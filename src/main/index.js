const {app, BrowserWindow, ipcMain, net, dialog, shell} = require('electron')
const child_process = require('child_process')
const path = require('path')
const os = require('os')

const is = require('electron-is')
const debug = require('electron-debug')
const log = require('electron-log')

const Q = require('q')
const fs = require('fs-extra')
const minimist = require('minimist') //命令行参数解析
const SerialPort = require('serialport') //串口
const glob = require('glob')
const extract = require('extract-zip')

var args = minimist(process.argv.slice(1)) //命令行参数

var boardNames
var connectedPorts = {
	autoPortId: 0,
	ports: {}
}

var mainWindow

init()

function init() {
	if(app.makeSingleInstance((commandLine, workingDirectory) => {
		if(mainWindow) {
			mainWindow.isMinimized() && mainWindow.restore()
			mainWindow.focus()
		}
	})) {
		app.quit()
	}

	log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {text}'
	if(is.dev() || args.dev) {
		//非debug模式，禁用控制台输出
		log.transports.file.level = 'debug'
	} else {
		log.transports.console = false
		log.transports.file.level = 'error'
	}

	log.debug(`app start, version ${app.getVersion()}`)

	listenEvent()
	listenMessage()
}

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 800,
		minWidth: 1024,
		minHeight: 768,
		frame: false,
		show: false
	})
	args.fullscreen && mainWindow.setFullScreen(true)

	mainWindow.loadURL(`file://${__dirname}/../index.html`)
	mainWindow.focus()

	mainWindow.on('closed', _ => {
		mainWindow = null
	}).once('ready-to-show', () => {
		mainWindow.show()
	})

	mainWindow.webContents.on('devtools-reload-page', _ => {
		closeAllSerialPort()
	})
	mainWindow.webContents.session.on('will-download', (e, item, webContent) => {
		var savePath = path.join(app.getPath("appData"), app.getName(), 'temp', item.getFilename())
		item.setSavePath(savePath)

		var url = item.getURL()
		var pos = url.lastIndexOf("#")
		var action = url.substring(pos + 1)
		url = url.substring(0, pos)

		item.on('updated', (evt, state) => {
			if(state == "interrupted") {
				log.debug(`download interrupted: ${url}`)
			} else if(state === 'progressing') {
				if(item.isPaused()) {
					log.debug(`download paused: ${url}`)
				}
			}
		})

		item.once('done', (evt, state) => {
			if(state == "completed") {
				log.debug(`download success: ${url}, at ${savePath}`)
				postMessage("app:onDownloadSuccess", savePath, action)
			} else {
				log.debug(`download fail: ${url}`)
			}
		})
	})
}

function listenEvent() {
	app.on('ready', _ => {
		log.debug('app ready')

		is.dev() && args.dev && debug({showDevTools: true})

		createWindow()

		loadBoards()
	})
	.on('window-all-closed', _ => {
		if (process.platform !== 'darwin') {
			app.quit()
		}
	})
	.on('activate', _ => {
		if (mainWindow === null) {
			createWindow()
		}
	})
	.on('will-quit', _ => {
		closeAllSerialPort()
	})
	.on('quit', _ => {
		log.debug('app quit')
	})
}

function listenMessage() {
	ipcMain.on('app:getVersion', (e, deferId) => {
		e.sender.send('app:getVersion', deferId, true, app.getVersion())
	})
	.on('app:reload', (e, deferId) => {
		mainWindow.reload()
		e.sender.send('app:reload', deferId, true, true)
	})
	.on('app:min', (e, deferId) => {
		mainWindow.minimize()
		e.sender.send('app:min', deferId, true, true)
	})
	.on('app:max', (e, deferId) => {
		if(mainWindow.isFullScreen()) {
			mainWindow.setFullScreen(false)
		} else {
			mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
		}
		e.sender.send('app:max', deferId, true, true)
	})
	.on('app:fullscreen', (e, deferId) => {
		var fullscreen = !mainWindow.isFullScreen()
		mainWindow.setFullScreen(fullscreen)
		e.sender.send('app:fullscreen', deferId, true, fullscreen)
	})
	.on('app:quit', (e, deferId) => {
		app.quit()
	}).on('app:openUrl', (e, deferId, url) => {
		var success = url && shell.openExternal(url)
		e.sender.send('app:openUrl', deferId, success, success)
	})
	.on('app:netRequest', (e, deferId, options) => {
		var request = net.request(options)
		if(options.header) {
			for(var key in options.header) {
				request.setHeader(key, options.header[key])
			}
		}
		request.on('response', response => {
			var chunks = []
			var size = 0
			response.on('data', chunk => {
				chunks.push(chunk)
				size += chunk.length
			}).on('end', _ => {
				var data
				switch(chunks.length) {
					case 0:
						data = new Buffer(0)
						break
					case 1:
						data = chunks[0]
						break
					default:
						data = new Buffer(size)
						var pos = 0
						chunks.forEach(chunk => {
							chunk.copy(data, pos)
							pos += chunk.len
						})
						break
				}
				data = data.toString()
				if(options.json) {
					var temp
					try{
						temp = JSON.parse(data)
					} catch (ex) {
						e.sender.send('app:netRequest', deferId, false, data)
						return
					}
					data = temp
				}
				e.sender.send('app:netRequest', deferId, true, data)
			})
		}).on('abort', _ => {
			log.error(err)
			e.sender.send('app:netRequest', deferId, false, 'abort')
		}).on('error', err => {
			log.error(err)
			e.sender.send('app:netRequest', deferId, false, err)
		}).end()
	})
	.on('app:execCommand', (e, deferId, command, options) => {
		execCommand(command, options).then(stdout => {
			e.sender.send('app:execCommand', deferId, true, stdout)
		}, err => {
			e.sender.send('app:execCommand', deferId, false, err)
		})
	})
	.on('app:readFile', (e, deferId, file, options) => {
		readFile(file, options).then(data => {
			e.sender.send('app:readFile', deferId, true, data)
		}, err => {
			e.sender.send('app:readFile', deferId, false, err)
		})
	})
	.on('app:writeFile', (e, deferId, file, data) => {
		writeFile(file, data).then(_ => {
			e.sender.send('app:writeFile', deferId, true, true)
		}, err => {
			e.sender.send('app:writeFile', deferId, false, err)
		})
	})
	.on('app:removeFile', (e, deferId, file) => {
		removeFile(file).then(_ => {
			e.sender.send('app:removeFile', deferId, true, true)
		}, err => {
			e.sender.send('app:removeFile', deferId, false, err)
		})
	})
	.on('app:saveProject', (e, deferId, file, projectInfo, isTemp) => {
		saveProject(file, projectInfo, isTemp).then(file => {
			e.sender.send('app:saveProject', deferId, true, file)
		}, err => {
			e.sender.send('app:saveProject', deferId, false, err)
		})
	})
	.on('app:openProject', (e, deferId, file) => {
		openProject(file).then(data => {
			e.sender.send('app:openProject', deferId, true, data)
		}, err => {
			e.sender.send('app:openProject', deferId, false, err)
		})	
	})
	.on('app:buildProject', (e, deferId, file, options) => {
		buildProject(file, options).then(target => {
			e.sender.send('app:buildProject', deferId, true, target)
		}, err => {
			e.sender.send('app:buildProject', deferId, false, err)
		})
	})
	.on('app:getSerialPorts', (e, deferId) => {
		getSerialPorts().then(ports => {
			e.sender.send('app:getSerialPorts', deferId, true, ports)
		}, err => {
			e.sender.send('app:getSerialPorts', deferId, false, err)
		})
	})
	.on('app:openSerialPort', (e, deferId, comName, options) => {
		openSerialPort(comName, options).then(portId => {
			e.sender.send('app:openSerialPort', deferId, true, portId)
		}, err => {
			e.sender.send('app:openSerialPort', deferId, false, err)
		})
	})
	.on('app:writeSerialPort', (e, deferId, portId, buffer) => {
		writeSerialPort(portId, buffer).then(_ => {
			e.sender.send('app:writeSerialPort', deferId, true, true)
		}, err => {
			e.sender.send('app:writeSerialPort', deferId, false, err)
		})
	})
	.on('app:closeSerialPort', (e, deferId, portId) => {
		closeSerialPort(portId).then(_ => {
			e.sender.send('app:closeSerialPort', deferId, true, true)
		}, err => {
			e.sender.send('app:closeSerialPort', deferId, false, err)
		})
	})
	.on('app:updateSerialPort', (e, deferId, portId, options) => {
		updateSerialPort(portId, options).then(_ => {
			e.sender.send('app:updateSerialPort', deferId, true, true)
		}, err => {
			e.sender.send('app:updateSerialPort', deferId, false, err)
		})
	})
	.on('app:flushSerialPort', (e, deferId, portId) => {
		flushSerialPort(portId).then(_ => {
			e.sender.send('app:flushSerialPort', deferId, true, true)
		}, err => {
			e.sender.send('app:flushSerialPort', deferId, false, err)
		})
	})
	.on('app:upload', (e, deferId, target, options) => {
		getSerialPorts().then(ports => {
			if(ports.length == 1) {
				upload(target, ports[0].comName, options).then(_ => {
					e.sender.send('app:upload', deferId, true, true)
				}, err => {
					e.sender.send('app:upload', deferId, false, err)
				})
			} else {
				e.sender.send('app:upload', deferId, false, {
					status: "SELECT_PORT",
					ports: ports,
				})
			}
		}, _ => {
			e.sender.send('app:upload', deferId, false, {
				status: "NOT_FOUND_PORT"
			})
		})
	})
	.on('app:upload2', (e, deferId, target, comName, options) => {
		upload(target, comName, options).then(_ => {
			e.sender.send('app:upload2', deferId, true, true)
		}, err => {
			e.sender.send('app:upload2', deferId, false, err)
		})
	})
	.on('app:errorReport', (e, deferId, error) => {
		log.error(`------ error message ------`)
		log.error(`${error.message}(${error.src} at line ${error.line}:${error.col})`)
		log.error(`${error.stack}`)
		e.sender.send('app:errorReport', deferId, true, true)
	})
	.on('app:log', (e, deferId, text, level) => {
		log.log(level || "debug", text)
		e.sender.send('app:log', deferId, true, true)
	})
	.on('app:getOSInfo', (e, deferId) => {
		e.sender.send('app:getOSInfo', deferId, true, getOSInfo())
	})
	.on('app:download', (e, deferId, url, action) => {
		log.debug(`download ${url}, action ${action}`)
		mainWindow.webContents.downloadURL(`${url}#${action}`)
		e.sender.send('app:download', deferId, true, true)
	})
	.on('app:installDriver', (e, defer, driverPath) => {
		installDriver(driverPath).then(_ => {
			e.sender.send('app:installDriver', deferId, true, true)
		}, err => {
			e.sender.send('app:installDriver', deferId, false, err)
		})
	})
}

function postMessage(name) {
	mainWindow && mainWindow.webContents.send(name, Array.from(arguments).slice(1))
}

function getOSInfo() {
	return {
		bit: is.x86() ? 32 : 64,
		platform: getSystemSuffix()
	}
}

function installDriver(driverPath) {
	var deferred = Q.defer()

	log.debug(`installDriver: ${driverPath}`)
	var dir = path.dirname(driverPath)
	extract(driverPath, {dir: dir}, err => {
		if(err) {
			log.error(err)
			deferred.reject(err)
			return
		}

		var exePath = path.join(dir, path.basename(driverPath, path.extname(driverPath)), "arduino驱动安装.exe")
		var command = `start /WAIT ${exePath}`
		execCommand(command).then(_ => {
			deferred.resolve()
		}, err1 => {
			log.error(err1)
			deferred.reject(err1)
		})
	})

	return deferred.promise
}

function getSerialPorts() {
	var deferred = Q.defer()

	log.debug("getSerialPorts")
	SerialPort.list((err, ports) => {
		if(err) {
			log.error(err)
			deferred.reject(err)
			return
		}

		if(ports.length == 0) {
			deferred.reject()
			return
		}

		matchBoardNames(ports).then(_ => {
			log.debug(ports.map(p => `${p.comName}, pid: ${p.productId}, vid: ${p.vendorId}, boardName: ${p.boardName || ""}`).join('\n'))
			deferred.resolve(ports)
		}, err1 => {
			if(err1) {
				log.error(err1)
				deferred.reject(err1)
			}
		})
	})

	return deferred.promise
}

function openSerialPort(comName, options) {
	var deferred = Q.defer()

	log.debug(`openSerialPort: ${comName}, options: ${JSON.stringify(options)}`)
	options.autoOpen = false
	if(options.parser == "raw") {
		options.parser = SerialPort.parsers.raw
	} else {
		var newline = options.parser.replace("NL", '\n').replace("CR", '\r')
		options.parser = SerialPort.parsers.readline(newline)
	}

	var port = new SerialPort(comName, options)
	port.open(err => {
		if(err) {
			log.error(err)
			deferred.reject(err)
			return
		}

		var portId = addPort(port)
		port.flush(_ => {
			deferred.resolve(portId)
		})
	})

	return deferred.promise
}

function writeSerialPort(portId, buffer) {
	var  deferred = Q.defer()

	log.debug(`writeSerialPort: ${portId}, ${buffer}`)
	var port = connectedPorts.ports[portId]
	if(!port) {
		setTimeout(_ => {
			deferred.reject()
		}, 10)
		return deferred.promise
	}

	port.write(buffer, err => {
		if(err) {
			log.error(err)
			deferred.reject(err)
			return
		}

		port.drain(_ => {
			deferred.resolve()
		})
	})

	return deferred.promise
}

function closeSerialPort(portId) {
	var  deferred = Q.defer()

	var port = connectedPorts.ports[portId]
	if(!port) {
		setTimeout(_ => {
			deferred.reject()
		}, 10)
		return deferred.promise
	}

	port.close(_ => {
		deferred.resolve()
	})

	return deferred.promise
}

function closeAllSerialPort() {
	for(var key in connectedPorts.ports) {
		connectedPorts.ports[key].close()
	}
	connectedPorts.ports = {}
}

function updateSerialPort(portId, options) {
	var  deferred = Q.defer()

	var port = connectedPorts.ports[portId]
	if(!port) {
		setTimeout(_ => {
			deferred.reject()
		}, 10)
		return deferred.promise
	}

	port.update(options, _ => {
		deferred.resolve()
	})

	return deferred.promise
}

function flushSerialPort(portId, options) {
	var  deferred = Q.defer()

	var port = connectedPorts.ports[portId]
	if(!port) {
		setTimeout(_ => {
			deferred.reject()
		}, 10)
		return deferred.promise
	}

	port.flush(_ => {
		deferred.resolve()
	})

	return deferred.promise
}

function addPort(port) {
	var autoPortId = ++connectedPorts.autoPortId
	connectedPorts.ports[autoPortId] = port

	port.on('error', err => {
		postMessage("app:onSerialPortError", autoPortId, err)
	})
	.on('close', _ => {
		delete connectedPorts.ports[autoPortId]
		postMessage("app:onSerialPortClose", autoPortId)
	})
	.on('data', data => {
		postMessage("app:onSerialPortData", autoPortId, data)
	})

	return autoPortId
}

function getScript(name, boardType) {
	var suffix = boardType == "genuino101" ? "_101" : ""
	if(is.windows()) {
		return path.join("scripts", `${name}${suffix}.bat`)
	} else if(is.macOS()) {
		return is.dev() ? path.join(`scripts`, `${name}${suffix}.sh`) : path.join(app.getAppPath(), '..', '..', 'scripts', `${name}${suffix}.sh`)
	} else {
		return path.join("scripts", `${name}${suffix}.sh`)
	}
}

function showOpenDialog(options) {
	var deferred = Q.defer()
	options = options || {}
	options.title = "打开"
	options.defaultPath = app.getPath("documents")
	options.buttonLabel = "打开"

	log.debug(`showOpenDialog: options: ${JSON.stringify(options)}`)
	dialog.showOpenDialog(mainWindow, options, files => {
		if(!files) {
			deferred.reject()
			return
		}

		deferred.resolve(files[0])
	})

	return deferred.promise
}

function showSaveDialog(options) {
	var deferred = Q.defer()
	options = options || {}
	options.title = "保存"
	options.defaultPath = app.getPath("documents")
	options.buttonLabel = "保存"

	log.debug(`showSaveDialog: options: ${JSON.stringify(options)}`)
	dialog.showSaveDialog(mainWindow, options, file => {
		if(!file) {
			deferred.reject()
			return
		}

		deferred.resolve(file)
	})

	return deferred.promise
}

function readJson(file, options) {
	var deferred = Q.defer()
	options = options || {}

	log.debug(`readJson:${file}, options: ${JSON.stringify(options)}`)
	fs.readJson(file, options, (err, data) => {
		if(err) {
			log.error(err)
			deferred.reject(err)
			return
		}

		deferred.resolve(data)
	})

	return deferred.promise
}

function writeJson(file, data, options) {
	var deferred = Q.defer()
	options = options || {}

	log.debug(`writeJson:${file}, options: ${JSON.stringify(options)}`)
	fs.outputJson(file, data, options, err => {
		if(err) {
			log.error(err)
			deferred.reject(err)
			return
		}

		deferred.resolve()
	})

	return deferred.promise
}

function readFile(file, options) {
	var deferred = Q.defer()
	options = options || "utf8"

	log.debug(`readFile:${file}, options: ${JSON.stringify(options)}`)
	fs.readFile(file, options, (err, data) => {
		if(err) {
			log.error(err)
			deferred.reject(err)
			return
		}

		deferred.resolve(data)
	})

	return deferred.promise
}

function writeFile(file, data) {
	var deferred = Q.defer()

	log.debug(`writeFile:${file}`)
	fs.outputFile(file, data, err => {
		if(err) {
			log.error(err)
			deferred.reject(err)
			return
		}

		deferred.resolve()
	})

	return deferred.promise
}

function removeFile(file) {
	var deferred = Q.defer()

	log.debug(`removeFile:${file}`)
	fs.remove(file, data, err => {
		if(err) {
			log.error(err)
			deferred.reject(err)
			return
		}

		deferred.resolve()
	})

	return deferred.promise
}

function saveProject(oldFile, projectInfo, isTemp) {
	var deferred = Q.defer()
	isTemp = isTemp === true

	log.debug(`saveProject: isTemp:${isTemp}`)

	var save = file => {
		var updated_at = new Date()
		projectInfo.updated_at = updated_at
		projectInfo.project_name = path.basename(file)

		Q.all([
			writeFile(path.join(file, path.basename(file) + ".ino"), projectInfo.project_data.code),
			writeJson(path.join(file, "project.json"), projectInfo)
		]).then(_ => {
			deferred.resolve({
				path: file,
				updated_at: projectInfo.updated_at,
				project_name: projectInfo.project_name
			})
		}, _ => {
			deferred.reject()
		})
	}

	if(oldFile) {
		save(oldFile)
	} else if(isTemp) {
		var file = path.join(app.getPath("temp"), "build", "sketch" + new Date().getTime())
		save(file)
	} else {
		showSaveDialog().then(file => {
			save(file)
		}, _ => {
			deferred.reject()
		})
	}
	
	return deferred.promise
}

function openProject(file) {
	var deferred = Q.defer()

	var read = file => {
		readJson(path.join(file, "project.json")).then(projectInfo => {
			deferred.resolve({
				path: file,
				projectInfo: projectInfo
			})
		}, err => {
			deferred.reject(err)
		})
	}
	if(file) {
		read(file)
	} else {
		showOpenDialog({
			properties: ["openDirectory"]
		}).then(file => {
			read(file)
		}, err => {
			deferred.reject(err)
		})
	}

	return deferred.promise
}

function buildProject(file, options) {
	var deferred = Q.defer()

	options = options || {}
	options.board_type = options.board_type || "uno"

	var scriptPath = getScript("build", options.board_type)
	log.debug(path.resolve(scriptPath))
	var command
	if(options.board_type == "genuino101") {
		command = `${scriptPath} ${file}`
	} else {
		command = `${scriptPath} ${file} ${options.board_type}`
	}
	log.debug(`buildProject:${file}, options: ${JSON.stringify(options)}`)
	execCommand(command).then(_ => {
		deferred.resolve(path.join(file, "build", path.basename(file) + `.ino.${options.board_type == "genuino101" ? "bin" : "hex"}`))
	}, err => {
		deferred.reject(err)
	})

	return deferred.promise
}

function upload(target, comName, options) {
	var deferred = Q.defer()

	log.debug(`upload:${target}, ${comName}, options: ${JSON.stringify(options)}`)

	preUpload(comName, options.board_type).then(_ => {
		var scriptPath = getScript("upload", options.board_type)
		log.debug(path.resolve(scriptPath))
		var command = `${scriptPath} ${target} ${comName}`

		execCommand(command).then(_ => {
			deferred.resolve()
		}, err => {
			deferred.reject(err)
		})
	}, err => {
		deferred.reject(err)
	})
	
	return deferred.promise
}

function preUpload(comName, boardType) {
	var deferred = Q.defer()

	if(boardType != "genuino101") {
		setTimeout(_ => {
			deferred.resolve()
		}, 10)
		
		return deferred.promise
	} 

	var serialPort = new SerialPort(comName, {
		baudRate: 1200
	})

	serialPort.on('open', _ => {
		serialPort.set({
			rts: true,
			dtr: false,
		})
		setTimeout(_ => {
			serialPort.close(_ => {
				deferred.resolve()
			})
		}, 650)
	}).on('error', err => {
		log.error(err)
		serialPort.close(_ => {
			deferred.reject(err)
		})
	})

	return deferred.promise
}

function getSystemSuffix() {
	if(is.windows()) {
		return "win"
	} else if(is.macOS()) {
		return "mac"
	} else {
		var arch = os.arch()
		if(arch.indexOf('arm') >= 0) {
			return "arm"
		} else {
			return "linux"
		}
	}
}

function loadBoards(forceReload) {
	var deferred = Q.defer()

	if(boardNames && !forceReload) {
		setTimeout(_ => {
			deferred.resolve(boardNames)
		}, 10)

		return deferred.promise
	}

	var _boardNames = {}
	var pidReg = /\n(([^\.\n]+)\.pid(\.\d)?)=([^\r\n]+)/g
	var vidReg = /\n(([^\.\n]+)\.vid(\.\d)?)=([^\r\n]+)/g
	var nameReg = /\n([^\.\n]+)\.name=([^\r\n]+)/g
	
	var searchPath = 'arduino-' + getSystemSuffix()
	glob(`${searchPath}/**/boards.txt`, {}, (err, pathList) => {
		if(err) {
			log.error(err)
			deferred.reject(err)
			return
		}
		
		var count = pathList.length
		pathList.forEach(p => {
			readFile(p).then(content => {
				var pidList = content.match(pidReg)
				var vidList = content.match(vidReg)
				var nameList = content.match(nameReg)
				var names = []
				nameList.forEach(n => {
					var type = n.substring(0, n.indexOf(".name")).trim()
					var name = n.substring(n.indexOf("=") + 1).trim()
					names[type] = name
				})

				var types = pidList.map(pid => pid.substring(0, pid.indexOf('.pid')).trim())
				pidList = pidList.map(pid => pid.substring(pid.indexOf('=') + 3))
				vidList = vidList.map(vid => vid.substring(vid.indexOf('=') + 3))

				for(var i = 0; i < pidList.length; i++) {
					_boardNames[pidList[i] + "_" + vidList[i]] = {
						pid: pidList[i],
						vid: vidList[i],
						type: types[i],
						name: names[types[i]]
					}
				}

				count--
				if(count == 0) {
					boardNames = _boardNames
					deferred.resolve(boardNames)
				}
			}, err1 => {
				log.error(err1)
				deferred.reject(err1)
			})
		})
	})

	return deferred.promise
}

function matchBoardNames(ports) {
	var deferred = Q.defer()

	loadBoards().then(names => {
		ports.forEach(p => {
			if(p.productId && p.vendorId) {
				var board = boardNames[p.productId + "_" + p.vendorId]
				if(board) {
					p.boardName = board.name
				}
			}
		})

		deferred.resolve(ports)
	}, err => {
		log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function execCommand(command, options) {
	var deferred = Q.defer()
	options = options || {}

	log.debug(`execCommand:${command}, options: ${JSON.stringify(options)}`)
	child_process.exec(command, options, (err, stdout, stderr) => {
		if(err) {
			log.error(err)
			deferred.reject(err)
			return
		}

		deferred.resolve(stdout)
	})

	return deferred.promise
}
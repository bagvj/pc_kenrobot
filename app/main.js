const {app, BrowserWindow, ipcMain, net, dialog, shell, Menu, globalShortcut} = require('electron')

const child_process = require('child_process')
const path = require('path')

const Q = require('q')
const fs = require('fs-extra')
const is = require('electron-is')
const debug = require('electron-debug')
const log = require('electron-log')
const encoding = require('encoding')
const minimist = require('minimist') //命令行参数解析

var args = minimist(process.argv.slice(1)) //命令行参数

let mainWindow

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

	var logPath = path.join(__dirname, '..', 'log', 'log.txt')
	fs.ensureDirSync(path.dirname(logPath))
	log.transports.file.level = 'debug'
	log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {text}'

	log.debug("app start")

	listenEvent()
	listenMessage()
}

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 800,
		frame: false
	})
	args.fullscreen && mainWindow.setFullScreen(true)

	mainWindow.loadURL(`file://${__dirname}/index.html`)
	mainWindow.focus()

	mainWindow.on('closed', _ => {
		mainWindow = null
	})
}

function listenEvent() {
	app.on('ready', _ => {
		log.debug('app ready')

		is.dev() && args.dev && debug({showDevTools: true})

		createWindow()
	}).on('window-all-closed', _ => {
		if (process.platform !== 'darwin') {
			app.quit()
		}
	}).on('activate', _ => {
		if (mainWindow === null) {
			createWindow()
		}
	}).on('quit', _ => {
		log.debug('app quit')
	})
}

function listenMessage() {
	ipcMain.on('app:reload', (e, deferId) => {
		mainWindow.reload()
		e.sender.send('app:reload', deferId, true, true)
	}).on('app:min', (e, deferId) => {
		mainWindow.minimize()
		e.sender.send('app:min', deferId, true, true)
	}).on('app:max', (e, deferId) => {
		if(mainWindow.isFullScreen()) {
			mainWindow.setFullScreen(false)
		} else {
			mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
		}
		e.sender.send('app:max', deferId, true, true)
	}).on('app:fullscreen', (e, deferId) => {
		var fullscreen = !mainWindow.isFullScreen()
		mainWindow.setFullScreen(fullscreen)
		e.sender.send('app:fullscreen', deferId, true, fullscreen)
	}).on('app:quit', (e, deferId) => {
		app.quit()
	}).on('app:openUrl', (e, deferId, url) => {
		var success = url && shell.openExternal(url)
		e.sender.send('app:openUrl', deferId, success, success)
	}).on('app:netRequest', (e, deferId, options) => {
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
	}).on('app:execCommand', (e, deferId, command, options) => {
		execCommand(command, options).then(stdout => {
			e.sender.send('app:execCommand', deferId, true, stdout)
		}, err => {
			e.sender.send('app:execCommand', deferId, false, err)
		})
	}).on('app:readFile', (e, deferId, file, options) => {
		readFile(file, options).then(data => {
			e.sender.send('app:readFile', deferId, true, data)
		}, err => {
			e.sender.send('app:readFile', deferId, false, err)
		})
	}).on('app:writeFile', (e, deferId, file, data) => {
		writeFile(file, data).then(_ => {
			e.sender.send('app:writeFile', deferId, true, true)
		}, err => {
			e.sender.send('app:writeFile', deferId, false, err)
		})
	}).on('app:removeFile', (e, deferId, file) => {
		removeFile(file).then(_ => {
			e.sender.send('app:removeFile', deferId, true, true)
		}, err => {
			e.sender.send('app:removeFile', deferId, false, err)
		})
	}).on('app:saveProject', (e, deferId, file, projectInfo, isTemp) => {
		saveProject(file, projectInfo, isTemp).then(file => {
			e.sender.send('app:saveProject', deferId, true, file)
		}, err => {
			e.sender.send('app:saveProject', deferId, false, err)
		})
	}).on('app:openProject', (e, deferId, file) => {
		openProject(file).then(data => {
			e.sender.send('app:openProject', deferId, true, data)
		}, err => {
			e.sender.send('app:openProject', deferId, false, err)
		})	
	}).on('app:buildProject', (e, deferId, file, options) => {
		buildProject(file, options).then(hex => {
			e.sender.send('app:buildProject', deferId, true, hex)
		}, err => {
			e.sender.send('app:buildProject', deferId, false, err)
		})
	}).on('app:uploadHex', (e, deferId, hex, options) => {
		getSerialPorts().then(ports => {
			if(ports.length == 1) {
				uploadHex(hex, ports[0].path, options).then(_ => {
					e.sender.send('app:uploadHex', deferId, true, true)
				}, err => {
					e.sender.send('app:uploadHex', deferId, false, err)
				})
			} else {
				e.sender.send('app:uploadHex', deferId, false, {
					status: "SELECT_PORT",
					ports: ports,
				})
			}
		}, _ => {
			e.sender.send('app:uploadHex', deferId, false, {
				status: "NOT_FOUND_PORT"
			})
		})
	}).on('app:uploadHex2', (e, deferId, hex, com, options) => {
		uploadHex(hex, com, options).then(_ => {
			e.sender.send('app:uploadHex2', deferId, true, true)
		}, err => {
			e.sender.send('app:uploadHex2', deferId, false, err)
		})
	}).on('app:errorReport', (e, deferId, error) => {
		log.error(`------ error message ------\n${error.message}(${error.src} at line ${error.line}:${error.col})\n${error.stack}`)
	})
}

function getSerialPorts() {
	var deferred = Q.defer()

	log.debug("getSerialPorts")
	if(is.windows()) {
		execCommand("scripts\\lscom.exe").then(stdout => {
			var comReg = /(COM\d+): (.*) \(COM\d+\)/g
			var ports = []
			var match
			while((match = comReg.exec(stdout))) {
				ports.push({
					path: match[1],
					displayName: match[2]
				})
			}

			ports.length > 0 ? deferred.resolve(ports) : deferred.reject()
		}, err => {
			deferred.reject(err)
		})
	} else {
		execCommand("ls /dev/tty*").then(stdout => {
			var comReg = /(\/dev\/tty(S|A)[^\s]+)/g
			var ports = []
			var match
			while((match = comReg.exec(stdout))) {
				ports.push({
					path: match[1]
				})
			}

			ports.length > 0 ? deferred.resolve(ports) : deferred.reject()
		}, err => {
			deferred.reject(err)
		})
	}

	return deferred.promise
}

function getScript(name) {
	return path.join("scripts", `${name}.${is.windows() ? "bat" : "sh"}`)
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

	var scriptPath = getScript("build")
	options = options || {}
	options.board_type = options.board_type || "uno"

	var command = `${scriptPath} ${file} ${options.board_type}`

	log.debug(`buildProject:${file}, options: ${JSON.stringify(options)}`)
	execCommand(command).then(_ => {
		deferred.resolve(path.join(file, "build", path.basename(file) + ".ino.hex"))
	}, err => {
		deferred.reject(err)
	})

	return deferred.promise
}

function uploadHex(hex, com, options) {
	var deferred = Q.defer()

	log.debug(`uploadHex:${hex}, ${com}, options: ${JSON.stringify(options)}`)
	var scriptPath = getScript("upload")
	var sudo = is.windows() ? "" : "sudo "
	var command = `${sudo}${scriptPath} ${hex} ${com}`

	execCommand(command).then(_ => {
		deferred.resolve()
	}, err => {
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
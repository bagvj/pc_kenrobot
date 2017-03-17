const {app, BrowserWindow, ipcMain, shell, clipboard} = require('electron')

const path = require('path')
const util = require('./util')

const is = require('electron-is')
const debug = require('electron-debug')
const log = require('electron-log')

const Q = require('q')
const fs = require('fs-extra')
const minimist = require('minimist') //命令行参数解析
const SerialPort = require('serialport') //串口
const hasha = require('hasha') //计算hash

const PACKAGE = require('../package')

var args = minimist(process.argv.slice(1)) //命令行参数

var connectedPorts = {
	autoPortId: 0,
	ports: {}
}
var buildOptions = {
	packagePath: []	
}

var config

var mainWindow

init()

/**
 * 初始化
 */
function init() {
	if(app.makeSingleInstance((commandLine, workingDirectory) => {
		if(mainWindow) {
			mainWindow.isMinimized() && mainWindow.restore()
			mainWindow.focus()
		}
	})) {
		app.quit()
	}

	is.dev() && app.setName(PACKAGE.name)

	log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {text}'
	if(is.dev() || args.dev) {
		//非debug模式，禁用控制台输出
		log.transports.file.level = 'debug'
	} else {
		log.transports.console = false
		log.transports.file.level = 'error'
	}

	log.debug(`app start, version ${getVersion()}`)

	listenEvent()
	listenMessage()
}

/**
 * 创建窗口
 */
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 800,
		minWidth: 1280,
		minHeight: 800,
		frame: false,
		show: false
	})
	args.fullscreen && mainWindow.setFullScreen(true)

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

	unpackPackages().then(_ => {
		mainWindow.loadURL(`file://${__dirname}/../index.html`)
		mainWindow.focus()
	})	
}

/**
 * 监听事件
 */
function listenEvent() {
	app.on('ready', _ => {
		log.debug('app ready')

		is.dev() && args.dev && debug({showDevTools: true})

		loadConfig().then(data => {
			config = data

			createWindow()
			loadBoards()
		})
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

/**
 * 监听消息
 */
function listenMessage() {
	ipcMain.on('app:getVersion', (e, deferId) => {
		e.sender.send('app:getVersion', deferId, true, getVersion())
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
	.on('app:execCommand', (e, deferId, command, options) => {
		util.execCommand(command, options).then(stdout => {
			e.sender.send('app:execCommand', deferId, true, stdout)
		}, err => {
			e.sender.send('app:execCommand', deferId, false, err)
		})
	})
	.on('app:spawnCommand', (e, deferId, command, args, options) => {
		util.spawnCommand(command, args, options).then(stdout => {
			e.sender.send('app:spawnCommand', deferId, true, stdout)
		}, stderr => {
			e.sender.send('app:spawnCommand', deferId, false, stderr)
		}, progress => {
			e.sender.send('app:spawnCommand', deferId, "notify", progress)
		})
	})
	.on('app:readFile', (e, deferId, file, options) => {
		util.readFile(file, options).then(data => {
			e.sender.send('app:readFile', deferId, true, data)
		}, err => {
			e.sender.send('app:readFile', deferId, false, err)
		})
	})
	.on('app:writeFile', (e, deferId, file, data) => {
		util.writeFile(file, data).then(_ => {
			e.sender.send('app:writeFile', deferId, true, true)
		}, err => {
			e.sender.send('app:writeFile', deferId, false, err)
		})
	})
	.on('app:removeFile', (e, deferId, file) => {
		util.removeFile(file).then(_ => {
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
		}, progress => {
			e.sender.send('app:buildProject', deferId, "notify", progress)
		})
	})
	.on('app:upload', (e, deferId, target, options) => {
		listSerialPort().then(ports => {
			if(ports.length == 1) {
				upload(target, ports[0].comName, options).then(_ => {
					e.sender.send('app:upload', deferId, true, true)
				}, err => {
					e.sender.send('app:upload', deferId, false, err)
				}, progress => {
					e.sender.send('app:upload', deferId, "notify", progress)
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
		}, progress => {
			e.sender.send('app:upload2', deferId, "notify", progress)
		})
	})
	.on('app:listSerialPort', (e, deferId) => {
		listSerialPort().then(ports => {
			e.sender.send('app:listSerialPort', deferId, true, ports)
		}, err => {
			e.sender.send('app:listSerialPort', deferId, false, err)
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
	.on('app:installDriver', (e, deferId, driverPath) => {
		installDriver(driverPath).then(_ => {
			e.sender.send('app:installDriver', deferId, true, true)
		}, err => {
			e.sender.send('app:installDriver', deferId, false, err)
		})
	})
	.on('app:loadExamples', (e, deferId) => {
		loadExamples().then(examples => {
			e.sender.send('app:loadExamples', deferId, true, examples)
		}, err => {
			e.sender.send('app:loadExamples', deferId, false, err)
		})
	})
	.on("app:openExample", (e, deferId, category, name) => {
		openExample(category, name).then(projectInfo => {
			e.sender.send('app:openExample', deferId, true, projectInfo)
		}, err => {
			e.sender.send('app:openExample', deferId, false, err)
		})
	})
	.on("app:copy", (e, deferId, text, type) => {
		clipboard.writeText(text, type)
		e.sender.send("app:copy", deferId, true, true)
	})
	.on("app:loadPackages", (e, deferId) => {
		loadPackages().then(packages => {
			e.sender.send('app:loadPackages', deferId, true, packages)
		}, err => {
			e.sender.send('app:loadPackages', deferId, false, err)
		})
	})
	.on("app:switchUI", (e, deferId, type) => {
		switchUI(type).then(otherType => {
			e.sender.send('app:switchUI', deferId, true, otherType)
		}, err => {
			e.sender.send('app:switchUI', deferId, false, err)
		})
	})
}

/**
 * 发送消息
 * @param {*} name 
 */
function postMessage(name) {
	log.debug(`postMessage, ${Array.from(arguments).join(", ")}`)
	mainWindow && mainWindow.webContents.send(name, Array.from(arguments).slice(1))
}

function getVersion() {
	return is.dev() ? PACKAGE.version : app.getVersion()
}

/**
 * 载入配置
 */
function loadConfig() {
	var deferred = Q.defer()

	log.debug("loadConfig")
	var configPath = path.join(app.getPath("appData"), app.getName(), "config.json")
	if(!fs.existsSync(configPath)) {
		setTimeout(_ => {
			deferred.resolve({})
		}, 10)
		return deferred.promise
	}

	util.readJson(configPath).then(data => {
		deferred.resolve(data)
	}, err => {
		deferred.resolve({})
	})

	return deferred.promise
}

/**
 * 载入配置
 */
function writeConfig(sync) {
	sync = sync == true
	var configPath = path.join(app.getPath("appData"), app.getName(), "config.json")
	log.debug(`writeConfig, path: ${configPath}, sync: ${sync}`)
	if(sync) {
		fs.writeJsonSync(configPath, config)
	} else {
		return util.writeJson(configPath, config)
	}
}

/**
 * 解压资源包
 */
function unpackPackages() {
	var deferred = Q.defer()

	if(config.version && config.version == getVersion()) {
		log.debug("skip unpack packages")
		setTimeout(_ => {
			deferred.resolve()
		}, 10)

		return deferred.promise
	}

	log.debug("unpack packages")
	var packagesPath = path.join(getResourcePath(), "packages")
	util.readJson(path.join(packagesPath, "packages.json")).then(packages => {
		var oldPackages = config.packages || []
		var list = packages.filter(p => !oldPackages.find(o => o.name == p.name && o.checksum == p.checksum))

		Q.all(list.map(p => {
			var d = Q.defer()
			util.unzip(path.join(packagesPath, p.name), path.join(app.getPath("documents"), app.getName(), "packages"))
			.then(_ => {
				var oldPackage = oldPackages.find(o => o.name == p.name)
				if(oldPackage) {
					oldPackage.checksum = p.checksum
				} else {
					oldPackages.push(p)
				}
			})
			.fin(_ => {
				d.resolve()
			})
			return d.promise
		})).then(_ => {
			config.version = getVersion()
			config.packages = oldPackages
			writeConfig().then(_ => {
				deferred.resolve()
			}, err => {
				log.error(err)
				deferred.reject()
			})
		})
	}, err => {
		log.error(err)
		deferred.reject()
	})

	return deferred.promise
}

/**
 * 加载所有包
 */
function loadPackages() {
	var deferred = Q.defer()

	var packages = []
	var packagePath = path.join(app.getPath("documents"), app.getName(), "packages")
	log.debug(`loadPackages: ${packagePath}`)
	
	util.searchFiles(`${packagePath}/*/package.json`).then(pathList => {
		Q.all(pathList.map(p => {
			var d = Q.defer()
			util.readJson(p).then(packageConfig => {
				packageConfig.path = path.dirname(p)
				packages.push(packageConfig)
				buildOptions.packagePath.push(path.join(packageConfig.path, "src"))
			})
			.fin(_ => {
				d.resolve()
			})
			return d.promise	
		}))
		.then(_ => {
			deferred.resolve(packages)
		})
	}, err => {
		log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

/**
 * 打开示例
 * @param {*} category 分类
 * @param {*} name 名字
 */
function openExample(category, name) {
	var deferred = Q.defer()

	var examplePath = path.join(getResourcePath(), "examples", category, name)
	log.debug(`openExample: ${examplePath}`)
	util.readJson(path.join(examplePath, "project.json")).then(projectInfo => {
		deferred.resolve(projectInfo)
	}, err => {
		log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

/**
 * 加载示例
 */
function loadExamples() {
	var deferred = Q.defer()

	log.debug('loadExamples')
	util.readJson(path.join(getResourcePath(), "examples", "examples.json")).then(examples => {
		deferred.resolve(examples)
	}, err => {
		log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

/**
 * 安装驱动
 * @param {*} driverPath 
 */
function installDriver(driverPath) {
	var deferred = Q.defer()

	log.debug(`installDriver: ${driverPath}`)
	var dir = path.dirname(driverPath)
	util.unzip(driverPath, dir).then(_ => {
		var exePath = path.join(dir, path.basename(driverPath, path.extname(driverPath)), "setup.exe")
		var command = `start /WAIT ${exePath}`
		util.execCommand(command, null, true).fin(_ => {
			deferred.resolve()
		})
	}, err => {
		log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

/**
 * 查询串口
 */
function listSerialPort() {
	var deferred = Q.defer()

	log.debug("listSerialPort")
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
			log.error(err1)
			deferred.reject(err1)
		})
	})

	return deferred.promise
}

/**
 * 打开串口
 * @param {*} comName 串口路径
 * @param {*} options 选项
 */
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

		var portId = ++connectedPorts.autoPortId
		connectedPorts.ports[portId] = port

		port.on('error', err => {
			postMessage("app:onSerialPortError", portId, err)
		})
		.on('close', _ => {
			delete connectedPorts.ports[portId]
			postMessage("app:onSerialPortClose", portId)
		})
		.on('data', data => {
			postMessage("app:onSerialPortData", portId, data)
		})

		port.flush(_ => {
			deferred.resolve(portId)
		})
	})

	return deferred.promise
}

/**
 * 串口发送
 * @param {*} portId 串口id
 * @param {*} buffer 发送内容，Buffer | String
 */
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

/**
 * 关闭串口
 * @param {*} portId 串口id
 */
function closeSerialPort(portId) {
	var  deferred = Q.defer()

	log.debug(`closeSerialPort, portId: ${portId}`)
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

/**
 * 关闭所有串口
 */
function closeAllSerialPort() {
	log.debug(`closeAllSerialPort`)
	for(var key in connectedPorts.ports) {
		connectedPorts.ports[key].close()
	}
	connectedPorts.ports = {}
}

/**
 * 更新串口设置
 * @param {*} portId 串口id
 * @param {*} options 选项
 */
function updateSerialPort(portId, options) {
	var  deferred = Q.defer()

	log.debug(`updateSerialPort, portId: ${portId}`)
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

/**
 * 清空串口缓冲区
 * @param {*} portId 串口id
 * @param {*} options 选项
 */
function flushSerialPort(portId, options) {
	var  deferred = Q.defer()

	log.debug(`flushSerialPort, portId: ${portId}`)
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

/**
 * 保存项目
 * @param {*} oldFile 
 * @param {*} projectInfo 
 * @param {*} isTemp 
 */
function saveProject(oldFile, projectInfo, isTemp) {
	var deferred = Q.defer()
	isTemp = isTemp === true

	log.debug(`saveProject: isTemp:${isTemp}`)

	var save = file => {
		var updated_at = new Date()
		projectInfo.updated_at = updated_at
		projectInfo.project_name = path.basename(file)

		Q.all([
			util.writeFile(path.join(file, path.basename(file) + ".ino"), projectInfo.project_data.code),
			util.writeJson(path.join(file, "project.json"), projectInfo)
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
		util.showSaveDialog(mainWindow).then(file => {
			save(file)
		}, _ => {
			deferred.reject()
		})
	}
	
	return deferred.promise
}

/**
 * 打开项目
 * @param {*} file 
 */
function openProject(file) {
	var deferred = Q.defer()

	log.debug(`openProject ${file}`)
	var read = file => {
		util.readJson(path.join(file, "project.json")).then(projectInfo => {
			deferred.resolve({
				path: file,
				projectInfo: projectInfo
			})
		}, err => {
			log.error(err)
			deferred.reject(err)
		})
	}
	if(file) {
		read(file)
	} else {
		util.showOpenDialog(mainWindow, {
			properties: ["openDirectory"]
		}).then(file => {
			read(file)
		}, err => {
			log.error(err)
			deferred.reject(err)
		})
	}

	return deferred.promise
}

/**
 * 编译项目
 * @param {*} file 
 * @param {*} options 
 */
function buildProject(file, options) {
	var deferred = Q.defer()

	preBuild(file, options).then(_ => {
		var scriptPath = getScriptPath("build", options.type)
		//'='不能直接传给bat，所以传'!'然后在bat里替换回'='
		var fqbn = is.windows() ? options.fqbn.replace(/=/g, '!') : options.fqbn
		var args = [file, fqbn]
		buildOptions.packagePath.length > 0 && args.push(buildOptions.packagePath.join(','))
		
		log.debug(`buildProject:${file}, options: ${JSON.stringify(options)}`)
		util.spawnCommand(scriptPath, args, {shell: true}).then(_ => {
			deferred.resolve(path.join(file, "build", path.basename(file) + `.ino.${options.type == "genuino101" ? "bin" : "hex"}`))
		}, err => {
			log.error(err)
			deferred.reject(err)
		}, progress => {
			deferred.notify(progress)
		})
	})
	
	return deferred.promise
}

function preBuild(file, options) {
	var deferred = Q.defer()

	log.debug('pre build')

	var optionPath = path.join(file, 'build', 'build.options.json')
	if(!fs.existsSync(optionPath)) {
		setTimeout(_ => {
			deferred.resolve()
		}, 10)
		return deferred.promise
	}

	util.readJson(optionPath).then(op => {
		if(options.fqbn == op.fqbn) {
			deferred.resolve()
			return
		}

		util.removeFile(path.join(file, 'build')).fin(_ => {
			deferred.resolve()
		})
	}, err => {
		deferred.resolve()
	})

	return deferred.promise
}

/**
 * 上传
 * @param {*} target hex | bin
 * @param {*} comName 串口路径
 * @param {*} options 选项
 */
function upload(target, comName, options) {
	var deferred = Q.defer()

	log.debug(`upload:${target}, ${comName}, options: ${JSON.stringify(options)}`)

	preUpload(comName, options).then(_ => {
		var scriptPath = getScriptPath("upload", options.type)
		log.debug(path.resolve(scriptPath))
		util.spawnCommand(scriptPath, [target, comName], {shell: true}).then(_ => {
			deferred.resolve()
		}, err => {
			log.error(err)
			deferred.reject(err)
		}, progress => {
			deferred.notify(progress)
		})
	}, err => {
		log.error(err)
		deferred.reject(err)
	})
	
	return deferred.promise
}

/**
 * 上传预处理
 */
function preUpload(comName, options) {
	var deferred = Q.defer()

	log.debug("pre upload")
	if(options.type != "genuino101") {
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

/**
 * 加载主板
 * @param {*} forceReload 
 */
function loadBoards(forceReload) {
	var deferred = Q.defer()

	if(config.boardNames && !forceReload) {
		log.debug("skip loadBoards")
		setTimeout(_ => {
			deferred.resolve(config.boardNames)
		}, 10)

		return deferred.promise
	}

	log.debug("loadBoards")
	var boardNames = {}
	var pidReg = /\n(([^\.\n]+)\.pid(\.\d)?)=([^\r\n]+)/g
	var vidReg = /\n(([^\.\n]+)\.vid(\.\d)?)=([^\r\n]+)/g
	var nameReg = /\n([^\.\n]+)\.name=([^\r\n]+)/g
	
	var searchPath = 'arduino-' + util.getPlatform()
	util.searchFiles(`${searchPath}/**/boards.txt`).then(pathList => {
		Q.all(pathList.map(p => {
			var d = Q.defer()
			util.readFile(p).then(content => {
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
					boardNames[pidList[i] + "_" + vidList[i]] = {
						pid: pidList[i],
						vid: vidList[i],
						type: types[i],
						name: names[types[i]]
					}
				}
			})
			.fin(_ => {
				d.resolve()
			})
			return d.promise
		})).then(_ => {
			config.boardNames = boardNames
			writeConfig().then(_ => {
				deferred.resolve(config.boardNames)
			}, err => {
				log.error(err)
				deferred.reject(err)
			})
		})
	}, err => {
		log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

/**
 * 匹配主板名
 * @param {*} ports 
 */
function matchBoardNames(ports) {
	var deferred = Q.defer()

	log.debug("matchBoardNames")
	loadBoards().then(names => {
		ports.forEach(p => {
			if(p.productId && p.vendorId) {
				var board = config.boardNames[p.productId + "_" + p.vendorId]
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

function switchUI(type) {
	var deferred = Q.defer()
	mainWindow.once('ready-to-show', _ => {
		deferred.resolve()
	})

	if(type == "scratch") {
		mainWindow.loadURL(`file://${__dirname}/../scratch/index.html`)
		mainWindow.focus()
	} else {
		mainWindow.loadURL(`file://${__dirname}/../index.html`)
		mainWindow.focus()
	}

	return deferred.promise
}

/**
 * 获取资源路径
 */
function getResourcePath() {
	return (!is.windows() && !is.dev()) ? path.join(app.getAppPath(), "..", "..") : "."
}

/**
 * 获取脚本路径
 * @param {*} name 
 * @param {*} type 
 */
function getScriptPath(name, type) {
	var suffix = type == "genuino101" ? "_101" : ""
	var ext = is.windows() ? "bat" : "sh"
	return path.join(getResourcePath(), "scripts", `${name}${suffix}.${ext}`)
}

/**
 * 获取系统信息
 */
function getOSInfo() {
	return {
		bit: util.isX64() ? 64 : 32,
		platform: util.getPlatform()
	}
}
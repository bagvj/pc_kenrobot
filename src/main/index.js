const {app, BrowserWindow, dialog, ipcMain, shell, clipboard} = require('electron')

const path = require('path')
const querystring = require('querystring')

const is = require('electron-is')
const debug = require('electron-debug')
const log = require('electron-log')
const Q = require('q')
const fs = require('fs-extra')
const commandLineArgs = require('command-line-args') //命令行参数解析
const hasha = require('hasha') //计算hash
const _ = require('lodash')
const terminate = require('terminate')

const util = require('./util/util')
const SerialPort = require('./model/serialPort') //串口
const ArduinoOptions = require('./config/arduinoOptions')
const Url = require('./config/url')

const Token = require('./model/token')
const Project = require('./model/project') //同步
const User = require('./model/user')
const Package = require('./model/package')
const Cache = require('./util/cache')
const Crypto = require('./util/crypto')

const CONFIG_KEY = "config"

const listenMessage = util.listenMessage

const optionDefinitions = [
	{ name: 'debug-brk', type: Number, defaultValue: false },
	{ name: 'dev', alias: 'd', type: Boolean, defaultValue: false },
	{ name: 'devTool', alias: 't', type: Boolean, defaultValue: false },
	{ name: 'fullscreen', alias: 'f', type: Boolean, defaultValue: false},
	{ name: 'maximize', alias: 'm', type: Boolean, defaultValue: false},
	{ name: 'project', alias: 'p', type: Project.check, defaultOption: true}
]

var args = commandLineArgs(optionDefinitions, {argv: process.argv.slice(1), partial: true}) //命令行参数

const DEBUG = is.dev() && args.dev
// const DEBUG = true
const DEV = is.dev()

var cache
var config

var mainWindow
var firstRun
var projectToLoad
var isLoadReady

var downloadTasks = {}
var forceQuit

init()

/**
 * 初始化
 */
function init() {
	process.on('uncaughtException', err => {
		var stack = err.stack || (err.name + ': ' + err.message)
		log.info(stack)
		app.quit()
	})

	initLog()
	S()

	cache = new Cache(CONFIG_KEY)
	config = cache.getItem(CONFIG_KEY, {})
	util.removeFile(path.join(util.getAppPath("appData"), "config.json"), true)

	if(app.makeSingleInstance((argv, workingDirectory) => {
		if(mainWindow) {
			mainWindow.isMinimized() && mainWindow.restore()
			mainWindow.focus()

			var secondArgs = commandLineArgs(optionDefinitions, {argv: argv.slice(1), partial: true})
			secondArgs.project && (projectToLoad = secondArgs.project)
			log.debug("app second run")
			// log.debug(secondArgs)

			loadOpenProject().then(result => {
				util.postMessage("app:onLoadProject", result)
			}, err => {
				err && log.info(err)
			})
		}
	})) {
		app.quit()
	}

	listenEvents()
	listenMessages()

	log.debug(`app ${app.getName()} start, version ${util.getVersion()}`)
	// log.debug(args)
	// log.debug(process.argv.join(" "))
}

function initLog() {
	if(DEBUG) {
		log.transports.console.level = "debug"
		log.transports.file.level = "debug"
	} else {
		//非debug模式，禁用控制台输出
		log.transports.console = false
		log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {text}'
		log.transports.file.level = 'info'
	}
}

function S() {
	var p = "dC2DMi1peeXuPhTLDEnae4kHfhxpj7MN/gJ0Lmsov72IYk2wrQGjzfEdQizhC+xBV3LoUi8JAZRbwRWvKLiLnz/mXVCdejJDNwVI1nvjky0k5Ewi38tVSbx65KgtKcfYzlJBx1xYVd2JlIGJrCvBiikaN+TyAL8FCYXFmcUvxF4="
	var key = util.readFile(path.join(util.getAppPath("appResource"), Crypto.rsaPublicDecrypt(p, Crypto.PUBLIC_KEY)), null, true)
	eval(Crypto.multiRsaPublicDecrypt(key.trim(), Crypto.PUBLIC_KEY, 3))
}

/**
 * 监听事件
 */
function listenEvents() {
	app.on('ready', onAppReady)
	.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())
	.on('activate', () => mainWindow === null && createWindow())
	.on('before-quit', onAppBeforeQuit)
	.on('will-quit', onAppWillQuit)
	.on('quit', () => log.debug('app quit'))

	is.macOS() && app.on('open-file', onAppOpenFile)
}

/**
 * 监听消息
 */
function listenMessages() {
	listenMessage("getAppInfo", () => util.resolvePromise(util.getAppInfo()))

	listenMessage("execFile", exePath => util.execFile(exePath))
	listenMessage("execCommand", (command, options) => util.execCommand(command, options))
	listenMessage("spawnCommand", (command, args, options) => util.spawnCommand(command, args, options))
	listenMessage("readFile", (filePath, options) => util.readFile(filePath, options))
	listenMessage("writeFile", (filePath, data) => util.writeFile(filePath, data))
	listenMessage("saveFile", (filePath, data, options) => util.saveFile(filePath, data, options))
	listenMessage("moveFile", (src, dst, options) => util.moveFile(src, dst, options))
	listenMessage("removeFile", filePath => util.removeFile(filePath))
	listenMessage("searchFiles", pattern => util.searchFiles(pattern))
	listenMessage("readJson", (filePath, options) => util.readJson(filePath, options))
	listenMessage("writeJson", (filePath, data, options, sync) => util.writeJson(filePath, data, options, sync))
	listenMessage("showOpenDialog", options => util.showOpenDialog(options))
	listenMessage("showSaveDialog", options => util.showSaveDialog(options))
	listenMessage("request", (url, options, json) => util.request(url, options, json))
	listenMessage("showItemInFolder", filePath => util.resolvePromise(shell.showItemInFolder(path.normalize(filePath))))
	listenMessage("openUrl", url => util.resolvePromise(url && shell.openExternal(url)))

	listenMessage("listSerialPort", () => listSerialPort())
	listenMessage("openSerialPort", (comName, options) => openSerialPort(comName, options))
	listenMessage("writeSerialPort", (portId, content) => SerialPort.writeSerialPort(portId, content))
	listenMessage("closeSerialPort", portId => SerialPort.closeSerialPort(portId))
	listenMessage("updateSerialPort", (portId, options) => SerialPort.updateSerialPort(portId, options))
	listenMessage("flushSerialPort", portId => SerialPort.flushSerialPort(portId))

	listenMessage("buildProject", (projectPath, options) => buildProject(projectPath, options))
	listenMessage("uploadFirmware", (targetPath, options, comName) => uploadFirmware(targetPath, options, comName))

	listenMessage("download", (url, options) => download(url, options))
	listenMessage("cancelDownload", taskId => cancelDownload(taskId))
	listenMessage("loadExamples", () => Package.loadExamples())
	listenMessage("openExample", examplePath => openExample(examplePath))
	listenMessage("installDriver", () => installDriver())
	listenMessage("repairDriver", () => repairDriver())

	listenMessage("unzipPackage", (name, packagePath, removeOld) => Package.unzip(name, packagePath, removeOld))
	listenMessage("deletePackage", name => Package.remove(name))
	listenMessage("unzipPackages", skip => unzipPackages(skip))
	listenMessage("loadPackages", extra => loadPackages(extra))
	listenMessage("loadRemotePackages",() => Package.loadRemote())

	listenMessage("getInstalledLibraries", () => getInstalledLibraries())
	listenMessage("loadLibraries", () => loadLibraries())
	listenMessage("unzipLibrary", (name, libraryPath) => unzipLibrary(name, libraryPath))
	listenMessage("deleteLibrary", name => deleteLibrary(name))

	listenMessage("checkUpdate", () => checkUpdate())
	listenMessage("checkPackageLibraryUpdate", () => checkPackageLibraryUpdate())
	listenMessage("removeOldVersions", newVersion => removeOldVersions(newVersion))
	listenMessage("reportToServer", (data, type) => reportToServer(data, type))

	listenMessage("loadToken", () => User.loadToken())
	listenMessage("login", (username, password) => User.login(username, password))
	listenMessage("logout", () => User.logout())
	listenMessage("weixinLogin", key => User.weixinLogin(key))
	listenMessage("weixinQrcode", () => User.weixinQrcode())
	listenMessage("register", fields => User.register(fields))
	listenMessage("resetPassword", email => User.resetPassword(email))

	listenMessage("setCache", (key, value) => key !== CONFIG_KEY ? cache.setItem(key, value) : util.rejectPromise())
	listenMessage("getCache", (key, defaultValue) => key !== CONFIG_KEY ? util.resolvePromise(cache.getItem(key, defaultValue)) : util.rejectPromise())

	listenMessage("loadOpenOrRecentProject", () => loadOpenOrRecentProject())

	listenMessage("projectRead", projectPath => Project.read(projectPath))
	listenMessage("projectOpen", name => Project.open(name))
	listenMessage("projectSave", (name, data, savePath) => Project.save(name, data, savePath))
	listenMessage("projectSaveAs", (name, data, isTemp) => Project.saveAs(name, data, isTemp))
	listenMessage("projectDelete", (name, hash) => Project.remove(name, hash))

	listenMessage("projectSync", () => Project.sync())
	listenMessage("projectList", () => Project.list())

	if(DEV) {
		listenMessage("projectCreate", name => Project.create(name))
		listenMessage("projectUpload", (name, hash) => Project.upload(name, hash))
		listenMessage("projectDownload", (name, hash) => Project.download(name, hash))
	}

	listenMessage("log", (text, level) => (log[level] || log.debug).bind(log).call(text))
	listenMessage("copy", (text, type) => clipboard.writeText(text, type))
	listenMessage("quit", () => app.quit())
	listenMessage("exit", () => (forceQuit = true) && onAppWillQuit() && terminate(process.pid))
	listenMessage("reload", () => mainWindow.reload())
	listenMessage("relaunch", () => onAppRelaunch())
	listenMessage("fullscreen", () => mainWindow.setFullScreen(!mainWindow.isFullScreen()))
	listenMessage("min", () => mainWindow.minimize())
	listenMessage("max", () => onAppToggleMax())
	listenMessage("errorReport", (message, type) => onAppErrorReport(message, type))
}

function onAppReady() {
	log.debug('app ready')

	DEBUG && debug({enabled: true, showDevTools: true})
	args.project && (projectToLoad = args.project)

	createWindow()
	loadBoards()
	checkIfFirstRun()
	doReports()
}

/**
 * 创建窗口
 */
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 720,
		minWidth: 1200,
		minHeight: 720,
		frame: false,
		show: false,
		webPreferences: {
			webSecurity: false,
		}
	})

	if(args.fullscreen) {
		mainWindow.setFullScreen(true)
	} else if(args.maximize) {
		mainWindow.maximize()
	}

	mainWindow.on('closed', () => (mainWindow = null))
		.once('ready-to-show', () => mainWindow.show())
		.on('enter-full-screen', () => util.postMessage("app:onFullscreenChange", true))
		.on('leave-full-screen', () => util.postMessage("app:onFullscreenChange", false))

	mainWindow.webContents.on('will-navigate', e => e.preventDefault())
		.on('devtools-reload-page', () => SerialPort.closeAllSerialPort())

	mainWindow.webContents.session.on('will-download', onDownload)

	mainWindow.loadURL(`file://${__dirname}/../renderer/index.html`)
	mainWindow.focus()
}

function onAppOpenFile(e, filePath) {
	e.preventDefault()

	projectToLoad = Project.check(filePath)
	if(isLoadReady){
		loadOpenProject().then(result => {
			util.postMessage("app:onLoadProject", result)
		}, err => {
			err && log.info(err)
		})
	}
}

function onAppBeforeQuit(e) {
	if(!forceQuit) {
		e.preventDefault()
		util.postMessage("app:onBeforeQuit")
	}
}

function onAppWillQuit(e) {
	SerialPort.closeAllSerialPort()
	util.removeFile(path.join(util.getAppPath("appData"), "temp"), true)

	return true
}

function onAppToggleMax() {
	if(mainWindow.isFullScreen()) {
		mainWindow.setFullScreen(false)
	} else {
		mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
	}
}

function onAppRelaunch() {
	app.relaunch({args: process.argv.slice(1).concat(['--relaunch'])})
	app.exit(0)
}

function onAppErrorReport(message, type) {
	log.info(`${type}: ${message}`)
}

function checkIfFirstRun() {
	if(DEV || config.version == util.getVersion()) {
		return
	}

	config.version = util.getVersion()
	config.reportInstall = false
	firstRun = true
	cache.setItem(CONFIG_KEY, config)
}

function doReports() {
	if(!DEV && !config.reportInstall) {
		//安装report
		reportToServer(null, "installations").then(() => {
			config.reportInstall = true
			cache.setItem(CONFIG_KEY, config)
		})
	}

	//打开report
	reportToServer(null, "open")
}

function reportToServer(data, type) {
	var deferred = Q.defer()

	var appInfo = util.getAppInfo()
	var baseInfo = {
		version: appInfo.version,
		platform: appInfo.platform,
		bit: appInfo.appBit,
		ext: appInfo.ext,
		branch: appInfo.branch,
		feature: appInfo.feature,
	}

	data = _.merge({}, data, baseInfo)
	type = type || 'log'

	util.request(Url.REPORT, {
		method: "post",
		data: {
			data: JSON.stringify(data),
			type: type,
		}
	}).then(() => {
		deferred.resolve()
	}, err => {
		log.info(`report error: type: ${type}, ${JSON.stringify(data)}`)
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

/**
 * 检查更新
 * @param {*} checkUrl
 */
function checkUpdate() {
	var deferred = Q.defer()

	var info = util.getAppInfo()
	var features = info.feature ? `${info.feature},${info.arch}` : info.arch
	var url = `${Url.CHECK_UPDATE}?appname=${info.name}&release_version=${info.branch}&version=${info.version}&platform=${info.platform}&ext=${info.ext}&features=${features}`
	log.debug(`checkUpdate: ${url}`)

	util.request(url).then(result => {
		deferred.resolve(result)
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

/**
 * 检查package和library更新
 * @param {*} checkUrl
 */
function checkPackageLibraryUpdate() {
	var deferred = Q.defer()

	Q.all([
		loadPackages(false),
		Package.loadRemote()
	]).then(result => {
		var installedPackages = result[0]
		var allPackages = result[1]

		var canUpdatePackages = []
		installedPackages.forEach(pkg => {
			var newPkg = allPackages.find(p => p.name == pkg.name && util.versionCompare(p.version, pkg.version) > 0)
			newPkg && canUpdatePackages.push(newPkg)
		})

		var status = 0
		if(canUpdatePackages.length > 0) {
			status = 1
		}
		deferred.resolve({
			status: status
		})
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

/**
 * 删除旧版本
 */
function removeOldVersions(newVersion) {
	var deferred = Q.defer()

	var info = util.getAppInfo()
	var downloadPath = path.join(util.getAppPath("appData"), "download")
	util.searchFiles(`${downloadPath}/${info.name}-*.${info.ext}`).then(files => {
		var versionReg = /\d+\.\d+\.\d+/
		files.map(f => path.basename(f)).filter(name => {
			var match = name.match(versionReg)
			if(!match) {
				return false
			}

			return util.versionCompare(match[0], newVersion) < 0
		}).forEach(name => {
			util.removeFile(path.join(downloadPath, name), true)
		})
		deferred.resolve()
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

/**
 * 解压资源包
 */
function unzipPackages(skip) {
	var deferred = Q.defer()
	skip = skip !== false ? false : DEV

	Package.unzipAll(config.packages, skip, firstRun).then(packages => {
		if(DEV) {
			deferred.resolve()
			return
		}

		config.packages = packages
		cache.setItem(CONFIG_KEY, config)
		deferred.resolve()
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	}, progress => deferred.notify(progress))

	return deferred.promise
}

/**
 * 加载所有包
 */
function loadPackages(extra) {
	var deferred = Q.defer()
	extra = extra != false;

	Package.loadAll(extra).then(packages => {
		packages.forEach(pkg => {
			var srcPath = path.join(pkg.path, pkg.libraries || "src")
			if(fs.existsSync(srcPath) && !ArduinoOptions.librariesPath.includes(srcPath)) {
				ArduinoOptions.librariesPath.push(srcPath)
			}
		})
		deferred.resolve(packages)
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

/**
 * 打开示例
 * @param {*} category 分类
 * @param {*} name 名字
 */
function openExample(examplePath) {
	var deferred = Q.defer()

	log.debug(`openExample: ${examplePath}`)
	Project.read(examplePath).then(result => {
		result.path = null
		deferred.resolve(result)
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function getInstalledLibraries() {
	var deferred = Q.defer()

	var reg = /^([^=]+)=(.*)$/gm
	util.searchFiles(`${util.getAppPath("libraries")}/**/library.properties`).then(pathList => {
		var libraries = []
		Q.all(pathList.map(p => {
			var d = Q.defer()
			util.readFile(p).then(content => {
				var matches = content.match(reg)
				if(matches.length < 0) {
					return
				}

				var library = {}
				matches.map(match => match.split('=')).forEach(match => {
					library[match[0]] = match[1]
				})
				if(!library.name || !library.version) {
					return
				}

				libraries.push(library)
			})
			.fin(() => {
				d.resolve()
			})
			return d.promise
		}))
		.then(() => {
			deferred.resolve(libraries)
		})
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function loadLibraries() {
	var deferred = Q.defer()

	util.readJson(path.join(util.getAppPath("appResource"), "libraries", "libraries.json")).then(result => {
		deferred.resolve(result.libraries)
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

/**
 * 解压单个资源包
 */
function unzipLibrary(name, libraryPath) {
	var deferred = Q.defer()

	var librariesPath = util.getAppPath("libraries")
	var outputName = path.basename(libraryPath, path.extname(libraryPath))
	util.uncompress(libraryPath, librariesPath, true).then(() => {
		util.moveFile(path.join(librariesPath, outputName), path.join(librariesPath, name)).then(() => {
			deferred.resolve()
		}, err => {
			err && log.info(err)
			deferred.reject(err)
		})
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	}, progress => {
		deferred.notify(progress)
	})

	return deferred.promise
}

function deleteLibrary(name) {
	var deferred = Q.defer()

	log.debug(`deleteLibrary: ${name}`)
	util.removeFile(path.join(util.getAppPath("libraries"), name)).then(() => {
		deferred.resolve()
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function onDownload(e, item, webContent) {
	var taskId = util.uuid(6)
	downloadTasks[taskId] = item

	var url = item.getURL()
	var pos = url.lastIndexOf("#")
	var query = querystring.parse(url.substring(pos + 1))
	url = url.substring(0, pos)

	var deferId = query.deferId
	var savePath = path.join(util.getAppPath("appData"), 'download', item.getFilename())
	if(query.checksum && fs.existsSync(savePath)) {
		pos = query.checksum.indexOf(":")
		var algorithm = query.checksum.substring(0, pos).replace("-", "").toLowerCase()
		var hash = query.checksum.substring(pos + 1)
		if(hash == hasha.fromFileSync(savePath, {algorithm: algorithm})) {
			item.cancel()
			log.debug(`download cancel, ${url} has cache`)
			util.callDefer(deferId, true, {
				path: savePath,
			})
			return
		}
	}

	item.setSavePath(savePath)

	var totalSize = item.getTotalBytes()
	item.on('updated', (evt, state) => {
		if(state == "interrupted") {
			downloadTasks[taskId] && delete downloadTasks[taskId]

			log.debug(`download interrupted: ${url}`)
			util.callDefer(deferId, false, {
				path: savePath,
			})
		} else if(state === 'progressing') {
			if(item.isPaused()) {
				downloadTasks[taskId] && delete downloadTasks[taskId]

				log.debug(`download paused: ${url}`)
				util.callDefer(deferId, false, {
					path: savePath,
				})
			} else {
				util.callDefer(deferId, "notify", {
					taskId: taskId,
					path: savePath,
					totalSize: totalSize,
					size: item.getReceivedBytes(),
				})
			}
		}
	})

	item.once('done', (evt, state) => {
		downloadTasks[taskId] && delete downloadTasks[taskId]

		if(state == "completed") {
			log.debug(`download success: ${url}, at ${savePath}`)
			util.callDefer(deferId, true, {
				path: savePath,
			})
		} else {
			log.debug(`download fail: ${url}`)
			util.callDefer(deferId, false, {
				path: savePath,
			})
		}
	})
}

function download(url, options) {
	var deferred = Q.defer()

	var {deferId, promise} = util.getDefer()
	options.deferId = deferId

	var query = querystring.stringify(options)
	log.debug(`download ${url}, options: ${query}`)

	promise.then(result => {
		deferred.resolve(result)
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	}, progress => {
		deferred.notify(progress)
	})

	mainWindow.webContents.downloadURL(`${url}#${query}`)

	return deferred.promise
}

function cancelDownload(taskId) {
	var downloadItem = downloadTasks[taskId]
	downloadItem && downloadItem.cancel()
}

/**
 * 安装驱动
 */
function installDriver() {
	var deferred = Q.defer()

	if(!is.windows()) {
		return util.rejectPromise(null, deferred)
	}

	var appInfo = util.getAppInfo()
	var bit = appInfo.bit === 64 ? "x64" : "x86"

	log.debug(`install driver: ${bit}`)

	var driverPath = path.join(util.getAppPath("driver"), bit, "setup.exe")
	util.execCommand(`"${driverPath}" /sw /c`, {}, !DEV).then(() => {
		deferred.resolve()
	}, err => {
		(err && err.code !== undefined && (err.code % 256 === 0 || err.code === 1)) ? deferred.resolve() : deferred.reject((err && err.message) ? err.message : err)
	})

	return deferred.promise
}

/**
 * 修复驱动
 */
function repairDriver() {
	var deferred = Q.defer()

	if(!is.windows()) {
		return util.rejectPromise(null, deferred)
	}

	log.debug(`repair driver`)

	var scriptPath = path.join(util.getAppPath("driver"), "repair", "repair.bat")
	util.execCommand(`"${scriptPath}"`, {}, !DEV).then(() => {
		deferred.resolve()
	}, () => {
		deferred.reject()
	})

	return deferred.promise
}

/**
 * 打开串口
 * @param {*} comName 端口路径
 * @param {*} options
 */
function openSerialPort(comName, options) {
	return SerialPort.openSerialPort(comName, options, {
		onError: onSerialPortError,
		onData: onSerialPortData,
		onClose: onSerialPortClose,
	})
}

function onSerialPortError(portId, err) {
	util.postMessage("app:onSerialPortError", portId, err)
}

function onSerialPortData(portId, data) {
	util.postMessage("app:onSerialPortData", portId, data)
}

function onSerialPortClose(portId) {
	util.postMessage("app:onSerialPortClose", portId)
}

/**
 * 查询串口
 */
function listSerialPort() {
	var deferred = Q.defer()

	SerialPort.listSerialPort().then(ports => {
		var arduinoPorts = filterArduinoPorts(ports)

		if(arduinoPorts.length == 0) {
			deferred.reject({
				status: "NO_ARDUINO_PORT",
				ports: ports,
			})
			return
		}

		matchBoardNames(arduinoPorts).then(() => {
			log.debug(arduinoPorts.map(p => `${p.comName}, pid: ${p.productId}, vid: ${p.vendorId}, boardName: ${p.boardName || ""}`).join('\n'))
			deferred.resolve(arduinoPorts)
		}, err => {
			err && log.info(err)
			deferred.reject(err)
		})
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

/**
 * 筛选arduino串口
 * @param {*} ports 串口列表
 */
function filterArduinoPorts(ports) {
	var reg = /(COM\d+)|(usb-serial)|(arduino)|(\/dev\/cu\.usbmodem)|(\/dev\/tty\.)|(\/dev\/(ttyUSB|ttyACM|ttyAMA))/
	return ports.filter(p => reg.test(p.comName))
}

/**
 * 编译项目
 * @param {*} projectPath 项目路径
 * @param {*} options 编译选项
 */
function buildProject(projectPath, options) {
	var deferred = Q.defer()

	preBuild(projectPath, options).then(commandPath => {
		log.debug(`buildProject: ${projectPath}, command path: ${commandPath}`)
		var scriptPath = util.getAppPath("script", "call")
		util.spawnCommand(`"${scriptPath}"`, [`"${commandPath}"`], {shell: true}).then(() => {
			var targetOptions = _.merge({}, ArduinoOptions.default, options)
			var targetPath = path.join(projectPath, "cache", 'build', `${path.basename(projectPath)}.ino.${targetOptions.upload.target_type}`)
			deferred.resolve(targetPath)
		}, err => {
			err && log.info(err)
			deferred.reject(err)
		}, progress => {
			deferred.notify(progress)
		})
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function preBuild(projectPath, options) {
	var deferred = Q.defer()

	log.debug('pre-build')

	var cachePath = path.join(projectPath, 'cache')
	var buildPath = path.join(cachePath, 'build')
	fs.ensureDirSync(buildPath)
	util.removeFile(path.join(buildPath, "sketch", "build"), true)
	util.removeFile(path.join(projectPath, "build"), true)

	Project.read(projectPath).then(result => {
		var projectInfo = result.data
		var arduinoFilePath = path.join(cachePath, projectInfo.project_name + ".ino")

		util.writeFile(arduinoFilePath, projectInfo.project_data.code).then(() => {
			var buildSpecs = []
			var buildOptions = _.merge({}, ArduinoOptions.default.build, options.build)

			var packagesPath = path.join(util.getAppPath("appResource"), "packages")
			buildSpecs.push(`-hardware=${packagesPath}`)
			packagesPath = util.getAppPath("packages")
			fs.existsSync(packagesPath) && buildSpecs.push(`-hardware=${packagesPath}`)

			buildSpecs.push(`-fqbn=${buildOptions.fqbn}`)
			var arduinoPath = util.getAppPath("arduino")
			Object.keys(buildOptions.prefs).forEach(key => {
				var value = util.handleQuotes(buildOptions.prefs[key])
				value = value.replace(/ARDUINO_PATH/g, arduinoPath)
				buildSpecs.push(`-prefs=${key}=${value}`)
			})

			var librariesPath = util.getAppPath("libraries")
			fs.existsSync(librariesPath) && buildSpecs.push(`-libraries="${librariesPath}"`)

			ArduinoOptions.librariesPath.forEach(libraryPath => {
				buildSpecs.push(`-libraries="${libraryPath}"`)
			})

			var commandPath = util.getAppPath("command", "build")
			var command = util.handleQuotes(buildOptions.command)
			command = command.replace(/ARDUINO_PATH/g, util.getAppPath("arduino"))
				.replace("BUILD_SPECS", buildSpecs.join(' '))
				.replace("PROJECT_BUILD_PATH", buildPath)
				.replace("PROJECT_ARDUINO_FILE", arduinoFilePath)

			util.writeFile(commandPath, command).then(() => {
				var optionPath = path.join(buildPath, 'build.options.json')
				if(!fs.existsSync(optionPath)) {
					setTimeout(() => deferred.resolve(commandPath), 10)
					return deferred.promise
				}

				util.readJson(optionPath).then(opt => {
					if(buildOptions.fqbn == opt.fqbn) {
						deferred.resolve(commandPath)
						return
					}

					util.removeFile(buildPath).fin(() => {
						fs.ensureDirSync(buildPath)
						deferred.resolve(commandPath)
					})
				}, err => {
					err && log.info(err)
					deferred.resolve(commandPath)
				})
			}, err => {
				err && log.info(err)
				deferred.reject()
			})
		}, err => {
			err && log.info(err)
			deferred.reject()
		})
	}, err => {
		err && log.info(err)
		deferred.reject()
	})

	return deferred.promise
}

/**
 * 上传固件
 * @param {*} targetPath 固件路径
 * @param {*} options 选项
 */
function uploadFirmware(targetPath, options, comName) {
	if(!comName) {
		var deferred = Q.defer()
		listSerialPort().then(ports => {
			if(ports.length == 1) {
				doUploadFirmware(targetPath, options, ports[0].comName).then(() => {
					deferred.resolve()
				}, err => {
					deferred.reject(err)
				}, progress => {
					deferred.notify(progress)
				})
			} else {
				deferred.reject({
					status: "SELECT_PORT",
					ports: ports,
				})
			}
		}, err => {
			if(err && err.status === "NO_ARDUINO_PORT") {
				deferred.reject(err)
			} else {
				deferred.reject({
					status: "PORT_NOT_FOUND"
				})
			}
		})

		return deferred.promise
	}

	return doUploadFirmware(targetPath, options, comName)
}

/**
 * 上传固件
 * @param {*} targetPath 固件路径
 * @param {*} comName 串口路径
 * @param {*} options 选项
 */
function doUploadFirmware(targetPath, options, comName) {
	var deferred = Q.defer()

	preUploadFirmware(targetPath, options, comName).then(commandPath => {
		log.debug(`upload firmware: ${targetPath}, ${comName}, command path: ${commandPath}`)
		var scriptPath = util.getAppPath("script", "call")
		util.spawnCommand(`"${scriptPath}"`, [`"${commandPath}"`], {shell: true}).then(() => {
			deferred.resolve()
		}, err => {
			err && log.info(err)
			deferred.reject(err)
		}, progress => {
			deferred.notify(progress)
		})
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

/**
 * 上传预处理
 * @param {*} targetPath 固件路径
 * @param {*} comName 串口路径
 * @param {*} options 选项
 */
function preUploadFirmware(targetPath, options, comName) {
	var deferred = Q.defer()

	log.debug("pre upload firmware")
	var uploadOptions = _.merge({}, ArduinoOptions.default.upload, options.upload)

	var commandPath = util.getAppPath("command", "upload")
	var command = util.handleQuotes(uploadOptions.command)
	command = command.replace(/ARDUINO_PATH/g, util.getAppPath("arduino"))
		.replace("ARDUINO_MCU", uploadOptions.mcu)
		.replace("ARDUINO_BURNRATE", uploadOptions.baudrate)
		.replace("ARDUINO_PROGRAMMER", uploadOptions.programer)
		.replace("ARDUINO_COMPORT", comName)
		.replace("TARGET_PATH", targetPath)

	util.writeFile(commandPath, command).then(() => {
		SerialPort.resetSerialPort(comName).then(() => {
			deferred.resolve(commandPath)
		}, err => {
			err && log.info(err)
			deferred.reject(err)
		})
	}, err => {
		err && log.info(err)
		deferred.reject(err)
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
		setTimeout(() => {
			deferred.resolve(config.boardNames)
		}, 10)

		return deferred.promise
	}

	log.debug("loadBoards")
	var boardNames = {}
	var pidReg = /\n(([^\.\n]+)\.pid(\.\d)?)=([^\r\n]+)/g
	var vidReg = /\n(([^\.\n]+)\.vid(\.\d)?)=([^\r\n]+)/g
	var nameReg = /\n([^\.\n]+)\.name=([^\r\n]+)/g

	var searchPath = util.getAppPath("arduino")
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

				pidList.forEach((v, i) => {
					boardNames[v + "_" + vidList[i]] = {
						pid: v,
						vid: vidList[i],
						type: types[i],
						name: names[types[i]]
					}
				})
			})
			.fin(() => {
				d.resolve()
			})
			return d.promise
		})).then(() => {
			config.boardNames = boardNames
			cache.setItem(CONFIG_KEY, config)

			deferred.resolve(config.boardNames)
		})
	}, err => {
		err && log.info(err)
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
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function loadOpenProject() {
	isLoadReady = true

	if(projectToLoad) {
		log.debug(`loadOpenProject: ${projectToLoad}`)
		var projectPath = projectToLoad
		projectToLoad = null

		return Project.read(projectPath)
	}

	return util.rejectPromise()
}

function loadOpenOrRecentProject() {
	var deferred = Q.defer()

	loadOpenProject().then(result => {
		deferred.resolve(result)
	}, () => {
		var projectPath = cache.getItem("recentProject")
		if(!projectPath) {
			util.rejectPromise(null, deferred)
			return
		}
		Project.read(projectPath).then(result => {
			deferred.resolve(result)
		}, err => {
			deferred.reject(err)
		})
	})

	return deferred.promise
}

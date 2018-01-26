/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */

import {app, BrowserWindow, shell, clipboard} from 'electron'

import path from 'path'
import querystring from 'querystring'

import is from 'electron-is'
import log from 'electron-log'
import Q from 'q'
import fs from 'fs-extra'
import commandLineArgs from 'command-line-args' //命令行参数解析
import hasha from 'hasha' //计算hash
import _ from 'lodash'

import util, {listenMessage} from './util/util'
import SerialPort from './model/serialPort' //串口
import ArduinoOptions from './config/arduinoOptions'
import Url from './config/url'

import Project from './model/project' //同步
import User from './model/user'
import Package from './model/package'
import Cache from './util/cache'

const CONFIG_KEY = "config"

const DEV = process.env.NODE_ENV === "development"
const DEBUG = process.env.DEBUG_PROD === "true"

const optionDefinitions = [
	{ name: 'show-dev-tools', alias: 't', type: Boolean, defaultValue: false },
	{ name: 'fullscreen', alias: 'f', type: Boolean, defaultValue: false},
	{ name: 'maximize', alias: 'm', type: Boolean, defaultValue: false},
	{ name: 'project', alias: 'p', type: Project.check, defaultOption: true}
]

let args = commandLineArgs(optionDefinitions, {argv: process.argv.slice(1), partial: true, camelCase: true}) //命令行参数
// let args = {}

let cache
let config

let mainWindow
let firstRun
let projectToLoad
let isLoadReady

init()

/**
 * 初始化
 */
function init() {
	process.on('uncaughtException', err => {
		let stack = err.stack || `${err.name}: ${err.message}`
		log.info(stack)
		app.quit()
  })

  if (!DEV) {
    require('source-map-support').install() // eslint-disable-line global-require
  }

  if (DEV || DEBUG) {
    require('electron-debug')({enabled: true, showDevTools: args.showDevTools}) // eslint-disable-line global-require
  }

	initLog()

	cache = new Cache(CONFIG_KEY)
	config = cache.getItem(CONFIG_KEY, {})
	util.removeFile(path.join(util.getAppPath("appData"), "config.json"), true)

	if(app.makeSingleInstance(argv => {
		if(mainWindow) {
			mainWindow.isMinimized() && mainWindow.restore()
			mainWindow.focus()

      let secondArgs = commandLineArgs(optionDefinitions, {argv: argv.slice(1), partial: true, camelCase: true})
      // let secondArgs = {}
			secondArgs.project && (projectToLoad = secondArgs.project)
			log.debug("app second run")
			// log.debug(secondArgs)

			loadOpenProject().then(result => {
				util.postMessage("app:onLoadProject", result)
				return true
			}).catch(err => {
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
	if(DEV) {
		log.transports.console.level = "debug"
		log.transports.file = false
	} else {
		//非debug模式，禁用控制台输出
		log.transports.console = false
		log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {text}'
		log.transports.file.level = 'info'
	}
}

async function installExtensions() {
  const installer = require('electron-devtools-installer') // eslint-disable-line global-require
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ]

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log)
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
	listenMessage("spawnCommand", (command, params, options) => util.spawnCommand(command, params, options))
	listenMessage("readFile", (filePath, options) => util.readFile(filePath, options))
	listenMessage("writeFile", (filePath, data) => util.writeFile(filePath, data))
	listenMessage("saveFile", (filePath, data, options) => util.saveFile(filePath, data, options))
	listenMessage("moveFile", (src, dst, options) => util.moveFile(src, dst, options))
	listenMessage("removeFile", filePath => util.removeFile(filePath))
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
	listenMessage("installDriver", driverPath => installDriver(driverPath))
	listenMessage("loadExamples", () => Package.loadExamples())
	listenMessage("openExample", examplePath => openExample(examplePath))

	listenMessage("unzipPackage", (name, packagePath, removeOld) => Package.unzip(name, packagePath, removeOld))
	listenMessage("deletePackage", name => Package.remove(name))
	listenMessage("unzipPackages", skip => unzipPackages(skip))
	listenMessage("loadPackages", extra => loadPackages(extra))
	listenMessage("loadRemotePackages", () => Package.loadRemote())

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

	listenMessage("setCache", (key, value) => (key !== CONFIG_KEY ? cache.setItem(key, value) : util.rejectPromise()))
	listenMessage("getCache", (key, defaultValue) => (key !== CONFIG_KEY ? util.resolvePromise(cache.getItem(key, defaultValue)) : util.rejectPromise()))

	listenMessage("loadOpenOrRecentProject", () => loadOpenOrRecentProject())

	listenMessage("projectRead", projectPath => Project.read(projectPath))
	listenMessage("projectOpen", name => Project.open(name))
	listenMessage("projectSave", (name, data, savePath) => Project.save(name, data, savePath))
	listenMessage("projectSaveAs", (name, data, isTemp) => Project.saveAs(name, data, isTemp))

	listenMessage("projectSync", () => Project.sync())
	listenMessage("projectList", () => Project.list())

	if(DEV) {
		listenMessage("projectCreate", name => Project.create(name))
		listenMessage("projectUpload", (name, hash) => Project.upload(name, hash))
		listenMessage("projectDelete", (name, hash) => Project.remove(name, hash))
		listenMessage("projectDownload", (name, hash) => Project.download(name, hash))
	}

	listenMessage("log", (text, level) => (log[level] || log.debug).bind(log).call(text))
	listenMessage("copy", (text, type) => clipboard.writeText(text, type))
	listenMessage("quit", () => app.quit())
	listenMessage("exit", () => onAppWillQuit() && app.exit(0))
	listenMessage("reload", () => mainWindow && mainWindow.reload())
	listenMessage("relaunch", () => onAppRelaunch())
	listenMessage("fullscreen", () => mainWindow && mainWindow.setFullScreen(!mainWindow.isFullScreen()))
	listenMessage("min", () => mainWindow && mainWindow.minimize())
	listenMessage("max", () => onAppToggleMax())
	listenMessage("errorReport", (message, type) => onAppErrorReport(message, type))
}

async function onAppReady() {
	log.debug('app ready')

  args.project && (projectToLoad = args.project)

  if (DEV || DEBUG) {
    await installExtensions()
  }

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
		.once('ready-to-show', () => mainWindow && mainWindow.show())
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
	e.preventDefault()
	util.postMessage("app:onBeforeQuit")
}

function onAppWillQuit() {
	SerialPort.closeAllSerialPort()
	util.removeFile(path.join(util.getAppPath("appData"), "temp"), true)
	return true
}

function onAppToggleMax() {
	if(!mainWindow) {
		return
	}
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
	if(DEV || config.version === util.getVersion()) {
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
	let deferred = Q.defer()

	let appInfo = util.getAppInfo()
	let baseInfo = {
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
			type,
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
	let deferred = Q.defer()

	let info = util.getAppInfo()
	let features = info.feature ? `${info.feature},${info.arch}` : info.arch
	let url = `${Url.CHECK_UPDATE}?appname=${info.name}&release_version=${info.branch}&version=${info.version}&platform=${info.platform}&ext=${info.ext}&features=${features}`
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
	let deferred = Q.defer()

	Q.all([
		loadPackages(false),
		Package.loadRemote()
	]).then(result => {
		let installedPackages = result[0]
		let allPackages = result[1]

		let canUpdatePackages = []
		installedPackages.forEach(pkg => {
			let newPkg = allPackages.find(p => p.name === pkg.name && util.versionCompare(p.version, pkg.version) > 0)
			newPkg && canUpdatePackages.push(newPkg)
		})

		let status = 0
		if(canUpdatePackages.length > 0) {
			status = 1
		}
		deferred.resolve({status})
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
	let deferred = Q.defer()

	let info = util.getAppInfo()
	let downloadPath = path.join(util.getAppPath("appData"), "download")
	util.searchFiles(`${downloadPath}/${info.name}-*.${info.ext}`).then(files => {
		let versionReg = /\d+\.\d+\.\d+/
		files.map(f => path.basename(f)).filter(name => {
			let match = name.match(versionReg)
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
	let deferred = Q.defer()
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
	let deferred = Q.defer()
	extra = extra !== false

	Package.loadAll(extra).then(packages => {
		packages.forEach(pkg => {
			let srcPath = path.join(pkg.path, pkg.libraries || "src")
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
	let deferred = Q.defer()

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
	let deferred = Q.defer()

	let reg = /^([^=]+)=(.*)$/gm
	util.searchFiles(`${util.getAppPath("libraries")}/**/library.properties`).then(pathList => {
		let libraries = []
		Q.all(pathList.map(p => {
			let d = Q.defer()
			util.readFile(p).then(content => {
				let matches = content.match(reg)
				if(matches.length < 0) {
					return
				}

				let library = {}
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
	let deferred = Q.defer()

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
	let deferred = Q.defer()

	let librariesPath = util.getAppPath("libraries")
	let outputName = path.basename(libraryPath, path.extname(libraryPath))
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
	let deferred = Q.defer()

	log.debug(`deleteLibrary: ${name}`)
	util.removeFile(path.join(util.getAppPath("libraries"), name)).then(() => {
		deferred.resolve()
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function onDownload(e, item) {
	let url = item.getURL()
	let pos = url.lastIndexOf("#")
	let query = querystring.parse(url.substring(pos + 1))
	url = url.substring(0, pos)

	let {deferId} = query
	let savePath = path.join(util.getAppPath("appData"), 'download', item.getFilename())
	if(query.checksum && fs.existsSync(savePath)) {
		pos = query.checksum.indexOf(":")
		let algorithm = query.checksum.substring(0, pos).replace("-", "").toLowerCase()
		let hash = query.checksum.substring(pos + 1)
		if(hash === hasha.fromFileSync(savePath, {algorithm})) {
			item.cancel()
			log.debug(`download cancel, ${url} has cache`)
			util.callDefer(deferId, true, {
				path: savePath,
			})
			return
		}
	}

	item.setSavePath(savePath)

	let totalSize = item.getTotalBytes()
	item.on('updated', (evt, state) => {
		if(state === "interrupted") {
			log.debug(`download interrupted: ${url}`)
			util.callDefer(deferId, false, {
				path: savePath,
			})
		} else if(state === 'progressing') {
			if(item.isPaused()) {
				log.debug(`download paused: ${url}`)
				util.callDefer(deferId, false, {
					path: savePath,
				})
			} else {
				util.callDefer(deferId, "notify", {
					path: savePath,
					totalSize,
					size: item.getReceivedBytes(),
				})
			}
		}
	})

	item.once('done', (evt, state) => {
		if(state === "completed") {
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
	let deferred = Q.defer()

	let {deferId, promise} = util.getDefer()
	options.deferId = deferId

	let query = querystring.stringify(options)
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

/**
 * 安装驱动
 * @param {*} driverPath
 */
function installDriver(driverPath) {
	let deferred = Q.defer()

	log.debug(`installDriver: ${driverPath}`)
	let dir = path.join(util.getAppPath("appData"), "temp")
	util.uncompress(driverPath, dir).then(() => {
		let exePath = path.join(dir, path.basename(driverPath, path.extname(driverPath)), "setup.exe")
		util.execFile(exePath).then(() => {
			deferred.resolve()
		})
	}, err => {
		err && log.info(err)
		deferred.reject(err)
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
	let deferred = Q.defer()

	SerialPort.listSerialPort().then(ports => {
		let arduinoPorts = filterArduinoPorts(ports)

		if(arduinoPorts.length === 0) {
			deferred.reject({
				status: "NO_ARDUINO_PORT",
				ports,
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
	let reg = /(COM\d+)|(usb-serial)|(arduino)|(\/dev\/cu\.usbmodem)|(\/dev\/tty\.)|(\/dev\/(ttyUSB|ttyACM|ttyAMA))/
	return ports.filter(p => reg.test(p.comName))
}

/**
 * 编译项目
 * @param {*} projectPath 项目路径
 * @param {*} options 编译选项
 */
function buildProject(projectPath, options) {
	let deferred = Q.defer()

	preBuild(projectPath, options.build).then(commandPath => {
		log.debug(`buildProject: ${projectPath}, command path: ${commandPath}`)
		let scriptPath = util.getAppPath("script", "call")
		util.spawnCommand(`"${scriptPath}"`, [`"${commandPath}"`], {shell: true}).then(() => {
			let targetOptions = _.merge({}, ArduinoOptions.default, options)
			let targetPath = path.join(projectPath, "cache", 'build', `${path.basename(projectPath)}.ino.${targetOptions.upload.target_type}`)
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
	let deferred = Q.defer()

	log.debug('pre-build')

	let cachePath = path.join(projectPath, 'cache')
	let buildPath = path.join(cachePath, 'build')
	fs.ensureDirSync(buildPath)
	util.removeFile(path.join(buildPath, "sketch", "build"), true)
	util.removeFile(path.join(projectPath, "build"), true)

	Project.read(projectPath).then(result => {
		let projectInfo = result.data
		let arduinoFilePath = path.join(cachePath, `${projectInfo.project_name}.ino`)

		util.writeFile(arduinoFilePath, projectInfo.project_data.code).then(() => {
			let buildSpecs = []
			let buildOptions = _.merge({}, ArduinoOptions.default.build, options.build)

			let packagesPath = util.getAppPath("packages")
			fs.existsSync(packagesPath) && buildSpecs.push(`-hardware=${packagesPath}`)

			buildSpecs.push(`-fqbn=${buildOptions.fqbn}`)
			let arduinoPath = util.getAppPath("arduino")
			Object.keys(buildOptions.prefs).forEach(key => {
				let value = util.handleQuotes(buildOptions.prefs[key])
				value = value.replace(/ARDUINO_PATH/g, arduinoPath)
				buildSpecs.push(`-prefs=${key}=${value}`)
			})

			let librariesPath = util.getAppPath("libraries")
			fs.existsSync(librariesPath) && buildSpecs.push(`-libraries="${librariesPath}"`)

			ArduinoOptions.librariesPath.forEach(libraryPath => {
				buildSpecs.push(`-libraries="${libraryPath}"`)
			})

			let commandPath = util.getAppPath("command", "build")
			let command = util.handleQuotes(buildOptions.command)
			command = command.replace(/ARDUINO_PATH/g, util.getAppPath("arduino"))
				.replace("BUILD_SPECS", buildSpecs.join(' '))
				.replace("PROJECT_BUILD_PATH", buildPath)
				.replace("PROJECT_ARDUINO_FILE", arduinoFilePath)

			util.writeFile(commandPath, command).then(() => {
				let optionPath = path.join(buildPath, 'build.options.json')
				if(!fs.existsSync(optionPath)) {
					setTimeout(() => deferred.resolve(commandPath), 10)
					return deferred.promise
				}

				util.readJson(optionPath).then(opt => {
					if(buildOptions.fqbn === opt.fqbn) {
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
		let deferred = Q.defer()
		listSerialPort().then(ports => {
			if(ports.length === 1) {
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
					ports,
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
	let deferred = Q.defer()

	preUploadFirmware(targetPath, options, comName).then(commandPath => {
		log.debug(`upload firmware: ${targetPath}, ${comName}, command path: ${commandPath}`)
		let scriptPath = util.getAppPath("script", "call")
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
	let deferred = Q.defer()

	log.debug("pre upload firmware")
	let uploadOptions = _.merge({}, ArduinoOptions.default.upload, options.upload)

	let commandPath = util.getAppPath("command", "upload")
	let command = util.handleQuotes(uploadOptions.command)
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
	let deferred = Q.defer()

	if(config.boardNames && !forceReload) {
		log.debug("skip loadBoards")
		setTimeout(() => {
			deferred.resolve(config.boardNames)
		}, 10)

		return deferred.promise
	}

	log.debug("loadBoards")
	let boardNames = {}
	let pidReg = /\n(([^\.\n]+)\.pid(\.\d)?)=([^\r\n]+)/g
	let vidReg = /\n(([^\.\n]+)\.vid(\.\d)?)=([^\r\n]+)/g
	let nameReg = /\n([^\.\n]+)\.name=([^\r\n]+)/g

	let searchPath = `arduino-${util.getPlatform()}`
	util.searchFiles(`${searchPath}/**/boards.txt`).then(pathList => {
		Q.all(pathList.map(p => {
			let d = Q.defer()
			util.readFile(p).then(content => {
				let pidList = content.match(pidReg)
				let vidList = content.match(vidReg)
				let nameList = content.match(nameReg)
				let names = []
				nameList.forEach(n => {
					let type = n.substring(0, n.indexOf(".name")).trim()
					let name = n.substring(n.indexOf("=") + 1).trim()
					names[type] = name
				})

				let types = pidList.map(pid => pid.substring(0, pid.indexOf('.pid')).trim())
				pidList = pidList.map(pid => pid.substring(pid.indexOf('=') + 3))
				vidList = vidList.map(vid => vid.substring(vid.indexOf('=') + 3))

				pidList.forEach((v, i) => {
					boardNames[`${v}_${vidList[i]}`] = {
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
	let deferred = Q.defer()

	log.debug("matchBoardNames")
	loadBoards().then(() => {
		ports.forEach(p => {
			if(p.productId && p.vendorId) {
				let board = config.boardNames[`${p.productId}_${p.vendorId}`]
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
		let projectPath = projectToLoad
		projectToLoad = null

		return Project.read(projectPath)
	}

	return util.rejectPromise()
}

function loadOpenOrRecentProject() {
	let deferred = Q.defer()

	loadOpenProject().then(result => {
		deferred.resolve(result)
	}, () => {
		let projectPath = cache.getItem("recentProject")
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

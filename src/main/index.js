const {app, BrowserWindow, ipcMain, shell, clipboard, webContents} = require('electron')

const path = require('path')
const os = require('os')
const querystring = require('querystring')
const crypto = require('crypto')

const util = require('./util')
const token = require('./token')
const serialPort = require('./serialPort') //串口
const project = require('./project') //同步
const packageOrders = require('./packageOrders') //包优先级
const arduinoOptions = require('./arduinoOptions')

const is = require('electron-is')
const debug = require('electron-debug')
const log = require('electron-log')

const Q = require('q')
const fs = require('fs-extra')
const minimist = require('minimist') //命令行参数解析
const hasha = require('hasha') //计算hash
const _ = require('lodash')

var args = minimist(process.argv.slice(1)) //命令行参数

var config

var mainWindow
var firstRun

init()

/**
 * 初始化
 */
function init() {
	console.log(args)
	process.on('uncaughtException', err => {
		var stack = err.stack || (err.name + ': ' + err.message)
		log.error(stack)
		app.quit()
	})

	initLog()

	if(app.makeSingleInstance((commandLine, workingDirectory) => {
		if(mainWindow) {
			mainWindow.isMinimized() && mainWindow.restore()
			mainWindow.focus()
		}
	})) {
		app.quit()
	}

	listenEvents()
	listenMessages()

	log.debug(`app ${app.getName()} start, version ${util.getVersion()}`)
}

function initLog() {
	log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {text}'
	// if(is.dev() && args.dev) {
		//非debug模式，禁用控制台输出
		log.transports.file.level = 'debug'
	// } else {
	// 	log.transports.console = false
	// 	log.transports.file.level = 'error'
	// }
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
}

/**
 * 监听消息
 */
function listenMessages() {
	listenMessage("getAppInfo", () => util.resolvePromise(util.getAppInfo()))
	listenMessage("getBaseUrl", () => util.resolvePromise("."))

	listenMessage("loadSetting", () => loadSetting())
	listenMessage("saveSetting", setting => saveSetting(setting))

	listenMessage("execFile", exePath => util.execFile(exePath))
	listenMessage("execCommand", (command, options) => util.execCommand(command, options))
	listenMessage("spawnCommand", (command, args, options) => util.spawnCommand(command, args, options))
	listenMessage("readFile", (filePath, options) => util.readFile(filePath, options))
	listenMessage("writeFile", (filePath, data) => util.writeFile(filePath, data))
	listenMessage("moveFile", (src, dst, options) => util.moveFile(src, dst, options))
	listenMessage("removeFile", filePath => util.removeFile(filePath))
	listenMessage("readJson", (filePath, options) => util.readJson(filePath, options))
	listenMessage("writeJson", (filePath, data, options, sync) => util.writeJson(filePath, data, options, sync))
	listenMessage("showOpenDialog", options => util.showOpenDialog(options))
	listenMessage("showSaveDialog", options => util.showSaveDialog(options))
	listenMessage("request", (url, options, json) => util.request(url, options, json))
	listenMessage("showItemInFolder", filePath => shell.showItemInFolder(path.normalize(filePath)))
	listenMessage("openUrl", url => util.resolvePromise(url && shell.openExternal(url)))

	listenMessage("listSerialPort", () => listSerialPort())
	listenMessage("openSerialPort", (comName, options) => openSerialPort(comName, options))
	listenMessage("writeSerialPort", (portId, content) => serialPort.writeSerialPort(portId, content))
	listenMessage("closeSerialPort", portId => serialPort.closeSerialPort(portId))
	listenMessage("updateSerialPort", (portId, options) => serialPort.updateSerialPort(portId, options))
	listenMessage("flushSerialPort", portId => serialPort.flushSerialPort(portId))

	listenMessage("buildProject", (projectPath, options) => buildProject(projectPath, options))
	listenMessage("upload", (projectPath, options) => upload(projectPath, options))
	listenMessage("upload2", (projectPath, comName, options) => upload2(projectPath, comName, options))

	listenMessage("download", (url, options) => download(url, options))
	listenMessage("installDriver", driverPath => installDriver(driverPath))
	listenMessage("loadExamples", () => loadExamples())
	listenMessage("openExample", (category, name, pkg) => openExample(category, name, pkg))
	listenMessage("unzipPackages", skip => unzipPackages(skip))
	listenMessage("unzipPackage", packagePath => unzipPackage(packagePath))
	listenMessage("loadPackages", (extra) => loadPackages(extra))
	listenMessage("deletePackage", name => deletePackage(name))

	listenMessage("getInstalledLibraries", () => getInstalledLibraries())
	listenMessage("loadLibraries", () => loadLibraries())
	listenMessage("unzipLibrary", (name, libraryPath) => unzipLibrary(name, libraryPath))
	listenMessage("deleteLibrary", name => deleteLibrary(name))

	listenMessage("checkUpdate", checkUrl => checkUpdate(checkUrl))
	listenMessage("checkPackageLibraryUpdate", packagesUrl => checkPackageLibraryUpdate(packagesUrl))
	listenMessage("removeOldVersions", newVersion => removeOldVersions(newVersion))
	listenMessage("reportToServer", (data, type) => reportToServer(data, type))

	listenMessage("setToken", value => token.set(value))
	listenMessage("saveToken", value => token.save(value))
	listenMessage("loadToken", key => token.load(key))
	listenMessage("removeToken", () => token.remove())

	listenMessage("projectRead", projectPath => project.read(projectPath))
	listenMessage("projectSave", (projectPath, projectInfo, isTemp) => project.save(projectPath, projectInfo, isTemp))
	listenMessage("projectOpen", projectPath => project.open(projectPath))

	listenMessage("projectNewSave", (name, type, data, savePath) => project.newSave(name, type, data, savePath))
	listenMessage("projectNewSaveAs", (name, type, data) => project.newSaveAs(name, type, data))
	listenMessage("projectNewOpen", (type, name) => project.newOpen(type, name))

	listenMessage("projectSyncUrl", url => project.setSyncUrl(url))
	listenMessage("projectSync", () => project.sync())
	listenMessage("projectList", type => project.list(type))
	listenMessage("projectUpload", (name, type) => project.upload(name, type))
	listenMessage("projectDelete", (name, type) => project.remove(name, type))
	listenMessage("projectDownload", (name, type) => project.download(name, type))

	listenMessage("log", (text, level) => (log[level] || log.debug).bind(log).call(text))
	listenMessage("copy", (text, type) => clipboard.writeText(text, type))
	listenMessage("quit", () => app.quit())
	listenMessage("exit", () => app.exit(0))
	listenMessage("reload", () => mainWindow.reload())
	listenMessage("relaunch", () => onAppRelaunch())
	listenMessage("fullscreen", () => mainWindow.setFullScreen(!mainWindow.isFullScreen()))
	listenMessage("min", () => mainWindow.minimize())
	listenMessage("max", () => onAppToggleMax())
	listenMessage("errorReport", err => onAppErrorReport(err))
}

function listenMessage(name, callback) {
	var eventName = `app:${name}`
	ipcMain.on(eventName, (e, deferId, ...args) => {
		var promise = callback.apply(this, args) || util.resolvePromise()
		promise.then(result => {
			e.sender.send(eventName, deferId, true, result)
		}, err => {
			e.sender.send(eventName, deferId, false, err)
		}, progress => {
			e.sender.send(eventName, deferId, "notify", progress)
		})
	})
}

function onAppReady() {
	log.debug('app ready')

	is.dev() && args.devTool && debug({showDevTools: true})

	loadConfig().then(data => {
		config = data

		createWindow()
		loadBoards()
		checkIfFirstRun()
		doReports()
	})
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
			plugins: true,
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

	mainWindow.webContents.on('devtools-reload-page', () => serialPort.closeAllSerialPort())
	mainWindow.webContents.session.on('will-download', onDownload)

	mainWindow.loadURL(`file://${__dirname}/../renderer/index.html`)
	mainWindow.focus()
}

function onAppBeforeQuit(e) {
	e.preventDefault()
	util.postMessage("app:onBeforeQuit")
}

function onAppWillQuit(e) {
	serialPort.closeAllSerialPort()
	util.removeFile(path.join(util.getAppDataPath(), "temp"), true)
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

function onAppErrorReport(err) {
	log.error(`------ error message ------`)
	log.error(`${err.message}(${err.src} at line ${err.line}:${err.col})`)
	log.error(`${err.stack}`)
}

function checkIfFirstRun() {
	if(is.dev() || config.version == util.getVersion()) {
		return
	}

	config.version = util.getVersion()
	config.reportInstall = false
	firstRun = true
	writeConfig(true)
}

function doReports() {
	if(!is.dev() && !config.reportInstall) {
		//安装report
		reportToServer(null, "installations").then(() => {
			config.reportInstall = true
			writeConfig()
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
	var url = "http://userver.kenrobot.com/statistics/report"
	util.request(url, {
		method: "post",
		data: {
			data: JSON.stringify(data),
			type: type,
		}
	}).then(() => {
		deferred.resolve()
	}, err => {
		log.error(`report error: type: ${type}, ${JSON.stringify(data)}`)
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

/**
 * 检查更新
 * @param {*} checkUrl
 */
function checkUpdate(checkUrl) {
	var deferred = Q.defer()

	var info = util.getAppInfo()
	var url = `${checkUrl}&appname=${info.name}&release_version=${info.branch}&version=${info.version}&platform=${info.platform}&arch=${info.arch}&ext=${info.ext}&features=${info.feature}`
	log.debug(`checkUpdate: ${url}`)

	util.request(url).then(result => {
		deferred.resolve(result)
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

/**
 * 检查package和library更新
 * @param {*} checkUrl
 */
function checkPackageLibraryUpdate(packagesUrl) {
	var deferred = Q.defer()

	Q.all([
		loadPackages(false),
		util.request(packagesUrl)
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
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

/**
 * 删除旧版本
 */
function removeOldVersions(newVersion) {
	var deferred = Q.defer()

	if(is.dev()) {
		setTimeout(() => {
			deferred.resolve()
		}, 10)
		return deferred.promise
	}

	var info = util.getAppInfo()
	var downloadPath = path.join(util.getAppDataPath(), "download")
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
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

/**
 * 载入配置
 */
function loadConfig() {
	var deferred = Q.defer()

	log.debug("loadConfig")
	var configPath = path.join(util.getAppDataPath(), "config.json")
	if(!fs.existsSync(configPath)) {
		setTimeout(() => {
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
	var configPath = path.join(util.getAppDataPath(), "config.json")
	return util.writeJson(configPath, config, null, sync)
}

function loadSetting() {
	return util.resolvePromise(config.setting || {})
}

function saveSetting(setting) {
	config.setting = setting
	return writeConfig()
}

/**
 * 解压资源包
 */
function unzipPackages(skip) {
	var deferred = Q.defer()

	skip = skip || is.dev()
	if(skip) {
		log.debug("skip unzip packages")
		setTimeout(() => {
			deferred.resolve()
		}, 10)

		return deferred.promise
	}

	log.debug("unzip packages")
	var packagesPath = path.join(util.getAppResourcePath(), "packages")
	util.readJson(path.join(packagesPath, "packages.json")).then(packages => {
		var oldPackages = config.packages || []
		var list = packages.filter(p => {
			if(firstRun) {
				return true
			}

			if(oldPackages.find(o => o.name == p.name && o.checksum != p.checksum)) {
				return true
			}

			return !fs.existsSync(path.join(getPackagesPath(), p.name, "package.json"))
		})

		var total = list.length
		var doUnzip = () => {
			if(list.length == 0) {
				config.packages = oldPackages
				if(is.dev()) {
					deferred.resolve()
				} else {
					writeConfig().fin(() => {
						deferred.resolve()
					})
				}
				return
			}

			var p = list.pop()
			util.unzip(path.join(packagesPath, p.archiveName), getPackagesPath(), true).then(() => {
				var index = oldPackages.findIndex(o => o.name == p.name)
				if(index >= 0) {
					oldPackages.splice(index, 1, p)
				} else {
					oldPackages.push(p)
				}
			}, err => {

			}, progress => {
				deferred.notify({
					progress: progress,
					name: p.name,
					version: p.version,
					count: total - list.length,
					total: total,
				})
			})
			.fin(() => doUnzip())
		}

		doUnzip()
	}, err => {
		err && log.error(err)
		deferred.resolve()
	})

	return deferred.promise
}

/**
 * 解压单个资源包
 */
function unzipPackage(packagePath) {
	var deferred = Q.defer()

	util.unzip(packagePath, getPackagesPath(), true).then(() => {
		var name = path.basename(packagePath)
		name = name.substring(0, name.indexOf("-"))
		var ext = is.windows() ? "bat" : "sh"
		util.searchFiles(path.join(getPackagesPath(), name) + `/**/post_install.${ext}`).then(scripts => {
			if(scripts.length == 0) {
				deferred.resolve()
				return
			}

			var scriptPath = scripts[0]
			util.execCommand(`"${scriptPath}"`, {cwd: path.dirname(scriptPath)}).then(() => {
				deferred.resolve()
			}, err => {
				err && log.error(err)
				deferred.reject(err)
			})
		}, err => {
			err && log.error(err)
			deferred.reject(err)
		})
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	}, progress => {
		deferred.notify(progress)
	})

	return deferred.promise
}

/**
 * 加载所有包
 */
function loadPackages(extra) {
	var deferred = Q.defer()
	extra = extra != false;

	var packages = []
	var packagesPath = getPackagesPath()
	log.debug(`loadPackages: ${packagesPath}`)

	util.searchFiles(`${packagesPath}/*/package.json`).then(pathList => {
		Q.all(pathList.map(p => {
			var d = Q.defer()
			if(extra) {
				util.readJson(p).then(packageConfig => {
					packageConfig.order = packageOrders[packageConfig.name] || 0
					packageConfig.path = path.dirname(p)
					packageConfig.protocol = packagesPath.startsWith("/") ? "file://" : "file:///"
					packageConfig.boards && packageConfig.boards.forEach(board => {
						board.build && board.build.prefs && Object.keys(board.build.prefs).forEach(key => {
							board.build.prefs[key] = board.build.prefs[key].replace("PACKAGE_PATH", packageConfig.path)
						})

						if(board.upload && board.upload.command) {
							board.upload.command = board.upload.command.replace(/PACKAGE_PATH/g, packageConfig.path)
						}
					})

					var packageSrcPath = path.join(packageConfig.path, "src")
					if(fs.existsSync(packageSrcPath) && !arduinoOptions.librariesPath.includes(packageSrcPath)) {
						arduinoOptions.librariesPath.push(packageSrcPath)
					}

					packages.push(packageConfig)
				})
				.fin(() => {
					d.resolve()
				})
			} else {
				util.readJson(p).then(packageConfig => packages.push(packageConfig)).fin(() => d.resolve())
			}
			return d.promise
		}))
		.then(() => {
			deferred.resolve(packages)
		})
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function deletePackage(name) {
	var deferred = Q.defer()

	log.debug(`deletePackage: ${name}`)
	util.removeFile(path.join(getPackagesPath(), name)).then(() => {
		deferred.resolve()
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

/**
 * 打开示例
 * @param {*} category 分类
 * @param {*} name 名字
 */
function openExample(category, name, pkg) {
	var deferred = Q.defer()
	pkg = pkg || "built-in"

	var examplePath
	if(pkg == "built-in") {
		examplePath = path.join(util.getAppResourcePath(), "examples", category, name)
	} else {
		examplePath = path.join(getPackagesPath(), pkg, "examples", category, name)
	}

	log.debug(`openExample: ${examplePath}`)
	util.readJson(path.join(examplePath, "project.json")).then(projectInfo => {
		deferred.resolve(projectInfo)
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

/**
 * 加载示例
 */
function loadExamples() {
	var deferred = Q.defer()

	var examples = []
	log.debug('loadExamples')

	util.readJson(path.join(util.getAppResourcePath(), "examples", "examples.json")).then(exampleGroups => {
		examples.push({
			name: "built-in",
			groups: exampleGroups
		})

		var packagesPath = getPackagesPath()
		util.searchFiles(`${packagesPath}/*/examples/examples.json`).then(pathList => {
			Q.all(pathList.map(p => {
				var d = Q.defer()
				util.readJson(p).then(groups => {
					examples.push({
						name: path.basename(path.dirname(path.dirname(p))),
						groups: groups,
					})
				})
				.fin(() => {
					d.resolve()
				})
				return d.promise
			}))
			.then(() => {
				deferred.resolve(examples)
			})
		}, err => {
			err && log.error(err)
			deferred.reject(err)
		})
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function getInstalledLibraries() {
	var deferred = Q.defer()

	var reg = /^([^=]+)=(.*)$/gm
	util.searchFiles(`${getLibrariesPath()}/**/library.properties`).then(pathList => {
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
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function loadLibraries() {
	var deferred = Q.defer()

	util.readJson(path.join(util.getAppResourcePath(), "libraries", "libraries.json")).then(result => {
		deferred.resolve(result.libraries)
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

/**
 * 解压单个资源包
 */
function unzipLibrary(name, libraryPath) {
	var deferred = Q.defer()

	var librariesPath = getLibrariesPath()
	var outputName = path.basename(libraryPath, path.extname(libraryPath))
	util.unzip(libraryPath, librariesPath, true).then(() => {
		util.moveFile(path.join(librariesPath, outputName), path.join(librariesPath, name)).then(() => {
			deferred.resolve()
		}, err => {
			err && log.error(err)
			deferred.reject(err)
		})
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	}, progress => {
		deferred.notify(progress)
	})

	return deferred.promise
}

function deleteLibrary(name) {
	var deferred = Q.defer()

	log.debug(`deleteLibrary: ${name}`)
	util.removeFile(path.join(getLibrariesPath(), name)).then(() => {
		deferred.resolve()
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function onDownload(e, item, webContent) {
	var url = item.getURL()
	var pos = url.lastIndexOf("#")
	var query = querystring.parse(url.substring(pos + 1))
	url = url.substring(0, pos)

	var deferId = query.deferId
	var savePath = path.join(util.getAppDataPath(), 'download', item.getFilename())
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
					totalSize: totalSize,
					size: item.getReceivedBytes(),
				})
			}
		}
	})

	item.once('done', (evt, state) => {
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
		err && log.error(err)
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
	var deferred = Q.defer()

	log.debug(`installDriver: ${driverPath}`)
	var dir = path.join(util.getAppDataPath(), "temp")
	util.unzip(driverPath, dir).then(() => {
		var exePath = path.join(dir, path.basename(driverPath, path.extname(driverPath)), "setup.exe")
		util.execFile(exePath).then(() => {
			deferred.resolve()
		})
	}, err => {
		err && log.error(err)
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
	return serialPort.openSerialPort(comName, options, {
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

	serialPort.listSerialPort().then(ports => {
		ports = filterArduinoPorts(ports)

		if(ports.length == 0) {
			deferred.reject()
			return
		}

		matchBoardNames(ports).then(() => {
			log.debug(ports.map(p => `${p.comName}, pid: ${p.productId}, vid: ${p.vendorId}, boardName: ${p.boardName || ""}`).join('\n'))
			deferred.resolve(ports)
		}, err => {
			err && log.error(err)
			deferred.reject(err)
		})
	}, err => {
		err && log.error(err)
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
		var scriptPath = getScriptPath("call")
		util.spawnCommand(`"${scriptPath}"`, [`"${commandPath}"`], {shell: true}).then(() => {
			deferred.resolve()
		}, err => {
			err && log.error(err)
			deferred.reject(err)
		}, progress => {
			deferred.notify(progress)
		})
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function preBuild(projectPath, options) {
	var deferred = Q.defer()

	log.debug('pre-build')

	var buildSpecs = []
	options = _.merge({}, arduinoOptions.default.build, options)

	var packagesPath = getPackagesPath()
	fs.existsSync(packagesPath) && buildSpecs.push(`-hardware=${packagesPath}`)

	buildSpecs.push(`-fqbn=${options.fqbn}`)
	var arduinoPath = getArduinoPath()
	Object.keys(options.prefs).forEach(key => {
		var value = util.handleQuotes(options.prefs[key])
		value = value.replace(/ARDUINO_PATH/g, arduinoPath)
		buildSpecs.push(`-prefs=${key}=${value}`)
	})

	var librariesPath = getLibrariesPath()
	fs.existsSync(librariesPath) && buildSpecs.push(`-libraries="${librariesPath}"`)

	arduinoOptions.librariesPath.forEach(libraryPath => {
		buildSpecs.push(`-libraries="${libraryPath}"`)
	})

	var projectBuildPath = path.join(projectPath, 'build')
	fs.ensureDirSync(projectBuildPath)
	util.removeFile(path.join(projectBuildPath, "sketch", "build"), true)
	var commandPath = getCommandPath("build")
	var command = util.handleQuotes(options.command)
	command = command.replace(/ARDUINO_PATH/g, getArduinoPath())
		.replace("BUILD_SPECS", buildSpecs.join(' '))
		.replace("PROJECT_BUILD_PATH", projectBuildPath)
		.replace("PROJECT_ARDUINO_FILE", path.join(projectPath, `${path.basename(projectPath)}.ino`))

	util.writeFile(commandPath, command).then(() => {
		var optionPath = path.join(projectPath, 'build', 'build.options.json')
		if(!fs.existsSync(optionPath)) {
			setTimeout(() => {
				deferred.resolve(commandPath)
			}, 10)
			return deferred.promise
		}

		util.readJson(optionPath).then(opt => {
			if(options.fqbn == opt.fqbn) {
				deferred.resolve(commandPath)
				return
			}

			util.removeFile(path.join(projectPath, 'build')).fin(() => {
				fs.ensureDirSync(path.join(projectPath, 'build'))
				deferred.resolve(commandPath)
			})
		}, err => {
			err && log.error(err)
			deferred.resolve(commandPath)
		})
	}, err => {
		err && log.error(err)
		deferred.reject()
	})

	return deferred.promise
}

/**
 * 上传
 * @param {*} projectPath 项目路径
 * @param {*} options 选项
 */
function upload(projectPath, options) {
	options = _.merge({}, arduinoOptions.default.upload, options)
	var targetPath = path.join(projectPath, 'build', `${path.basename(projectPath)}.ino.${options.target_type}`)

	return uploadFirmware(targetPath, options)
}

/**
 * 上传
 * @param {*} projectPath 项目路径
 * @param {*} comName 串口路径
 * @param {*} options 选项
 */
function upload2(projectPath, comName, options) {
	options = _.merge({}, arduinoOptions.default.upload, options)
	var targetPath = path.join(projectPath, 'build', `${path.basename(projectPath)}.ino.${options.target_type}`)

	return uploadFirmware2(targetPath, comName, options)
}

/**
 * 上传固件
 * @param {*} targetPath 固件路径
 * @param {*} options 选项
 */
function uploadFirmware(targetPath, options) {
	var deferred = Q.defer()

	listSerialPort().then(ports => {
		if(ports.length == 1) {
			uploadFirmware2(targetPath, ports[0].comName, options).then(result => {
				deferred.resolve(result)
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
	}, () => {
		deferred.reject({
			status: "NOT_FOUND_PORT"
		})
	})

	return deferred.promise
}

/**
 * 上传固件
 * @param {*} targetPath 固件路径
 * @param {*} comName 串口路径
 * @param {*} options 选项
 */
function uploadFirmware2(targetPath, comName, options) {
	var deferred = Q.defer()

	preUploadFirmware(targetPath, comName, options).then(commandPath => {
		log.debug(`upload firmware: ${targetPath}, ${comName}, command path: ${commandPath}`)
		var scriptPath = getScriptPath("call")
		util.spawnCommand(`"${scriptPath}"`, [`"${commandPath}"`], {shell: true}).then(() => {
			deferred.resolve()
		}, err => {
			err && log.error(err)
			deferred.reject(err)
		}, progress => {
			deferred.notify(progress)
		})
	}, err => {
		err && log.error(err)
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
function preUploadFirmware(targetPath, comName, options) {
	var deferred = Q.defer()

	log.debug("pre upload firmware")
	options = _.merge({}, arduinoOptions.default.upload, options)

	var commandPath = getCommandPath("upload")
	var command = util.handleQuotes(options.command)
	command = command.replace(/ARDUINO_PATH/g, getArduinoPath())
		.replace("ARDUINO_MCU", options.mcu)
		.replace("ARDUINO_BURNRATE", options.baudrate)
		.replace("ARDUINO_PROGRAMMER", options.programer)
		.replace("ARDUINO_COMPORT", comName)
		.replace("TARGET_PATH", targetPath)

	util.writeFile(commandPath, command).then(() => {
		serialPort.resetSerialPort(comName).then(() => {
			deferred.resolve(commandPath)
		}, err => {
			err && log.error(err)
			deferred.reject(err)
		})
	}, err => {
		err && log.error(err)
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
			writeConfig().then(() => {
				deferred.resolve(config.boardNames)
			}, err => {
				err && log.error(err)
				deferred.reject(err)
			})
		})
	}, err => {
		err && log.error(err)
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
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

/**
 * 获取脚本路径
 * @param {*} name
 * @param {*} type
 */
function getScriptPath(name) {
	var ext = is.windows() ? "bat" : "sh"
	return path.join(util.getAppResourcePath(), "scripts", `${name}.${ext}`)
}

/**
 * 获取command路径
 */
function getCommandPath(name) {
	return path.join(util.getAppDataPath(), "temp", `${name}.txt`)
}

/**
 * 获取arduino路径
 */
function getArduinoPath() {
	return path.join(util.getAppResourcePath(), `arduino-${util.getPlatform()}`)
}

/**
 * 获取解压后的packages路径
 */
function getPackagesPath() {
	return path.join(app.getPath("documents"), app.getName(), "packages")
}

/**
 * 获取解压后的libraries路径
 */
function getLibrariesPath() {
	return path.join(app.getPath("documents"), app.getName(), "libraries")
}

const os = require('os')
const child_process = require('child_process')
const path = require('path')
const crypto = require('crypto')

const {app, dialog, BrowserWindow} = require('electron')
const log = require('electron-log')
const is = require('electron-is')

const Q = require('q')
const fs = require('fs-extra')
const glob = require('glob')
const sudo = require('sudo-prompt')
const iconv = require('iconv-lite')
const path7za = require('7zip-bin').path7za.replace("app.asar", "app.asar.unpacked")
const fetch = require('node-fetch')

const PACKAGE = require('../package')

is.dev() && app.setName(PACKAGE.name)

const defers = {}
var deferAutoId = 0

/**
 * 判断当前系统是否为64位
 */
function isX64() {
	return process.arch === 'x64' || process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432')
}

/**
 * 获取平台名字
 */
function getPlatform() {
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

/**
 * 获取版本
 */
function getVersion() {
	return is.dev() ? PACKAGE.version : app.getVersion()
}

/**
 * 获取系统信息
 */
function getAppInfo() {
	var info = {
		bit: isX64() ? 64 : 32,
		arch: process.arch,
		platform: getPlatform(),
		version: getVersion(),
		name: app.getName(),
	}

	if(is.dev()) {
		info.ext = path.extname(app.getPath("exe")).replace('.', '')
		info.branch = "beta"
		info.feature = ""
	} else {
		info.ext = PACKAGE.buildInfo.ext
		info.branch = PACKAGE.buildInfo.branch
		info.feature = PACKAGE.buildInfo.feature
	}

	return info
}

/**
 * 获取appData目录
 */
function getAppDataPath() {
	return path.join(app.getPath("appData"), app.getName())
}

/**
 * 获取资源路径
 */
function getResourcePath() {
	return (!is.windows() && !is.dev()) ? path.resolve(app.getAppPath(), "..", "..") : path.resolve(".")
}

function versionCompare(versionA, versionB) {
	var reg = /(\d+)\.(\d+)\.(\d+)/
	var matchA = reg.exec(versionA)
	var matchB = reg.exec(versionB)

	var versionsA = [
		parseInt(matchA[1]),
		parseInt(matchA[2]),
		parseInt(matchA[3]),
	]
	var versionsB = [
		parseInt(matchB[1]),
		parseInt(matchB[2]),
		parseInt(matchB[3]),
	]

	for(var i = 0; i <= 2; i++) {
		if(versionsA[i] != versionsB[i]) {
			return versionsA[i] > versionsB[i] ? 1 : -1
		}
	}

	return 0
}

/**
 * 发送消息
 * @param {*} name 
 */
function postMessage(name, ...args) {
	log.debug(`postMessage: ${name}, ${args.join(", ")}`)
	var wins = BrowserWindow.getAllWindows()
	wins && wins.length && wins[0].webContents.send(name, args)
}

function getDefer() {
	var deferred = Q.defer()
	var deferId = deferAutoId++
	defers[deferId] = deferred

	return {
		deferId: deferId,
		promise: deferred.promise
	}
}

function callDefer(deferId, type, ...args) {
	var deferred = defers[deferId]
	if(!deferred) {
		return
	}

	var callback
	if(type == "notify") {
		callback = deferred.notify
	} else {
		delete defers[deferId]
		callback = type ? deferred.resolve : deferred.reject
	}
	callback.apply(this, args)
}

/**
 * 处理引号
 * @param {*} p 
 */
function handleQuotes(p) {
	return is.windows() ? p : p.replace(/"/g, "")
}

function encrypt(plainText, key, algorithm) {
	algorithm = algorithm || "aes-128-cbc"
	var cipher = crypto.createCipher(algorithm, key)
	var cryptedText = cipher.update(plainText, 'utf8', 'binary')
	cryptedText += cipher.final('binary')
	cryptedText = new Buffer(cryptedText, 'binary').toString('base64')

	return cryptedText
}

function decrypt(cryptedText, key, algorithm) {
	algorithm = algorithm || "aes-128-cbc"
	cryptedText = new Buffer(cryptedText, 'base64').toString('binary')
	var decipher = crypto.createDecipher(algorithm, key)
	var plainText = decipher.update(cryptedText, 'binary', 'utf8')
	plainText += decipher.final('utf8')

	return plainText
}

/**
 * 执行可执行文件
 * @param {*} driverPath 
 */
function execFile(exePath) {
	var deferred = Q.defer()

	log.debug(`execFile: ${exePath}`)
	var command
	if(is.windows()) {
		command = `start /WAIT ${exePath}`
	} else {
		command = `${exePath}`
	}
	execCommand(command, null, true).fin(_ => {
		deferred.resolve()
	})

	return deferred.promise
}

/**
 * 执行命令
 * @param {*} command 命令
 * @param {*} options 选项
 * @param {*} useSudo 用sudo执行
 */
function execCommand(command, options, useSudo) {
	var deferred = Q.defer()
	options = options || {}
	useSudo = useSudo || false

	log.debug(`execCommand:${command}, options: ${JSON.stringify(options)}, useSudo: ${useSudo}`)
	if(useSudo) {
		sudo.exec(command, {name: "kenrobot"}, (err, stdout, stderr) => {
			stdout = is.windows() ? iconv.decode(stdout || "", 'gbk') : stdout
			stderr = is.windows() ? iconv.decode(stderr || "", 'gbk') : stderr
			if(err) {
				log.error(err)
				stdout && log.error(stdout)
				stderr && log.error(stderr)
				deferred.reject(stderr || stdout || err)
				return
			}

			is.dev() && log.debug(stdout)
			deferred.resolve(stdout)
		})
	} else {
		child_process.exec(command, options, (err, stdout, stderr) => {
			stdout = is.windows() ? iconv.decode(stdout || "", 'gbk') : stdout
			stderr = is.windows() ? iconv.decode(stderr || "", 'gbk') : stderr
			if(err) {
				log.error(err)
				stdout && log.error(stdout)
				stderr && log.error(stderr)
				deferred.reject(stderr || stdout || err)
				return
			}

			is.dev() && log.debug(stdout)
			deferred.resolve(stdout)
		})
	}

	return deferred.promise
}

/**
 * 异步执行命令
 * @param {*} command 命令
 * @param {*} args 参数
 * @param {*} options 选项
 */
function spawnCommand(command, args, options) {
	var deferred = Q.defer()
	var child = child_process.spawn(command, args, options)
	child.stdout.on('data', data => {
		var str = is.windows() ? iconv.decode(data, 'gbk') : data.toString()
		is.dev() && log.debug(str)
		deferred.notify({
			type: "stdout",
			data: str,
		})
	})
	child.stderr.on('data', data => {
		var str = is.windows() ? iconv.decode(data, 'gbk') : data.toString()
		is.dev() && log.debug(str)
		deferred.notify({
			type: "stderr",
			data: str,
		})
	})
	child.on('close', code => {
		code == 0 ? deferred.resolve() : deferred.reject()
	})

	return deferred.promise
}

/**
 * 读取文件
 * @param {*} file 路径
 * @param {*} options 选项 
 */
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

/**
 * 写文件
 * @param {*} file 路径
 * @param {*} data 数据
 */
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

function moveFile(src, dst, options) {
	var deferred = Q.defer()
	options = options || {overwrite: true}

	log.debug(`moveFile:${src} -> ${dst}`)
	fs.move(src, dst, options, err => {
		if(err) {
			log.error(err)
			deferred.reject(err)
			return
		}

		deferred.resolve()
	})

	return deferred.promise
}

/**
 * 删除文件
 * @param {*} file 路径
 */
function removeFile(file, sync) {
	if(sync) {
		log.debug(`removeFile:${file}`)
		fs.removeSync(file)
	} else {
		var deferred = Q.defer()

		log.debug(`removeFile:${file}`)
		fs.remove(file, err => {
			if(err) {
				log.error(err)
				deferred.reject(err)
				return
			}

			deferred.resolve()
		})

		return deferred.promise
	}
}

/**
 * 读取json
 * @param {*} file 路径
 * @param {*} options 选项
 */
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

/**
 * 写json
 * @param {*} file 路径
 * @param {*} data 数据
 * @param {*} options 选项 
 */
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

/**
 * 搜索文件
 * @param {*} pattern 模式
 */
function searchFiles(pattern) {
	var deferred = Q.defer()

	log.debug(`searchFiles: ${pattern}`)
	glob(pattern, {}, (err, pathList) => {
		if(err) {
			log.error(err)
			deferred.reject(err)
			return
		}

		return deferred.resolve(pathList)
	})

	return deferred.promise
}

/**
 * 解压文件
 * @param {*} zipPath 压缩文件路径
 * @param {*} dist 解压缩目录
 * @param {*} spawn 是否用spawn, 默认为false
 */
function unzip(zipPath, dist, spawn) {
	var deferred = Q.defer()
	var reg = /([\d]+)% \d+ - .*\r?/g

	log.debug(`unzip: ${zipPath} => ${dist}`)
	if(spawn) {
		spawnCommand(`"${path7za}"`, ["x", `"${zipPath}"`, "-bsp1", "-y", `-o"${dist}"`], {shell: true}).then(result => {
			deferred.resolve(result)
		}, err => {
			err && log.error(err)
			deferred.reject(err)
		}, progess => {
			reg.lastIndex = 0
			if(!reg.test(progess.data)) {
				return
			}

			var match
			var temp = reg.exec(progess.data)
			do {
				match = temp
				temp = reg.exec(progess.data)
			} while(temp)
			
			deferred.notify(parseInt(match[1]))
		})
	} else {
		execCommand(`"${path7za}" x "${zipPath}" -y -o"${dist}"`).then(_ => {
			deferred.resolve()
		}, err => {
			err && log.error(err)
			deferred.reject(err)
		})
	}

	return deferred.promise
}

/**
 * 显示打开文件对话框
 * @param {*} win 父窗口
 * @param {*} options 选项
 */
function showOpenDialog(win, options) {
	var deferred = Q.defer()
	options = options || {}
	options.title = "打开"
	options.defaultPath = app.getPath("documents")
	options.buttonLabel = "打开"

	log.debug(`showOpenDialog: options: ${JSON.stringify(options)}`)
	dialog.showOpenDialog(win, options, files => {
		if(!files) {
			deferred.reject()
			return
		}

		deferred.resolve(files[0])
	})

	return deferred.promise
}

/**
 * 显示保存文件对话框
 * @param {*} win 父窗口
 * @param {*} options 选项
 */
function showSaveDialog(win, options) {
	var deferred = Q.defer()
	options = options || {}
	options.title = "保存"
	options.defaultPath = app.getPath("documents")
	options.buttonLabel = "保存"

	log.debug(`showSaveDialog: options: ${JSON.stringify(options)}`)
	dialog.showSaveDialog(win, options, file => {
		if(!file) {
			deferred.reject()
			return
		}

		deferred.resolve(file)
	})

	return deferred.promise
}

function request(url, options, json) {
	var deferred = Q.defer()

	options = options || {}
	json = json !== false
	options.method = options.method || "GET"
	if(json && options.data) {
		options.body = JSON.stringify(options.data)
		var headers = options.headers || (options.headers = {})
		headers['Content-Type'] = 'application/json'
		headers['Accept'] = 'application/json'
		delete options.data
	}

	log.debug(`request: ${url}, options: ${JSON.stringify(options)}`)
	fetch(url, options).then(res => {
		if(res.status >= 200 && res.status < 300) {
			return json ? res.json() : res.text()
		} else {
			var error = new Error(res.statusText)
			error.status = res.status
			throw error
		}
	}).then(result => {
		deferred.resolve(result)
	}).catch(err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

module.exports.isX64 = isX64
module.exports.getPlatform = getPlatform
module.exports.getVersion = getVersion
module.exports.getAppInfo = getAppInfo
module.exports.getAppDataPath = getAppDataPath
module.exports.getResourcePath = getResourcePath
module.exports.versionCompare = versionCompare
module.exports.postMessage = postMessage
module.exports.getDefer = getDefer
module.exports.callDefer = callDefer
module.exports.handleQuotes = handleQuotes
module.exports.encrypt = encrypt
module.exports.decrypt = decrypt

module.exports.execFile = execFile
module.exports.execCommand = execCommand
module.exports.spawnCommand = spawnCommand

module.exports.readFile = readFile
module.exports.writeFile = writeFile
module.exports.moveFile = moveFile
module.exports.removeFile = removeFile
module.exports.readJson = readJson
module.exports.writeJson = writeJson

module.exports.searchFiles = searchFiles
module.exports.unzip = unzip

module.exports.showOpenDialog = showOpenDialog
module.exports.showSaveDialog = showSaveDialog

module.exports.request = request

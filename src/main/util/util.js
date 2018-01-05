const os = require('os')
const child_process = require('child_process')
const path = require('path')
const crypto = require('crypto')

const {app, ipcMain, dialog, BrowserWindow} = require('electron')
const log = require('electron-log')
const is = require('electron-is')

const Q = require('q')
const fs = require('fs-extra')
const glob = require('glob')
const sudo = require('sudo-prompt')
const iconv = require('iconv-lite')
const _ = require('lodash')
const path7za = require('7zip-bin').path7za.replace("app.asar", "app.asar.unpacked")
const fetch = require('node-fetch')

const PACKAGE = require(is.dev() ? path.resolve('app', 'package.json') : path.resolve(__dirname, '..', '..', 'app.asar', 'package.json'))

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC7Jat1/19NDxOObrFpW8USTia6
uHt34Sac1Arm6F2QUzsdUEUmvGyLIOIGcdb+F6pTdx4ftY+wZi7Aomp4k3vNqXmX
T0mE0vpQlCmsPUcMHXuUi93XTGPxLXIv9NXxCJZXSYI0JeyuhT9/ithrYlbMlyNc
wKB/BwSpp+Py2MTT2wIDAQAB
-----END PUBLIC KEY-----
`

is.dev() && app.setName(PACKAGE.productName)

const defers = {}
var deferAutoId = 0

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
	var isX64 = process.arch === 'x64' || process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432')

	var info = {
		bit: isX64 ? 64 : 32,
		arch: process.arch,
		platform: getPlatform(),
		version: getVersion(),
		name: app.getName(),
		buildNumber: PACKAGE.buildNumber,
		dev: is.dev(),
	}

	if(is.dev()) {
		info.ext = path.extname(getAppPath("exe")).replace('.', '')
		info.branch = "beta"
		info.feature = ""
		info.date = stamp()
		info.appBit = info.bit
	} else {
		info.ext = PACKAGE.buildInfo.ext
		info.branch = PACKAGE.buildInfo.branch
		info.feature = PACKAGE.buildInfo.feature
		info.date = PACKAGE.buildInfo.date
		info.appBit = PACKAGE.buildInfo.appBit
	}

	return info
}

function getAppPath(name, extra) {
	switch(name) {
		case "appData":
			return path.join(app.getPath("appData"), app.getName())
		case "appResource":
			return is.dev() ? path.resolve(".") : path.resolve(app.getAppPath(), "..", "..")
		case "appDocuments":
			return path.join(app.getPath("documents"), app.getName())
		case "script":
			return path.join(getAppPath("appResource"), "scripts", `${extra}.${is.windows() ? "bat" : "sh"}`)
		case "command":
			return path.join(getAppPath("appData"), "temp", `${uuid(6)}`)
		case "libraries":
			return path.join(getAppPath("appDocuments"), "libraries")
		case "packages":
			return path.join(getAppPath("appDocuments"), "packages")
		case "arduino":
			return path.join(getAppPath("appResource"), `arduino-${getPlatform()}`)
		default:
			return app.getPath(name)
	}
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

function listenMessage(name, callback) {
	var eventName = `app:${name}`
	ipcMain.on(eventName, (e, deferId, ...args) => {
		var promise = callback.apply(this, args) || resolvePromise()
		promise.then(result => {
			e.sender.send(eventName, deferId, true, result)
		}, err => {
			e.sender.send(eventName, deferId, false, err)
		}, progress => {
			e.sender.send(eventName, deferId, "notify", progress)
		})
	})
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

function uuid(len, radix) {
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
	var result = [], i
	radix = radix || chars.length

	if (len) {
		// Compact form
		for (i = 0; i < len; i++) result[i] = chars[0 | Math.random()*radix]
	} else {
		// rfc4122, version 4 form
		var r

		// rfc4122 requires these characters
		result[8] = result[13] = result[18] = result[23] = '-'
		result[14] = '4'

		// Fill in random data.  At i==19 set the high bits of clock sequence as
		// per rfc4122, sec. 4.1.5
		for (i = 0; i < 36; i++) {
			if (!result[i]) {
				r = 0 | Math.random()*16
				result[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
			}
		}
	}

	return result.join('')
}

function stamp() {
	return parseInt(Date.now() / 1000)
}

function throttle(fn, delay) {
	var timerId
	return () => {
		timerId && clearTimeout(timerId)
		timerId = setTimeout(() => {
			fn()
			clearTimeout(timerId)
			timerId = null;
		}, delay)
	}
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

function rsa_encrypt(plain, key) {
	key = key || PUBLIC_KEY
    var buffer = new Buffer(plain)
    var encrypted = crypto.publicEncrypt({key: key, padding: crypto.constants.RSA_PKCS1_PADDING}, buffer)
    return encrypted.toString("base64")
}

function rsa_decrypt(encrypted, key) {
    var buffer = new Buffer(encrypted, "base64")
    var decrypted = crypto.privateDecrypt({key: key, padding: crypto.constants.RSA_PKCS1_PADDING}, buffer)
    return decrypted.toString("utf8")
}

function resolvePromise(result, deferred) {
	deferred = deferred || Q.defer()

	setTimeout(() => deferred.resolve(result), 10)

	return deferred.promise
}

function rejectPromise(result, deferred) {
	deferred = deferred || Q.defer()

	setTimeout(() => deferred.reject(result), 10)

	return deferred.promise
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
	execCommand(command, null, true).fin(() => {
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
			stdout = stdout || ""
			stderr = stderr || ""
			stdout = is.windows() ? iconv.decode(Buffer.from(stdout), 'win1252') : stdout
			stderr = is.windows() ? iconv.decode(Buffer.from(stderr), 'win1252') : stderr
			if(err) {
				log.error(err)
				stdout && log.error(stdout)
				stderr && log.error(stderr)
				deferred.reject(stderr || stdout || err)
				return
			}

			is.dev() && stdout && log.debug(stdout)
			deferred.resolve(stdout)
		})
	} else {
		child_process.exec(command, options, (err, stdout, stderr) => {
			stdout = stdout || ""
			stderr = stderr || ""
			stdout = is.windows() ? iconv.decode(Buffer.from(stdout), 'win1252') : stdout
			stderr = is.windows() ? iconv.decode(Buffer.from(stderr), 'win1252') : stderr
			if(err) {
				log.error(err)
				stdout && log.error(stdout)
				stderr && log.error(stderr)
				deferred.reject(stderr || stdout || err)
				return
			}

			is.dev() && stdout && log.debug(stdout)
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
	var stdout = ''
	var stderr = ''
	child.stdout.on('data', data => {
		var str = is.windows() ? iconv.decode(data, 'win1252') : data.toString()
		is.dev() && str && log.debug(str)
		stdout += str
		deferred.notify({
			type: "stdout",
			data: str,
		})
	})
	child.stderr.on('data', data => {
		var str = is.windows() ? iconv.decode(data, 'win1252') : data.toString()
		is.dev() && str && log.debug(str)
		stderr += str
		deferred.notify({
			type: "stderr",
			data: str,
		})
	})
	child.on('close', code => {
		code == 0 ? deferred.resolve(stdout) : deferred.reject(stderr)
	})

	return deferred.promise
}

/**
 * 读取文件
 * @param {*} filePath 路径
 * @param {*} options 选项
 */
function readFile(filePath, options, sync) {
	if(sync) {
		return fs.readFileSync(filePath, options)
	} else {
		var deferred = Q.defer()
		options = options || "utf8"

		fs.readFile(filePath, options, (err, data) => {
			if(err) {
				log.error(err)
				deferred.reject(err)
				return
			}

			deferred.resolve(data)
		})

		return deferred.promise
	}
}

/**
 * 写文件
 * @param {*} filePath 路径
 * @param {*} data 数据
 */
function writeFile(filePath, data, options, sync) {
	if(sync) {
		fs.outputFileSync(filePath, data, options)
	} else {
		var deferred = Q.defer()

		fs.outputFile(filePath, data, options, err => {
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
 * 保存文件
 * @param {*} filePath 路径
 * @param {*} data 数据
 */
function saveFile(filePath, data, options) {
	var deferred = Q.defer()

	options = options || {}
	filePath && (options.defaultPath = filePath)

	showSaveDialog(options).then(savePath => {
		writeFile(savePath, data, options).then(() => {
			deferred.resolve()
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

function moveFile(src, dst, options) {
	var deferred = Q.defer()
	options = options || {overwrite: true}

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
 * @param {*} filePath 路径
 */
function removeFile(filePath, sync) {
	if(sync) {
		fs.removeSync(filePath)
	} else {
		var deferred = Q.defer()

		fs.remove(filePath, err => {
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
 * @param {*} filePath 路径
 * @param {*} options 选项
 */
function readJson(filePath, options) {
	var deferred = Q.defer()
	options = options || {}

	fs.readJson(filePath, options, (err, data) => {
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
 * @param {*} filePath 路径
 * @param {*} data 数据
 * @param {*} options 选项
 */
function writeJson(filePath, data, options, sync) {
	if(sync) {
		fs.outputJsonSync(filePath, data, options)
	} else {
		var deferred = Q.defer()
		options = options || {}

		fs.outputJson(filePath, data, options, err => {
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
 * @param {*} filePath 压缩文件路径
 * @param {*} dist 解压缩目录
 * @param {*} spawn 是否用spawn, 默认为false
 */
function uncompress(filePath, dist, spawn) {
	var deferred = Q.defer()
	var reg = /([\d]+)% \d+ - .*\r?/g

	log.debug(`uncompress: ${filePath} => ${dist}`)

	if(spawn) {
		spawnCommand(`"${path7za}"`, ["x", `"${filePath}"`, "-bsp1", "-y", `-o"${dist}"`], {shell: true}).then(result => {
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
		execCommand(`"${path7za}" x "${filePath}" -y -o"${dist}"`).then(() => {
			deferred.resolve()
		}, err => {
			err && log.error(err)
			deferred.reject(err)
		})
	}

	return deferred.promise
}

function compress(dir, files, dist, type) {
	var deferred = Q.defer()

	files = files  ? files : [files]
	type = type || "7z"
	log.debug(`compress: ${dir}: ${files.length} => ${dist}: ${type}`)

	execCommand(`cd ${is.windows() ? "/d " : ""}${dir} && "${path7za}" a -t${type} -r ${dist} ${files.join(' ')}`).then(() => {
		deferred.resolve()
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

/**
 * 显示打开文件对话框
 * @param {*} options 选项
 */
function showOpenDialog(options, win) {
	var deferred = Q.defer()

	options = options || {}
	options.title = "打开"
	options.defaultPath = options.defaultPath || getAppPath("documents")
	options.buttonLabel = "打开"

	win = win || BrowserWindow.getAllWindows()[0]

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
function showSaveDialog(options, win) {
	var deferred = Q.defer()

	options = options || {}
	options.title = "保存"
	options.defaultPath = (options.defaultPath && path.isAbsolute(options.defaultPath)) ? options.defaultPath : path.join(getAppPath("documents"), options.defaultPath || "untitled")
	options.buttonLabel = "保存"

	win = win || BrowserWindow.getAllWindows()[0]

	dialog.showSaveDialog(win, options, savePath => {
		if(!savePath) {
			deferred.reject()
			return
		}

		deferred.resolve(savePath)
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

	fetch(url, options).then(res => {
		if(res.ok) {
			return json ? res.json() : res
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

module.exports.getPlatform = getPlatform
module.exports.getVersion = getVersion
module.exports.getAppInfo = getAppInfo
module.exports.getAppPath = getAppPath

module.exports.versionCompare = versionCompare
module.exports.postMessage = postMessage
module.exports.listenMessage = listenMessage

module.exports.getDefer = getDefer
module.exports.callDefer = callDefer
module.exports.handleQuotes = handleQuotes
module.exports.uuid = uuid
module.exports.stamp = stamp
module.exports.throttle = throttle

module.exports.encrypt = encrypt
module.exports.decrypt = decrypt
module.exports.rsa_encrypt = rsa_encrypt
module.exports.rsa_decrypt = rsa_decrypt

module.exports.resolvePromise = resolvePromise
module.exports.rejectPromise = rejectPromise

module.exports.execFile = execFile
module.exports.execCommand = execCommand
module.exports.spawnCommand = spawnCommand

module.exports.readFile = readFile
module.exports.writeFile = writeFile
module.exports.saveFile = saveFile
module.exports.moveFile = moveFile
module.exports.removeFile = removeFile
module.exports.readJson = readJson
module.exports.writeJson = writeJson

module.exports.searchFiles = searchFiles
module.exports.compress = compress
module.exports.uncompress = uncompress

module.exports.showOpenDialog = showOpenDialog
module.exports.showSaveDialog = showSaveDialog

module.exports.request = request

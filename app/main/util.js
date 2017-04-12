const os = require('os')
const child_process = require('child_process')
const path = require('path')

const {app, dialog, net, BrowserWindow} = require('electron')
const log = require('electron-log')
const is = require('electron-is')

const Q = require('q')
const fs = require('fs-extra')
const glob = require('glob')
const sudo = require('sudo-prompt')
const iconv = require('iconv-lite')
const BufferHelper = require('bufferhelper')
const path7za = require('7zip-bin').path7za.replace("app.asar", "app.asar.unpacked")

const PACKAGE = require('../package')

is.dev() && app.setName(PACKAGE.name)

/**
 * 判断当前系统是否为64位
 */
function isX64() {
	return process.arch === 'x64' || process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432');
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
	return path.join(app.getPath("appData"), app.getName());
}

/**
 * 获取资源路径
 */
function getResourcePath() {
	return (!is.windows() && !is.dev()) ? path.join(app.getAppPath(), "..", "..") : "."
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

/**
 * 处理引号
 * @param {*} p 
 */
function handleQuotes(p) {
	return is.windows() ? p : p.replace(/"/g, "")
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
	var stdoutBuffer = new BufferHelper()
	var stderrBuffer = new BufferHelper()
	child.stdout.on('data', data => {
		stdoutBuffer.concat(data)
		var str = is.windows() ? iconv.decode(data, 'gbk') : data.toString()
		is.dev() && log.debug(str)
		deferred.notify({
			type: "stdout",
			data: str,
		})
	})
	child.stderr.on('data', data => {
		stderrBuffer.concat(data)
		var str = is.windows() ? iconv.decode(data, 'gbk') : data.toString()
		is.dev() && log.debug(str)
		deferred.notify({
			type: "stderr",
			data: str,
		})
	})
	child.on('close', code => {
		var buffer = code == 0 ? stdoutBuffer : stderrBuffer
		var output = is.windows() ? iconv.decode(buffer.toBuffer(), 'gbk') : buffer.toString()
		code == 0 ? deferred.resolve(output) : deferred.reject(output)
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

/**
 * 删除文件
 * @param {*} file 路径
 */
function removeFile(file) {
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
	var reg = /([\d]+%) \d+ - .*\r?/g

	log.debug(`unzip: ${zipPath} => ${dist}`)
	if(spawn) {
		spawnCommand(`"${path7za}"`, ["x", `"${zipPath}"`, "-bsp1", "-y", `-o"${dist}"`], {shell: true}).then(result => {
			deferred.resolve(result)
		}, err => {
			log.error(err)
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
			
			deferred.notify(match[1])
		})
	} else {
		execCommand(`"${path7za}" x "${zipPath}" -y -o"${dist}"`).then(_ => {
			deferred.resolve()
		}, err => {
			log.error(err)
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

function request(options) {
	log.debug(`request: [${options.method}] ${options.url}`)
	var deferred = Q.defer()

	var request = net.request(options)

	if(options.header) {
		for(var key in options.header) {
			request.setHeader(key, options.header[key])
		}
	}

	request.on('response', response => {
		var buffer = new BufferHelper()
		response.on('data', chunk => {
			buffer.concat(chunk)
		}).on('end', _ => {
			var data = buffer.toString()
			if(options.json) {
				try{
					data = JSON.parse(data)
				} catch (ex) {
					log.error(ex)
					deferred.reject(ex)
					return
				}
			}
			deferred.resolve(data)
		})
	}).on('abort', _ => {
		log.error('abort')
		deferred.reject()
	}).on('error', err => {
		log.error(err)
		deferred.reject(err)
	}).end()

	return deferred.promise
}

module.exports.isX64 = isX64
module.exports.getPlatform = getPlatform
module.exports.getVersion = getVersion
module.exports.getAppInfo = getAppInfo
module.exports.getAppDataPath = getAppDataPath
module.exports.getResourcePath = getResourcePath
module.exports.postMessage = postMessage
module.exports.handleQuotes = handleQuotes

module.exports.execFile = execFile
module.exports.execCommand = execCommand
module.exports.spawnCommand = spawnCommand

module.exports.readFile = readFile
module.exports.writeFile = writeFile
module.exports.removeFile = removeFile
module.exports.readJson = readJson
module.exports.writeJson = writeJson

module.exports.searchFiles = searchFiles
module.exports.unzip = unzip

module.exports.showOpenDialog = showOpenDialog
module.exports.showSaveDialog = showSaveDialog

module.exports.request = request

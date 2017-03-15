const os = require('os')
const child_process = require('child_process')

const {app, dialog} = require('electron')
const log = require('electron-log')
const is = require('electron-is')

const Q = require('q')
const fs = require('fs-extra')
const glob = require('glob')
const sudo = require('sudo-prompt')
const iconv = require('iconv-lite')
const BufferHelper = require('bufferhelper')
const path7za = require('7zip-bin').path7za.replace("app.asar", "app.asar.unpacked")

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
			stdout = is.windows() ? iconv.decode(stdout, 'gbk') : stdout
			stderr = is.windows() ? iconv.decode(stderr, 'gbk') : stderr
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
			stdout = is.windows() ? iconv.decode(stdout, 'gbk') : stdout
			stderr = is.windows() ? iconv.decode(stderr, 'gbk') : stderr
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
 */
function unzip(zipPath, dist) {
	var deferred = Q.defer()

	log.debug(`unzip: ${zipPath} => ${dist}`)
	var command = `"${path7za}" x "${zipPath}" -y -o"${dist}"`
	execCommand(command).then(_ => {
		deferred.resolve()
	}, err => {
		log.error(err)
		deferred.reject(err)
	})

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

module.exports.isX64 = isX64
module.exports.getPlatform = getPlatform

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
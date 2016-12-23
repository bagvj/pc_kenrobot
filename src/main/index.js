const {app, BrowserWindow, ipcMain, net, dialog, shell, Menu} = require('electron')

const child_process = require('child_process')
const path = require('path')

const Q = require('q')
const fs = require('fs-extra')
const is = require('electron-is')
const debug = require('electron-debug')
const log = require('electron-log')
const encoding = require('encoding')

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
	log.transports.file.file = logPath
	log.transports.file.streamConfig = { flags: 'a' }

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

	mainWindow.loadURL(`file://${__dirname}/index.html`)
	mainWindow.focus()

	mainWindow.on('closed', _ => {
		mainWindow = null
	})
}

function listenEvent() {
	app.on('ready', _ => {
		log.debug('app ready')

		is.dev() && debug({showDevTools: true})

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
		e.sender.send('app:reload', deferId, true, true)
	}).on('app:max', (e, deferId) => {
		mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
		e.sender.send('app:reload', deferId, true, true)
	}).on('app:quit', (e, deferId) => {
		app.quit()
	}).on('app:openUrl', (e, deferId, url) => {
		var success = url && shell.openExternal.bind(shell, url)
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
	}).on('app:saveProject', (e, deferId, file, code, isTemp) => {
		saveProject(file, code, isTemp).then(file => {
			e.sender.send('app:saveProject', deferId, true, file)
		}, err => {
			e.sender.send('app:saveProject', deferId, false, err)
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
		}, err => {
			e.sender.send('app:uploadHex', deferId, false, err)
		})
	}).on('app:uploadHex2', (e, deferId, hex, com, options) => {
		uploadHex(hex, com, options).then(_ => {
			e.sender.send('app:uploadHex2', deferId, true, true)
		}, err => {
			e.sender.send('app:uploadHex2', deferId, false, err)
		})
	}).on('app:errorReport', (e, deferId, type, content) => {
		if(type == "debug") {
			var messages = JSON.parse(content)
			log.debug(`------ debug message ------\n${messages.join('\n')}`)
		} else {
			var errors = JSON.parse(content)
			var str = errors.reduce((result, error) => {
				result += `\n${error.message}(${error.src} at line ${error.line}:${error.col})\n${error.stack}`
				return result
			}, '')
			log.error(`------ error message ------${str}`)
		}
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
		execCommand("ls /dev/ttyS*").then(stdout => {
			var comReg = /(\/dev\/ttyS[^\s]+)/g
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

function saveProject(oldFile, code, isTemp) {
	var deferred = Q.defer()

	log.debug(`saveProject: isTemp:${isTemp}`)
	if(oldFile) {
		writeFile(path.join(oldFile, path.basename(oldFile) + ".ino"), code).then(_ => {
			deferred.resolve(oldFile)
		}, err => {
			deferred.reject(err)
		})
	} else if(isTemp) {
		var file = path.join(app.getPath("temp"), "build", "sketch" + new Date().getTime())
		writeFile(path.join(file, path.basename(file) + ".ino"), code).then(_ => {
			deferred.resolve(file)
		}, err => {
			deferred.reject(err)
		})
	} else {
		showSaveDialog().then(file => {
			writeFile(path.join(file, path.basename(file) + ".ino"), code).then(_ => {
				deferred.resolve(file)
			}, err => {
				deferred.reject(err)
			})
		}, _ => {
			deferred.reject()
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
	var command = `${scriptPath} ${hex} ${com}`

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
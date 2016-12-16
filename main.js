const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain
const net = electron.net
const dialog = electron.dialog
const shell = electron.shell
const fs = require('fs-extra')
const child_process = require('child_process')
const path = require('path')

let mainWindow

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 800
	})

	mainWindow.loadURL(`file://${__dirname}/index.html`)
	mainWindow.webContents.openDevTools()

	mainWindow.on('closed', _ => {
		mainWindow = null
	})
}

app.on('ready', createWindow)
app.on('window-all-closed', _ => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', _ => {
	if (mainWindow === null) {
		createWindow()
	}
})

ipcMain.on('app:reload', (e, deferId) => {
	mainWindow.reload()
	e.sender.send('app:reload', deferId, true, true)
})

ipcMain.on('app:openUrl', (e, deferId, url) => {
	var success = url && shell.openExternal(url)
	e.sender.send('app:openUrl', deferId, success, success)
})

ipcMain.on('app:readFile', (e, deferId, file, options) => {
	fs.readFile(file, options || "utf8", (err, data) => {
		if(err) {
			console.error(err)
			e.sender.send('app:readFile', deferId, false, err)
			return
		}
		
		e.sender.send('app:readFile', deferId, true, data)
	})
})

ipcMain.on('app:writeFile', (e, deferId, file, data, options) => {
	fs.outputFile(file, data, options, err => {
		if(err) {
			console.error(err)
			e.sender.send('app:writeFile', deferId, false, err)
			return
		}

		e.sender.send('app:writeFile', deferId, true)
	})
})

ipcMain.on('app:removeFile', (e, deferId, file) => {
	fs.remove(file, err => {
		if(err) {
			console.error(err);
			e.sender.send('app:removeFile', deferId, false, err)
			return
		}

		e.sender.send('app:removeFile', deferId, true)
	})
})

ipcMain.on('app:showOpenDialog', (e, deferId, options) => {
	options.getPath && (options.defaultPath = app.getPath(options.getPath))
	dialog.showOpenDialog(mainWindow, options, files => {
		e.sender.send('app:showOpenDialog', deferId, true, files)
	})
})

ipcMain.on('app:showSaveDialog', (e, deferId, options) => {
	options.getPath && (options.defaultPath = app.getPath(options.getPath))
	dialog.showSaveDialog(mainWindow, options, file => {
		e.sender.send('app:showSaveDialog', deferId, true, file)
	})
})

ipcMain.on('app:execCommand', (e, deferId, command, options) => {
	child_process.exec(command, options, (err, stdout, stderr) => {
		if(err) {
			console.error(err)
			e.sender.send('app:execCommand', deferId, false, err)
			return
		}

		e.sender.send('app:execCommand', deferId, true, stdout)
	})
})

ipcMain.on('app:netRequest', (e, deferId, options) => {
	const request = net.request(options)
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
					var chunk
					for(var i = 0, pos = 0, len = chunks.length; i < len; i++) {
						chunk = chunks[i]
						chunk.copy(data, pos)
						pos += chunk.length
					}
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
		console.error(err)
		e.sender.send('app:netRequest', deferId, false, 'abort')
	}).on('error', err => {
		console.error(err)
		e.sender.send('app:netRequest', deferId, false, err)
	}).end()
})

ipcMain.on('app:saveProject', (e, deferId, code) => {
	dialog.showSaveDialog(mainWindow, {
		title: "保存",
		defaultPath: app.getPath("documents"),
		buttonLabel: "保存"
	}, file => {
		if(!file) {
			e.sender.send('app:saveProject', deferId, false)
			return
		}
		
		var name = path.basename(file)
		fs.outputFile(path.join(file, name + ".ino"), code, err => {
			if(err) {
				console.error(err);
				e.sender.send('app:saveProject', deferId, false, err)
				return
			}

			e.sender.send('app:saveProject', deferId, true)
		})
	})
})
const {BrowserWindow} = require('electron')

const {autoUpdater} = require('electron-auto-updater')
const is = require('electron-is')
const os = require('os')
const log = require('electron-log')

function init() {
	// if(is.dev()) {
	// 	return
	// }

	const platform = os.platform()
	if(platform == "linux" || platform == "darwin") {
		return
	}

	autoUpdater.signals.updateDownloaded(result => {
		notify("发现新版本", `已成功下载版本${result.version}，退出时将自动安装新版本`)
	})
	autoUpdater.checkForUpdates()
}

function notify(title, message) {
	var windows = BrowserWindow.getAllWindows()
	if(windows.length == 0) {
		return
	}

	windows[0].webContents.send('notify', title, message)
}

module.exports.init = init
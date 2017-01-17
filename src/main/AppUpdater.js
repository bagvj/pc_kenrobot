const {BrowserWindow} = require('electron')

const {autoUpdater} = require('electron-auto-updater')
const is = require('electron-is')
const os = require('os')
const log = require('electron-log')

function init() {
	log.debug("AppUpdater init")
	// if(is.dev()) {
	// 	return
	// }
	const platform = os.platform()
	if(platform == "linux" || platform == "darwin") {
		return
	}

	autoUpdater.on('error', (err, message) => {
		log.debug(`auto update error: ${message}, ${JSON.stringify(err)}`)
	})
	.on('checking-for-update', e => {
		log.debug('checking-for-update')
	})
	.on('update-available', e => {
		log.debug('update-available')
	})
	.on('download-progress', e => {
		log.debug('download-progress')
	})
	.on('update-downloaded', e => {
		log.debug('update-downloaded')
	})
	autoUpdater.signals.updateDownloaded(result => {
		notify("发现新版本", `已成功下载版本${result.version}，退出时将自动安装新版本`)
	})
	log.debug("app updater checkForUpdates")
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
const path = require('path')
const fs = require('fs-extra')
const Q = require('q')
const hasha = require('hasha')
const log = require('electron-log')

const util = require('./util')
const Token = require('./token')

const PROJECT_EXT = ".krb"
const PROJECT_TYPE = "krobot"

const months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"]

var suffix = 96
var syncUrl
var throttleSync = util.throttle(sync, 3000)

function check(projectPath) {
	if(path.extname(projectPath) != PROJECT_EXT || !fs.existsSync(projectPath)) {
		return null
	}

	return projectPath
}

function read(filePath) {
	var deferred = Q.defer()

	var projectPath
	if(check(filePath)) {
		projectPath = filePath
	} else {
		var projectName = path.basename(filePath)
		projectPath = path.join(filePath, projectName + PROJECT_EXT)
		if(!fs.existsSync(projectPath)) {
			projectPath = path.join(filePath, "project.json")
		}
	}

	util.readJson(projectPath).then(projectInfo => {
		deferred.resolve({
			path: projectPath,
			data: projectInfo
		})
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function open(name) {
	var deferred = Q.defer()

	var doOpen = projectPath => {
		read(projectPath).then(result => {
			deferred.resolve(result)
		}, err => {
			err && log.error(err)
			deferred.reject(err)
		})
	}

	var token = Token.get()
	if(name) {
		if(!token) {
			return util.rejectPromise(null, deferred)
		}

		doOpen(path.join(getProjectsDir(), name))

		return deferred.promise
	} else {
		var options = {}
		options.defaultPath = token ? getProjectsDir() : util.getAppPath("documents")
		options.properties = ["openDirectory"]

		util.showOpenDialog(options).then(openPath => {
			doOpen(openPath)
		}, err => {
			err && log.error(err)
			deferred.reject(err)
		})

		return deferred.promise
	}
}

function save(projectName, projectInfo, savePath) {
	var deferred = Q.defer()

	var token = Token.get()
	if(!token) {
		var prefix = path.join(util.getAppDocumentPath(), "projects")
		if(savePath && savePath.startsWith(prefix)) {
			savePath = null
		}
		return saveAs(projectName, projectInfo, false, savePath)
	}

	savePath = path.join(getProjectsDir(), projectName)
	doSave(savePath, projectName, projectInfo, "cloud").then(() => {
		updateLocalItem(projectName).then(() => {
			throttleSync()
			deferred.resolve({
				project_name: projectInfo.project_name,
				project_type: projectInfo.project_type,
				updated_at: projectInfo.updated_at,
				path: savePath,
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

function saveAs(projectName, projectInfo, isTemp, savePath) {
	var deferred = Q.defer()

	var _doSave = (_savePath, _name) => {
		doSave(_savePath, _name, projectInfo).then(() => {
			deferred.resolve({
				project_name: projectInfo.project_name,
				project_type: projectInfo.project_type,
				updated_at: projectInfo.updated_at,
				path: _savePath,
			})
		}, err => {
			err && log.error(err)
			deferred.reject(err)
		})
	}

	if(isTemp) {
		savePath = path.join(util.getAppPath("temp"), "build", `sketch_${util.stamp()}`)
		_doSave(savePath, path.basename(savePath))
	} else if(savePath) {
		_doSave(path.join(path.dirname(savePath), projectName), projectName)
	} else {
		util.showSaveDialog({defaultPath: getDefaultName()}).then(savePath => {
			_doSave(savePath, path.basename(savePath))
		}, err => {
			err && log.error(err)
			deferred.reject(err)
		})
	}

	return deferred.promise
}

function setSyncUrl(url) {
	log.debug(`project setSyncUrl: ${url}`)
	syncUrl = url
}

function sync() {
	var deferred = Q.defer()

	log.debug(`project sync`)

	Q.all([
		list(),
		loadLocalList()
	]).then(result => {
		var [remoteList, localList] = result
		doSync(remoteList, localList).then(() => {
			log.debug(`project sync success`)
			deferred.resolve()
		}, err => {
			log.debug(`project sync fail`)
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

function list() {
	var deferred = Q.defer()

	log.debug(`project list`)
	var token = Token.get()
	if(!token || !syncUrl) {
		return util.rejectPromise(null, deferred)
	}

	var id = token.id
	var stamp = util.stamp()
	var sign = util.rsa_encrypt(`Kenrobot-${id}-${stamp}`)

	var url = `${syncUrl}/list`
	util.request(url, {
		method: "post",
		data: {
			id: id,
			stamp: stamp,
			sign: sign,
			type: PROJECT_TYPE
		}
	}).then(result => {
		if(result.status != 0) {
			deferred.reject(result.message)
			return
		}
		deferred.resolve(result.data)
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function upload(name) {
	var deferred = Q.defer()

	log.debug(`project upload: ${name}`)

	var token = Token.get()
	if(!token || !syncUrl) {
		return util.rejectPromise(null, deferred)
	}

	var id = token.id
	var stamp = util.stamp()
	var sign = util.rsa_encrypt(`Kenrobot-${id}-${stamp}`)

	compress(getProjectsDir(), name).then(outputPath => {
		var url = `${syncUrl}/upload`
		util.request(url, {
			method: "post",
			headers: {
				id: id,
				stamp: stamp,
				sign: sign,
				name: encodeURI(name),
				type: PROJECT_TYPE
			},
			body: fs.createReadStream(outputPath)
		}).then(result => {
			if(result.status != 0) {
				deferred.reject(result.message)
				return
			}

			var item = result.data
			updateLocalItem(item.name, item.modify_time).then(() => {
				log.debug(`project upload success: ${name}`)
				deferred.resolve(item)
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
	})

	return deferred.promise
}

function download(name) {
	var deferred = Q.defer()

	log.debug(`project download: ${name}`)

	var token = Token.get()
	if(!token || !syncUrl) {
		return util.rejectPromise(null, deferred)
	}

	var id = token.id
	var stamp = util.stamp()
	var sign = util.rsa_encrypt(`Kenrobot-${id}-${stamp}`)

	var data = {
		id: id,
		stamp: stamp,
		sign: sign,
		name: name,
		type: PROJECT_TYPE
	}

	var url = `${syncUrl}/download`
	util.request(url, {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	}, false).then(res => {
		var modify_time = parseInt(res.headers.get("modify_time"))
		var savePath = path.join(util.getAppDataPath(), 'temp', `${util.uuid(6)}.7z`)
		fs.ensureDirSync(path.dirname(savePath))
		var stream = fs.createWriteStream(savePath)
		res.body.pipe(stream)
		res.body.on("end", () => {
			util.uncompress(savePath, getProjectsDir()).then(() => {
				updateLocalItem(name, modify_time).then(() => {
					log.debug(`project download success: ${name}`)
					deferred.resolve()
				}, err => {
					err && log.error(err)
					deferred.reject(err)
				})
			}, err => {
				err && log.error(err)
				deferred.reject(err)
			})
		}).on("error", err => {
			err && log.error(err)
			deferred.reject(err)
		})
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function remove(name) {
	var deferred = Q.defer()

	log.debug(`project remove: ${name}`)

	var token = Token.get()
	if(!token || !syncUrl) {
		return util.rejectPromise(null, deferred)
	}

	var id = token.id
	var stamp = util.stamp()
	var sign = util.rsa_encrypt(`Kenrobot-${id}-${stamp}`)

	var url = `${syncUrl}/delete`
	util.request(url, {
		method: "post",
		data: {
			id: id,
			stamp: stamp,
			sign: sign,
			name: name,
			type: PROJECT_TYPE
		}
	}).then(result => {
		if(result.status != 0) {
			deferred.reject(result.message)
			return
		}

		Q.all([
			util.removeFile(path.join(getProjectsDir(), name)),
			removeLocalItem(name),
		]).then(() => {
			log.debug(`project remove success: ${name}`)
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

function compress(projectsDir, name) {
	var deferred = Q.defer()

	var outputPath = path.join(util.getAppDataPath(), 'temp', `${util.uuid(6)}.7z`)
	var files = [`${name}/${name}${PROJECT_EXT}`]
	util.compress(projectsDir, files, outputPath).then(() => {
		deferred.resolve(outputPath)
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function doSave(savePath, projectName, projectInfo, projectType) {
	projectInfo.project_name = projectName
	projectInfo.project_type = projectType || "local"
	projectInfo.updated_at = new Date()

	var projectPath = path.join(savePath, projectName + PROJECT_EXT)
	log.debug(`project save: ${projectPath}`)

	return Q.all([
		util.writeJson(projectPath, projectInfo),
		util.removeFile(path.join(projectPath, `${projectName}.ino`)),
		util.removeFile(path.join(projectPath, "project.json"))
	])
}

function doSync(remoteList, localList) {
	var deferred = Q.defer()

	var [downloadList, uploadList] = findSyncList(remoteList, localList)
	log.debug(`doSync: downloadList:${downloadList.length}, uploadList:${uploadList.length}`)
	var total = downloadList.length + uploadList.length
	var count = 0

	var notify = (name, action) => {
		count++
		deferred.notify({
			total: total,
			count: count,
			name: name,
			action: action,
		})
	}

	downloadSync(downloadList, notify)
		.then(uploadSync(uploadList, notify))
		.then(() => {
			deferred.resolve()
		})
		.catch(err => {
			err && log.error(err)
			deferred.reject(err)
		})

	return deferred.promise
}

function findSyncList(remoteList, localList) {
	var remoteDic = {}
	var localDic = {}
	remoteList.forEach(item => {
		remoteDic[`${item.name}`] = item
	})
	localList.forEach(item => {
		localDic[`${item.name}`] = item
	})
	var downloadList = []
	var uploadList = []

	remoteList.forEach(item => {
		var key = `${item.name}`
		var localItem = localDic[key]
		if(!localItem || !localItem.modify_time || localItem.modify_time < item.modify_time) {
			downloadList.push(item)
		} else if(!check(path.join(getProjectsDir(), item.name, item.name + PROJECT_EXT))) {
			downloadList.push(item)
		}
	})
	localList.forEach(item => {
		var key = `${item.name}`
		var remoteItem = remoteDic[key]
		if(!remoteItem || remoteItem.modify_time < item.modify_time) {
			uploadList.push(item)
		}
	})

	return [downloadList, uploadList]
}

function downloadSync(downloadList, notify) {
	var deferred = Q.defer()

	var worker
	worker = () => {
		if(downloadList.length == 0) {
			return util.resolvePromise(true, deferred)
		}

		var item = downloadList.shift()
		download(item.name).then(() => {
			notify(item.name, "download")
			if(downloadList.length == 0) {
				deferred.resolve()
			} else {
				setTimeout(() => worker(), 100)
			}
		}, err => {
			err && log.error(err)
			deferred.reject(err)
		})
	}
	worker()

	return deferred.promise
}

function uploadSync(uploadList, notify) {
	var deferred = Q.defer()

	var worker
	worker = () => {
		if(uploadList.length == 0) {
			return util.resolvePromise(true, deferred)
		}

		var item = uploadList.shift()
		upload(item.name).then(() => {
			notify(item.name, "upload")
			if(uploadList.length == 0) {
				deferred.resolve()
			} else {
				setTimeout(() => worker(), 100)
			}
		}, err => {
			err && log.error(err)
			deferred.reject(err)
		})
	}
	worker()

	return deferred.promise
}

function loadLocalList() {
	var deferred = Q.defer()

	var token = Token.get()
	if(!token) {
		return util.rejectPromise(null, deferred)
	}

	var listPath = getLocalListPath()
	if(!fs.existsSync(listPath)) {
		return util.resolvePromise([], deferred)
	}

	return util.readJson(listPath)
}

function saveLocalList(localList) {
	var token = Token.get()
	if(!token) {
		return util.rejectPromise()
	}

	return util.writeJson(getLocalListPath(), localList)
}

function updateLocalItem(name, modify_time) {
	var deferred = Q.defer()
	modify_time = modify_time || util.stamp()

	loadLocalList().then(localList => {
		var localItem = localList.find(it => it.name == name)
		if(!localItem) {
			localList.push({
				name: name,
				modify_time: modify_time,
			})
		} else {
			localItem.modify_time = modify_time
		}

		saveLocalList(localList).then(() => {
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

function removeLocalItem(name) {
	var deferred = Q.defer()

	loadLocalList().then(localList => {
		var index = localList.findIndex(it => it.name == name)
		if(index < 0) {
			deferred.resolve()
			return
		}
		localList.splice(index, 1)

		saveLocalList(localList).then(() => {
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

function getLocalListPath() {
	var token = Token.get()
	if(!token) {
		return null
	}

	return path.join(util.getAppDataPath(), "projects", getUserSpec(token.id, 1), "list.json")
}

function getProjectsDir() {
	var token = Token.get()
	if(!token) {
		return null
	}

	return path.join(util.getAppDocumentPath(), "projects", getUserSpec(token.id))
}

function getUserSpec(id, index) {
	index = index || 0
	return hasha(`${id}`, {algorithm: "md5"}).substring(index * 8, (index + 1) * 8)
}

function getSuffix() {
	suffix++
	return String.fromCharCode(suffix <= 122 ? suffix : (suffix = 97))
}

function getDefaultName() {
	var date = new Date()
	var month = months[date.getMonth()]
	var day = (100 + date.getDate()).toString().substring(1)
	var suffix = getSuffix()

	return `sketch_${month}${day}${suffix}`
}

module.exports.check = check
module.exports.read = read
module.exports.open = open
module.exports.save = save
module.exports.saveAs = saveAs

module.exports.setSyncUrl = setSyncUrl
module.exports.sync = sync
module.exports.list = list
module.exports.upload = upload
module.exports.remove = remove
module.exports.download = download

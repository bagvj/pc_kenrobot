const path = require('path')
const fs = require('fs-extra')
const Q = require('q')
const hasha = require('hasha')
const log = require('electron-log')
const JSZip = require('jszip')

const util = require('./util')
const Token = require('./token')

const PROJECT_EXT = ".krb"

var syncUrl
var throttleSync = util.throttle(sync, 3000)

function setSyncUrl(url) {
	log.debug(`project setSyncUrl: ${url}`)
	syncUrl = url
}

function list(type) {
	var deferred = Q.defer()
	type = type || "all"

	log.debug(`project list: ${type}`)
	var token = Token.get()
	if(!token || !syncUrl) {
		return util.rejectPromise(null, deferred)
	}

	var id = token.user_id
	var stamp = util.stamp()
	var sign = util.rsa_encrypt(`Kenrobot-${id}-${stamp}`)

	var url = `${syncUrl}/list`
	util.request(url, {
		method: "post",
		data: {
			id: id,
			stamp: stamp,
			sign: sign,
			type: type,
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

function upload(name, type) {
	var deferred = Q.defer()

	log.debug(`project upload: ${name} ${type}`)

	var token = Token.get()
	if(!token || !syncUrl) {
		return util.rejectPromise(null, deferred)
	}

	var id = token.user_id
	var stamp = util.stamp()
	var sign = util.rsa_encrypt(`Kenrobot-${id}-${stamp}`)

	zip(getProjectsDir(id, type), name, type).then(zipPath => {
		var url = `${syncUrl}/upload`
		util.request(url, {
			method: "post",
			headers: {
				id: id,
				stamp: stamp,
				sign: sign,
				name: encodeURI(name),
				type: type,
			},
			body: fs.createReadStream(zipPath)
		}).then(result => {
			if(result.status != 0) {
				deferred.reject(result.message)
				return
			}

			var item = result.data
			updateLocalItem(item.name, item.type, item.modify_time).then(() => {
				log.debug(`project upload success: ${name} ${type}`)
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

function download(name, type) {
	var deferred = Q.defer()

	log.debug(`project download: ${name} ${type}`)

	var token = Token.get()
	if(!token || !syncUrl) {
		return util.rejectPromise(null, deferred)
	}

	var id = token.user_id
	var stamp = util.stamp()
	var sign = util.rsa_encrypt(`Kenrobot-${id}-${stamp}`)

	var data = {
		id: id,
		stamp: stamp,
		sign: sign,
		name: name,
		type: type
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
		var zipPath = path.join(util.getAppDataPath(), "temp", `${util.uuid(6)}.zip`)
		fs.ensureDirSync(path.dirname(zipPath))
		var stream = fs.createWriteStream(zipPath)
		res.body.pipe(stream)
		res.body.on("end", () => {
			unzip(zipPath, getProjectsDir(id, type), name, type).then(() => {
				updateLocalItem(name, type, modify_time).then(() => {
					log.debug(`project download success: ${name} ${type}`)
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

function remove(name, type) {
	var deferred = Q.defer()

	log.debug(`project remove: ${name} ${type}`)

	var token = Token.get()
	if(!token || !syncUrl) {
		return util.rejectPromise(null, deferred)
	}

	var id = token.user_id
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
			type: type,
		}
	}).then(result => {
		if(result.status != 0) {
			deferred.reject(result.message)
			return
		}

		Q.all([
			util.removeFile(path.join(getProjectsDir(id, type), name)),
			removeLocalItem(name),
		]).then(() => {
			log.debug(`project remove success: ${name} ${type}`)
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

function sync() {
	var deferred = Q.defer()

	log.debug(`project sync`)

	Q.all([
		list(),
		getLocalList()
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

function zip(projectsDir, name, type) {
	var deferred = Q.defer()

	var zip = new JSZip()
	zip.file(`${name}/${name}.ino`, fs.createReadStream(path.join(projectsDir, `${name}/${name}.ino`)))
	zip.file(`${name}/project.json`, fs.createReadStream(path.join(projectsDir, `${name}/project.json`)))

	var zipPath = path.join(util.getAppDataPath(), 'temp', `${util.uuid(6)}.zip`)
	fs.ensureDirSync(path.dirname(zipPath))
	zip.generateNodeStream({
		streamFiles: true,
		type: "nodebuffer",
	})
	.pipe(fs.createWriteStream(zipPath))
	.on('finish', () => {
		deferred.resolve(zipPath)
	})
	.on('error', err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function unzip(zipPath, projectsDir, name, type) {
	var deferred = Q.defer()

	util.unzip(zipPath, projectsDir).then(() => {
		log.error(`unzip success: ${name} ${type}`)
		deferred.resolve()
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function projectExist(name, type) {
	var token = Token.get()
	if(!token) {
		return false
	}

	var projectsDir = getProjectsDir(token.user_id, type)
	var projectPath = path.join(projectsDir, name)
	return fs.existsSync(projectPath)
}

function doSync(remoteList, localList) {
	var deferred = Q.defer()

	var [downloadList, uploadList] = findSyncList(remoteList, localList)
	log.debug(`doSync: downloadList:${downloadList.length}, uploadList:${uploadList.length}`)
	var total = downloadList.length + uploadList.length
	var count = 0

	var notify = (name, type, action) => {
		count++
		deferred.notify({
			total: total,
			count: count,
			name: name,
			type: type,
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
		remoteDic[`${item.name}-${item.type}`] = item
	})
	localList.forEach(item => {
		localDic[`${item.name}-${item.type}`] = item
	})
	var downloadList = []
	var uploadList = []

	remoteList.forEach(item => {
		var key = `${item.name}-${item.type}`
		var localItem = localDic[key]
		if(!localItem || !localItem.modify_time || localItem.modify_time < item.modify_time) {
			downloadList.push(item)
		} else if(!projectExist(item.name, item.type)) {
			downloadList.push(item)
		}
	})
	localList.forEach(item => {
		var key = `${item.name}-${item.type}`
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
		download(item.name, item.type).then(() => {
			notify(item.name, item.type, "download")
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
		upload(item.name, item.type).then(() => {
			notify(item.name, item.type, "upload")
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

function updateLocalItem(name, type, modify_time) {
	var deferred = Q.defer()

	getLocalList().then(localList => {
		var localItem = localList.find(it => it.name == name)
		if(!localItem) {
			localList.push({
				name: name,
				type: type,
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

	getLocalList().then(localList => {
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

function getLocalList() {
	var deferred = Q.defer()

	var token = Token.get()
	if(!token) {
		return util.rejectPromise(null, deferred)
	}

	var listPath = getLocalListPath(token.user_id)
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

	return util.writeJson(getLocalListPath(token.user_id), localList)
}

function getLocalListPath(id) {
	return path.join(util.getAppDataPath(), "projects", getUserSpec(id, 1), "list.json")
}

function getProjectsDir(id, type) {
	return path.join(util.getAppDocumentPath(), "projects", getUserSpec(id), type)
}

function getUserSpec(id, type) {
	type = type || 0
	var md5 = hasha(`${id}`, {algorithm: "md5"})
	return md5.substring(type * 8, (type + 1) * 8)
}

function newSave(name, type, data, savePath) {
	var deferred = Q.defer()

	var token = Token.get()
	if(!token) {
		var prefix = path.join(util.getAppDocumentPath(), "projects")
		if(savePath && savePath.startsWith(prefix)) {
			savePath = null
		}
		return newSaveAs(name, type, data, savePath)
	}

	var projectsDir = getProjectsDir(token.user_id, type)
	savePath = path.join(projectsDir, name)
	newDoSave(name, type, data, savePath).then(() => {
		updateLocalItem(name, type, util.stamp()).then(() => {
			throttleSync()
			deferred.resolve({
				name: name,
				type: type,
				path: savePath,
				tag: "network",
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

function newSaveAs(name, type, data, savePath) {
	var deferred = Q.defer()

	var doSave = projectPath => {
		newDoSave(name, type, data, projectPath).then(() => {
			deferred.resolve({
				name: name,
				type: type,
				path: projectPath,
				tag: "local",
			})
		}, err => {
			err && log.error(err)
			deferred.reject(err)
		})
	}

	if(savePath) {
		doSave(savePath)
	} else {
		var options = {}
		options.defaultPath = path.join(util.getAppPath("documents"), name)
		util.showSaveDialog(options).then(savePath => {
			doSave(savePath)
		}, err => {
			err && log.error(err)
			deferred.reject(err)
		})
	}

	return deferred.promise
}

function newDoSave(name, type, data, savePath) {
	log.debug(`project save: ${name} ${type} -> ${savePath}`)
	return Q.all([
		util.writeFile(path.join(savePath, `${name}.ino`), data.project_data.code),
		util.writeJson(path.join(savePath, 'project.json'), data),
	])
}

function newOpen(type, name) {
	var deferred = Q.defer()

	log.debug(`project open: ${type}`)

	var doOpen = projectPath => {
		newDoOpen(projectPath, type).then(result => {
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

		var openPath = path.join(getProjectsDir(token.user_id, type), name)
		doOpen(openPath)

		return deferred.promise
	} else {
		var options = {}
		if(token) {
			options.defaultPath = getProjectsDir(token.user_id, type)
		} else {
			options.defaultPath = util.getAppPath("documents")
		}
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

function newDoOpen(openPath, type) {
	var deferred = Q.defer()

	log.debug(`project open: ${type} -> ${openPath}`)

	util.readJson(path.join(openPath, "project.json")).then(data => {
		deferred.resolve({
			extra: {
				name: path.basename(openPath),
				type: type,
				path: openPath,
			},
			data: data
		})
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

/**
 * 保存项目
 * @param {*} oldProjectPath
 * @param {*} projectInfo
 * @param {*} isTemp
 */
function save(oldProjectPath, projectInfo, isTemp) {
	var deferred = Q.defer()
	isTemp = isTemp === true

	log.debug(`saveProject: isTemp:${isTemp}`)

	var doSave = projectPath => {
		var updated_at = new Date()
		projectInfo.updated_at = updated_at
		projectInfo.project_name = path.basename(projectPath)

		Q.all([
			util.writeFile(path.join(projectPath, projectInfo.project_name + ".ino"), projectInfo.project_data.code),
			util.writeJson(path.join(projectPath, projectInfo.project_name + PROJECT_EXT), projectInfo),
			util.removeFile(path.join(projectPath, "project.json"))
		]).then(() => {
			deferred.resolve({
				path: projectPath,
				updated_at: projectInfo.updated_at,
				project_name: projectInfo.project_name
			})
		}, () => {
			deferred.reject()
		})
	}

	if(oldProjectPath) {
		doSave(oldProjectPath)
	} else if(isTemp) {
		var projectPath = path.join(util.getAppPath("temp"), "build", "sketch" + new Date().getTime())
		doSave(projectPath)
	} else {
		util.showSaveDialog().then(projectPath => {
			doSave(projectPath)
		}, () => {
			deferred.reject()
		})
	}

	return deferred.promise
}

function read(projectPath) {
	var deferred = Q.defer()

	var projectName = path.basename(projectPath)
	var filePath = path.join(projectPath, projectName + PROJECT_EXT)
	if(!fs.existsSync(filePath)) {
		filePath = path.join(projectPath, projectName + ".json")
	}
	util.readJson(filePath).then(projectInfo => {
		deferred.resolve({
			path: projectPath,
			projectInfo: projectInfo
		})
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function load(projectPath) {
	var deferred = Q.defer()

	util.readJson(projectPath).then(projectInfo => {
		deferred.resolve({
			path: path.dirname(projectPath),
			projectInfo: projectInfo
		})
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

/**
 * 打开项目
 * @param {*} projectPath 项目路径
 */
function open(projectPath) {
	var deferred = Q.defer()

	var doRead = p => {
		read(p).then(result => {
			deferred.resolve(result)
		}, err => {
			deferred.reject(err)
		});
	}

	log.debug(`openProject ${projectPath}`)
	if(projectPath) {
		doRead(projectPath)
	} else {
		util.showOpenDialog({
			properties: ["openDirectory"],
		}).then(p => {
			doRead(p)
		}, err => {
			err && log.error(err)
			deferred.reject(err)
		})
	}

	return deferred.promise
}

function check(projectPath) {
	if(path.extname(projectPath) != PROJECT_EXT || !fs.existsSync(projectPath)) {
		return null
	}

	return projectPath
}

module.exports.setSyncUrl = setSyncUrl

module.exports.sync = sync
module.exports.list = list
module.exports.upload = upload
module.exports.remove = remove
module.exports.download = download

module.exports.read = read
module.exports.load = load
module.exports.open = open
module.exports.save = save
module.exports.check = check

module.exports.newSave = newSave
module.exports.newSaveAs = newSaveAs
module.exports.newOpen = newOpen

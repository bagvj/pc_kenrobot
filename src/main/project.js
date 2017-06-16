const path = require('path')
const fs = require('fs-extra')
const Q = require('q')
const hasha = require('hasha')
const log = require('electron-log')
const JSZip = require('jszip')

const util = require('./util')
const Token = require('./token')

var localListCache

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
				name: name,
				type: type,
			},
			body: fs.createReadStream(zipPath)
		}).then(result => {
			if(result.status != 0) {
				deferred.reject(result.message)
				return
			}

			var item = result.data
			updateLocalItem(item.name, item.type, item.modify_time).then(_ => {
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
		res.body.on("end", _ => {
			unzip(zipPath, getProjectsDir(id, type), name, type).then(_ => {
				updateLocalItem(name, type, modify_time).then(_ => {
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
			util.removeFile(path.join(getProjectsDir(id, type), getProjectRelativePath(name, type))),
			removeLocalItem(name),
		]).then(_ => {
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
		doSync(remoteList, localList).then(_ => {
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
	var relativePath = getProjectRelativePath(name, type)
	switch(type) {
		case "edu":
		case "ide":
			zip.file(`${relativePath}/${name}.ino`, util.readFile(path.join(projectsDir, `${relativePath}/${name}.ino`), {}, true), {base64: true})
			zip.file(`${relativePath}/project.json`, util.readFile(path.join(projectsDir, `${relativePath}/project.json`), {}, true), {base64: true})
			break
		case "scratch2":
			zip.file(relativePath, util.readFile(path.join(projectsDir, relativePath), {}, true), {base64: true})
			break
		case "scratch3":
			zip.file(relativePath, util.readFile(path.join(projectsDir, relativePath), {}, true), {base64: true})
			break
	}

	var zipPath = path.join(util.getAppDataPath(), 'temp', `${util.uuid(6)}.zip`)
	fs.ensureDirSync(path.dirname(zipPath))
	zip.generateNodeStream({
			streamFiles: true,
			type: "nodebuffer",
		})
		.pipe(fs.createWriteStream(zipPath))
		.on('finish', _ => {
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

	util.readFile(zipPath, {}).then(data => {
		var zip = new JSZip()
		zip.loadAsync(data).then(_ => {
			var count = 0
			zip.forEach((relativePath, file) => {
				if(file.dir) {
					return
				}

				count++
				file.async("nodebuffer").then(content => {
					util.writeFile(path.join(projectsDir, relativePath), content, {}, true)
					count--
					if(count == 0) {
						deferred.resolve()
					}
				}, err => {
					err && log.error(err)
					deferred.reject(err)
				})
			})
		}, err => {
			log.error(`unzip fail: ${name} ${type}`)
			err && log.error(err)
			deferred.reject(err)
		})
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
	var projectPath = path.join(projectsDir, getProjectRelativePath(name, type))
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
		.then(_ => {
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
	worker = _ => {
		if(downloadList.length == 0) {
			return util.resolvePromise(true, deferred)
		}

		var item = downloadList.shift()
		download(item.name, item.type).then(_ => {
			notify(item.name, item.type, "download")
			if(downloadList.length == 0) {
				deferred.resolve()
			} else {
				setTimeout(_ => worker(), 100)
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
	worker = _ => {
		if(uploadList.length == 0) {
			return util.resolvePromise(true, deferred)
		}

		var item = uploadList.shift()
		upload(item.name, item.type).then(_ => {
			notify(item.name, item.type, "upload")
			if(uploadList.length == 0) {
				deferred.resolve()
			} else {
				setTimeout(_ => worker(), 100)
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

		saveLocalList(localList).then(_ => {
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
		
		saveLocalList(localList).then(_ => {
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

	if(localListCache) {
		return util.resolvePromise(localListCache, deferred)
	}

	var listPath = getLocalListPath(token.user_id)

	if(!fs.existsSync(listPath)) {
		localListCache = []
		return util.resolvePromise(localListCache, deferred)
	}

	util.readJson(listPath).then(result => {
		localListCache = result
		deferred.resolve(localListCache)
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
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

function getProjectRelativePath(name, type) {
	var relativePath
	switch(type) {
		case "edu":
		case "ide":
			relativePath = name
			break
		case "scratch2":
			relativePath = `${name}.sb2`
			break
		case "scratch3":
			relativePath = `${name}.json`
			break
	}

	return relativePath
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
	savePath = path.join(projectsDir, getProjectRelativePath(name, type))
	newDoSave(name, type, data, savePath).then(_ => {
		updateLocalItem(name, type, util.stamp()).then(_ => {
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
		newDoSave(name, type, data, projectPath).then(_ => {
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
		options.defaultPath = path.join(util.getAppPath("documents"), getProjectRelativePath(name, type))
		if(type == "scratch2") {
			options.filters = [{name: "sb2", extensions: ["sb2"]}]
		} else if(type == "scratch3") {
			options.filters = [{name: "json", extensions: ["json"]}]
		}

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
	if(type == "edu") {
		return Q.all([
			util.writeFile(path.join(savePath, `${name}.ino`), data.project_data.code),
			util.writeJson(path.join(savePath, 'project.json'), data),
		])
	} else if(type == "ide") {
		return Q.all([
			util.writeFile(path.join(savePath, `${name}.ino`), data.project_data.code),
			util.writeJson(path.join(savePath, 'project.json'), data),
		])
	} else if(type == "scratch2") {
		return util.writeFile(savePath, new Buffer(data, "base64"))
	} else if(type == "scratch3") {
		return util.writeFile(savePath, data)
	} else {
		return util.rejectPromise()
	}
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

		var openPath = path.join(getProjectsDir(token.user_id, type), getProjectRelativePath(name, type))
		doOpen(openPath)

		return deferred.promise
	} else {
		var options = {}
		if(token) {
			options.defaultPath = getProjectsDir(token.user_id, type)
		} else {
			options.defaultPath = util.getAppPath("documents")
		}

		if(type == "edu") {
			options.properties = ["openDirectory"]
		} else if(type == "ide") {
			options.properties =  ["openFile"]
			options.filters = [{name: "ino", extensions: ["ino"]}]
		} else if(type == "scratch2") {
			options.properties =  ["openFile"]
			options.filters = [{name: "sb2", extensions: ["sb2"]}]
		} else if(type == "scratch3") {
			options.properties =  ["openFile"]
			options.filters = [{name: "json", extensions: ["json"]}]
		}

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

	if(type == "edu") {
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
	} else if(type == "ide") {
		var dirname = path.dirname(openPath)
		var basename = path.basename(openPath, path.extname(openPath))
		if(path.basename(dirname) != basename) {
			return util.rejectPromise({
				path: openPath,
				newPath: path.join(dirname, basename, `${basename}.ino`),
				status: "DIR_INVALID",
			}, deferred)
		}
		util.readFile(openPath).then(data => {
			deferred.resolve({
				extra: {
					name: basename,
					type: type,
					path: dirname,
				},
				data: data,
			})
		}, err => {
			err && log.error(err)
			deferred.reject(err)
		})
	} else if(type == "scratch2") {
		util.readFile(openPath, "base64").then(data => {
			deferred.resolve({
				extra: {
					name: path.basename(openPath, path.extname(openPath)),
					type: type,
					path: openPath,
				},
				data: data
			})
		}, err => {
			err && log.error(err)
			deferred.reject(err)
		})
	} else if(type == "scratch3") {
		util.readFile(openPath).then(data => {
			deferred.resolve({
				extra: {
					name: path.basename(openPath, path.extname(openPath)),
					type: type,
					path: openPath,
				},
				data: data
			})
		}, err => {
			err && log.error(err)
			deferred.reject(err)
		})
	} else {
		util.rejectPromise(null, deferred)
	}

	return deferred.promise
}

function checkProjectTag(projectPath, type) {
	var deferred = Q.defer()

	// var token = Token.get()
	// if(!token) {
	// 	return util.resolvePromise("local", )
	// }

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
			util.writeFile(path.join(projectPath, path.basename(projectPath) + ".ino"), projectInfo.project_data.code),
			util.writeJson(path.join(projectPath, "project.json"), projectInfo)
		]).then(_ => {
			deferred.resolve({
				path: projectPath,
				updated_at: projectInfo.updated_at,
				project_name: projectInfo.project_name
			})
		}, _ => {
			deferred.reject()
		})
	}

	if(oldProjectPath) {
		doSave(oldProjectPath)
	} else if(isTemp) {
		var projectPath = path.join(app.getPath("temp"), "build", "sketch" + new Date().getTime())
		doSave(projectPath)
	} else {
		util.showSaveDialog().then(projectPath => {
			doSave(projectPath)
		}, _ => {
			deferred.reject()
		})
	}
	
	return deferred.promise
}

/**
 * 打开项目
 * @param {*} projectPath 项目路径 
 */
function open(projectPath, type) {
	var deferred = Q.defer()
	type = type || "project"

	log.debug(`openProject ${projectPath}`)
	var read = projectPath => {
		if(type == "project") {
			util.readJson(path.join(projectPath, "project.json")).then(projectInfo => {
				deferred.resolve({
					path: projectPath,
					projectInfo: projectInfo
				})
			}, err => {
				err && log.error(err)
				deferred.reject(err)
			})
		} else {
			var dirname = path.dirname(projectPath)
			var basename = path.basename(projectPath, path.extname(projectPath))
			if(path.basename(dirname) != basename) {
				setTimeout(_ => {
					deferred.reject({
						path: projectPath,
						newPath: path.join(dirname, basename, `${basename}.ino`),
						status: "DIR_INVALID",
					})
				}, 10)
				return
			}
			util.readFile(projectPath).then(code => {
				deferred.resolve({
					path: dirname,
					code: code,
				})
			}, err => {
				err && log.error(err)
				deferred.reject(err)
			})
		}
	}
	if(projectPath) {
		read(projectPath)
	} else {
		var filters = type == "project" ? null : [{name: "ino", extensions: ["ino"]}]
		var properties = type == "project" ? ["openDirectory"] : ["openFile"]
		util.showOpenDialog(null, {
			properties: properties,
			filters: filters,
		}).then(projectPath => {
			read(projectPath)
		}, err => {
			err && log.error(err)
			deferred.reject(err)
		})
	}

	return deferred.promise
}

module.exports.setSyncUrl = setSyncUrl

module.exports.sync = sync
module.exports.list = list
module.exports.upload = upload
module.exports.remove = remove
module.exports.download = download

module.exports.open = open
module.exports.save = save

module.exports.newSave = newSave
module.exports.newSaveAs = newSaveAs
module.exports.newOpen = newOpen

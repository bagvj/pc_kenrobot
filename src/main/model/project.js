import path from 'path'
import fs from 'fs-extra'
import Q from 'q'
import hasha from 'hasha'
import log from 'electron-log'

import util from '../util/util'
import Token from './token'
import Url from '../config/url'

const PROJECT_EXT = ".krb"
const PROJECT_TYPE = "krobot"

const months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"]

let suffix = 96
let throttleSync = util.throttle(sync, 3000)

function check(projectPath) {
	if(!projectPath || path.extname(projectPath) !== PROJECT_EXT || !fs.existsSync(projectPath)) {
		return null
	}

	return projectPath
}

function read(filePath) {
	let deferred = Q.defer()

	let projectPath
	if(check(filePath)) {
		projectPath = filePath
	} else {
		let projectName = path.basename(filePath)
		projectPath = path.join(filePath, projectName + PROJECT_EXT)
		if(!fs.existsSync(projectPath)) {
			projectPath = path.join(filePath, "project.json")
		}
		if(!fs.existsSync(projectPath)) {
			return util.rejectPromise(null, deferred)
		}
	}

	util.readJson(projectPath).then(projectInfo => {
		deferred.resolve({
			path: path.dirname(projectPath),
			project_type: projectInfo.project_type || "local",
			data: projectInfo,
		})
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function open(name) {
	let deferred = Q.defer()

	let doOpen = projectPath => {
		read(projectPath).then(result => {
			deferred.resolve(result)
		}, err => {
			err && log.info(err)
			deferred.reject(err)
		})
	}

	if(name) {
		if(!Token.getUser()) {
			return util.rejectPromise(null, deferred)
		}

		doOpen(path.join(getProjectsDir(), name))

		return deferred.promise
	}

	let options = {}
	options.defaultPath = Token.getUser() ? getProjectsDir() : util.getAppPath("documents")
	options.properties = ["openDirectory"]

	util.showOpenDialog(options).then(openPath => {
		doOpen(openPath)
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function save(projectName, projectInfo, savePath) {
	let deferred = Q.defer()

	if(!Token.getUser()) {
		let prefix = path.join(util.getAppPath("appDocuments"), "projects")
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
			err && log.info(err)
			deferred.reject(err)
		})
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function saveAs(projectName, projectInfo, isTemp, savePath) {
	let deferred = Q.defer()

	let doSaveFn = (_savePath, _name) => {
		doSave(_savePath, _name, projectInfo).then(() => {
			deferred.resolve({
				project_name: projectInfo.project_name,
				project_type: projectInfo.project_type,
				updated_at: projectInfo.updated_at,
				path: _savePath,
			})
		}, err => {
			err && log.info(err)
			deferred.reject(err)
		})
	}

	if(isTemp) {
		savePath = path.join(util.getAppPath("temp"), "build", `sketch_${util.stamp()}`)
		doSaveFn(savePath, path.basename(savePath))
	} else if(savePath) {
		doSaveFn(path.join(path.dirname(savePath), projectName), projectName)
	} else {
		util.showSaveDialog({defaultPath: getDefaultName()}).then(_savePath => {
			doSaveFn(_savePath, path.basename(_savePath))
		}, err => {
			err && log.info(err)
			deferred.reject(err)
		})
	}

	return deferred.promise
}

function sync() {
	let deferred = Q.defer()

	log.debug(`project sync`)

	Q.all([
		list(),
		loadLocalList()
	]).then(result => {
		let [remoteList, localList] = result
		doSync(remoteList, localList).then(() => {
			log.debug(`project sync success`)
			deferred.resolve()
		}, err => {
			log.debug(`project sync fail`)
			err && log.info(err)
			deferred.reject(err)
		}, progress => {
			deferred.notify(progress)
		})
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function list() {
	let deferred = Q.defer()

	log.debug(`project list`)

	Token.request(Url.PROJECT_SYNC_LIST, {method: "post"}).then(result => {
		if(result.status !== 0) {
			deferred.reject(result.message)
			return
		}
		deferred.resolve(result.data.filter(p => p.type === PROJECT_TYPE))
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function create(name) {
	let deferred = Q.defer()

	log.debug(`project create: ${name}`)

	Token.request(Url.PROJECT_SYNC_CREATE, {
		method: 'post',
		data: {
			name,
			type: PROJECT_TYPE
		}
	}).then(result => {
		if(result.status !== 0) {
			deferred.reject(result.message)
			return
		}

		let item = result.data
		updateLocalItem(item.name, item.modify_time, item.hash).then(() => {
			log.debug(`project create success: ${name} ${item.hash}`)
			deferred.resolve(item)
		}, err => {
			err && log.info(err)
			deferred.reject(err)
		})
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function remove(name, hash) {
	let deferred = Q.defer()

	log.debug(`project remove: ${hash}`)

	Token.request(Url.PROJECT_SYNC_DELETE, {
		method: "post",
		data: {
			hash
		}
	}).then(result => {
		if(result.status !== 0) {
			deferred.reject(result.message)
			return
		}

		Q.all([
			util.removeFile(path.join(getProjectsDir(), name)),
			removeLocalItem(hash),
		]).then(() => {
			log.debug(`project remove success: ${name}`)
			deferred.resolve()
		}, err => {
			err && log.info(err)
			deferred.reject(err)
		})
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function upload(name, hash) {
	let deferred = Q.defer()

	log.debug(`project upload: ${name}: ${hash}`)

	compress(getProjectsDir(), name).then(outputPath => {
		let url = `${Url.PROJECT_SYNC_UPLOAD}/${hash}`
		Token.request(url, {
			method: "post",
			body: fs.createReadStream(outputPath)
		}).then(result => {
			if(result.status !== 0) {
				deferred.reject(result.message)
				return
			}

			let item = result.data
			updateLocalItem(name, item.modify_time, hash).then(() => {
				log.debug(`project upload success: ${name}`)
				deferred.resolve(item)
			}, err => {
				err && log.info(err)
				deferred.reject(err)
			})
		}, err => {
			err && log.info(err)
			deferred.reject(err)
		})
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function download(name, hash) {
	let deferred = Q.defer()

	log.debug(`project download: ${hash}`)

	let url = `${Url.PROJECT_SYNC_DOWNLOAD}/${hash}`
	Token.request(url, {method: "post"}, false).then(res => {
		let savePath = path.join(util.getAppPath("appData"), 'temp', `${util.uuid(6)}.7z`)
		fs.ensureDirSync(path.dirname(savePath))

		let stream = fs.createWriteStream(savePath)
		res.body.pipe(stream)
		res.body.on("end", () => {
			util.uncompress(savePath, getProjectsDir()).then(() => {
				updateLocalItem(name, null, hash).then(() => {
					log.debug(`project download success: ${name}`)
					deferred.resolve()
				}, err => {
					err && log.info(err)
					deferred.reject(err)
				})
			}, err => {
				err && log.info(err)
				deferred.reject(err)
			})
		}).on("error", err => {
			err && log.info(err)
			deferred.reject(err)
		})
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function compress(projectsDir, name) {
	let deferred = Q.defer()

	let outputPath = path.join(util.getAppPath("appData"), 'temp', `${util.uuid(6)}.7z`)
	let files = [`${name}/${name}${PROJECT_EXT}`]
	util.compress(projectsDir, files, outputPath).then(() => {
		deferred.resolve(outputPath)
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function doSave(savePath, projectName, projectInfo, projectType) {
	projectInfo.project_name = projectName
	projectInfo.project_type = projectType || "local"
	projectInfo.updated_at = new Date()

	let projectPath = path.join(savePath, projectName + PROJECT_EXT)
	log.debug(`project save: ${projectPath}`)

	return Q.all([
		util.writeJson(projectPath, projectInfo),
		util.removeFile(path.join(savePath, `${projectName}.ino`)),
		util.removeFile(path.join(savePath, "project.json"))
	])
}

function doSync(remoteList, localList) {
	let deferred = Q.defer()

	let [createList, downloadList, uploadList] = findSyncList(remoteList, localList)
	log.debug(`doSync: createList:${createList.length}, downloadList:${downloadList.length}, uploadList:${uploadList.length}`)
	let total = createList.length + downloadList.length + uploadList.length
	let count = 0

	let notify = (name, action) => {
		count++
		deferred.notify({
			total,
			count,
			name,
			action,
		})
	}

	downloadSync(downloadList, notify).then(() => {
		createSync(createList, notify).then(() => {
			uploadSync(uploadList, notify).then(() => {
				deferred.resolve()
			}, err => {
				err && log.info(err)
				deferred.reject(err)
			})
		}, err => {
			err && log.info(err)
			deferred.reject(err)
		})
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function findSyncList(remoteList, localList) {
	let remoteDic = {}
	let localDic = {}
	remoteList.forEach(item => {
		remoteDic[`${item.name}`] = item
	})
	localList.forEach(item => {
		localDic[`${item.name}`] = item
	})
	let downloadList = []
	let uploadList = []
	let createList = []

	remoteList.forEach(item => {
		let localItem = localDic[item.name]
		if(!localItem || !localItem.modify_time || localItem.modify_time < item.modify_time) {
			downloadList.push(item)
		} else if(!check(path.join(getProjectsDir(), item.name, item.name + PROJECT_EXT))) {
			downloadList.push(item)
		}
	})
	localList.forEach(item => {
		let remoteItem = remoteDic[item.name]
		if(!remoteItem) {
			createList.push(item)
			uploadList.push(item)
		} else if(remoteItem.modify_time < item.modify_time) {
			uploadList.push(item)
		}
	})

	return [createList, downloadList, uploadList]
}

function createSync(createList, notify) {
	let deferred = Q.defer()

	let worker
	worker = () => {
		if(createList.length === 0) {
			return util.resolvePromise(true, deferred)
		}

		let item = createList.shift()
		create(item.name).then(it => {
			item.hash = it.hash
			notify(item.name, "create")
			if(createList.length === 0) {
				deferred.resolve()
			} else {
				setTimeout(() => worker(), 100)
			}
		}, err => {
			err && log.info(err)
			deferred.reject(err)
		})
	}
	worker()

	return deferred.promise
}

function uploadSync(uploadList, notify) {
	let deferred = Q.defer()

	let worker
	worker = () => {
		if(uploadList.length === 0) {
			return util.resolvePromise(true, deferred)
		}

		let item = uploadList.shift()
		upload(item.name, item.hash).then(() => {
			notify(item.name, "upload")
			if(uploadList.length === 0) {
				deferred.resolve()
			} else {
				setTimeout(() => worker(), 100)
			}
		}, err => {
			err && log.info(err)
			deferred.reject(err)
		})
	}
	worker()

	return deferred.promise
}

function downloadSync(downloadList, notify) {
	let deferred = Q.defer()

	let worker
	worker = () => {
		if(downloadList.length === 0) {
			return util.resolvePromise(true, deferred)
		}

		let item = downloadList.shift()
		download(item.name, item.hash).then(() => {
			notify(item.name, "download")
			if(downloadList.length === 0) {
				deferred.resolve()
			} else {
				setTimeout(() => worker(), 100)
			}
		}, err => {
			err && log.info(err)
			deferred.reject(err)
		})
	}
	worker()

	return deferred.promise
}

function loadLocalList() {
	let deferred = Q.defer()

	if(!Token.getUser()) {
		return util.rejectPromise(null, deferred)
	}

	let listPath = getLocalListPath()
	if(!fs.existsSync(listPath)) {
		return util.resolvePromise([], deferred)
	}

	return util.readJson(listPath)
}

function saveLocalList(localList) {
	if(!Token.getUser()) {
		return util.rejectPromise()
	}

	return util.writeJson(getLocalListPath(), localList)
}

function updateLocalItem(name, modify_time, hash) {
	let deferred = Q.defer()
	modify_time = modify_time || util.stamp()

	loadLocalList().then(localList => {
		let localItem = localList.find(it => (hash && it.hash === hash) || it.name === name)
		if(!localItem) {
			localList.push({
				name,
				hash,
				modify_time,
			})
		} else {
			name && (localItem.name = name)
			hash && (localItem.hash = hash)
			localItem.modify_time = modify_time
		}

		saveLocalList(localList).then(() => {
			deferred.resolve()
		}, err => {
			err && log.info(err)
			deferred.reject(err)
		})
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function removeLocalItem(hash) {
	let deferred = Q.defer()

	loadLocalList().then(localList => {
		let index = localList.findIndex(it => it.hash === hash)
		if(index < 0) {
			deferred.resolve()
			return
		}
		localList.splice(index, 1)

		saveLocalList(localList).then(() => {
			deferred.resolve()
		}, err => {
			err && log.info(err)
			deferred.reject(err)
		})
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function getLocalListPath() {
	let userId = Token.getUserId()
	if(!userId) {
		return null
	}

	return path.join(util.getAppPath("appData"), "projects", getUserSpec(userId, 1), "list.json")
}

function getProjectsDir() {
	let userId = Token.getUserId()
	if(!userId) {
		return null
	}

	return path.join(util.getAppPath("appDocuments"), "projects", getUserSpec(userId))
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
	let date = new Date()
	let month = months[date.getMonth()]
	let day = (100 + date.getDate()).toString().substring(1)
	let s = getSuffix()

	return `sketch_${month}${day}${s}`
}

module.exports.check = check
module.exports.read = read
module.exports.open = open
module.exports.save = save
module.exports.saveAs = saveAs

module.exports.sync = sync
module.exports.list = list
module.exports.create = create
module.exports.remove = remove
module.exports.upload = upload
module.exports.download = download

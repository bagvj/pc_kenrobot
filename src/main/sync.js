const path = require('path')
const fs = require('fs-extra')
const Q = require('q')
const hasha = require('hasha')
const log = require('electron-log')
const JSZip = require('jszip')

const util = require('./util')
const Token = require('./token')

var baseUrl

function setBaseUrl(url) {
	log.debug(`sync setBaseUrl: ${url}`)
	baseUrl = url
}

function list() {
	var deferred = Q.defer()

	log.debug(`sync list`)
	var token = Token.get()
	if(!token || !baseUrl) {
		return util.rejectPromise(null, deferred)
	}

	var id = token.user_id
	var stamp = parseInt(new Date().getTime() / 1000)
	var sign = util.rsa_encrypt(`Kenrobot-${id}-${stamp}`)

	var url = `${baseUrl}/list`
	util.request(url, {
		method: "post",
		data: {
			id: id,
			stamp: stamp,
			sign: sign,
		}
	}).then(result => {
		deferred.resolve(result)
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function upload(name, type) {
	var deferred = Q.defer()

	log.debug(`sync upload: ${name} ${type}`)

	var token = Token.get()
	if(!token || !baseUrl) {
		return util.rejectPromise(null, deferred)
	}

	var id = token.user_id
	var stamp = parseInt(new Date().getTime() / 1000)
	var sign = util.rsa_encrypt(`Kenrobot-${id}-${stamp}`)

	zipProject(getProjectsPath(id), name, type).then(zipPath => {
		var url = `${baseUrl}/upload`
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
			deferred.resolve(result)
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

function remove(name, type) {
	var deferred = Q.defer()

	log.debug(`sync remove: ${name} ${type}`)

	var token = Token.get()
	if(!token || !baseUrl) {
		return util.rejectPromise(null, deferred)
	}

	var id = token.user_id
	var stamp = parseInt(new Date().getTime() / 1000)
	var sign = util.rsa_encrypt(`Kenrobot-${id}-${stamp}`)

	var url = `${baseUrl}/delete`
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
		deferred.resolve(result)
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function download(name, type) {
	var deferred = Q.defer()

	log.debug(`sync download: ${name} ${type}`)

	var token = Token.get()
	if(!token || !baseUrl) {
		return util.rejectPromise(null, deferred)
	}

	var id = token.user_id
	var stamp = parseInt(new Date().getTime() / 1000)
	var sign = util.rsa_encrypt(`Kenrobot-${id}-${stamp}`)

	var data = {
		id: id,
		stamp: stamp,
		sign: sign,
		name: name,
		type: type
	}

	var url = `${baseUrl}/download`
	util.request(url, {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	}, false).then(res => {
		var zipPath = path.join(util.getAppDataPath(), "temp", `${util.uuid(6)}.zip`)
		fs.ensureDirSync(path.dirname(zipPath))
		var stream = fs.createWriteStream(zipPath)
		res.body.pipe(stream)
		res.body.on("end", _ => {
			unzipProject(zipPath, getProjectsPath(id), name, type).then(_ => {
				deferred.resolve()
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

function zipProject(projectsDir, name, type) {
	var deferred = Q.defer()

	var zip = new JSZip()
	switch(type) {
		case "edu":
		case "ide":
			zip.file(`${name}/${name}.ino`, util.readFile(path.join(projectsDir, `${name}/${name}.ino`), {encoding: null}, true))
			zip.file(`${name}/project.json`, util.readFile(path.join(projectsDir, `${name}/project.json`), {encoding: null}, true))
			break
		case "scratch2":
			zip.file(`${name}.sb2`, util.readFile(path.join(projectsDir, `${name}.sb2`), {encoding: null}, true))
			break
		case "scratch3":
			zip.file(`${name}.json`, util.readFile(path.join(projectsDir, `${name}.json`), {encoding: null}, true))
			break
	}

	var zipPath = path.join(util.getAppDataPath(), 'temp', `${util.uuid(6)}.zip`)
	fs.ensureDirSync(path.dirname(zipPath))
	zip.generateNodeStream({streamFiles:true})
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

function unzipProject(zipPath, projectsDir, name, type) {
	var deferred = Q.defer()

	util.readFile(zipPath, {encoding: null}).then(data => {
		var zip = new JSZip()
		zip.loadAsync(data).then(_ => {
			var count = 0
			zip.forEach((relativePath, file) => {
				if(file.dir) {
					return
				}

				count++
				file.async("string").then(content => {
					util.writeFile(path.join(projectsDir, relativePath), content, true)
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
			err && log.error(err)
			deferred.reject(err)
		})
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function getProjectsPath(id) {
	return path.join(util.getDocumentPath(), "projects", hasha(`${id}`, {algorithm: "md5"}))
}

module.exports.setBaseUrl = setBaseUrl

module.exports.list = list
module.exports.upload = upload
module.exports.remove = remove
module.exports.download = download

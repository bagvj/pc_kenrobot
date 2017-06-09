const path = require('path')
const fs = require('fs-extra')
const Q = require('q')
const log = require('electron-log')

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

function upload(filePath) {
	var deferred = Q.defer()

	log.debug(`sync upload: ${filePath}`)

	var token = Token.get()
	if(!token || !baseUrl) {
		return util.rejectPromise(null, deferred)
	}

	var id = token.user_id
	var filename = path.basename(filePath)
	var stamp = parseInt(new Date().getTime() / 1000)
	var sign = util.rsa_encrypt(`Kenrobot-${id}-${stamp}`)

	var url = `${baseUrl}/upload`
	util.request(url, {
		method: "post",
		headers: {
			id: id,
			filename: filename,
			stamp: stamp,
			sign: sign,
		},
		body: fs.createReadStream(filePath)
	}).then(result => {
		deferred.resolve(result)
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function remove(filePath) {
	var deferred = Q.defer()

	log.debug(`sync remove: ${filePath}`)

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
			filename: filePath,
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

function download(filePath, dest) {
	var deferred = Q.defer()

	log.debug(`sync download: ${filePath} -> ${dest}`)

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
		filename: filePath,
	}

	var url = `${baseUrl}/download`
	util.request(url, {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	}, false).then(res => {
		var destPath = path.join(dest, path.basename(filePath))
		var stream = fs.createWriteStream(destPath)
		res.body.pipe(stream)
		res.body.on("end", _ => {
			deferred.resolve(destPath)
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

module.exports.setBaseUrl = setBaseUrl

module.exports.list = list
module.exports.upload = upload
module.exports.remove = remove
module.exports.download = download

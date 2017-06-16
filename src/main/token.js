const path = require('path')
const crypto = require('crypto')
const Q = require('q')
const fs = require('fs-extra')
const util = require('./util')
const log = require('electron-log')

var token

function get() {
	return token
}

function set(value) {
	token = value
}

function remove() {
	token = null
	util.removeFile(getTokenPath(), true)
}

function save(value) {
	var deferred = Q.defer()

	var key = crypto.randomBytes(128)
	util.writeFile(getTokenPath(), util.encrypt(JSON.stringify(value), key)).then(_ => {
		deferred.resolve(key.toString("hex"))
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}


function load(key) {
	var deferred = Q.defer()

	var tokenPath = getTokenPath()
	if(!fs.existsSync(tokenPath)) {
		setTimeout(_ => {
			deferred.reject()
		}, 10)

		return deferred.promise
	}
	
	util.readFile(tokenPath, "utf8").then(content => {
		try {
			var plainText = util.decrypt(content, Buffer.from(key, "hex"))
			deferred.resolve(JSON.parse(plainText))
		} catch (ex) {
			deferred.reject()
		}
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function getTokenPath() {
	return path.join(util.getAppDataPath(), "token")
}

module.exports.get = get
module.exports.set = set
module.exports.remove = remove

module.exports.save = save
module.exports.load = load

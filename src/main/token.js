const path = require('path')
const crypto = require('crypto')
const Q = require('q')
const fs = require('fs-extra')
const log = require('electron-log')

const util = require('./util')
const Url = require('./config/url')
const Status = require('./config/status')

var token

function get() {
	return token
}

function remove() {
	token = null
	util.removeFile(getTokenPath(), true)
}

function verify() {
	var deferred = Q.defer()

	request(Url.VERIFY, {method: "post"}).then(result => {
		if(result.status != Status.SUCCESS) {
			deferred.reject(result.message)
			return
		}

		deferred.resolve()
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function save(_token) {
	var deferred = Q.defer()

	var key = crypto.randomBytes(128)
	util.writeFile(getTokenPath(), util.encrypt(JSON.stringify(_token), key)).then(() => {
		token = _token
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
		setTimeout(() => {
			deferred.reject()
		}, 10)

		return deferred.promise
	}

	util.readFile(tokenPath, "utf8").then(content => {
		try {
			var plainText = util.decrypt(content, Buffer.from(key, "hex"))
			token = JSON.parse(plainText)

			verify().then(() => {
				deferred.resolve(token)
			}, err => {
				remove()
				err && log.error(err)
				deferred.reject(err)
			})
		} catch (ex) {
			deferred.reject()
		}
	}, err => {
		err && log.error(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function request(url, options, json) {
	if(!token) {
		return util.rejectPromise()
	}

	var appInfo = util.getAppInfo()

	var headers = options.headers || {}
	headers['Authorization'] = `Bearer ${token.api_token}`
	headers['X-Ken-App-Version'] = `${appInfo.name}-${appInfo.version}-${appInfo.branch}-${appInfo.platform}-${appInfo.appBit}`

	options.headers = headers

	return util.request(url, options, json)
}

function getTokenPath() {
	return path.join(util.getAppDataPath(), "token")
}

module.exports.get = get
module.exports.remove = remove

module.exports.verify = verify
module.exports.save = save
module.exports.load = load
module.exports.request = request

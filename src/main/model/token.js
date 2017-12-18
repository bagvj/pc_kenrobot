const path = require('path')
const crypto = require('crypto')
const Q = require('q')
const fs = require('fs-extra')
const log = require('electron-log')

const util = require('../util/util')
const Url = require('../config/url')
const Status = require('../config/status')

const Cache = require('../util/cache')

const TOKEN_KEY = "tokenKey"

var token

function getUserId() {
	return token && token.user ? token.user.id : 0
}

function getUser() {
	return token && token.user ? token.user : null
}

function remove() {
	token = null

	Cache.removeItem("token", false)
	Cache.removeItem(TOKEN_KEY, false)
	Cache.save()

	util.removeFile(path.join(util.getAppPath("appData"), "token"), true)
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
	try {
		var key = crypto.randomBytes(128)

		Cache.setItem("token", util.encrypt(JSON.stringify(_token), key), false)
		Cache.setItem(TOKEN_KEY, key.toString("hex"), false)
		Cache.save()
		token = _token

		return util.resolvePromise()
	} catch (ex) {

		return util.rejectPromise(ex)
	}
}

function load() {
	var deferred = Q.defer()

	var key = Cache.getItem(TOKEN_KEY)
	var tokenEncrypt = Cache.getItem("token")

	if(!key || !tokenEncrypt) {
		return util.rejectPromise(null, deferred)
	}

	try {
		var plainText = util.decrypt(tokenEncrypt, Buffer.from(key, "hex"))
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

module.exports.getUser = getUser
module.exports.getUserId = getUserId
module.exports.remove = remove

module.exports.save = save
module.exports.load = load
module.exports.request = request

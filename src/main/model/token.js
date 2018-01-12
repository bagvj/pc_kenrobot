const path = require('path')
const crypto = require('crypto')
const Q = require('q')
const fs = require('fs-extra')
const log = require('electron-log')
const isOnline = require('is-online')

const util = require('../util/util')
const Url = require('../config/url')
const Status = require('../config/status')

const Cache = require('../util/cache')

var cache
var token

function getUserId() {
	return token && token.user ? token.user.id : 0
}

function getUser() {
	return token && token.user ? token.user : null
}

function load() {
	var deferred = Q.defer()

	var key = getCache().getItem("key")
	var value = getCache().getItem("value")

	if(!key || !value) {
		return util.rejectPromise(null, deferred)
	}

	try {
		var plainText = util.decrypt(value, Buffer.from(key, "hex"))
		token = JSON.parse(plainText)

		verify().then(() => {
			deferred.resolve(token)
		}, err => {
			isOnline().then(() => remove()).fin(() => {
				err && log.info(err)
				deferred.reject(err)
			})
		})
	} catch (ex) {
		deferred.reject()
	}

	return deferred.promise
}

function save(value) {
	try {
		var key = crypto.randomBytes(128)

		getCache().setItem("key", key.toString("hex"), false)
		getCache().setItem("value", util.encrypt(JSON.stringify(value), key), false)
		getCache().save()

		token = value

		return util.resolvePromise()
	} catch (ex) {

		return util.rejectPromise(ex)
	}
}

function remove() {
	token = null

	getCache().removeItem("key", false)
	getCache().removeItem("value", false)
	getCache().save()

	// util.removeFile(path.join(util.getAppPath("appData"), "token"), true)
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

function verify() {
	var deferred = Q.defer()

	request(Url.VERIFY, {method: "post"}).then(result => {
		if(result.status != Status.SUCCESS) {
			deferred.reject(result.message)
			return
		}

		deferred.resolve()
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function getCache() {
	if(!cache) {
		cache = new Cache("token")
	}

	return cache
}

module.exports.getUser = getUser
module.exports.getUserId = getUserId

module.exports.load = load
module.exports.save = save
module.exports.remove = remove

module.exports.request = request

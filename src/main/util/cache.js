const path = require('path')
const crypto = require('crypto')
const Q = require('q')
const fs = require('fs-extra')
const log = require('electron-log')
const flatCache = require('flat-cache')

const util = require('./util')

var cacheMap = {}

function Cache(name) {
	if(cacheMap[name]) {
		return cacheMap[name]
	}

	this.name = name
	this._cache = flatCache.load(name, util.getAppPath("appData"))

	cacheMap[name] = this
}

Cache.prototype.getItem = function(key, defaultValue) {
	var value = this._cache.getKey(key)
	return value !== undefined ? value : defaultValue
}

Cache.prototype.setItem = function(key, value, doSave) {
	doSave = doSave !== false

	this._cache.setKey(key, value)
	doSave && this._cache.save(true)
}

Cache.prototype.removeItem = function(key, doSave) {
	doSave = doSave !== false

	this._cache.removeKey(key)
	doSave && this._cache.save(true)
}

Cache.prototype.save = function() {
	this._cache.save(true)
}

module.exports = Cache

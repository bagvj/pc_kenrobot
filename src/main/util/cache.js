import flatCache from 'flat-cache'

import util from './util'

let cacheMap = {}

function Cache(name) {
	if(cacheMap[name]) {
		return cacheMap[name]
	}

	this.name = name
	this._cache = flatCache.load(name, util.getAppPath("appData"))

	cacheMap[name] = this
}

Cache.prototype.getItem = function getItem(key, defaultValue) {
	let value = this._cache.getKey(key)
	return value !== undefined ? value : defaultValue
}

Cache.prototype.setItem = function setItem(key, value, doSave) {
	doSave = doSave !== false

	this._cache.setKey(key, value)
	doSave && this._cache.save(true)
}

Cache.prototype.removeItem = function remoteItem(key, doSave) {
	doSave = doSave !== false

	this._cache.removeKey(key)
	doSave && this._cache.save(true)
}

Cache.prototype.save = function save() {
	this._cache.save(true)
}

module.exports = Cache

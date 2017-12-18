const path = require('path')
const crypto = require('crypto')
const Q = require('q')
const fs = require('fs-extra')
const log = require('electron-log')
const flatCache = require('flat-cache')

const util = require('./util')

var cache

function getCache() {
	if(!cache) {
		cache = flatCache.load('storage', util.getAppPath("appData"))
	}

	return cache
}

function getItem(key) {
	return getCache().getKey(key)
}

function setItem(key, value, doSave) {
	doSave = doSave !== false

	var c = getCache()
	c.setKey(key, value)
	doSave && c.save()
}

function removeItem(key, doSave) {
	doSave = doSave !== false

	var c = getCache()
	c.removeKey(key)
	doSave && c.save()
}

function save() {
	getCache().save()
}

module.exports.getItem = getItem
module.exports.setItem = setItem
module.exports.removeItem = removeItem
module.exports.save = save

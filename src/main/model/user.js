const Q = require('q')
const log = require('electron-log')

const util = require('../util/util')
const Token = require('./token')
const Url = require('../config/url')
const Status = require('../config/status')

var emailReg =/^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/

function loadToken() {
	var deferred = Q.defer()

	Token.load().then(result => {
		deferred.resolve(result.user)
	}, err => {
		err && log.info(er)
		deferred.reject(err)
	})

	return deferred.promise
}

function login(username, password, autoLogin) {
	var deferred = Q.defer()

	var data = {}
	if(emailReg.test(username)) {
		data.email = username
	} else {
		data.username = username
	}
	data.password = password

	util.request(Url.LOGIN, {
		method: "POST",
		data: data,
	}).then(result => {
		if(result.status != 0) {
			deferred.resolve(result)
			return
		}

		Token.save(result.data).fin(() => {
			deferred.resolve(result)
		})
	}, err => {
		err && log.info(er)
		deferred.reject(err)
	})

	return deferred.promise
}

function logout() {
	var deferred = Q.defer()

	Token.remove()
	util.request(Url.LOGOUT).then(() => {
		deferred.resolve()
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function weixinLogin(key) {
	var deferred = Q.defer()

	util.request(Url.WEIXIN_LOGIN, {
		method: "POST",
		data: {
			auth_key : key,
		},
	}).then(result => {
		if(result.status != 0 && result.status != 1) {
			deferred.resolve(result)
			return
		}

		Token.save(result.data).fin(() => {
			deferred.resolve(result)
		})
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function weixinQrcode() {
	var deferred = Q.defer()

	util.request(Url.WEIXIN_QRCODE).then(result => {
		deferred.resolve(result)
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function register(fields) {
	var deferred = Q.defer()

	util.request(Url.REGISTER, {
		method: "POST",
		data: {
			email: fields.email,
			username: fields.username,
			password: fields.password,
			login: true,
		},
	}).then(result => {
		deferred.resolve(result)
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

function resetPassword(email) {
	var deferred = Q.defer()

	util.request(Url.FIND_PASSWORD, {
		method: "POST",
		data: {
			email: email,
		},
	}).then(result => {
		deferred.resolve(result)
	}, err => {
		err && log.info(err)
		deferred.reject(err)
	})

	return deferred.promise
}

module.exports.loadToken = loadToken
module.exports.login = login
module.exports.logout = logout
module.exports.weixinLogin = weixinLogin
module.exports.weixinQrcode = weixinQrcode
module.exports.register = register
module.exports.resetPassword = resetPassword

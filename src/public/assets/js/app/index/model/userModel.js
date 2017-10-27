define(['vendor/jquery', 'app/common/config/config', 'app/common/util/emitor'], function($1, config, emitor) {
	var userInfo;
	var emailReg =/^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;

	function getUserId() {
		return userInfo ? userInfo.user_id : 0;
	}

	function getUserInfo() {
		return userInfo;
	}

	function getUserName() {
		return userInfo ? userInfo.base_name : "";
	}

	function loadToken() {
		var promise = $.Deferred();

		var key = localStorage.userKey;
		if(!key) {
			setTimeout(() => {
				promise.reject()
			}, 10);

			return promise;
		}

		kenrobot.postMessage("app:loadToken", key).then(token => {
			userInfo = token;
			kenrobot.postMessage("app:setToken", userInfo);
			promise.resolve();
		}, err => {
			promise.reject();
		});

		return promise;
	}

	function saveToken() {
		kenrobot.postMessage("app:saveToken", userInfo).then(key => {
			localStorage.userKey = key;
		})
	}

	function login(username, password, autoLogin) {
		var promise = $.Deferred();

		var data = {};
		if(emailReg.test(username)) {
			data.email = username;
		} else {
			data.username = username;
		}
		data.password = password;

		kenrobot.postMessage("app:request", config.url.login, {
			method: "POST",
			data: data,
		}).then(result => {
			if(result.status == 0) {
				userInfo = result.data;
				autoLogin && saveToken();
				kenrobot.postMessage("app:setToken", userInfo);
			}
			promise.resolve(result);
		}, err => {
			promise.reject(err);
		});

		return promise;
	}

	function logout() {
		var promise = $.Deferred();

		userInfo = null;
		localStorage.removeItem("userKey");
		kenrobot.postMessage("app:removeToken");
		kenrobot.postMessage("app:request", config.url.logout).then(() => {
			promise.resolve();
		}, err => {
			promise.reject(err);
		});

		return promise;
	}

	function weixinLogin(key, autoLogin) {
		var promise = $.Deferred();
		kenrobot.postMessage("app:request", config.url.login, {
			method: "POST",
			data: {
				source: "weixin",
				login_key : key,
			},
		}).then(function(result) {
			if(result.status == 0 || result.status == 1) {
				userInfo = result.data;
				autoLogin && saveToken();
				kenrobot.postMessage("app:setToken", userInfo);
			}
			promise.resolve(result);
		});

		return promise;
	}

	function weixinQrcode() {
		var promise = $.Deferred();

		kenrobot.postMessage("app:request", config.url.loginQrcode).then(result => {
			promise.resolve(result);
		}, err => {
			promise.reject(err);
		});

		return promise;
	}

	function register(fields) {
		var promise = $.Deferred();

		kenrobot.postMessage("app:request", config.url.register, {
			method: "POST",
			data: {
				email: fields.email,
				username: fields.username,
				password: fields.password,
				login: true,
			},
		}).then(function(result) {
			if(result.status == 0) {
				userInfo = result.data;
			}
			promise.resolve(result);
		});

		return promise;
	}

	function resetPassword(email) {
		var promise = $.Deferred();

		kenrobot.postMessage("app:request", config.url.findPassword, {
			method: "POST",
			data: {
				email: email,
			},
		}).then(result => {
			promise.resolve(result);
		}, err => {
			promise.reject(err);
		});

		return promise;
	}

	return {
		getUserId: getUserId,
		getUserInfo: getUserInfo,
		getUserName: getUserName,

		loadToken: loadToken,

		login: login,
		logout: logout,
		weixinLogin: weixinLogin,
		weixinQrcode: weixinQrcode,
		register: register,
		resetPassword: resetPassword,
	};
});

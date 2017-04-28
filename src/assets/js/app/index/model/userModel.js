define(['vendor/jquery', 'app/common/config/config', 'app/common/util/emitor'], function($1, config, emitor) {
	var userInfo;

	function getUserId() {
		return userInfo ? userInfo.uid : 0;
	}

	function getUserInfo() {
		return userInfo;
	}

	function getUserName() {
		return userInfo ? userInfo.username : "";
	}

	function loadToken() {
		var promise = $.Deferred();

		var key = localStorage.userKey;
		if(!key) {
			setTimeout(_ => {
				promise.reject()
			}, 10);

			return promise;
		}

		kenrobot.postMessage("app:getToken", key).then(token => {
			userInfo = token;
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

		kenrobot.postMessage("app:request", config.url.login, {
			method: "POST",
			data: {
				username: username,
				password: password,
			},
		}).then(result => {
			if(result.status == 0) {
				userInfo = result.data;
				autoLogin && saveToken();
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
		kenrobot.postMessage("app:request", config.url.logout).then(_ => {
			promise.resolve();
		}, err => {
			promise.reject(err);
		});

		return promise;
	}

	function weixinLogin(key) {
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
			}
			promise.resolve(result);
		});

		return promise;
	}

	function weixinQrcode() {
		var promise = $.Deferred();

		kenrobot.postMessage("app:request", config.url.loginQrcode).then(_ => {
			promise.resolve();
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
	};
});
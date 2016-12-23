define(['vendor/jquery', 'vendor/jsencrypt', 'app/config/config', 'app/util/net', 'app/util/emitor'], function($1, JSEncrypt, config, net, emitor) {
	var userInfo;

	function getUserId() {
		return userInfo ? userInfo.uid : 0;
	}

	function getUserInfo() {
		return userInfo;
	}

	function getUserName() {
		return userInfo ? userInfo.name : "";
	}

	function attach() {
		var promise = $.Deferred();
		if(config.target != "pc") {
			return promise.resolve();
		}

		net.request({
			type: 'POST',
			url: '/api/auth/attach',
			dataType: 'json',
			data: {
				id: 0
			},
		}).done(function(result) {
			promise.resolve();
		});

		return promise;
	}

	function authCheck(showLogin) {
		var promise = $.Deferred();
		var type = userInfo && "check" || "all";

		if(config.target == "web") {
			net.request({
				type: 'POST',
				url: '/api/auth/check',
				data: {
					id: 0,
					type: type,
				},
				dataType: 'json',
			}).done(function(result) {
				if(result.status == 0) {
					if(type == "all") {
						userInfo = result.data;
						promise.resolve();
						emitor.trigger("user", "login");
					} else {
						emitor.resolve();
					}
				} else {
					userInfo = null;
					promise.reject();
					showLogin && emitor.trigger("login", "show");
				}
			});
		} else {
			return promise.resolve();
		}
		
		return promise;
	}

	function login(username, password, remember) {
		var promise = $.Deferred();

		var encrypt = new JSEncrypt.JSEncrypt();
		encrypt.setPublicKey(config.encrypt.publicKey);

		net.request({
			type: 'POST',
			url: '/api/auth/login',
			dataType: 'json',
			data: {
				username: username,
				password: encrypt.encrypt(password),
				remember: remember,
			},
		}).done(function(result) {
			if(result.status == 0 || result.status == 1) {
				userInfo = result.data;
			}
			promise.resolve(result);
		});

		return promise;
	}

	function logout() {
		return net.request({
			type: 'POST',
			url: '/api/auth/logout',
			dataType: 'json',
			data: {
				id: 0
			}
		});
	}

	function weixinLogin(key) {
		var promise = $.Deferred();
		net.request({
			type: 'POST',
			url: '/api/auth/weixin/login',
			data: {
				login_key : key,
			},
			dataType: 'json',
		}).done(function(result) {
			if(result.status == 0 || result.status == 1) {
				userInfo = result.data;
			}
			promise.resolve(result);
		});

		return promise;
	}

	function weixinQrcode(refresh) {
		return net.request({
			type: 'POST',
			url: '/api/auth/weixin/qrcode',
			data: {
				refresh: refresh || false,
			},
			dataType: 'json',
		});
	}

	return {
		getUserId: getUserId,
		getUserInfo: getUserInfo,
		getUserName: getUserName,
		attach: attach,
		authCheck: authCheck,
		login: login,
		logout: logout,
		weixinLogin: weixinLogin,
		weixinQrcode: weixinQrcode,
	};
});
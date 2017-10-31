define(function() {
	var configs = {
		//基本配置
		url: {
			kenrobot: "http://www.kenrobot.com",
			arduino: "http://www.arduino.cn",
			uper: "http://www.uper.cc",
			arduinoDriver: "http://www.kenrobot.com/download/arduino-driver-x{BIT}.7z",
			support: "http://www.arduino.cn/forum-101-1.html",
			about: "http://www.kenrobot.com/index.php?app=square&mod=Index&act=help",
			checkUpdate: "http://www.kenrobot.com/?app=api&mod=Download&act=checkupdate",
			packages: "http://www.kenrobot.com/packages/packages.json",
			login: "http://userver.kenrobot.com/sso/login",
			logout: "http://userver.kenrobot.com/sso/logout",
			loginQrcode: "http://userver.kenrobot.com/api/wechat/scanlogin/token",
			register: "http://userver.kenrobot.com/api/user/register",
			findPassword: "http://userver.kenrobot.com/password/email",
			projectSync: "http://userver.kenrobot.com/api/project/sync"
		},
		arduinoDriver: {
			checksum: {
				"64": "sha256:bc5847718612e8c9bd2d75a5b4dedebe2684293d89bdfb864c7bd7c3b74b505d",
				"86": "sha256:aa3e6a11c8f27a72f0d2ab6cca5a4b1ed68151ef18d971f49c2f71875d3bf78f",
			},
		},
	}

	return configs;
});

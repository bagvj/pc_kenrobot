define(function() {
	var configs = {
		//基本配置
		base: {
			host: "http://edu0.kenrobot.com",
			title: "啃萝卜智能硬件平台",
			//加密
			encrypt: {
				//公钥
				publicKey: "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC7Jat1/19NDxOObrFpW8USTia6\nuHt34Sac1Arm6F2QUzsdUEUmvGyLIOIGcdb+F6pTdx4ftY+wZi7Aomp4k3vNqXmX\nT0mE0vpQlCmsPUcMHXuUi93XTGPxLXIv9NXxCJZXSYI0JeyuhT9/ithrYlbMlyNc\nwKB/BwSpp+Py2MTT2wIDAQAB\n-----END PUBLIC KEY-----"
			},
			url: {
				kenrobot: "http://www.kenrobot.com",
				arduino: "http://www.arduino.cn",
				arduinoDriver: "http://ide.kenrobot.com/download/arduino-driver-x{BIT}.zip",
			}
		},
		//调试模式
		debug: {
			debug: true,
		}
	}

	function extend(target) {
		var sources = [].slice.call(arguments, 1);
		sources.forEach(function(source) {
			for (var prop in source) {
				target[prop] = source[prop];
			}
		});
		return target;
	}

	return extend({}, configs.base, configs.debug.debug ? configs.debug : {});
});
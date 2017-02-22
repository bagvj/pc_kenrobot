define(function() {
	var configs = {
		//基本配置
		base: {
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
define(['app/common/util/util', 'app/common/util/emitor', '../config/menu'], function(util, emitor, menu) {

	var portId;

	function init() {
		emitor.on('app', 'start', onAppStart);

		kenrobot.on('app-menu', 'do-action', onMenuAction)
			.on("serial", "open", onSerialOpen)
			.on("serial", "sendPackage", onSerialSendPackage)
			.on("serialport", "data", onSerialData)
			.on("serialport", "close", onSerialClose)
			.on("serialport", "error", onSerialClose);
	}

	function onAppStart() {
		kenrobot.trigger("app-menu", "load", menu, "scratch2");

		kenrobot.postMessage("app:loadSetting").then(setting => {
			var specSetting = setting[kenrobot.viewType];
			for(var name in specSetting) {
				emitor.trigger("setting", "change", name, specSetting[name]);
			}
		});
	}

	function onMenuAction(action) {
		kenrobot.trigger("app", "command", action);
	}

	function onSerialOpen() {
		// console.log("onSerialOpen");
		kenrobot.postMessage("app:listSerialPort").then(ports => {
			if(ports.length == 1) {
				openSerial(ports[0].comName)
			} else {
				kenrobot.trigger("port", "show", {
					ports: ports,
					callback: port => port && openSerial(port.comName),
				});
			}
		}, _ => {
			util.message({
				text: "找不到串口",
				type: "warning",
			});
		});
	}

	function openSerial(comName) {
		kenrobot.postMessage("app:openSerialPort", comName, {
			baudRate: 115200,
			parser: [13], //\r\n})
		}).then(id => {
			portId = id;
			kenrobot.trigger("serial", "ready", portId);
		}, _ => {
			util.message({
				text: "打开串口失败",
				type: "error",
			});
		});
	}

	function onSerialData(portId, data) {
		portId && kenrobot.trigger("serial", "data", portId, data);
	}

	function onSerialClose(portId, err) {
		portId && kenrobot.trigger("serial", "close", portId);
		portId = null;
	}

	function onSerialSendPackage(bytes) {
		// console.log(bytes);
		portId && kenrobot.postMessage("app:writeSerialPort", portId, bytes);
	}

	return {
		init: init,
	};
});
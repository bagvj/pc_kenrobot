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

	function onMenuAction(action, extra) {
		if(action == "upload-firmware") {
			uploadFirmware(extra.name, extra.options);
		} else {
			kenrobot.trigger("app", "command", action, extra);
		}
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

	function uploadFirmware(name, options) {
		util.message("开始上传");
		kenrobot.postMessage("app:uploadFirmware", name, options).then(_ => {
			util.message("上传成功");
		}, err => {
			if(err.status == "SELECT_PORT") {
				kenrobot.trigger("port", "show", {
					ports: err.ports,
					callback: port => {
						if(!port) {
							util.message("上传取消");
							return
						}

						kenrobot.postMessage("app:uploadFirmware2", extra.name, port.comName, extra.options).then(_ => {
							util.message("上传成功");
						}, _ => {
							util.message({
								text: "上传失败",
								type: "error",
							});
						});
					}
				});
			} else if(err.status == "NOT_FOUND_PORT") {
				util.message({
					text: "找不到串口",
					type: "error",
				});
			} else {
				util.message({
					text: "上传失败",
					type: "error",
				});
			}
		});
	}

	return {
		init: init,
	};
});
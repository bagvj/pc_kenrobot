define(['vendor/jquery', 'vendor/pace', 'app/common/util/util', 'app/common/util/emitor', 'app/common/config/config', '../config/nav', '../config/menu'], function($1, pace, util, emitor, config, nav, menu) {
	var mainWrap;
	var iframe;

	function init() {
		iframe = window.frames["content-frame"];
		emitor.on('app', 'check-update', onCheckUpdate).on('app', 'switch', onSwitch).on("app", "start", onAppStart);

		kenrobot.listenMessage("app:fullscreenChange", onFullscreenChange)
			.listenMessage("app:onDownloadSuccess", onDownloadSuccess)
			.listenMessage("app:onSerialPortData", onSerialPortData)
			.listenMessage("app:onSerialPortError", onSerialPortError)
			.listenMessage("app:onSerialPortClose", onSerialPortClose)
			.on('build', 'error', onBuildError, {canReset: false})
			.on('app-menu', 'do-action', onMenuAction, {canReset: false});

		pace.start({
			elements: {
				selectors: ["#content-frame"],
			},
			ajax: false,
			document: false,
			restartOnPushState: false,
			restartOnRequestAfter: false,
		});
		pace.stop();
	}

	function onAppStart() {
		kenrobot.trigger("app-menu", "load", menu, "index");

		kenrobot.postMessage("app:unpackPackages").then(_ => {

		}, err => {
			util.message({
				text: "解压出错",
				type: "error"
			});
		}, progressData => {
			kenrobot.trigger("unpack", "show", progressData);
		}).fin(_ => {
			kenrobot.trigger("unpack", "hide");

			setTimeout(_ => {
				onSwitch("ide");

				//app启动后自动检查更新，并且如果检查失败或者没有更新，不提示
				setTimeout(function() {
					onCheckUpdate(false);
				}, 3000);
			}, 1000);
		});
	}

	function onMenuAction(action, extra) {
		switch(action) {
			case "fullscreen":
				kenrobot.postMessage("app:fullscreen");
				break;
			case "language":
				util.message("敬请期待");
				break;
			case "theme":
				util.message("敬请期待");
				break;
			case "setting":
				util.message("敬请期待");
				break;
			case "switch":
				onSwitch(extra.type);
				break;
			case "download-arduino-driver":
				kenrobot.postMessage("app:getAppInfo").then(function(info) {
					if (info.platform != "win") {
						util.message("您的系统是" + info.platform + ", 不需要安装驱动");
						return;
					}
					kenrobot.postMessage("app:download", config.url.arduinoDriver.replace("{BIT}", info.bit == 64 ? "64" : "86"), "driver-download");
				});
				break;
			case "check-update":
				onCheckUpdate();
				break;
			case "visit-kenrobot":
				kenrobot.postMessage("app:openUrl", config.url.kenrobot);
				break;
			case "visit-arduino":
				kenrobot.postMessage("app:openUrl", config.url.arduino);
				break;
			case "suggestion":
				kenrobot.postMessage("app:openUrl", config.url.support);
				break;
			case "about-kenrobot":
				kenrobot.postMessage("app:getAppInfo").then(function(info) {
					kenrobot.trigger("about", "show", {version: info.version, url: config.url.kenrobot});
				});
				break;
		}
	}

	function onCheckUpdate(manual) {
		manual = manual !== false;

		kenrobot.postMessage("app:getAppInfo").then(function(info) {
			var data = {
				version: info.version,
				platform: info.platform,
				arch: info.arch,
				features: info.features,
				ext: info.ext,
			};

			$.ajax({
				type: "GET",
				url: config.url.checkUpdate + "&" + $.param(data),
				dataType: "json",
			}).then(function(result) {
				if(result.status == 0) {
					util.confirm({
						title: "检查更新",
						text: "发现新版本" + result.data.version + "，是否下载？",
						onConfirm: function() {
							kenrobot.postMessage("app:download", result.data.download_url, "update-download").then(function(path) {
								util.message("开始下载");
							});
						}
					});
				} else {
					manual && util.message("已经是最新版本了");
				}
			}, function(err) {
				manual && util.message("检查更新失败");
			});
		});
	}

	function onSwitch(type) {
		kenrobot.reset();
		
		kenrobot.trigger("app", "will-leave");
		var url = nav[type];
		iframe.src = url;
		pace.restart();
	}

	function onFullscreenChange(fullscreen) {
		emitor.trigger("app", "fullscreenChange", fullscreen);
	}

	function onDownloadSuccess(path, action) {		
		switch(action) {
			case "driver-download":
				util.confirm({
					text: "驱动下载成功，是否安装?",
					onConfirm: function() {
						kenrobot.postMessage("app:installDriver", path).then(function() {
							util.message("驱动安装成功");
						}, function(err) {
							util.message({
								text: "驱动安装失败",
								type: "error"
							});
						});
					}
				});
				break;
			case "update-download":
				kenrobot.postMessage("app:getAppInfo").then(function(info) {
					if(info.platform == "win") {
						util.confirm({
							text: "下载成功，是否安装新版本?",
							onConfirm: function() {
								kenrobot.postMessage("app:execFile", path).then(function() {
									util.message("安装成功");
								}, function(err) {
									util.message({
										text: "安装失败",
										type: "error"
									});
								});
							}
						});
					} else {
						util.confirm({
							text: "下载成功，是否打开文件所在位置?",
							onConfirm: function() {
								kenrobot.postMessage("app:showItemInFolder", path);
							}
						});
					}
				});
				break;
		}
	}

	function onSerialPortData(portId, data) {
		kenrobot.trigger("serialport", "data", portId, data);
	}

	function onSerialPortError(portId, err) {
		kenrobot.trigger("serialport", "error", portId, err);
	}

	function onSerialPortClose(portId) {
		kenrobot.trigger("serialport", "close", portId);
	}

	function onBuildError(message, err) {
		util.confirm({
			text: message,
			cancelLabel: "确定",
			confirmLabel: "查看日志",
			onConfirm: function() {
				kenrobot.delayTrigger(500, "error", "show", {output: [message, err]});
			}
		});
	}

	return {
		init: init,
	};
});
define(['vendor/jquery', 'vendor/pace', 'app/common/util/util', 'app/common/util/emitor', 'app/common/config/config', '../config/nav'], function($1, pace, util, emitor, config, nav) {
	var mainWrap;
	var iframe;

	function init() {
		iframe = window.frames["content-frame"];
		emitor.on('app', 'check-update', onCheckUpdate).on('app', 'switch', onSwitch).on("app", "start", onAppStart);

		kenrobot.listenMessage("app:onDownloadSuccess", onDownloadSuccess)
			.listenMessage("app:onSerialPortData", onSerialPortData)
			.listenMessage("app:onSerialPortError", onSerialPortError)
			.listenMessage("app:onSerialPortClose", onSerialPortClose);

		pace.start({
			elements: {
				selectors: ["#content-frame"],
			},
			ajax: false,
			document: false,
			restartOnPushState: false,
			restartOnRequestAfter: false,
		});
	}

	function onAppStart() {
		onSwitch("ide");

		//app启动后自动检查更新，并且如果检查失败或者没有更新，不提示
		setTimeout(function() {
			onCheckUpdate(false);
		}, 3000);
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

		emitor.trigger("app", "after-switch", type);
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

	return {
		init: init,
	};
});
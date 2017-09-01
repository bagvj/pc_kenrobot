define(['vendor/jquery', 'vendor/pace', 'vendor/mousetrap', 'app/common/util/util', 'app/common/util/emitor', 'app/common/config/config', '../config/menu', '../model/userModel'], function($1, pace, Mousetrap, util, emitor, config, menu, userModel) {

	var iframe;
	var mousetrap;

	var baseUrl;
	var inSync;

	function init() {
		kenrobot.getUserInfo = userModel.getUserInfo;

		$(window).on('contextmenu', onContextMenu).on('click', onWindowClick).on('resize', onWindowResize);

		iframe = document.getElementById("content-frame");

		emitor.on('app', 'check-update', onCheckUpdate)
			.on('app', 'switch', onSwitch)
			.on("app", "start", onAppStart)
			.on("user", "update", onUserUpdate);	

		kenrobot.listenMessage("app:onFullscreenChange", onFullscreenChange)
			.listenMessage("app:onSerialPortData", onSerialPortData)
			.listenMessage("app:onSerialPortError", onSerialPortError)
			.listenMessage("app:onSerialPortClose", onSerialPortClose)
			.on("util", "message", onUtilMessage, {canReset: false})
			.on("shortcut", "register", onShortcutRegister, {canReset: false})
			.on('build', 'error', onBuildError, {canReset: false})
			.on('app-menu', 'do-action', onMenuAction, {canReset: false})
			.on("user", "logout", onUserLogout, {canReset: false})
			.on("project", "sync", onProjectSync, {canReset: false});

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

		kenrobot.postMessage("app:projectSyncUrl", config.url.projectSync);
		
		inSync = true;
		userModel.loadToken().always(_ => {
			emitor.trigger("user", "update");
		});

		kenrobot.postMessage("app:getBaseUrl").then(url => {
			baseUrl = url;

			kenrobot.postMessage("app:unzipPackages").then(_ => {

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
					onSwitch("edu");

					//app启动后自动检查更新，并且如果检查失败或者没有更新，不提示
					setTimeout(_ => {
						onCheckUpdate(false);

						inSync = false;
						//项目同步
						onProjectSync();
					}, 3000);
				}, 400);
			});
		});
	}

	function onUtilMessage() {
		util.message.apply(this, arguments);
	}

	function onShortcutRegister(shortcuts) {
		mousetrap && shortcuts.forEach(function(shortcut){
			mousetrap.bind(shortcut.key, function() {
				shortcut.callback && shortcut.callback();

				return false;
			});
		});
	}

	function onUserLogout() {
		userModel.logout().then(_ => {
			util.message("退出成功");
		}).always(_ => {
			emitor.trigger("user", "update");
		});
	}

	function onUserUpdate() {
		kenrobot.getUserInfo() && setTimeout(_ => onProjectSync(), 2000);
	}

	function onProjectSync() {
		if(kenrobot.viewType != "scratch2" && kenrobot.viewType != "scratch3") {
			return;
		}

		if(inSync || !kenrobot.getUserInfo()) {
			return;
		}

		inSync = true;
		util.message("项目开始同步");
		kenrobot.postMessage("app:projectSync").then(_ => {
			inSync = false;
			util.message("项目同步成功");
		}, err => {
			inSync = false;
			util.message({
				text: "项目同步失败",
				type: "error",
			});
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
				kenrobot.trigger("setting", "show");
				break;
			case "switch":
				onSwitch(extra.type);
				break;
			case "download-arduino-driver":
				var info = kenrobot.appInfo;
				if (info.platform != "win") {
					util.message("您的系统是" + info.platform + ", 不需要安装驱动");
					return;
				}
				var bit = info.bit == 64 ? "64" : "86";
				var checksum = config.arduinoDriver.checksum[bit]
				kenrobot.postMessage("app:download", config.url.arduinoDriver.replace("{BIT}", bit), {checksum: checksum}).then(result => {
					util.confirm({
						text: "驱动下载成功，是否安装?",
						onConfirm: () => {
							kenrobot.postMessage("app:installDriver", result.path).then(_ => {
								util.message("驱动安装成功");
							}, err => {
								util.message({
									text: "驱动安装失败",
									type: "error"
								});
							});
						}
					});
				}, err => {
					util.message("驱动下载失败");
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
				var info = kenrobot.appInfo;
				kenrobot.trigger("about", "show", {
					version: info.version,
					url: config.url.kenrobot,
					date: info.date,
					platform: info.platform,
					bit: info.bit,
				});
				break;
			case "show-board-dialog":
				kenrobot.trigger("board", "show");
				break;
		}
	}

	function onCheckUpdate(manual) {
		manual = manual !== false;

		kenrobot.postMessage("app:checkUpdate", config.url.checkUpdate).then(result => {
			if(result.status != 0) {
				manual && util.message("已经是最新版本了");
				return;
			}

			kenrobot.trigger("update", "show", result.data);
		}, err => {
			manual && util.message("检查更新失败");
		});
	}

	function onSwitch(type) {
		kenrobot.reset();
		
		kenrobot.trigger("app", "will-leave");
		iframe.src = `${baseUrl}/${type}`;
		iframe.addEventListener("load", _ => {
			mousetrap = Mousetrap(iframe.contentDocument);
		}, false);
		pace.restart();

		kenrobot.viewType = type;
	}

	function onFullscreenChange(fullscreen) {
		emitor.trigger("app", "fullscreenChange", fullscreen);
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

	function onContextMenu(e) {
		e.preventDefault();

		hideMenu();

		emitor.trigger("app", "contextMenu", e);

		return false;
	}

	function onWindowClick(e) {
		hideMenu();
	}

	function onWindowResize(e) {
		hideMenu();
		emitor.trigger("app", "resize", e);
	}

	function hideMenu() {
		$('.x-select, .x-context-menu').removeClass("active");
	}

	return {
		init: init,
	};
});
define(['vendor/jquery', 'vendor/pace', 'vendor/mousetrap', 'app/common/util/util', 'app/common/util/emitor', '../config/menu'], function($1, pace, Mousetrap, util, emitor, menu) {

	var iframe;
	var mousetrap;

	var inSync;

	function init() {
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

		inSync = true;
		kenrobot.postMessage("app:loadToken").then(result => {
			kenrobot.user = result
		}).fin(() => {
			emitor.trigger("user", "update");
		});

		kenrobot.postMessage("app:unzipPackages").then(() => true, err => {
			util.message({
				text: "解压出错",
				type: "error"
			});
		}, progressData => {
			kenrobot.trigger("unpack", "show", progressData);
		}).fin(() => {
			kenrobot.trigger("unpack", "hide");

			setTimeout(() => {
				onSwitch("default");

				//app启动后自动检查更新，并且如果检查失败或者没有更新，不提示
				setTimeout(() => {
					onCheckUpdate(false).then(status => {
						// status > 0 && onCheckPackageLibraryUpdate(false);
					});

					inSync = false;
					//项目同步
					onProjectSync();
				}, 3000);
			}, 400);
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
		kenrobot.postMessage("app:logout").then(() => {
			util.message("退出成功");
		}).fin(() => {
			kenrobot.user = null;
			emitor.trigger("user", "update");
		});
	}

	function onUserUpdate() {
		kenrobot.user && setTimeout(() => onProjectSync(), 2000);
	}

	function onProjectSync() {
		if(inSync || !kenrobot.user) {
			return;
		}

		inSync = true;
		// util.message("项目开始同步");
		kenrobot.postMessage("app:projectSync").then(() => {
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
			case "repair-arduino-driver":
				var info = kenrobot.appInfo;
				if (info.platform != "win") {
					util.message("您的系统是" + info.platform + ", 不需要安装驱动");
					return;
				}
				kenrobot.postMessage("app:installDriver").then(() => {
					util.message("修复成功");
				}, () => {
					kenrobot.postMessage("app:repairDriver").then(() => {
						kenrobot.postMessage("app:installDriver").then(() => {
							util.message("修复成功");
						}, () => {
							util.message("修复失败");
						});
					}, () => {
						util.message("修复失败");
					});
				});
				break;
			case "check-update":
				onCheckUpdate();
				break;
			case "check-package-library-update":
				onCheckPackageLibraryUpdate();
				break;
			case "visit-uper":
				kenrobot.postMessage("app:openUrl", "http://www.uper.cc");
				break;
			case "visit-arduino":
				kenrobot.postMessage("app:openUrl", "http://www.arduino.cn");
				break;
			case "suggestion":
				kenrobot.postMessage("app:openUrl", "http://www.arduino.cn/forum-101-1.html");
				break;
			case "about-software":
				var info = kenrobot.appInfo;
				kenrobot.trigger("about", "show", {
					version: info.version,
					url: "https://www.kenrobot.com",
					date: info.date,
					platform: info.platform,
					appBit: info.appBit,
					buildNumber: info.buildNumber,
				});
				break;
			case "show-board-dialog":
				kenrobot.trigger("board", "show");
				break;
			case "show-library-dialog":
				kenrobot.trigger("library", "show");
				break;
		}
	}

	function onCheckUpdate(manual) {
		var promise = $.Deferred();

		manual = manual !== false;

		kenrobot.postMessage("app:checkUpdate").then(result => {
			if(result.status != 0) {
				manual && util.message("已经是最新版本了");
				promise.resolve(1);
				return;
			}

			kenrobot.trigger("update", "show", result.data);
			promise.resolve(0);
		}, err => {
			manual && util.message("检查更新失败");
			promise.resolve(-1)
		});

		return promise
	}


	function onCheckPackageLibraryUpdate(manual) {
		manual = manual !== false;

		kenrobot.postMessage("app:checkPackageLibraryUpdate").then(result => {
			if(result.status == 0) {
				manual && util.message("开发板和库已经是最新版本了");
				return;
			}

			if(result.status == 1) {
				util.confirm({
					text: "开发板有更新，是否去更新？",
					onConfirm: () => kenrobot.trigger("board", "show"),
				})
				return;
			}
		}, err => {
			manual && util.message("开发板和库检查更新失败");
		});
	}

	function onSwitch(name) {
		kenrobot.reset();

		kenrobot.trigger("app", "will-leave");
		iframe.src = `./${name}/index.html`;
		iframe.addEventListener("load", () => {
			mousetrap = Mousetrap(iframe.contentDocument);
		}, false);
		pace.restart();
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

define(['vendor/jquery', 'app/util/emitor', 'app/util/util', 'app/config/config'], function($1, emitor, util, config) {
	var region;
	var appMenu;

	function init() {
		region = $('.titlebar-region').on('click', '.window-btns li', onWindowBtnClick);
		appMenu = $('.app-menu', region).on('click', "> ul > li > .placeholder", activeAppMenu).on('mouseleave', inactiveAppMenu).on('click', 'li', onAppMenuClick);
		
		emitor.on('download', 'success', onDownloadSuccess);
	}

	function activeAppMenu(e) {
		appMenu.toggleClass("active");
		return false;
	}

	function inactiveAppMenu(e) {
		appMenu.removeClass("active");
	}

	function onDownloadSuccess(path, action) {
		if(action != "driver-download") {
			return;
		}

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
	}

	function onAppMenuClick(e) {
		var li = $(this);
		var action = li.data("action");
		if (!action) {
			inactiveAppMenu();
			return;
		}

		switch (action) {
			case "new-project":
			case "open-project":
			case "save-project":
			case "save-as-project":
			case "toggle-comment":
			case "copy":
				emitor.trigger("app", "shortcut", action);
				break;
			case "open-demo":
				util.message("敬请期待");
				break;
			case "fullscreen":
				kenrobot.postMessage("app:fullscreen").done(function(fullscreen) {
					li.find('.text').text(fullscreen ? "退出全屏" : "全屏")
				});
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
			case "download-arduino-driver":
				kenrobot.postMessage("app:getOSInfo").then(function(info) {
					if (info.platform != "win") {
						util.message("您的系统是" + info.platform + ", 不需要安装驱动");
						return
					}

					kenrobot.postMessage("app:download", config.url.arduinoDriver.replace("{BIT}", info.bit), "driver-download");
				})
				break;
			case "check-update":
				kenrobot.postMessage("app:checkUpdate");
				util.message("敬请期待");
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
				kenrobot.postMessage("app:openUrl", config.url.about);
				break;
		}
		inactiveAppMenu();
	}

	function onWindowBtnClick(e) {
		var action = $(this).data("action");
		switch (action) {
			case "min":
				kenrobot.postMessage("app:min");
				break;
			case "max":
				kenrobot.postMessage("app:max");
				break;
			case "close":
				kenrobot.postMessage("app:quit");
				break;
		}
	}

	return {
		init: init,
	}
});
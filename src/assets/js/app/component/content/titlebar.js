define(['vendor/jquery', 'app/util/emitor', 'app/util/util', 'app/config/config'], function($1, emitor, util, config) {
	var region;
	var appMenu;

	function init() {
		region = $('.titlebar-region');

		appMenu = $('.app-menu', region).on('click', "> ul > li > .placeholder", activeAppMenu).on('mouseleave', inactiveAppMenu).on('click', 'li', onAppMenuClick);

		$('.window-btns li', region).on('click', onWindowBtnClick);
	}

	function activeAppMenu(e) {
		appMenu.toggleClass("active");
		return false;
	}

	function inactiveAppMenu(e) {
		appMenu.removeClass("active");
	}

	function onAppMenuClick(e) {
		var li = $(this);
		var action = li.data("action");
		if(!action) {
			inactiveAppMenu();
			return;
		}

		switch(action) {
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
				var bit = /WOW64|Win64/.test(navigator.userAgent) ? 64 : 32;
				kenrobot.postMessage("app:openUrl", config.url.arduinoDriver.replace("{BIT}", bit));
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
				util.message("感谢您的意见和反馈", "感谢", "success");
				break;
			case "about-kenrobot":
				util.message("关于啃萝卜");
				break;
		}
		inactiveAppMenu();
	}

	function onWindowBtnClick(e) {
		var action = $(this).data("action");
		switch(action) {
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
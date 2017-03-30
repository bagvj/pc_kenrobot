define(['vendor/jquery', 'app/common/util/emitor', 'app/common/util/util', 'app/common/config/config'], function($1, emitor, util, config) {
	var region;
	var appMenu;

	function init() {
		region = $('.titlebar-region').on('click', '.window-btns li', onWindowBtnClick);
		appMenu = $('.app-menu', region).on('click', "> ul > li > .placeholder", activeAppMenu).on('mouseleave', inactiveAppMenu).on('click', 'li', onAppMenuClick);
		
		emitor.on('app', 'start', onAppStart).on('app', 'after-switch', onAppAfterSwitch);
	}

	function onAppStart() {
		loadExamples();
	}

	function onAppAfterSwitch(type) {
		var li = appMenu.find(".switches > li").filter('[data-type="' + type + '"]');
		util.toggleActive(li);
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
				kenrobot.trigger("app", "shortcut", action);
				break;
			case "open-example":
				var category = li.data("category");
				var name = li.data("name");
				kenrobot.postMessage("app:openExample", category, name).then(function(projectInfo) {
					kenrobot.trigger("project", "open", projectInfo);
				}, function() {
					util.message("打开失败");
				});
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
			case "switch":
				util.toggleActive(li);
				emitor.trigger("app", "switch", li.data("type"));
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
				emitor.trigger("app", "check-update");
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
				})
				break;
		}
		inactiveAppMenu();
	}

	function loadExamples() {
		kenrobot.postMessage("app:loadExamples").then(function(examples) {
			var exampleBuiltIn = appMenu.find(".example-built-in > ul").empty();
			examples.forEach(function(ca) {
				var li = $('<li>').append($('<div>').addClass("placeholder").addClass("arrow").text(ca.category));
				var ul = $('<ul>').appendTo(li);
				ca.list.forEach(function(example) {
					$('<li>').data('action', 'open-example').data("category", ca.category).data("name", example.name).append($('<span>').addClass("text").text(example.name)).appendTo(ul);
				});
				li.appendTo(exampleBuiltIn);
			});

			appMenu.off('click').off('mouseleave').on('click', "> ul > li > .placeholder", activeAppMenu).on('mouseleave', inactiveAppMenu).on('click', 'li', onAppMenuClick);
		}, function(err) {
			util.message({
				text: "加载案例失败",
				type: "error",
			});
		});
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
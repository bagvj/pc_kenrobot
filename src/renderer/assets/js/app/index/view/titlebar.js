define(['vendor/jquery', 'app/common/util/emitor', 'app/common/util/util'], function($1, emitor, util) {
	var region;
	var appMenu;

	function init() {
		region = $('.titlebar-region')
			.on('click', '.login-region .placeholder', onLoginClick)
			.on('click', '.login-region .login-menu > ul > li', onLoginMenuClick)
			.on('click', '.window-btns li', onWindowBtnClick);
		appMenu = $('.app-menu', region);

		emitor.on("app", "fullscreenChange", onFullscreenChange)
			.on("user", "update", onUserUpdate)
			.on("update", "download", onUpdateDownload);

		kenrobot.on("app-menu", "load", onAppMenuLoad, {canReset: false}).on("app", "setTitle", onAppSetTitle, {canReset: false}).on("app-menu", "conditionChange", onAppMenuConditionChange, {canReset: false});;
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

		kenrobot.trigger("app-menu", "do-action", action, li.data("extra"), li);

		inactiveAppMenu();
	}

	function onAppMenuLoad(menu, type) {
		appMenu.empty().append(genMenu(menu));
		appMenu.off('click', "> ul > li > .placeholder", activeAppMenu)
			.on('click', "> ul > li > .placeholder", activeAppMenu)
			.off('mouseleave', inactiveAppMenu)
			.on('mouseleave', inactiveAppMenu)
			.off('click', 'li', onAppMenuClick)
			.on('click', 'li', onAppMenuClick);

		var versions = appMenu.find("ul > li").filter((index, item) => $(item).data("id")  == "version");
		var version = versions.find("li").filter((index, item) => $(item).data("extra").type == type);
		if(version.length > 0) {
			versions.find("> .placeholder").text(version.find(".text").text());
			util.toggleActive(version);
		}
	}

	function genMenu(menu) {
		var menuItems = menu.map(menuItem => {
			if(menuItem == "_") {
				return $(`<li class="seperator"></li>`);
			} else if(menuItem.text) {
				var li = $(`<li data-action="${menuItem.action}"><span class="text">${menuItem.text}</span></li>`);

				if(menuItem.id) {
					li.data("id", menuItem.id);
				}

				if(menuItem.extra) {
					li.data('extra', menuItem.extra);

					if(menuItem.extra.condition) {
						li.addClass("hide");
					}
				}

				if(menuItem.cls) {
					li.addClass(menuItem.cls);
				}

				if(menuItem.shortcut) {
					var shortcut = menuItem.shortcut;
					li.append($(`<span class="shortcut">${shortcut.text}</span>`));
				}

				return li;
			} else if(menuItem.placeholder) {
				var li = $(`<li><div class="placeholder${menuItem.arrow ? " arrow" : ""}">${menuItem.placeholder}</div></li>`);

				if(menuItem.id) {
					li.data("id", menuItem.id);
				}

				if(menuItem.menu) {
					var subMenu = genMenu(menuItem.menu);
					if(menuItem.menuCls) {
						subMenu.addClass(menuItem.menuCls);
					}
					if(menuItem.menuWidth) {
						subMenu.css("width", menuItem.menuWidth);
					}
					li.append(subMenu);
				}

				return li;
			} else {
				return "";
			}
		});

		return $('<ul>').append(menuItems);
	}

	function onAppSetTitle(title) {
		region.find(".project-path").text(title).attr("title", title);
	}

	function onLoginClick(e) {
		var wrap = $(this).parent();
		if(wrap.hasClass("login")) {
			return;
		}

		kenrobot.trigger("login", "show");
	}

	function onLoginMenuClick(e) {
		var action = $(this).data("action");
		switch(action) {
			case "setting":
				util.message("敬请期待");
				break;
			case "project-manager":
				kenrobot.trigger("project", "show");
				break;
			case "project-sync":
				kenrobot.trigger("project", "sync");
				break;
			case "logout":
				kenrobot.trigger("user", "logout");
				break;
		}
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

	function onFullscreenChange(fullscreen) {
		appMenu.find('li[data-action="fullscreen"]').find(".text").text(fullscreen ? "退出全屏" : "全屏");
	}

	function onUserUpdate() {
		var userInfo = kenrobot.user;
		var loginWrap = region.find(".login-region .wrap");
		if(userInfo) {
			loginWrap.addClass("login");
			loginWrap.find(".name").text(userInfo.base_name);
			var photo = loginWrap.find(".photo");
			photo.attr("src", userInfo.base_avatar || photo.data("defaultAvatar"));
		} else {
			loginWrap.removeClass("login");
			loginWrap.find(".name").text("未登录");
			var photo = loginWrap.find(".photo");
			photo.attr("src", photo.data("defaultAvatar"));
		}
	}

	function onUpdateDownload(value) {
		var span = appMenu.find('li[data-action="check-update"]').find(".text");
		if(value === true) {
			span.text("安装更新");
		} else if(value === false) {
			span.text("检查更新");
		} else {
			span.text(`更新下载中(${value}%)`);
		}
	}

	function onAppMenuConditionChange(condition, ...args) {
		if(condition === "text-mode") {
			var mode = args[0];
			var list = appMenu.find("li").filter((index, li) => {
				var extra = $(li).data('extra');
				return extra && extra.condition && extra.condition === condition;
			});
			mode == "text" ? list.removeClass("hide") : list.addClass("hide");
		} else {

		}

	}

	return {
		init: init,
	}
});
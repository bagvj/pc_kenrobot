define(['vendor/jquery', 'app/common/util/emitor', 'app/common/util/util', 'app/common/config/config'], function($1, emitor, util, config) {
	var region;
	var appMenu;

	function init() {
		region = $('.titlebar-region')
			.on('click', '.login-region .placeholder', onLoginClick)
			.on('click', '.login-region .login-menu > ul > li', onLoginMenuClick)
			.on('click', '.window-btns li', onWindowBtnClick);
		appMenu = $('.app-menu', region);
		
		emitor.on("app", "fullscreenChange", onFullscreenChange).on("user", "update", onUserUpdate);
		kenrobot.on("app-menu", "load", onAppMenuLoad, {canReset: false});
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

		var li = appMenu.find(".switches > li").filter((index, item) => $(item).data("extra").type  == type)
		li.length && util.toggleActive(li);
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
				console.log("error config", menuItem);
				return "";
			}
		});

		return $('<ul>').append(menuItems);
	}

	function onLoginClick(e) {
		var wrap = $(this);
		if(wrap.hasClass("login")) {
			return;
		}

		emitor.trigger("login", "show");
	}

	function onLoginMenuClick(e) {
		var action = $(this).data("action");
		switch(action) {
			case "setting":
				util.message("敬请期待");
				break;
			case "logout":
				emitor.trigger("user", "logout");
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
		var li = Array.from(appMenu.find("li")).find(li => $(li).data("id") == "fullscreen");
		$(li).find(".text").text(fullscreen ? "退出全屏" : "全屏");
	}

	function onUserUpdate() {
		var userInfo = kenrobot.getUserInfo();
		var loginWrap = region.find(".login-region .wrap");
		if(userInfo) {
			loginWrap.addClass("login");
			loginWrap.find(".name").text(userInfo.username);
			var photo = loginWrap.find(".photo");
			photo.attr("src", userInfo.base_avatar || photo.data("defaultAvatar"));
		} else {
			loginWrap.removeClass("login");
			loginWrap.find(".name").text("未登录");
			var photo = loginWrap.find(".photo");
			photo.attr("src", photo.data("defaultAvatar"));
		}
	}

	return {
		init: init,
	}
});
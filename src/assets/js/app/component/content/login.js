define(['vendor/jquery', 'app/util/emitor', 'app/util/util', 'app/config/config', 'app/util/net', 'app/model/userModel'], function($1, emitor, util, config, net, userModel) {
	var region;

	function init() {
		region = $('.login-region');
		$('.login-menu ul > li', region).on('click', onMenuClick);
		$('.photo', region).on('click', onPhotoClick);
		
		emitor.on('user', 'login', onUserLogin);
	}

	function onMenuClick(e) {
		var li = $(this);
		var action = li.data('action');
		switch(action) {
			case "login":
				emitor.trigger('login', 'show');
				break;
			case "register":
				emitor.trigger('login', 'show', {
					isRegister: true,
				});
				break;
			case "share":
				emitor.trigger('share', 'show');
				break;
			case "setting":
				emitor.trigger('setting', 'show');
				break;
			case "logout":
				emitor.trigger('user', 'logout');
				break;
		}
	}

	function onPhotoClick(e) {
		if(util.isMobile() || $(this).hasClass("no-user")) {
			return;
		}

		var href = $(this).data('href');
		net.open(href);

		return false;
	}

	function onUserLogin() {
		util.message("登录成功");
		var userInfo = userModel.getUserInfo();		
		var photo = $('.photo', region).removeClass("no-user");
		
		$('> img', photo).attr("src", userInfo && userInfo.avatar_url || "assets/image/default-user.png");
		util.toggleActive($('.tab-user', region));
	}

	return {
		init: init,
	};
});
define(['vendor/jquery', 'app/common/util/util', 'app/common/util/emitor', 'app/common/config/config', '../../model/userModel'], function($1, util, emitor, config, userModel) {
	var dialogWin;
	var tabs;

	var qrcode;
	var qrcodeKey;
	var qrcodeTimeout = 5 * 60 * 1000;
	var qrcodeTimeoutTimer;

	var loginCheckTimer;
	var loginCallback;
	var scanTimerId;

	function init() {
		dialogWin = $('.login-dialog');

		tabs = dialogWin.find(".tab")
			.on("click", ".switch-login", onSwitchLoginClick)
			.on("keyup", ".x-field input", onTabEnter);

		tabs.filter(".tab-login")
			.on("click", ".switch-register", onSwitchRegisterClick)
			.on("click", ".login-btn", onLoginClick)
			.on("click", ".find-password", onFindPasswordClick)
			.on("click", ".other-ways ul > li", onOtherWaysClick);

		tabs.find(".x-field > input").on("focus", function(e) {
			$(this).attr("placeholder", "");
		}).on("blur", function(e) {
			$(this).attr("placeholder", $(this).data("placeholder"));
		}).each((index, input) => {
			var item = $(input);
			item.data("placeholder", item.attr("placeholder"));
		});

		// //登录、注册切换
		// $('.tab-login .switch-register', dialogWin).on('click', onSwitchDialogMode);

		// //登录切换
		// switches = $('.tab-login .switch li', dialogWin).on('click', onSwitchLoginType);
		// loginTabs = $('.tab-login .tabs', dialogWin);

		// //登录
		// $('.tab-account .login', dialogWin).on('click', onLoginClick);

		// //回车
		// $('.tab-account .username, .tab-account .password', dialogWin).on('keyup', onLoginEnter);

		// $('.tab-account .find-password', dialogWin).on('click', onFindPasswordClick);

		// qrcode = $('.tab-quick .qrcode', dialogWin);
		// qrcodeKey = $('.tab-quick .qrcode-key', dialogWin);

		// //二维码过期，刷新
		// $('.tab-quick .refresh', dialogWin).on('click', onRefreshQrcodeClick);

		// //注册
		// $('.tab-register .register', dialogWin).on('click', onRegisterClick);

		// refreshWeixinQrcode();

		emitor.on('login', 'show', onShow);
	}

	function onShow(args) {
		args = args || {};

		// loginCallback = args.callback;

		// switchDialogMode(args.mode || "login");
		// switchLoginType(args.type || "quick");

		// refreshWeixinQrcode();
		// setTimeout(onQrcodeTimeout, qrcodeTimeout);

		switchTab("login", false, false);

		util.dialog({
			selector: dialogWin,
			afterClose: onAfterClose,
		});
	}

	function onAfterClose() {
		// loginCallback = null;
		// clearTimeout(onQrcodeTimeout);
		// qrcodeTimeoutTimer = null;

		// setWeixinLoginCheck(false);
	}

	function switchTab(name, direction, animate) {
		var currentTab = tabs.filter(".active");
		var tab = tabs.filter(`.tab-${name}`);
		if(animate === false || currentTab.length == 0) {
			tabs.removeClass("active left-fadeIn right-fadeIn left-fadeOut right-fadeOut");
			tab.addClass("active");
			return;
		}

		if(direction) {
			//left
			tab.removeClass("right-fadeIn left-fadeOut right-fadeOut").addClass("left-fadeIn").addClass("active");
			currentTab.removeClass("active left-fadeIn right-fadeIn right-fadeOut").addClass("left-fadeOut");
		} else {
			//right
			tab.removeClass("left-fadeIn left-fadeOut right-fadeOut").addClass("right-fadeIn").addClass("active");
			currentTab.removeClass("active left-fadeIn left-fadeOut right-fadeIn").addClass("right-fadeOut");
		}

		tab.find(".x-field input").val("");
		switch(name) {
			case "login":
				tab.find(".username input").focus();
				break;
			case "register":
				tab.find(".email input").focus();
				break;
			case "register-success":

				break;
			case "find-password":
				tab.find(".email input").focus();
				break;
			case "weixin":

				break;
		}
	}

	function onSwitchLoginClick(e) {
		switchTab("login", true);
	}

	function onSwitchRegisterClick(e) {
		switchTab("register");
	}

	function onFindPasswordClick(e) {
		switchTab("find-password");
	}

	function onTabEnter(e) {
		if(e.keyCode != 13) {
			return;
		}

		var tab = $(this).parents(".tab");
		tab.find(".x-submit").trigger("click");
	}

	function onLoginClick(e) {
		var tab = tabs.filter(".tab-login");
		var $username = tab.find(".username input");
		var $password = tab.find(".password input");
		var username = $.trim($username.val());
		var password = $.trim($password.val());

		if(username == "" || password == "") {
			return;
		}

		var autoLogin = tab.find('.auto-login').is(":checked");
		userModel.login(username, password, autoLogin).then(result => {
			if(result.status == 0) {
				dialogWin.find(".x-dialog-close").trigger("click");
				
				util.message("登录成功");
				emitor.trigger("user", "update");
			} else {
				showError(tab, result.message);
			}
		}, err => {
			util.message("登录失败");
		})
	}

	function onOtherWaysClick(e) {
		var action = $(this).data("action");
		switch(action) {
			case "weixin":
				switchTab("weixin");
				break;
			case "qq":

				break;
			case "weibo":

				break;
			case "github":

				break;
		}
	}

	function showError(tab, message) {
		tab.find(".error-message").text(message).clearQueue().addClass("active").delay(3000).queue(function() {
			$(this).text('').removeClass("active").dequeue();
		});
	}

	// function switchDialogMode(mode) {
	// 	dialogMode = mode;

	// 	$('.title .mode', dialogWin).text(dialogMode == "login" ? "登录" : "注册");

	// 	var tab = $('.tab-' + dialogMode, dialogWin);

	// 	tab.siblings(".active").removeClass("x-fadeIn").removeClass("active").addClass("x-fadeOut");
	// 	tab.removeClass("x-fadeOut").addClass("active").addClass("x-fadeIn");

	// 	var titleHeight = $('.title', dialogWin).height();
	// 	var height = tab.height();
	// 	tab.parent().height(height);
	// 	dialogWin.height(height + titleHeight);

	// 	setWeixinLoginCheck(dialogMode == "login" && loginType == "quick");
	// 	$('.reset-field', dialogWin).val('');
	// }

	// function switchLoginType(type) {
	// 	loginType = type;

	// 	switches.filter('[data-action="' + loginType + '"]').addClass("active").siblings().removeClass("active");

	// 	var tab = $('.tab-login .tab-' + loginType, dialogWin);

	// 	tab.siblings(".active").removeClass("x-fadeIn").removeClass("active").addClass("x-fadeOut");
	// 	tab.removeClass("x-fadeOut").addClass("active").addClass("x-fadeIn");

	// 	var index = tab.index();
	// 	var x = index == 0 ? "0" : (0 - index * tab.width()) + "px";
	// 	loginTabs.css("transform", "translateX(" + x + ")");

	// 	if(loginType == "account") {
	// 		$('.tab-login .username', dialogWin).focus();
	// 	}

	// 	setWeixinLoginCheck(dialogMode == "login" && loginType == "quick");
	// 	$('.reset-field', dialogWin).val('');
	// }

	// function onSwitchDialogMode(e) {
	// 	var mode = $(this).data("action");
	// 	switchDialogMode(mode);
	// }

	// function onSwitchLoginType(e) {
	// 	var li = $(this);
	// 	if(li.hasClass("active")) {
	// 		return;
	// 	}
		
	// 	var type = li.data("action");
	// 	switchLoginType(type);
	// }

	// function onRefreshQrcodeClick(e) {
	// 	refreshWeixinQrcode();
	// }

	// function onLoginClick() {
	// 	var $username = $('.tab-account .username', dialogWin);
	// 	var $password = $('.tab-account .password', dialogWin);
	// 	var username = $.trim($username.val());
	// 	var password = $.trim($password.val());

	// 	if(username == "") {
	// 		showError($username, "请输入帐号");
	// 		return;
	// 	}

	// 	if(password == "") {
	// 		showError($password, "请输入密码");
	// 		return;
	// 	}

	// 	var autoLogin = $('.tab-account .auto-login', dialogWin).is(":checked");
	// 	// userModel.login(username, password, remember).done(onAccountLogin);
	// }

	// function onLoginEnter(e) {
	// 	e.keyCode == 13 && onLoginClick();
	// }

	// function setWeixinLoginCheck(value) {
	// 	clearInterval(loginCheckTimer);
	// 	loginCheckTimer = null;

	// 	if (!value) {
	// 		return;
	// 	}

	// 	loginCheckTimer = setInterval(function() {
	// 		// userModel.weixinLogin(qrcodeKey.val()).done(onWeixinLogin);
	// 	}, 3000);
	// }

	// function onAccountLogin(result) {
	// 	if (result.status == 0) {
	// 		//登录成功
	// 		closeDialog();
	// 		emitor.trigger("user", "login");
	// 		doLoginCallback();
	// 	} else if (result.status == 1) {

	// 	} else {
	// 		showError($(".tab-account .password"), result.message);
	// 	}
	// }

	// function onWeixinLogin(result) {
	// 	if (result.status == 0) {
	// 		//登录成功
	// 		setWeixinLoginCheck(false);
	// 		closeDialog();
	// 		emitor.trigger("user", "login");
	// 		doLoginCallback();
	// 	} else if (result.status == 1) {
	// 		//已经登录
	// 		setWeixinLoginCheck(false);
	// 	} else if(result.status == -3) {
	// 		refreshWeixinQrcode();
	// 	} else {
	// 		//登录失败
	// 	}
	// }

	// function onQrcodeTimeout() {
	// 	setWeixinLoginCheck(false);
	// 	qrcode.addClass("timeout");
	// 	qrcodeTimeoutTimer = null;
	// }

	// function closeDialog() {
	// 	$('.x-dialog-close', dialogWin).click();
	// }

	// function onRegisterClick(e) {
	// 	var $email = $('.tab-register .email', dialogWin);
	// 	var $username = $('.tab-register .username', dialogWin);
	// 	var $password = $('.tab-register .password', dialogWin);
	// 	var $confirmPassword = $('.tab-register .confirm-password', dialogWin);

	// 	var email = $.trim($email.val());
	// 	var username = $.trim($username.val());
	// 	var password = $.trim($password.val());
	// 	var confirmPassword = $.trim($confirmPassword.val());

	// 	if(email == "") {
	// 		showError($email, "请输入邮箱");
	// 		return;
	// 	}

	// 	if(username == "") {
	// 		showError($username, "请输入帐号");
	// 		return;
	// 	}

	// 	if(password == "") {
	// 		showError($password, "请输入密码");
	// 		return;
	// 	}

	// 	if(confirmPassword == "") {
	// 		showError($confirmPassword, "请再次输入密码");
	// 		return;
	// 	}

	// 	if(password != confirmPassword) {
	// 		showError($confirmPassword, "请确认密码");
	// 		return;
	// 	}

	// 	// userModel.register({
	// 	// 	email: email,
	// 	// 	username: username,
	// 	// 	password: password,
	// 	// }).done(onRegisterSuccess);
	// }

	// function onRegisterSuccess(result) {
	// 	if(result.status == 0) {
	// 		closeDialog();
	// 		emitor.trigger("user", "login");
	// 	} else {
	// 		showError($(".tab-register .username"), result.message);
	// 	}
	// }

	// function refreshWeixinQrcode() {
	// 	// userModel.weixinQrcode(true).done(function(result){
	// 	// 	if (result.status != 0) {
	// 	// 		return;
	// 	// 	}

	// 	// 	qrcodeKey.val(result.data.login_key);
	// 	// 	qrcode.attr('src', result.data.qrcodeurl);

	// 	// 	qrcode.removeClass("timeout");
	// 	// 	clearTimeout(onQrcodeTimeout);
	// 	// 	qrcodeTimeoutTimer = setTimeout(onQrcodeTimeout, qrcodeTimeout);
	// 	// });
	// }

	// function doLoginCallback() {
	// 	loginCallback && loginCallback();
	// }

	// function onFindPasswordClick(e) {
	// 	kenrobot.postMessage("app:openUrl", config.url.findPassword);
	// }

	return {
		init: init,
	};
});
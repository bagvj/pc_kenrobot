define(['vendor/jquery', 'app/util/util', 'app/util/emitor', 'app/model/userModel'], function($1, util, emitor, userModel) {
	var dialogWin;
	var loginTabs;
	var switchs;

	var qrcode;
	var qrcodeKey;
	var qrcodeTimeout = 30 * 60 * 1000;
	var qrcodeTimeoutTimer;

	var loginCheckTimer;
	var loginCallback;
	var scanTimerId;
	var dialogMode;

	function init() {
		dialogWin = $('.login-dialog');

		//登录、注册切换
		$('.tab-login .switch-register, .tab-register .switch-login').on('click', onSwitchDialogMode);

		//登录切换
		switchs = $('.tab-login .switch li', dialogWin).on('click', onSwitchLoginType);
		loginTabs = $('.tab-login .tabs', dialogWin);

		//登录
		$('.tab-account .login', dialogWin).on('click', onLoginClick);

		//回车
		$('.tab-account .username, .tab-account .password', dialogWin).on('keyup', onLoginEnter);

		qrcode = $('.tab-quick .qrcode', dialogWin);
		qrcodeKey = $('.tab-quick .qrcode-key', dialogWin);

		//二维码过期，刷新
		$('.tab-quick .refresh', dialogWin).on('click', onRefreshQrcodeClick);

		refreshWeixinQrcode();

		emitor.on('login', 'show', onShow);
	}

	function onShow(args) {
		args = args || {};

		var mode = args.mode || "login";
		var type = args.type || "quick";
		loginCallback = args.callback;

		switchDialogMode(mode);
		switchLoginType(type);

		$('.reset-field', dialogWin).val('');

		refreshWeixinQrcode();
		setTimeout(onQrcodeTimeout, qrcodeTimeout);

		util.showDialog({
			selector: dialogWin,
			afterClose: onAfterClose,
		});
	}

	function onAfterClose() {
		loginCallback = null;
		clearTimeout(onQrcodeTimeout);
		qrcodeTimeoutTimer = null;

		setWeixinLoginCheck(false);
	}

	function switchDialogMode(mode) {
		if(dialogMode && dialogMode == mode) {
			return;
		}

		$('.title .mode', dialogWin).text(mode == "login" ? "登录" : "注册");

		var tab = $('.tab-' + mode, dialogWin);

		tab.siblings(".active").removeClass("x-fadeIn").removeClass("active").addClass("x-fadeOut");
		tab.removeClass("x-fadeOut").addClass("active").addClass("x-fadeIn");

		var titleHeight = $('.title', dialogWin).height();
		var height = tab.height();
		tab.parent().height(height);
		dialogWin.height(height + titleHeight);
	}

	function switchLoginType(type) {
		switchs.filter('[data-action="' + type + '"]').addClass("active").siblings().removeClass("active");

		var tab = $('.tab-login .tab-' + type, dialogWin);

		tab.siblings(".active").removeClass("x-fadeIn").removeClass("active").addClass("x-fadeOut");
		tab.removeClass("x-fadeOut").addClass("active").addClass("x-fadeIn");

		var index = tab.index();
		var x = index == 0 ? "0" : (0 - index * tab.width()) + "px";
		loginTabs.css("transform", "translateX(" + x + ")");

		if(type == "quick") {
			setWeixinLoginCheck(true);
		} else {
			setWeixinLoginCheck(false);
			$('.tab-login .username', dialogWin).focus();
		}
	}

	function onSwitchDialogMode(e) {
		var mode = $(this).data("action");
		switchDialogMode(mode);
	}

	function onSwitchLoginType(e) {
		var li = $(this);
		if(li.hasClass("active")) {
			return;
		}
		
		var type = li.data("action");
		switchLoginType(type);
	}

	function onRefreshQrcodeClick(e) {
		refreshWeixinQrcode();
	}

	function onLoginClick() {
		var $username = $('.tab-account .username', dialogWin);
		var $password = $('.tab-account .password', dialogWin);
		var username = $.trim($username.val());
		var password = $.trim($password.val());

		if(username == "") {
			showError($username, "请输入帐号");
			return;
		}

		if(password == "") {
			showError($username, "请输入密码");
			return;
		}

		var remember = $('.tab-account .remember', dialogWin).is(":checked");
		userModel.login(username, password, remember).done(onAccountLogin);
	}

	function onLoginEnter(e) {
		e.keyCode == 13 && onLoginClick();
	}

	function setWeixinLoginCheck(value) {
		clearInterval(loginCheckTimer);
		loginCheckTimer = null;

		if (!value) {
			return;
		}

		loginCheckTimer = setInterval(function() {
			userModel.weixinLogin(qrcodeKey.val()).done(onWeixinLogin);
		}, 3000);
	}

	function onAccountLogin(result) {
		if (result.status == 0) {
			//登录成功
			setWeixinLoginCheck(false);
			$('.dialog-close', dialogWin).click();
			emitor.trigger("user", "login");
			doLoginCallback();
		} else if (result.status == 1) {
			setWeixinLoginCheck(false);
		} else {
			showError($(".tab-account .password"), result.message);
		}
	}

	function onWeixinLogin(result) {
		if (result.status == 0) {
			//登录成功
			setWeixinLoginCheck(false);
			$('.dialog-close', dialogWin).click();
			emitor.trigger("user", "login");
			doLoginCallback();
		} else if (result.status == 1) {
			//已经登录
			setWeixinLoginCheck(false);
		} else if(result.status == -3) {
			refreshWeixinQrcode();
		} else {
			//登录失败
		}
	}

	function onQrcodeTimeout() {
		setWeixinLoginCheck(false);
		qrcode.addClass("timeout");
		qrcodeTimeoutTimer = null;
	}

	function showError(target, message) {
		var error = target.siblings(".error");
		error.addClass("active").text(message).delay(2000).queue(function() {
			error.removeClass("active").text('').dequeue();
		});
	}

	function refreshWeixinQrcode() {
		userModel.weixinQrcode(true).done(function(result){
			if (result.status != 0) {
				return;
			}

			qrcodeKey.val(result.data.login_key);
			qrcode.attr('src', result.data.qrcodeurl);

			qrcode.removeClass("timeout");
			clearTimeout(onQrcodeTimeout);
			qrcodeTimeoutTimer = setTimeout(onQrcodeTimeout, qrcodeTimeout);
		});
	}

	function doLoginCallback() {
		loginCallback && loginCallback();
	}

	return {
		init: init,
	};
});
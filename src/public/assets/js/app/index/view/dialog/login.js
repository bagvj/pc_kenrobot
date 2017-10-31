define(['vendor/jquery', 'app/common/util/util', 'app/common/util/emitor', 'app/common/config/config', '../../model/userModel'], function($1, util, emitor, config, userModel) {
	var dialogWin;
	var tabs;

	var resetPasswordDelay = 60;

	var qrcodeDelay = 5 * 60 * 1000;
	var qrcodeTimer;
	var qrcodeLoginTimer;

	function init() {
		dialogWin = $('.login-dialog');

		tabs = dialogWin.find(".tab")
			.on("click", ".switch-login", onSwitchLoginClick)
			.on("keyup", ".x-field input", onTabEnter);

		tabs.find(".x-field > input").on("focus", function(e) {
			$(this).attr("placeholder", "");
		}).on("blur", function(e) {
			$(this).attr("placeholder", $(this).data("placeholder"));
		}).each((index, input) => {
			var item = $(input);
			item.data("placeholder", item.attr("placeholder"));
		});

		tabs.filter(".tab-login")
			.on("click", ".switch-register", onSwitchRegisterClick)
			.on("click", ".login-btn", onLoginClick)
			.on("click", ".find-password", onFindPasswordClick)
			.on("click", ".other-ways ul > li", onOtherWaysClick);

		tabs.filter(".tab-find-password")
			.on("click", ".send-btn", onSendClick);

		tabs.filter(".tab-register")
			.on("click", ".register-btn", onRegisterClick);

		tabs.filter(".tab-register-success")
			.on("click", ".ok-btn", onRegisterOKClick);

		kenrobot.on('login', 'show', onShow, {canReset: false});
	}

	function onShow(args) {
		args = args || {};

		refreshWeixinQrcode();

		switchTab("login", false, false);

		util.dialog({
			selector: dialogWin,
			afterClose: onAfterClose,
		});
	}

	function onAfterClose() {
		setWeixinLoginCheck(false);

		clearTimeout(qrcodeTimer);
		qrcodeTimer = null;
	}

	function switchTab(name, direction, animate) {
		reset(name);

		var currentTab = tabs.filter(".active");
		var tab = tabs.filter(`.tab-${name}`);
		if (animate === false || currentTab.length == 0) {
			tabs.removeClass("active left-fadeIn right-fadeIn left-fadeOut right-fadeOut");
			tab.addClass("active");
			return;
		}

		if (direction) {
			//left
			tab.removeClass("right-fadeIn left-fadeOut right-fadeOut").addClass("left-fadeIn").addClass("active");
			currentTab.removeClass("active left-fadeIn right-fadeIn right-fadeOut").addClass("left-fadeOut");
		} else {
			//right
			tab.removeClass("left-fadeIn left-fadeOut right-fadeOut").addClass("right-fadeIn").addClass("active");
			currentTab.removeClass("active left-fadeIn left-fadeOut right-fadeIn").addClass("right-fadeOut");
		}
		tabs.delay(300, "clear-class").queue("clear-class", function() {
			tabs.removeClass("left-fadeIn right-fadeIn left-fadeOut right-fadeOut");
		});
		tabs.dequeue("clear-class");
	}

	function reset(name) {
		var tab = tabs.filter(`.tab-${name}`);
		tab.find(".x-field input").val("");
		setWeixinLoginCheck(false);
		switch (name) {
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
				setWeixinLoginCheck(true);
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
		if (e.keyCode != 13) {
			return;
		}

		var tab = $(this).parents(".tab");
		tab.find(".x-submit").trigger("click");
	}

	function onLoginClick(e) {
		var tab = tabs.filter(".tab-login");
		var username = $.trim(tab.find(".username input").val());
		var password = $.trim(tab.find(".password input").val());

		if (username == "" || password == "") {
			return;
		}

		var autoLogin = tab.find('.auto-login').is(":checked");
		userModel.login(username, password, autoLogin).then(result => {
			if (result.status == 0) {
				dialogWin.find(".x-dialog-close").trigger("click");

				util.message("登录成功");
				emitor.trigger("user", "update");
			} else {
				showError(tab, result.message);
			}
		}, err => {
			util.message({
				text: "登录失败",
				type: "error",
			});
		});
	}

	function onOtherWaysClick(e) {
		var action = $(this).data("action");
		switch (action) {
			case "weixin":
				switchTab("weixin");
				break;
			case "qq":
				util.message("敬请期待");
				break;
			case "weibo":
				util.message("敬请期待");
				break;
			case "github":
				util.message("敬请期待");
				break;
		}
	}

	function showError(tab, message) {
		tab.find(".error-message").text(message).clearQueue().addClass("active").delay(3000).queue(function() {
			$(this).text('').removeClass("active").dequeue();
		});
	}

	function onSendClick(e) {
		var tab = tabs.filter(".tab-find-password");
		var email = $.trim(tab.find(".email input").val());
		if (email == "") {
			return;
		}

		userModel.resetPassword(email).then(result => {
			if (result.status == 0) {
				var count = resetPasswordDelay;
				var sendBtn = tab.find(".send-btn").attr("disabled", true).val(`重新发送(${count})`);
				var timerId;
				timerId = setInterval(() => {
					count--;
					if (count == 0) {
						sendBtn.attr("disabled", false).val("发送");
						clearTimeout(timerId);
						return;
					}
					sendBtn.val(`重新发送(${count})`);
				}, 1000);
				util.message("邮件已发送");
			} else {
				showError(tab, result.message);
			}
		}, err => {
			util.message({
				type: "error",
				text: "重置失败",
			});
		})
	}

	function onRegisterClick(e) {
		var tab = tabs.filter(".tab-register");
		var email = $.trim(tab.find(".email input").val());
		var username = $.trim(tab.find(".username input").val());
		var password = $.trim(tab.find(".password input").val());
		var confirmPassword = $.trim(tab.find(".confirm-password input").val());

		if (email == "" || username == "" || password == "" || confirmPassword == "") {
			return;
		}

		if (password != confirmPassword) {
			showError(tab, "两次密码不一致");
			return;
		}

		userModel.register({
			email: email,
			username: username,
			password: password,
		}).then(result => {
			if (result.status == 0) {
				switchTab("register-success")
			} else {
				showError(tab, result.message);
			}
		}, err => {
			util.message({
				text: "注册失败",
				type: "error",
			});
		});
	}

	function onRegisterOKClick(e) {
		switchTab("login");
	}

	function onWeixinLogin(result) {
		if (result.status == 0) {
			//登录成功
			setWeixinLoginCheck(false);
			dialogWin.find(".x-dialog-close").trigger("click");
			util.message("登录成功");
			emitor.trigger("user", "update");
		} else if (result.status == -3) {
			refreshWeixinQrcode();
		} else {
			//登录失败
		}
	}

	function setWeixinLoginCheck(value) {
		clearInterval(qrcodeLoginTimer);
		qrcodeLoginTimer = null;

		if (!value) {
			return;
		}

		var qrcode = tabs.filter(".tab-weixin").find(".qrcode");
		var autoLogin = tabs.filter(".tab-login").find('.auto-login');
		qrcodeLoginTimer = setInterval(function() {
			userModel.weixinLogin(qrcode.data("key"), autoLogin.is(":checked")).then(onWeixinLogin);
		}, 3000);
	}

	function onQrcodeTimeout() {
		setWeixinLoginCheck(false);
		clearTimeout(qrcodeTimer);
		qrcodeTimer = null;

		var tab = tabs.filter(".tab-weixin");
		tab.find(".qrcode").addClass("timeout");
	}

	function refreshWeixinQrcode() {
		userModel.weixinQrcode().then(result => {
			if (result.status != 0) {
				return;
			}

			var tab = tabs.filter(".tab-weixin");
			tab.find(".qrcode").removeClass("timeout").data("key", result.data.login_key).attr("src", result.data.qrcodeurl);

			clearTimeout(qrcodeTimer);
			qrcodeTimer = setTimeout(onQrcodeTimeout, qrcodeDelay);
		});
	}

	return {
		init: init,
	};
});
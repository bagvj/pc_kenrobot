define(['vendor/jquery'], function() {
	var messages = [];
	var messageConfig = {
		template: '<div class="x-message {type}"><i class="x-message-close kenrobot ken-close"></i><i class="x-message-icon kenrobot ken-info-{type}"></i><div class="x-message-wrap"><div class="x-message-title">{title}</div><div class="x-message-content">{text}</div></div></div>',
		titles: {
			"success": "成功",
			"error": "错误",
			"warning": "警告",
			"info": "消息",
		},
		max: 4,
		stayDuration: 2000,
	}

	function message(args) {
		args = typeof args == "string" ? {text: args} : args;
		var messageLayer = $(".message-layer", top.document);

		var text = args.text;
		var type = args.type || "info";
		var title = args.title || messageConfig.titles[type];

		window.kenrobot && kenrobot.postMessage("app:log", text);

		var html = messageConfig.template.replace(/\{type\}/g, type).replace(/\{text\}/g, text).replace(/\{title\}/g, title)
		var messageDiv = $(html).appendTo(messageLayer);
		messages.push(messageDiv);

		$('.x-message-close', messageDiv).on('click', function() {
			onMessageHide(messageDiv);
		});

		if(messages.length > messageConfig.max) {
			var oldMessageDiv = messages.shift();
			oldMessageDiv.find("x-message-close").click();
		}

		messageDiv.css("top", 140 * messages.length - 60).addClass("x-fadeIn").delay(messageConfig.stayDuration, "stay").queue("stay", function() {
			messageDiv.removeClass("x-fadeIn").addClass("x-fadeOut").delay(300, "fadeOut").queue("fadeOut", function() {
				onMessageHide(messageDiv);
			});
			messageDiv.dequeue("fadeOut");
		});
		messageDiv.dequeue("stay");
	}

	function error(text, title) {
		message({text: text, title: title, type: "error"});
	}

	function warn(text, title) {
		message({text: text, title: title, type: "warning"});
	}

	function success(text, title) {
		message({text: text, title: title, type: "success"});
	}

	function onMessageHide(messageDiv) {
		messages.splice(messages.indexOf(messageDiv), 1);
		messageDiv.remove();
		messages.forEach(function(div) {
			div.animate({
				"top": div.position().top - 140
			}, 100, "swing");
		});
	}

	var confirmConfig = {
		titles: {
			"confirm": "提示",
			"warning": "提示",
		},
		template: '<div class="x-confirm {type}"><i class="x-confirm-close kenrobot ken-close"></i><div class="x-confirm-title">{title}</div><div class="x-confirm-content">{text}</div><div class="x-confirm-btns clearfix"><input class="confirm" type="button" value="{confirmLabel}" /><input class="cancel" type="button" value="{cancelLabel}" /></div></div>',
		cancelLabel: "取消",
		confirmLabel: "确认",
	}

	function confirm(args) {
		args = typeof args == "string" ? {text: args} : args;

		var text = args.text;
		var type = args.type || "confirm";
		var title = args.title || confirmConfig.titles[type];
		var cancelLabel = args.cancelLabel || confirmConfig.cancelLabel;
		var confirmLabel = args.confirmLabel || confirmConfig.confirmLabel;
		var onCancel = args.onCancel;
		var onConfirm = args.onConfirm;

		var html = confirmConfig.template.replace(/\{type\}/g, type).replace(/\{title\}/g, title).replace(/\{text\}/, text).replace(/\{cancelLabel\}/, cancelLabel).replace(/\{confirmLabel\}/, confirmLabel);

		var dialogLayer = $('.dialog-layer', top.document).addClass("active");
		var confirmDiv = $(html).appendTo(dialogLayer);

		var doClose = function(callback, cancel) {
			confirmDiv.removeClass("x-fadeIn").addClass("x-fadeOut").delay(300, "fadeOut").queue("fadeOut", function() {
				confirmDiv.hide().removeClass("active").removeClass("x-fadeOut");
				dialogLayer.find("> .active").length == 0 && dialogLayer.removeClass("active");
				callback && callback(cancel);
				mask(confirmDiv, false);
				confirmDiv.remove();
			});
			confirmDiv.dequeue("fadeOut");
		};

		$('.x-confirm-close', confirmDiv).on('click', function() {
			doClose(onCancel, true);
		});

		$('.x-confirm-btns .cancel', confirmDiv).on('click', function() {
			doClose(onCancel);
		});

		$('.x-confirm-btns .confirm', confirmDiv).on('click', function() {
			doClose(onConfirm);
		});

		mask(confirmDiv, true);
		confirmDiv.addClass("active").addClass("x-fadeIn").delay(300, "fadeIn").queue("fadeIn", function() {
			confirmDiv.removeClass("x-fadeIn");
		});
		confirmDiv.dequeue("fadeIn");
	}

	function dialog(args) {
		args = typeof args == "string" ? {
			selector: args
		} : args;
		var selector = args.selector;
		var dialogWin = $(selector);
		if (!dialogWin || !dialogWin.hasClass("x-dialog")) {
			return false;
		}

		dialogWin.clearQueue("fadeIn");
		dialogWin.clearQueue("fadeOut");

		var onConfirm = args.onConfirm;
		var onCancel = args.onCancel;
		var onClosing = args.onClosing;
		var onClose = args.onClose;
		var onClosed = args.onClosed;
		var onShow = args.onShow;
		var afterShow = args.afterShow;

		var content = args.content;
		content && $('.x-dialog-content', dialogWin).html(content);

		var dialogLayer = $('.dialog-layer', top.document).addClass("active");
		var doClose = function(callback, cancel) {
			dialogWin.addClass("x-fadeOut").delay(300, "fadeOut").queue("fadeOut", function() {
				dialogWin.hide().removeClass("active").removeClass("x-fadeOut");
				dialogLayer.find("> .active").length == 0 && dialogLayer.removeClass("active");
				onClose && onClose();
				callback && callback(cancel);
				onClosed && onClosed();
				mask(dialogWin, false);
			});
			dialogWin.dequeue("fadeOut");
		}

		$('.x-dialog-btns .confirm', dialogWin).off('click').on('click', function() {
			if (!onClosing || onClosing("confirm") != false) {
				doClose(onConfirm);
			}
		});

		$('.x-dialog-btns .cancel', dialogWin).off('click').on('click', function() {
			if (!onClosing || onClosing("cancel") != false) {
				doClose(onCancel);
			}
		});

		$('.x-dialog-close', dialogWin).off('click').on('click', function() {
			if (!onClosing || onClosing("cancel") != false) {
				doClose(onCancel, true);
			}
		});

		mask(dialogWin, true);
		onShow && onShow();
		dialogWin.show().addClass("x-fadeIn").delay(300, "fadeIn").queue("fadeIn", function() {
			dialogWin.addClass("active").removeClass("x-fadeIn");
			afterShow && afterShow();
		});
		dialogWin.dequeue("fadeIn");

		return dialogWin;
	}

	function mask(dialog, show) {
		var $ = top.window.$;
		var dialogLayer = $(".dialog-layer", top.document);
		var dialogMask = dialogLayer.find("> .x-dialog-mask");

		var stack = dialogLayer.data("stack") || [];
		var index = dialogLayer.data("index");
		index = index !== undefined ? index : -1;

		if(show) {
			dialogMask.css("z-index", index + 1);
			dialog.css("z-index", index + 2);
			stack.push(dialog);
			index = index + 2;
		} else {
			stack.splice(stack.indexOf(dialog), 1);
			if(parseInt(dialog.css("z-index")) == index) {
				if(stack.length > 0) {
					var topDialog = stack[stack.length - 1];
					index = parseInt(topDialog.css("z-index"));
					dialogMask.css("z-index", index - 1);
				} else {
					index = -1;
				}
			}
		}

		dialogLayer.data("stack", stack);
		dialogLayer.data("index", index);
	}

	function toggleActive(target, collapseMode, cls) {
		cls = cls || "active";
		if (collapseMode) {
			if (target.hasClass(cls)) {
				target.removeClass(cls);
				return false;
			} else {
				target.siblings("." + cls).removeClass(cls);
				target.addClass(cls);
				return true;
			}
		} else {
			if (target.hasClass(cls)) {
				return false;
			}

			target.siblings("." + cls).removeClass(cls);
			target.addClass(cls);

			return true;
		}
	}

	/**
	 * 格式化日期
	 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、季度(q)可以用1-2个占位符
	 * 年(y)可以用1-4个占位符，毫秒(S)只能用1个占位符(是1-3位的数字)、周(E)可以用1-3个占位符
	 * eg:
	 * formatDate(date, "yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
	 * formatDate(date, "yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
	 * formatDate(date, "yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
	 * formatDate(date, "yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
	 * formatDate(date, "yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
	 */
	function formatDate(date, format) {
		if (typeof date == "number") {
			date = new Date(date);
		}
		var o = {
			"M+": date.getMonth() + 1,
			"d+": date.getDate(),
			"h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12,
			"H+": date.getHours(),
			"m+": date.getMinutes(),
			"s+": date.getSeconds(),
			"q+": Math.floor((date.getMonth() + 3) / 3),
			"S": date.getMilliseconds()
		};
		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		if (/(E+)/.test(format)) {
			var week = ["日", "一", "二", "三", "四", "五", "六"];
			format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[date.getDay()]);
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return format;
	}

	function uuid(len, radix) {
		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
		var uuid = [], i;
		radix = radix || chars.length;

		if (len) {
			// Compact form
			for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
		} else {
			// rfc4122, version 4 form
			var r;

			// rfc4122 requires these characters
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			uuid[14] = '4';

			// Fill in random data.  At i==19 set the high bits of clock sequence as
			// per rfc4122, sec. 4.1.5
			for (i = 0; i < 36; i++) {
				if (!uuid[i]) {
					r = 0 | Math.random()*16;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
				}
			}
		}

		return uuid.join('');
	}

	function throttle(fn, delay) {
		var timerId;
		return () => {
			timerId && clearTimeout(timerId);
			timerId = setTimeout(() => {
				fn();
				clearTimeout(timerId);
				timerId = null;
			}, delay);
		}
	}

	function versionCompare(versionA, versionB) {
		var reg = /(\d+).(\d+).(\d+)/;
		var matchA = reg.exec(versionA);
		var matchB = reg.exec(versionB);

		var versionsA = [
			parseInt(matchA[1]),
			parseInt(matchA[2]),
			parseInt(matchA[3]),
		];
		var versionsB = [
			parseInt(matchB[1]),
			parseInt(matchB[2]),
			parseInt(matchB[3]),
		];

		for(var i = 0; i <= 2; i++) {
			if(versionsA[i] != versionsB[i]) {
				return versionsA[i] > versionsB[i] ? 1 : -1;
			}
		}

		return 0;
	}

	return {
		message: message,
		error: error,
		warn: warn,
		success: success,
		confirm: confirm,
		dialog: dialog,
		toggleActive: toggleActive,
		formatDate: formatDate,
		uuid: uuid,
		throttle: throttle,
		versionCompare: versionCompare,
	}
});

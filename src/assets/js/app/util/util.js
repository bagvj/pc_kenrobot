define(function() {
	function message(args) {
		var duration = 400;
		var messageLayer = $(".message-layer");

		$(".x-message", messageLayer).stop(true).fadeOut(duration / 2, function() {
			$(this).remove();
		});

		args = typeof args == "string" ? {
			text: args
		} : args;
		var type = args.type || "info";
		var text = args.text;
		var template = '<div class="x-message ' + type + '">' + text + '<div class="x-message-close">&times;</div></div>';
		var messageDiv = $(template).appendTo(messageLayer);
		$('.x-message-close', messageDiv).on('click', function() {
			messageDiv.remove();
		});
		messageDiv.css({
			top: -messageDiv.height(),
		}).animate({
			top: messageLayer.data("offset") || 150,
		}, duration, "swing").delay(2000).fadeOut(duration, function() {
			messageDiv.remove();
		});
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

		var content = args.content;
		content && $('.x-dialog-content', dialogWin).html(content);

		var dialogLayer = $('.dialog-layer').addClass("active");
		var doClose = function(callback) {
			dialogWin.removeClass("dialog-in").addClass("dialog-fadeOut").delay(300, "fadeOut").queue("fadeOut", function() {
				dialogWin.hide().removeClass("dialog-fadeOut");
				dialogLayer.removeClass("active");
				onClose && onClose();
				callback && callback();
				onClosed && onClosed();
			});
			dialogWin.dequeue("fadeOut");
		}

		$('.x-dialog-btns .confirm', dialogWin).off('click').on('click', function() {
			if (!onClosing || onClosing() != false) {
				doClose(onConfirm);
			}
		});

		$('.x-dialog-close,.x-dialog-btns .cancel', dialogWin).off('click').on('click', function() {
			if (!onClosing || onClosing() != false) {
				doClose(onCancel);
			}
		});

		onShow && onShow();
		dialogWin.show().addClass("dialog-fadeIn").delay(300, "fadeIn").queue("fadeIn", function() {
			dialogWin.addClass("dialog-in").removeClass("dialog-fadeIn");
		});
		dialogWin.dequeue("fadeIn");

		return dialogWin;
	}

	function isInDialog() {
		return $('.dialog-layer').hasClass("active");
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

	function showMessage(selector, message, duration) {
		duration = duration || 2000;
		selector = $(selector).empty();
		var messageDiv = $('<div>').text(message).appendTo(selector);
		messageDiv.delay(duration).fadeOut(400, function() {
			messageDiv.remove();
		});
	}

	function aspectReset(aspect) {
		var origin = aspect._advisor.orig;
		aspect._advisor.remove();
		return origin;
	}

	function parseJson(data) {
		try {
			return JSON.parse(data);
		} catch (ex) {

		}
	}

	function numberToChinese(input) {
		var SYMBOLS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
		var UNIT_MAP = {
			'0': '',
			'1': '十',
			'2': '百',
			'3': '千',
			'4': '零万',
			'5': '十',
			'6': '百',
			'7': '千',
			'8': '零亿',
			'9': '十'
		};
		var Y_MAP = [0, 4, 8];

		if (input <= 0 || !parseInt(input, 10)) {
			return '请输入正整数';
		}

		var inputStr = '' + input;
		var inputArr = inputStr.split('').reverse();
		var inputLength = inputArr.length;

		if (inputLength > 10) {
			return '请输入10位以内的正整数';
		}

		var result = '';

		for (var i = 0; i < inputLength; i++) {
			var value = inputArr[i];
			var isY = Y_MAP.indexOf(i) !== -1;

			if (isY || (!isY && value != 0)) {
				result += UNIT_MAP[i];
			}

			result += SYMBOLS[value];
		}

		result = result.split('').reverse().join('');

		result = result.replace(/零+$/, '')
			.replace(/零+/, '零')
			.replace(/零+万/, '万')
			.replace(/零+亿/, '亿')
			.replace(/亿万/, '亿')
			.replace(/^一十/, '十');

		return result;
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

	function isMobile() {
		return navigator.userAgent.match(/Android|iPhone|iPad|iPod/i) ? true : false;
	}

	function isWeiXin() {
		return navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
	}

	function showDialog(args) {
		args = typeof args == "string" ? {
			selector: args
		} : args;

		var dialogWin = $(args.selector);
		var beforeClose = args.beforeClose;
		var onClose = args.onClose;
		var afterClose = args.afterClose;

		if (!dialogWin || !dialogWin.hasClass("a-dialog")) {
			return;
		}

		var dialogLayer = $('.dialog-layer').addClass("active");

		dialogWin.clearQueue("fadeIn").clearQueue("fadeOut");
		$('.dialog-close', dialogWin).off('click').on('click', function() {
			if(beforeClose && beforeClose() === false) {
				return;
			}

			dialogWin.removeClass("dialog-in").addClass("dialog-fadeOut").delay(300, "fadeOut").queue("fadeOut", function() {
				onClose && onClose();
				dialogLayer.removeClass("active");
				dialogWin.hide().removeClass("dialog-fadeOut");
				afterClose && afterClose();
			}).dequeue("fadeOut");
		});

		dialogWin.show().addClass("dialog-fadeIn").delay(300, "fadeIn").queue("fadeIn", function() {
			dialogWin.addClass("dialog-in").removeClass("dialog-fadeIn");
		}).dequeue("fadeIn");
	}

	return {
		message: message,
		showMessage: showMessage,
		dialog: dialog,
		isInDialog: isInDialog,
		toggleActive: toggleActive,
		aspectReset: aspectReset,
		parseJson: parseJson,
		numberToChinese: numberToChinese,
		formatDate: formatDate,
		isMobile: isMobile,
		isWeiXin: isWeiXin,
		showDialog: showDialog,
	}
});
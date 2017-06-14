define(['vendor/jquery', 'app/common/util/util', 'app/common/util/emitor'], function($1, util, emitor) {
	var dialogWin;
	var callback;

	function init() {
		dialogWin = $('.prompt-dialog').on("keyup", ".input", onKeyUp);

		kenrobot.on('prompt', 'show', onShow, {canReset: false});
	}

	function onShow(args) {
		args = args || {}
		var title = args.title || "提示";
		var placeholder = args.placeholder || "";
		callback = args.callback;

		dialogWin.find(".x-dialog-title").text(title);
		dialogWin.find(".input").attr("placeholder", placeholder);

		util.dialog({
			selector: dialogWin,
			onCancel: onCancel,
			onConfirm: onConfirm,
			onClosing: onClosing,
			onClosed: onClosed,
			afterShow: afterShow,
		});
	}

	function afterShow() {
		setTimeout(_ => dialogWin.find(".input").focus(), 100);
	}

	function onCancel() {
		callback && callback(false);
	}

	function onConfirm() {
		var value = dialogWin.find(".input").val();
		callback && callback(value);
	}

	function onClosing(type) {
		if(type != "confirm") {
			return true;
		}

		var value = dialogWin.find(".input").val();
		return $.trim(value) != "";
	}

	function onClosed() {
		callback = null;
		dialogWin.find(".x-dialog-title").text("");
		dialogWin.find(".input").attr("placeholder", "").val("");
	}

	function onKeyUp(e) {
		e.keyCode == 13 && dialogWin.find(".x-dialog-close").trigger("click");
	}

	return {
		init: init,
	};
});
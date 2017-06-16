define(['vendor/jquery', 'app/common/util/util', 'app/common/util/emitor'], function($1, util, emitor) {
	var dialogWin;
	var callback;

	function init() {
		dialogWin = $('.save-dialog');

		kenrobot.on('save', 'show', onShow, {canReset: false});
	}

	function onShow(_callback) {
		callback = _callback;

		util.dialog({
			selector: dialogWin,
			onCancel: onCancel,
			onConfirm: onConfirm,
		});
	}

	function onCancel(cancel) {
		!cancel && callback && callback();
	}

	function onConfirm() {
		setTimeout(_ => {
			kenrobot.trigger("login", "show");
		}, 400);
	}

	return {
		init: init,
	};
});
define(['vendor/jquery', 'app/common/util/util', 'app/common/util/emitor'], function($1, util, emitor) {
	var dialogWin;
	var callback;

	function init() {
		dialogWin = $('.save-as-dialog');

		kenrobot.on('save-as', 'show', onShow, {canReset: false});
	}

	function onShow(_callback) {
		callback = _callback;

		util.dialog({
			selector: dialogWin,
			onConfirm: onConfirm,
		});
	}

	function onConfirm() {
		callback && callback();
	}

	return {
		init: init,
	};
});
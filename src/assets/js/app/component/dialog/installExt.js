define(['vendor/jquery', 'app/util/util', 'app/util/emitor'], function($1, util, emitor) {
	var dialogWin;

	function init() {
		dialogWin = $('.install-ext-dialog');

		emitor.on('installExt', 'show', onShow);
	}

	function onShow() {
		util.dialog({
			selector: dialogWin
		});
	}

	return {
		init: init,
	};
});
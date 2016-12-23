define(['vendor/jquery', 'app/util/util', 'app/util/emitor'], function($1, util, emitor) {
	var dialogWin;

	function init() {
		dialogWin = $('.install-driver-dialog');

		var bit = /WOW64|Win64/.test(navigator.userAgent) ? 64 : 32;
		var driverUrl = $('.driver-url', dialogWin);
		driverUrl.attr('href', driverUrl.data("url").replace("BIT", bit)).data("url", null);

		emitor.on('installDriver', 'show', onShow);
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
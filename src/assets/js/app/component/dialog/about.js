define(['vendor/jquery', 'app/util/util', 'app/util/emitor', 'app/config/config'], function($1, util, emitor, config) {
	var dialogWin;

	function init() {
		dialogWin = $('.about-dialog');
		dialogWin.find(".office-web").data("href", config.url.kenrobot).text(config.url.kenrobot);

		emitor.on('about', 'show', onShow);
	}

	function onShow(args) {
		dialogWin.find(".version").text(args.version);

		util.dialog({
			selector: dialogWin
		});
	}

	return {
		init: init,
	};
});
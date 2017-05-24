define(['vendor/jquery', 'app/common/util/util', 'app/common/util/emitor'], function($1, util, emitor) {
	var dialogWin;

	function init() {
		dialogWin = $('.about-dialog');
		dialogWin.find(".office-web").on("click", onLink);
		
		kenrobot.on('about', 'show', onShow, {canReset: false});
	}

	function onLink(e) {
		var url = $(this).data("href");
		kenrobot.postMessage("app:openUrl", url);
	}

	function onShow(args) {
		dialogWin.find(".office-web").data("href", args.url).text(args.url);
		dialogWin.find(".version").text(args.version);

		util.dialog({
			selector: dialogWin
		});
	}

	return {
		init: init,
	};
});
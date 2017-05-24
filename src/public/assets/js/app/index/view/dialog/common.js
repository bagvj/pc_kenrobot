define(['vendor/jquery', 'app/common/util/util', 'app/common/util/emitor'], function($1, util, emitor) {
	var dialogWin;
	var onLinkCallback;

	function init() {
		dialogWin = $('.common-dialog');

		kenrobot.on('common', 'show', onShow, {canReset: false});
	}

	function onShow(args) {
		args = args || {};
		args.selector = dialogWin;

		var type = args.type || "info";
		dialogWin.addClass(type);
		onLinkCallback = args.onLink;


		var onClosed = args.onClosed;
		args.onClosed = function() {
			$('.x-dialog-context', dialogWin).empty();
			dialogWin.removeClass(type);

			onClosed && onClosed();
		}

		util.dialog(args);

		onLinkCallback && $('.link', dialogWin).on("click", onLinkClick);
	}

	function onLinkClick(e) {
		var link = $(this);
		var type = link.data("type");
		var closeDialog = link.data("closeDialog")
		var args = link.data("args");

		closeDialog && $('.x-dialog-close', dialogWin).click();
		onLinkCallback && onLinkCallback(type, args);
	}

	return {
		init: init,
	};
});
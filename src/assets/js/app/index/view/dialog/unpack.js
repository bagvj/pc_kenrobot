define(['vendor/jquery', 'app/common/util/util', 'app/common/util/emitor'], function($1, util, emitor) {
	var dialogWin;
	var show;
	var canClose;

	function init() {
		dialogWin = $('.unpack-dialog');
		
		kenrobot.on('unpack', 'show', onShow, {canReset: false}).on('unpack', 'hide', onHide, {canReset: false});
	}

	function onShow(args) {
		canClose = false;
		
		dialogWin.find(".name").text(`${args.name} ${args.version}`);
		dialogWin.find(".count").text(`${args.count}/${args.total}`);
		dialogWin.find(".x-progress").text(args.progress);

		if(!show) {
			show = true;
			util.dialog({
				onClosed: onClosed,
				onClosing: onClosing,
				selector: dialogWin
			});
		}
	}

	function onHide() {
		canClose = true;
		dialogWin.find(".x-dialog-close").trigger("click");
	}

	function onClosing() {
		return canClose;
	}

	function onClosed() {
		show = false;
		dialogWin.find(".name").text("");
		dialogWin.find(".count").text("");
		dialogWin.find(".x-progress").text("");
	}

	return {
		init: init,
	};
});
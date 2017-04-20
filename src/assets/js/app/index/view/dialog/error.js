define(['vendor/jquery', 'vendor/perfect-scrollbar', 'app/common/util/util', 'app/common/util/emitor'], function($1, $2, util, emitor) {
	var dialogWin;
	var onLinkCallback;

	function init() {
		dialogWin = $('.error-dialog').on("click", ".copy", onCopyClick);
		dialogWin.find(".output").parent().perfectScrollbar();

		kenrobot.on('error', 'show', onShow, {canReset: false});
	}

	function onShow(args) {
		args = args || {};

		var text;
		switch($.type(args.output)) {
			case "error":
				text = args.output.stack || args.output.message;
				break;
			case "array":
				text = args.output.map(function(o) {
					return $.type(o) == "error" ? (o.stack || o.message || toString(o)) : o;
				}).join("\n");
				break;
			case "string":
			default:
				text = args.output;
				break;
		}
		dialogWin.find(".output").text(text || "");

		util.dialog({
			selector: dialogWin,
			onClosed: onClosed,
			afterShow: afterShow,
		});
	}

	function afterShow() {
		dialogWin.find(".output").parent().perfectScrollbar("update");
	}

	function onClosed(e) {
		dialogWin.find(".output").empty().parent().perfectScrollbar("update");
	}

	function onCopyClick(e) {
		var output = dialogWin.find(".output").text();
		kenrobot.postMessage("app:copy", output).then(function() {
			util.message("复制成功");
			dialogWin.find(".x-dialog-close").trigger("click");
		});
	}

	return {
		init: init,
	};
});
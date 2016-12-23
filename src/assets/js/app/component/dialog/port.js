define(['vendor/jquery', 'app/util/util', 'app/util/emitor'], function($1, util, emitor) {
	var dialogWin;
	var portList;
	var callback;

	function init() {
		dialogWin = $('.port-dialog');
		portList = $('.port-list', dialogWin).on('click', '.placeholder', onShowPortSelect);

		emitor.on('port', 'show', onShow);
	}

	function onShow(args) {
		var ports = args.ports;
		callback = args.callback;

		reset();
		var ul = $("> ul", portList);
		ports.forEach(function(port) {
			$('<li>').data('value', port.path).text(port.displayName || port.path).appendTo(ul);
		});
		$('li', ul).on('click', onPortSelectClick)[0].click();

		util.dialog({
			selector: dialogWin,
			onClosed: onClosed,
			onConfirm: onConfirm,
		});
	}

	function onClosed() {
		reset();
	}

	function onConfirm() {
		var portPath = portList.data("value");
		callback(portPath);
	}

	function reset() {
		$('.placeholder', portList).empty();
		$('> ul', portList).empty();
	}

	function onShowPortSelect(e) {
		var select = $(this).closest(".x-select");
		select.toggleClass("active");
		e.stopPropagation();
	}

	function onPortSelectClick(e) {
		var li = $(this);
		var select = li.closest(".x-select");
		select.removeClass("active").data("value", li.data("value")).find(".placeholder").html(li.html());
	}

	return {
		init: init,
	};
});
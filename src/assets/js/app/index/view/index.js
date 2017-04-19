define(['./titlebar', './monitor', './dialog/about', './dialog/common', './dialog/error', './dialog/board', './dialog/port', './dialog/no-arduino', './dialog/unpack'], function(titlebar, monitor, about, common, error, board, port, noArduino, unpack) {

	function init() {
		titlebar.init();
		monitor.init();

		about.init();
		common.init();
		error.init();
		board.init();
		port.init();
		noArduino.init();
		unpack.init();
	}

	return {
		init: init,
	};
});
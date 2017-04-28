define(['./titlebar', './monitor', './dialog/login', './dialog/about', './dialog/common', './dialog/error', './dialog/board', './dialog/port', './dialog/no-arduino', './dialog/unpack'], function(titlebar, monitor, login, about, common, error, board, port, noArduino, unpack) {

	function init() {
		titlebar.init();
		monitor.init();

		login.init();
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
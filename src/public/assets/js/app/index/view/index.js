define(['./titlebar', './monitor', './dialog/update', './dialog/login', './dialog/about', './dialog/common', './dialog/error', './dialog/board', './dialog/project', './dialog/port', './dialog/no-arduino'], function(titlebar, monitor, update, login, about, common, error, board, project, port, noArduino) {

	function init() {
		titlebar.init();
		monitor.init();

		update.init();
		login.init();
		about.init();
		common.init();
		error.init();
		board.init();
		project.init();
		port.init();
		noArduino.init();
	}

	return {
		init: init,
	};
});
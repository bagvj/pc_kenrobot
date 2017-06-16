define(['./titlebar', './monitor', './dialog/update', './dialog/login', './dialog/about', './dialog/common', './dialog/prompt', './dialog/save', './dialog/saveAs', './dialog/error', './dialog/board', './dialog/project', './dialog/port', './dialog/no-arduino'], function(titlebar, monitor, update, login, about, common, prompt, save, saveAs, error, board, project, port, noArduino) {

	function init() {
		titlebar.init();
		monitor.init();

		update.init();
		login.init();
		about.init();
		common.init();
		prompt.init();
		save.init();
		saveAs.init();
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
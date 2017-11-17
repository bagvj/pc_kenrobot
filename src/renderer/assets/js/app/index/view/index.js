define(['./titlebar', './monitor', './dialog/update', './dialog/login', './dialog/about', './dialog/unpack', './dialog/common', './dialog/prompt', './dialog/save', './dialog/saveAs', './dialog/error', './dialog/board', './dialog/library', './dialog/project', './dialog/port', './dialog/no-arduino', './dialog/setting'], function(titlebar, monitor, update, login, about, unpack, common, prompt, save, saveAs, error, board, library, project, port, noArduino, setting) {

	function init() {
		titlebar.init();
		monitor.init();

		update.init();
		login.init();
		about.init();
		unpack.init();
		common.init();
		prompt.init();
		save.init();
		saveAs.init();
		error.init();
		board.init();
		library.init();
		project.init();
		port.init();
		noArduino.init();
		setting.init();
	}

	return {
		init: init,
	};
});

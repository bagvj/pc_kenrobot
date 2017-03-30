define(['./titlebar', './monitor', './dialog/about', './dialog/common', './dialog/error', './dialog/library', './dialog/port', './dialog/no-arduino'], function(titlebar, monitor, about, common, error, library, port, noArduino) {

	function init() {
		titlebar.init();
		monitor.init();

		about.init();
		common.init();
		error.init();
		library.init();
		port.init();
		noArduino.init();
	}

	return {
		init: init,
	};
});
define(['./titlebar', './monitor', './dialog/about', './dialog/common', './dialog/error', './dialog/library', './dialog/port'], function(titlebar, monitor, about, common, error, library, port) {

	function init() {
		titlebar.init();
		monitor.init();

		about.init();
		common.init();
		error.init();
		library.init();
		port.init();
	}

	return {
		init: init,
	};
});
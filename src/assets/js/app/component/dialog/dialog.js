define(['./common', './port', './library', './error', './about'], function(common, port, library, error, about) {

	function init() {
		common.init();
		port.init();
		library.init();
		error.init();
		about.init();
	}

	return {
		init: init,
	};
});
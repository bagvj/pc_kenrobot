define(['./common', './port', './installDriver', './library', './error'], function(common, port, installDriver, library, error) {

	function init() {
		common.init();
		port.init();
		installDriver.init();
		library.init();
		error.init();
	}

	return {
		init: init,
	};
});
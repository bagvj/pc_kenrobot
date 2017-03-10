define(['./common', './port', './installDriver', './library'], function(common, port, installDriver, library) {

	function init() {
		common.init();
		port.init();
		installDriver.init();
		library.init();
	}

	return {
		init: init,
	};
});
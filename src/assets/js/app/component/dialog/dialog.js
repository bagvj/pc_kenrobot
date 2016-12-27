define(['./common', './port', './installDriver'], function(common, port, installDriver) {

	function init() {
		common.init();
		port.init();
		installDriver.init();
	}

	return {
		init: init,
	};
});
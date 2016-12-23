define(['./common', './login', './project', './port', './installExt', './installDriver', './share'], function(common, login, project, port, installExt, installDriver, share) {

	function init() {
		common.init();
		login.init();
		project.init();
		port.init();
		installExt.init();
		installDriver.init();
		share.init();
	}

	return {
		init: init,
	};
});
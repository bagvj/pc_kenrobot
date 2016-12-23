define(['./mainController', './userController', './projectController'], function(mainController, userController, projectController) {

	function init() {
		mainController.init();
		userController.init();
		projectController.init();
	}

	return {
		init: init,
	};
});
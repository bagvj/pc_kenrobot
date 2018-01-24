define(['./mainController', './projectController'], function(mainController, projectController) {

	function init() {
		mainController.init();
		projectController.init();
	}

	return {
		init: init,
	};
});
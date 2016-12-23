define(['vendor/jquery', 'app/util/emitor', 'app/model/reportModel', './controller/controller', './component/component'], function($1, emitor, reportModel, controller, component) {

	function init() {
		reportModel.init();
		controller.init();
		component.init();

		emitor.trigger('app', 'start');
	}

	return {
		init: init,
	}
});
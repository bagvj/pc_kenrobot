define(['app/common/util/emitor', 'app/common/util/report', 'app/common/config/config', './controller/index'], function(emitor, report, config, controller) {

	function init() {
		window.kenrobot = window.kenrobot || top.kenrobot;
		
		report.init(config.debug);
		controller.init();

		emitor.trigger('app', 'start');
	}

	return {
		init: init,
	}
});
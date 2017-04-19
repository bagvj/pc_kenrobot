define(['app/common/util/emitor', 'app/common/util/report', 'app/common/config/config', './controller/index', './view/index'], function(emitor, report, config, controller, view) {

	function init() {
		window.kenrobot = window.kenrobot || {};
		
		kenrobot.postMessage("app:getAppInfo").then(info => {
			kenrobot.appInfo = info;

			report.init(config.debug);
			controller.init();
			view.init();

			emitor.trigger('app', 'start');
		});
	}

	return {
		init: init,
	}
});
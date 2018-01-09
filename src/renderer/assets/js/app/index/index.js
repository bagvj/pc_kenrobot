define(['app/common/util/emitor', 'app/common/util/report', './controller/index', './view/index'], function(emitor, report, controller, view) {

	function init() {
		window.kenrobot && kenrobot.postMessage && kenrobot.postMessage("app:getAppInfo").then(info => {
			kenrobot.appInfo = info;

			report.init();
			controller.init();
			view.init();

			emitor.trigger('app', 'start');
		});
	}

	return {
		init: init,
	}
});
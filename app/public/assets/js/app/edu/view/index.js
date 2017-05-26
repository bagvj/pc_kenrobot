define(['vendor/jquery', 'app/common/util/util', 'app/common/util/emitor', './hardware', './software', './code'], function($1, util, emitor, hardware, software, code) {
	var region;

	function init() {
		region = $('.content-region');

		hardware.init();
		software.init();
		code.init();

		emitor.on('app', 'start', onAppStart).on("app", "activeTab", onActiveTab);
	}

	function onAppStart() {
		emitor.trigger("app", "activeTab", "hardware");
	}

	function onActiveTab(name) {
		var tab = $('.tab-' + name, region);
		util.toggleActive(tab);
		emitor.delayTrigger(300, name, "resize");
	}

	return {
		init: init,
	};
});
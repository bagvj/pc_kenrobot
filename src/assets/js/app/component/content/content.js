define(['vendor/jquery', 'app/util/util', 'app/util/emitor', './titlebar', './hardware', './software', './code'], function($1, util, emitor, titlebar, hardware, software, code) {
	var region;

	function init() {
		region = $('.content-region');

		titlebar.init();
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
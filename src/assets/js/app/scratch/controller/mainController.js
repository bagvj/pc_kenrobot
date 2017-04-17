define(['vendor/jquery', 'vendor/mousetrap', 'app/common/util/util', 'app/common/util/emitor', 'app/common/config/config', '../config/menu'], function($1, Mousetrap, util, emitor, config, menu) {
	var mainWrap;

	function init() {
		emitor.on('app', 'start', onAppStart);
	}

	function onAppStart() {
		kenrobot.trigger("app-menu", "load", menu, "scratch");
	}

	return {
		init: init,
	};
});
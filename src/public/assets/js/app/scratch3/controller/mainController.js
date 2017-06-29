define(['app/common/util/emitor', '../config/menu'], function(emitor, menu) {

	function init() {
		emitor.on('app', 'start', onAppStart);

		kenrobot.on('app-menu', 'do-action', onMenuAction);
	}

	function onAppStart() {
		kenrobot.trigger("app-menu", "load", menu, "scratch3");
	}

	function onMenuAction(action) {
		kenrobot.trigger("app", "command", action);
	}

	return {
		init: init,
	};
});
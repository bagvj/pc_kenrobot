define(['app/common/util/emitor', '../config/menu'], function(emitor, menu) {

	function init() {
		emitor.on('app', 'start', onAppStart);

		kenrobot.on('app-menu', 'do-action', onMenuAction).on("project", "open-by", onProjectOpenBy);
	}

	function onAppStart() {
		kenrobot.trigger("app-menu", "load", menu, "scratch2");
	}

	function onMenuAction(action) {
		kenrobot.trigger("app", "command", action);
	}

	function onProjectOpenBy(name, type) {
		if(type != "scratch2") {
			return
		}

		kenrobot.trigger("app", "command", "open-project", name);
	}

	return {
		init: init,
	};
});
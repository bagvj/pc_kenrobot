define(['vendor/jquery', 'vendor/director', 'vendor/mousetrap', 'app/config/config', 'app/util/util', 'app/util/emitor'], function($1, $2, Mousetrap, config, util, emitor) {
	var mainWrap;
	var router;

	function init() {
		configRoute();

		targetHandle();

		$(window).on('contextmenu', onContextMenu).on('click', onWindowClick).on('resize', onWindowResize);

		emitor.on('app', 'start', onAppStart);
		emitor.on('app', 'shortcut', onShortcut);

		emitor.on('route', 'set', onSetRoute);
		emitor.on('route', 'init', onInitRoute);
	}

	function onAppStart() {
		var shortcuts = [{
			key: ["ctrl+n", "command+n"],
			name: "new-project"
		}, {
			key: ["ctrl+o", "command+o"],
			name: "open-project"
		}, {
			key: ["ctrl+s", "command+s"],
			name: "save-project"
		}, {
			key: ["ctrl+shift+s", "command+shift+s"],
			name: "save-as-project"
		}, {
			key: ["ctrl+/", "command+/"],
			name: "toggle-comment"
		}, {
			key: ["ctrl+c", "command+c"],
			name: "copy"
		}];

		shortcuts.forEach(function(shortcut){
			Mousetrap.bind(shortcut.key, function() {
				onShortcut(shortcut.name);

				return false;
			});
		});
	}

	function targetHandle() {
		$('.open-url').off('click').on('click', function() {
			var url = $(this).data('href');
			kenrobot.postMessage("app:openUrl", url);
		});
	}

	function onShortcut(name) {
		var args = Array.from(arguments);
		switch(name) {
			case "new-project":
				emitor.trigger('project', 'view', 'new');
				break;
			case "open-project":

				break;
			case "save-project":
				emitor.trigger('project', 'save', null, 'file');
				break;
			case "save-as-project":

				break;
			case "toggle-comment":

				break;
			case "copy":

				break;
		}
	}

	function onContextMenu(e) {
		e.preventDefault();

		hideContextMenu();
		hideSelectMenu();

		emitor.trigger("app", "contextMenu", e);

		return false;
	}

	function onWindowClick(e) {
		hideContextMenu();
		hideSelectMenu();
	}

	function onWindowResize(e) {
		hideContextMenu();
		hideSelectMenu();
	}

	function configRoute() {
		router = Router({
			'/': onRouteDefault,
			'/project/([0-9a-zA-Z]{6}|new|temp)/?': onRouteViewProject,
			'.*': onRouteOther, 
		});
	}

	function onInitRoute() {
		router.init("/");
	}

	function onRouteDefault() {
		emitor.trigger("project", "view");
	}

	function onRouteViewProject(hash) {
		emitor.trigger("project", "view", hash);
	}

	function onRouteOther() {
		onSetRoute("/");
	}

	function onSetRoute(path) {
		router.setRoute(path);
	}

	function hideSelectMenu() {
		$('.x-select').removeClass("active");
	}

	function hideContextMenu() {
		$('.x-context-menu').removeClass("active");
	}

	return {
		init: init,
	};
});
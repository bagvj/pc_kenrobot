define(['vendor/jquery', 'vendor/mousetrap', 'app/util/util', 'app/util/emitor'], function($1, Mousetrap, util, emitor) {
	var mainWrap;

	function init() {
		targetHandle();

		$(window).on('contextmenu', onContextMenu).on('click', onWindowClick).on('resize', onWindowResize);

		emitor.on('app', 'start', onAppStart).on('app', 'shortcut', onShortcut);

		kenrobot.on("app:onDownloadSuccess", onDownloadSuccess);
	}

	function onAppStart() {
		registerShortcut();
	}

	function onDownloadSuccess(path, action) {
		emitor.trigger("download", "success", path, action);
	}

	function targetHandle() {
		$('.open-url').off('click').on('click', function() {
			var url = $(this).data('href');
			kenrobot.postMessage("app:openUrl", url);
		});
	}

	function registerShortcut() {
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

	function onShortcut(name) {
		// var args = Array.from(arguments);
		switch(name) {
			case "new-project":
				emitor.trigger('project', 'new');
				break;
			case "open-project":
				emitor.trigger('project', 'open');
				break;
			case "save-project":
				emitor.trigger('project', 'save');
				break;
			case "save-as-project":
				emitor.trigger('project', 'save', true);
				break;
			case "toggle-comment":

				break;
			case "copy":

				break;
		}
	}

	function onContextMenu(e) {
		e.preventDefault();

		hideMenu();

		emitor.trigger("app", "contextMenu", e);

		return false;
	}

	function onWindowClick(e) {
		hideMenu();
	}

	function onWindowResize(e) {
		hideMenu();
		emitor.trigger("app", "resize", e);
	}

	function hideMenu() {
		$('.x-select, .x-context-menu').removeClass("active");
	}

	return {
		init: init,
	};
});
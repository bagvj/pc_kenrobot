define(['vendor/jquery', 'vendor/mousetrap', 'app/common/util/util', 'app/common/util/emitor', 'app/common/config/config', '../config/menu'], function($1, Mousetrap, util, emitor, config, menu) {
	function init() {
		$(window).on('contextmenu', onContextMenu).on('click', onWindowClick).on('resize', onWindowResize);

		emitor.on('app', 'start', onAppStart);
		kenrobot.on('app', 'will-leave', onAppWillLeave).on('app-menu', 'do-action', onMenuAction);
	}

	function onAppStart() {
		registerShortcut();

		loadExamples().then(exampleMenu => {
			var exampleMenuItem = menu.find(menuItem => menuItem.id && menuItem.id == "example");
			var buildInMenuItem = exampleMenuItem.menu.find(menuItem => menuItem.id && menuItem.id == "example-built-in");
			buildInMenuItem.menu = exampleMenu;
			
			kenrobot.trigger("app-menu", "load", menu, "edu");
		});
	}

	function onAppWillLeave() {
		emitor.trigger("app", "will-leave");
	}

	function loadExamples() {
		var promise = $.Deferred();

		kenrobot.postMessage("app:loadExamples").then(function(examples) {
			var exampleMenu = examples.map(ca => {
				return {
					placeholder: ca.category,
					arrow: true,
					menu: ca.list.map(example => {
						return {
							text: example.name,
							action: "open-example",
							extra: {
								name: example.name,
								category: example.category,
							},
						};
					}),
				};
			});
			promise.resolve(exampleMenu);
		}, function(err) {
			promise.resolve([]);
			util.message({
				text: "加载案例失败",
				type: "error",
			});
		});

		return promise;
	}

	function onMenuAction(action, extra) {
		switch (action) {
			case "new-project":
			case "open-project":
			case "save-project":
			case "save-as-project":
			case "toggle-comment":
			case "copy":
				onShortcut(action);
				break;
			case "open-example":
				kenrobot.postMessage("app:openExample", extra.category, extra.name).then(projectInfo => {
					emitor.trigger("project", "open", projectInfo);
				}, _ => {
					util.message("打开失败");
				});
				break;
		}
	}

	function onShortcut(name) {
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


	return {
		init: init,
	};
});
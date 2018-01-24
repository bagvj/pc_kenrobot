define(['vendor/jquery', 'vendor/mousetrap', 'vendor/lodash', 'app/common/util/util', 'app/common/util/emitor', 'app/common/config/config', '../config/menu'], function($1, Mousetrap, _, util, emitor, config, menu) {
	function init() {
		$(window).on('contextmenu', onContextMenu).on('click', onWindowClick).on('resize', onWindowResize);

		emitor.on('app', 'start', onAppStart);
		kenrobot.on('app', 'will-leave', onAppWillLeave).on('app-menu', 'do-action', onMenuAction);
	}

	function onAppStart() {
		registerShortcut();

		loadExamples().then(exampleMenu => {
			var exampleMenuItem = menu.find(menuItem => menuItem.id && menuItem.id == "example");
			exampleMenuItem.menu = exampleMenu;

			kenrobot.trigger("app-menu", "load", menu, "default");
		});

		kenrobot.postMessage("app:getCache", "setting").then(setting => {
			setting = setting || {}
			Object.keys(setting).forEach(type => {
				var specSettings = setting[type]
				for(var name in specSettings) {
					kenrobot.trigger("setting", "change", type, name, specSettings[name]);
				}
			})
		});
	}

	function onAppWillLeave() {
		emitor.trigger("app", "will-leave");
	}

	function loadExamples() {
		var promise = $.Deferred();

		kenrobot.postMessage("app:loadExamples").then(examples => {
			var exampleMenu = [];
			examples.forEach(exampleGroup => {
				var groupMenu
				if(exampleGroup.builtIn) {
					groupMenu = {
						id: "built-in-examples",
						placeholder: "内置示例",
						arrow: true,
						menuCls: "example-built-in",
					}
					exampleMenu.push(groupMenu)
					exampleMenu.push("_");
				} else {
					groupMenu = {
						id: `${exampleGroup.package}-examples`,
						placeholder: `${exampleGroup.package}示例`,
						arrow: true,
						menuCls: "example-third-party",
					}
					exampleMenu.push(groupMenu)
				}

				var groups = _.groupBy(exampleGroup.examples, "category");
				groupMenu.menu = Object.keys(groups).map(category => {
					return {
						placeholder: category,
						arrow: true,
						menu: groups[category].map(example => {
							return {
								text: example.name,
								action: "open-example",
								extra: {
									name: example.name,
									path: example.path,
								}
							};
						}),
					};
				});
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
			case "export":
				onShortcut(action);
				break;
			case "open-example":
				kenrobot.trigger("project", "open-example", extra);
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
				emitor.trigger('code', 'toggle-comment');
				break;
			case "copy":
				emitor.trigger('code', 'copy');
				break;
			case "export":
				emitor.trigger('code', 'export');
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

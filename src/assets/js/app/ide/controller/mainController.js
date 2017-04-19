define(['vendor/jquery', 'vendor/mousetrap', 'app/common/util/util', 'app/common/util/emitor', 'app/common/config/config', '../config/boards', '../config/menu'], function($1, Mousetrap, util, emitor, config, boards, menu) {
	var mainWrap;

	function init() {
		$(window).on('contextmenu', onContextMenu).on('click', onWindowClick).on('resize', onWindowResize);

		emitor.on('app', 'start', onAppStart);
		kenrobot.on('app', 'will-leave', onAppWillLeave).on('app-menu', 'do-action', onMenuAction);
	}

	function onAppStart() {
		$.when(loadBoards(), loadExamples()).then((boardMenu, exampleMenu) => {
			var optionsMenuItem = menu.find(menuItem => menuItem.id && menuItem.id == "options");
			var boardMenuItem = optionsMenuItem.menu.find(menuItem => menuItem.id && menuItem.id == "boards");
			boardMenuItem.menu = boardMenu;

			var exampleMenuItem = menu.find(menuItem => menuItem.id && menuItem.id == "example");
			var buildInMenuItem = exampleMenuItem.menu.find(menuItem => menuItem.id && menuItem.id == "example-built-in");
			buildInMenuItem.menu = exampleMenu;
			
			kenrobot.trigger("app-menu", "load", menu, "ide");
		});
	}

	function onAppWillLeave() {
		emitor.trigger("app", "will-leave");
	}

	function loadBoards() {
		var promise = $.Deferred();

		var boardList = boards.concat();
		kenrobot.postMessage("app:loadPackages").then(function(packages) {
			packages.forEach(function(pkg) {
				pkg.boards && (boardList = boardList.concat(pkg.boards));
			});
		})
		.fin(function() {
			var boardMenu = boardList.map(board => {
				return {
					text: board.label,
					action: "set-board",
					cls: "check",
					extra: {
						name: board.name,
						type: board.type,
						build: board.build,
						upload: board.upload
					},
				};
			});
			boardMenu.unshift({
				text: "开发板管理",
				action: "show-board-dialog",
			}, "_");
			promise.resolve(boardMenu);
		});

		return promise
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

	function onMenuAction(action, extra, li) {
		switch (action) {
			case "new":
				emitor.trigger('project', 'new');
				break;
			case "open":
				emitor.trigger('project', 'open');
				break;
			case "save":
				emitor.trigger('project', 'save');
				break;
			case "save-as":
				emitor.trigger('project', 'save', true);
				break;
			case "toggle-comment":

				break;
			case "copy":

				break;
			case "open-example":
				kenrobot.postMessage("app:openExample", extra.category, extra.name, "ino").then(code => {
					emitor.trigger("project", "open", code);
				}, _ => {
					util.message("打开失败");
				});
				break;
			case "set-board":
				emitor.trigger("board", "change", extra);
				util.toggleActive(li);
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
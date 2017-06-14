define(['vendor/jquery', 'vendor/mousetrap', 'app/common/util/util', 'app/common/util/emitor', 'app/common/config/config', '../config/menu'], function($1, Mousetrap, util, emitor, config, menu) {

	var projectPath;

	function init() {
		emitor.on('app', 'start', onAppStart);

		kenrobot.on('app-menu', 'do-action', onMenuAction);
	}

	function onAppStart() {
		registerShortcut();
		
		kenrobot.trigger("app-menu", "load", menu, "scratch3");

		var timerId;
		timerId = setInterval(_ => {
			if(kenrobot.view && kenrobot.view.getProject) {
				var defaultProject = kenrobot.view.getProject();
				kenrobot.view.newProject = () => {
					kenrobot.view.loadProject(defaultProject);
				};
				
				clearInterval(timerId);
			}
		}, 3000);
	}

	function onMenuAction(action, extra, li) {
		switch (action) {
			case "new-project":
				kenrobot.view.newProject();
				break;
			case "open-project":
				kenrobot.postMessage("app:showOpenDialog", {
					filters: [{name: "json", extensions: ["json"]}],
					properties: ["openFile"],
				}).then(path => {
					kenrobot.postMessage("app:readFile", path).then(content => {
						projectPath = path;
						kenrobot.view.loadProject(content);
						util.message("打开成功");
					}, err => {
						util.message({
							text: "打开失败",
							type: "error",
						});
					});
				}, err => {
					util.message({
						text: "打开失败",
						type: "error",
					});
				});
				break;
			case "save-project":
				if(projectPath) {
					saveProject(projectPath);
				} else {
					kenrobot.postMessage("app:showSaveDialog", {
						filters: [{name: "json", extensions: ["json"]}],
					}).then(path => {
						saveProject(path);
					}, err => {
						util.message({
							text: "保存失败",
							type: "error",
						});
					});
				}
				break;
			case "save-as-project":
				kenrobot.postMessage("app:showSaveDialog", {
					filters: [{name: "json", extensions: ["json"]}],
				}).then(path => {
					saveProject(path);
				}, err => {
					util.message({
						text: "保存失败",
						type: "error",
					});
				});
				break;
		}
	}

	function saveProject(path) {
		kenrobot.postMessage("app:writeFile", path, kenrobot.view.getProject()).then(_ => {
			projectPath = path;
			util.message("保存成功");
		}, err => {
			util.message({
				text: "保存失败",
				type: "error",
			});
		});
	}

	function onShortcut(name) {
		switch(name) {
			case "new-project":
				onMenuAction("new-project");
				break;
			case "open-project":
				onMenuAction("open-project");
				break;
			case "save-project":
				onMenuAction("save-project");
				break;
			case "save-as-project":
				onMenuAction("save-as-project");
				break;
		}
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
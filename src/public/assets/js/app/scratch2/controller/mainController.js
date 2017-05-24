define(['vendor/jquery', 'vendor/mousetrap', 'app/common/util/util', 'app/common/util/emitor', 'app/common/config/config', '../config/menu'], function($1, Mousetrap, util, emitor, config, menu) {
	var mainWrap;
	var projectPath;

	function init() {
		emitor.on('app', 'start', onAppStart);

		kenrobot.on('app-menu', 'do-action', onMenuAction);
	}

	function onAppStart() {
		kenrobot.trigger("app-menu", "load", menu, "scratch2");
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

	return {
		init: init,
	};
});
define(['vendor/jquery', 'vendor/mousetrap', 'app/common/util/util', 'app/common/util/emitor', 'app/common/config/config', '../config/menu'], function($1, Mousetrap, util, emitor, config, menu) {
	var scratch;
	var projectExtra = {};

	function init() {
		scratch = document.getElementById("ken-scratch");
		emitor.on('app', 'start', onAppStart);

		kenrobot.view.saveProject = saveProject;

		kenrobot.on('app-menu', 'do-action', onMenuAction).on("project", "open-by", onProjectOpenBy);
	}

	function onAppStart() {
		registerShortcut();

		kenrobot.trigger("app-menu", "load", menu, "scratch2");
	}

	function onMenuAction(action) {
		switch (action) {
			case "new-project":
				projectExtra = {};
				scratch.newProject();
				break;
			case "open-project":
				onOpenProject();
				break;
			case "save-project":
				onSaveProject();
				break;
			case "save-as-project":
				onSaveProject(true);
				break;
			case "undelete":
				scratch.undelete();
				break;
			case "toggle-samll-stage":
				scratch.toggleSmallStage();
				break;
			case "toggle-turbo-mode":
				scratch.toggleTurboMode();
				break;
			case "edit-block-colors":
				scratch.editBlockColors();
				break;
		}
	}

	function onProjectOpenBy(name, type) {
		if(type != "scratch2") {
			return
		}

		onOpenProject(name);
	}

	function onOpenProject(name) {
		kenrobot.postMessage("app:projectNewOpen", "scratch2", name).then(result => {
			projectExtra = result.extra;
			scratch.loadProject(result.data);
			scratch.setProjectName(projectExtra.name);

			if(kenrobot.getUserInfo()) {
				util.message("打开成功");
			} else {
				util.message("打开成功");
			}
		}, err => {
			util.message({
				text: "打开失败",
				type: "error",
			});
		});
	}

	function onSaveProject(saveAs) {
		var doSave = _ => {
			if(projectExtra.path) {
				scratch.exportProject(saveAs);
			} else {
				kenrobot.trigger("prompt", "show", {
					title: "项目保存",
					placeholder: "项目名字",
					callback: name => {
						if(!name) {
							util.message("保存失败");
							return
						}

						projectExtra.name = name;
						scratch.setProjectName(projectExtra.name);
						scratch.exportProject(saveAs);
					}
				});
			}
		}

		if(kenrobot.getUserInfo() || saveAs || projectExtra.hasShowSave) {
			doSave();
		} else {
			projectExtra.hasShowSave = true;
			kenrobot.trigger("save", "show", doSave);
		}
	}

	function saveProject(projectData, saveAs) {
		var promise
		if(saveAs) {
			promise = kenrobot.postMessage("app:projectNewSaveAs", projectExtra.name, "scratch2", projectData)
		} else {
			promise = kenrobot.postMessage("app:projectNewSave", projectExtra.name, "scratch2", projectData, projectExtra.path)
		}

		promise.then(result => {
			projectExtra = $.extend(projectExtra, result);
			scratch.setProjectName(projectExtra.name);

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
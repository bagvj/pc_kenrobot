define(['vendor/jquery', 'vendor/mousetrap', 'app/common/util/util', 'app/common/util/emitor', 'app/common/config/config', '../config/menu'], function($1, Mousetrap, util, emitor, config, menu) {

	var projectExtra = {};

	function init() {
		emitor.on('app', 'start', onAppStart);

		kenrobot.on('app-menu', 'do-action', onMenuAction).on("project", "open-by", onProjectOpenBy);;
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
				projectExtra = {};
				kenrobot.view.newProject();
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
		}
	}

	function onProjectOpenBy(name, type) {
		if(type != "scratch3") {
			return
		}

		onOpenProject(name);
	}

	function onOpenProject(name) {
		kenrobot.postMessage("app:projectNewOpen", "scratch3", name).then(result => {
			projectExtra = result.extra
			kenrobot.view.loadProject(result.data);
			util.message("打开成功");
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
				saveProject(kenrobot.view.getProject(), saveAs);
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
						saveProject(kenrobot.view.getProject(), saveAs);
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
		var promise;
		if(saveAs) {
			promise = kenrobot.postMessage("app:projectNewSaveAs", projectExtra.name, "scratch3", projectData);
		} else {
			promise = kenrobot.postMessage("app:projectNewSave", projectExtra.name, "scratch3", projectData, projectExtra.path);
		}

		promise.then(result => {
			projectExtra = $.extend(projectExtra, result);
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
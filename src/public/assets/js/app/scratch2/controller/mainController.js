define(['vendor/jquery', 'vendor/mousetrap', 'app/common/util/util', 'app/common/util/emitor', 'app/common/config/config', '../config/menu'], function($1, Mousetrap, util, emitor, config, menu) {
	var scratch;
	var projectPath;
	var projectName;

	function init() {
		scratch = document.getElementById("ken-scratch");
		emitor.on('app', 'start', onAppStart);

		kenrobot.view.saveProject = saveProject;

		kenrobot.on('app-menu', 'do-action', onMenuAction);
	}

	function onAppStart() {
		registerShortcut();

		kenrobot.trigger("app-menu", "load", menu, "scratch2");
	}

	function onMenuAction(action) {
		switch (action) {
			case "new-project":
				projectName = null;
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

	function onOpenProject() {
		kenrobot.postMessage("app:projectNewOpen", "scratch2").then(result => {
			scratch.loadProject(result.data);
			setProjectName(result.name);
			util.message("打开成功");
		}, err => {
			util.message({
				text: "打开失败",
				type: "error",
			});
		});
	}

	function onSaveProject(saveAs) {
		if(projectName) {
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

					setProjectName(name);
					scratch.exportProject(saveAs);
				}
			});
		}
	}

	function saveProject(projectData, saveAs) {
		var message = saveAs ? "app:projectNewSaveAs" : "app:projectNewSave";
		kenrobot.postMessage(message, projectName, "scratch2", projectData).then(savePath => {
			saveAs && setProjectName(savePath);
			util.message("保存成功");
		}, err => {
			if(err && err.status == "PROMPT_LOGIN") {
				// kenrobot.trigger("")
				return
			}

			util.message({
				text: "保存失败",
				type: "error",
			});
		});
	}

	function setProjectName(savePath) {
		var names = savePath.split(/\/|\\/);
		var name = names[names.length - 1];
		var index = name.indexOf(".");
		name = index >= 0 ? name.substring(0, index) : name;

		projectName = name;
		scratch.setProjectName(name);
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
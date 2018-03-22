define(['vendor/jquery', 'vendor/lodash', 'app/common/util/util', 'app/common/util/emitor', 'app/common/util/progress', '../config/blocks', '../view/hardware', '../view/software', '../view/code'], function($1, _, util, emitor, progress, blocks, hardware, software, code) {
	var currentProject;
	var savePath;
	var hasShowSave;

	function init() {
		emitor.on('app', 'start', onAppStart)
		    .on('project', 'new', onProjectNew)
			.on('project', 'open', onProjectOpen)
			.on('project', 'save', onProjectSave)
			.on("project", "load", onProjectLoad)
			.on('project', 'upload', onProjectUpload)
			.on('project', 'check', onProjectCheck)
			.on('code', 'refresh', onCodeRefresh)
			.on('code', 'copy', onCodeCopy)
			.on('code', 'export', onCodeExport)
			.on('software', 'update-block', onSoftwareBlockUpdate);

		kenrobot.on("project", "open", onProjectOpen)
			.on('project', 'open-example', onProjectOpenExample)
			.on("project", "save", onProjectSave)
			.on("project", "load", onProjectLoad)
			.listenMessage("app:onLoadProject", onLoadProject)
			.listenMessage("app:onBeforeQuit", onBeforeQuit);
	}

	function onAppStart() {
		loadPackages().then(schema => {
			hardware.loadSchema(schema);
			software.loadSchema(schema);

			loadOpenOrRecentProject();
		});
	}

	function onBeforeQuit() {
		askSaveProject(() => kenrobot.postMessage("app:exit"));
	}

	function loadPackages() {
		var promise = $.Deferred();

		var schema = {
			packages: [],
			boards: [],
			components: [],
			blocks: blocks.concat(),
		};

		kenrobot.postMessage("app:loadPackages").then(pkgs => {
			schema.packages = pkgs;
			schema.packages.forEach(pkg => {
				pkg.logo = pkg.logo ? `${pkg.protocol}${pkg.path}/${pkg.logo}` : "../assets/image/default-vendor-logo.png";
				pkg.boards && pkg.boards.forEach(board => {
					board.imageUrl = `${pkg.protocol}${pkg.path}/${board.imageUrl}`;
					schema.boards.push(board);

					board.blocks && (schema.blocks = schema.blocks.concat(board.blocks));
				});

				pkg.components && pkg.components.forEach(component => {
					component.package = pkg.name;
					component.imageUrl = `${pkg.protocol}${pkg.path}/${component.imageUrl}`;
					schema.components.push(component);

					component.blocks && (schema.blocks = schema.blocks.concat(component.blocks));
				});

				pkg.blocks && (schema.blocks = schema.blocks.concat(pkg.blocks));
			});
		}).fin(() => promise.resolve(schema));

		return promise
	}

	function loadOpenOrRecentProject() {
		kenrobot.postMessage("app:loadOpenOrRecentProject").then(result => {
			doLoadProject(result.path, result.data);
		}, () => {
			doLoadProject(null, getDefaultProject());
		});
	}

	function doLoadProject(projectPath, projectInfo, message) {
		emitor.trigger("code", "stop-refresh");

		currentProject && (currentProject.project_data = getProjectData());
		currentProject = projectInfo;

		var projectData = projectInfo.project_data;
		hardware.setData(projectData.hardware);
		software.setData(projectData.software);
		code.setData(projectData.code);
		code.setMode(projectData.mode);

		(!projectData.mode || projectData.mode == "block") && emitor.trigger("code", "start-refresh");
		emitor.trigger("app", "activeTab", projectData.mode == "text" ? "software" : "hardware");

		savePath = projectPath;
		hasShowSave = false;

		kenrobot.postMessage("app:setCache", "recentProject", savePath);
		kenrobot.trigger("app", "setTitle", savePath);

		util.message({
			text: message || "打开成功",
			type: "success"
		});

		currentProject.project_data = getProjectData();
	}

	function onLoadProject(result) {
		askSaveProject(() => onProjectLoad(result));
	}

	function onProjectLoad(result) {
		doLoadProject(result.path, result.data);
	}

	function onProjectNew() {
		askSaveProject(() => doLoadProject(null, getDefaultProject(), "新建成功"));
	}

	function onProjectOpen(name, callback) {
		askSaveProject(() => {
			kenrobot.postMessage("app:projectOpen", name).then(result => {
				onProjectLoad(result);
				callback();
			}, () => {
				util.message({
					text: "打开失败",
					type: "error",
				});
			});
		});
	}

	function onProjectOpenExample(extra) {
		askSaveProject(() => {
			kenrobot.postMessage("app:openExample", extra.path).then(onProjectLoad, () => {
				util.message("打开失败");
			});
		});
	}

	function onProjectSave(saveAs, callback) {
		var promise = $.Deferred();
		onCodeRefresh();

		var projectInfo = getCurrentProject();
		projectInfo.project_data = getProjectData();

		doProjectSave(projectInfo, saveAs).then(result => {
			util.message({
				text: "保存成功",
				type: "success"
			});

			callback && setTimeout(() => callback(), 100);
			promise.resolve();
		}, () => {
			util.message({
				text: "保存失败",
				type: "warning",
			});
			promise.reject();
		});

		return promise;
	}

	function onProjectUpload() {
		onCodeRefresh();

		var projectInfo = getCurrentProject();
		projectInfo.project_data = getProjectData();
		var boardData = hardware.getBoardData();
		var options = {
			build: boardData.build,
			upload: boardData.upload,
		};

		doProjectSave(projectInfo, !savePath).then(result => {
			emitor.trigger("ui", "lock", "build", true);
			util.message("保存成功，开始编译");
			kenrobot.postMessage("app:buildProject", result.path, options).then(targetPath => {
				util.message("编译成功，正在上传");
				setTimeout(() => {
					var uploadProgressHelper = {};
					kenrobot.postMessage("app:uploadFirmware", targetPath, options).then(() => {
						emitor.trigger("ui", "lock", "build", false);
						util.message({
							text: "上传成功",
							type: "success"
						});
						trySimulate(projectInfo, targetPath);
					}, function(err) {
						if(err.status == "SELECT_PORT" || err.status == "NO_ARDUINO_PORT") {
							kenrobot.trigger("port", "show", {
								ports: err.ports,
								callback: function(port) {
									if(!port) {
										emitor.trigger("ui", "lock", "build", false);
										util.message("上传取消");
										return
									}
									util.message("正在上传");
									uploadProgressHelper = {};
									kenrobot.postMessage("app:uploadFirmware", targetPath, options, port.comName).then(() => {
										emitor.trigger("ui", "lock", "build", false);
										util.message({
											text: "上传成功",
											type: "success"
										});
										trySimulate(projectInfo, targetPath);
									}, function(err1) {
										emitor.trigger("ui", "lock", "build", false);
										kenrobot.trigger("build", "error", "上传失败", err1);
									}, function(progressData) {
										emitor.trigger("progress", "upload", progress.matchUploadProgress(uploadProgressHelper, progressData.data, boardData.type), "upload");
									});
								}
							});
						} else if(err.status == "PORT_NOT_FOUND") {
							emitor.trigger("ui", "lock", "build", false);
							kenrobot.trigger("no-arduino", "show");
						} else {
							emitor.trigger("ui", "lock", "build", false);
							kenrobot.trigger("build", "error", "上传失败", err);
						}
					}, function(progressData) {
						emitor.trigger("progress", "upload", progress.matchUploadProgress(uploadProgressHelper, progressData.data, boardData.type), "upload");
					});
				}, 2000);
			}, function(err) {
				emitor.trigger("ui", "lock", "build", false);
				kenrobot.trigger("build", "error", "编译失败", err);
			}, function(progressData) {
				emitor.trigger("progress", "upload", progress.matchBuildProgress(progressData.data), "build");
			});
		}, () => {
			util.message({
				text: "保存失败",
				type: "warning",
			});
		});
	}

	function onProjectCheck() {
		onCodeRefresh();

		var projectInfo = getCurrentProject();
		projectInfo.project_data = getProjectData();
		var boardData = hardware.getBoardData();
		var options = {
			build: boardData.build,
			upload: boardData.upload,
		};

		util.message("正在验证，请稍候");
		doProjectSave(projectInfo, true, true).then(result => {
			emitor.trigger("ui", "lock", "build", true);
			kenrobot.postMessage("app:buildProject", result.path, options).then(targetPath => {
				emitor.trigger("ui", "lock", "build", false);
				util.message("验证成功");
				trySimulate(projectInfo, targetPath);
			}, function(err) {
				emitor.trigger("ui", "lock", "build", false);
				kenrobot.trigger("build", "error", "验证失败", err);
			}, function(progressData) {
				emitor.trigger("progress", "check", progress.matchBuildProgress(progressData.data))
			});
		}, () => {
			util.message({
				text: "保存失败",
				type: "warning",
			});
		});
	}

	function doProjectSave(projectInfo, saveAs, isTemp) {
		var promise = $.Deferred();

		var doSave = projectName => {
			var savePromise
			if(saveAs) {
				savePromise = kenrobot.postMessage("app:projectSaveAs", projectName, projectInfo, isTemp);
			} else {
				savePromise = kenrobot.postMessage("app:projectSave", projectName, projectInfo, savePath);
			}

			savePromise.then(result => {
				if(!isTemp) {
					projectInfo.project_name = result.project_name;
					projectInfo.project_type = result.project_type;
					projectInfo.updated_at = result.updated_at;

					savePath = result.path;
					kenrobot.trigger("app", "setTitle", savePath);
					kenrobot.postMessage("app:setCache", "recentProject", savePath);
				}
				saveAs && (hasShowSave = false);
				promise.resolve(result);
			}, err => {
				promise.reject(err);
			});
		};

		var save = () => {
			if(!savePath && (!projectInfo.project_type || projectInfo.project_type != "cloud")) {
				kenrobot.trigger("prompt", "show", {
					title: "项目保存",
					placeholder: "项目名字",
					value: projectInfo.project_name,
					callback: name => {
						if(!name) {
							kenrobot.trigger("util", "message", {
								text: "保存失败",
								type: "error",
							});
							return
						}

						doSave(name);
					}
				});
			} else {
				doSave(projectInfo.project_name);
			}
		}

		if(kenrobot.user || saveAs || hasShowSave) {
			save();
		} else {
			hasShowSave = true;
			kenrobot.trigger("save", "show", () => doSave(projectInfo.project_name));
		}

		return promise;
	}

	function trySimulate(projectInfo, targetPath) {
		var components = projectInfo.project_data.hardware.components;
		var connections = projectInfo.project_data.hardware.connections;
		var targetComponent = components.find(c => c.name == "ssd1306" || c.name == "nokia5110");
		if(targetComponent) {
			var componentConfig = hardware.getComponentConfig(targetComponent.name);
			util.confirm({
				confirmLabel: "是",
				cancelLabel: "否",
				text: `您正在使用“${componentConfig.label}”，是否开始仿真?`,
				onConfirm: () => {
					var boardData = hardware.getBoardData();
					var options = Object.keys(targetComponent.endpoints).map(pin => {
						var value = targetComponent.endpoints[pin];
						var connection = connections.find(c => c.sourceUid == value.uid);
						return [pin, boardData.pins.find(p => p.uid == connection.targetUid).name];
					});
					options = _.fromPairs(options);
					options.type = targetComponent.name;

					kenrobot.postMessage("app:readFile", targetPath).then(result => {
						kenrobot.trigger("lcd", "upload", result, options);
					});
				},
			});
		}
	}

	function onCodeRefresh() {
		if(code.getMode() != "block") {
			return;
		}

		var hardwareBlockData = hardware.getBlockData();
		var codeInfo = software.getCode(hardwareBlockData);

		var projectInfo = getCurrentProject();
		codeInfo.name = projectInfo.project_name;
		// codeInfo.author = "啃萝卜";
		code.genCode(codeInfo);
	}

	function onCodeCopy() {
		kenrobot.postMessage("app:copy", code.getCopyText(), "code").then(() => {
			util.message("复制成功");
		}, () => {
			util.message({
				text: "复制失败",
				type: "warning"
			});
		});
	}

	function onCodeExport() {
		var projectInfo = getCurrentProject();
		var options = {
			filters: [{name: 'Arduino(*.ino)', extensions: ['ino']}]
		}
		kenrobot.postMessage("app:saveFile", projectInfo.project_name + ".ino", code.getData(), options).then(() => {
			util.message("导出成功");
		}, () => {
			util.message({
				text: "导出失败",
				type: "warning"
			});
		});
	}

	function onCodeToggleComment() {
		if(code.getMode() != "block") {
			return;
		}

		code.toggleComment();
	}

	function onSoftwareBlockUpdate() {
		var hardwareBlockData = hardware.getBlockData();
		software.updateBlocks(hardwareBlockData);
	}

	function getProjectData() {
		return {
			hardware: hardware.getData(),
			software: software.getData(),
			code: code.getData(),
			mode: code.getMode(),
		};
	}

	function getCurrentProject() {
		return currentProject;
	}

	function getDefaultProject() {
		var now = new Date();
		return {
			project_name: "我的项目",
			project_data: {},
			project_type: "local",
			created_at: now,
			updated_at: now,
		};
	}

	function isProjectChange() {
		return !_.isEqual(currentProject.project_data, getProjectData());
	}

	function askSaveProject(callback, delay) {
		if(isProjectChange()) {
			util.confirm({
				type: "skip",
				confirmLabel: "是",
				skipLabel: "否",
				cancelLabel: "取消",
				text: "是否保存对当前项目的更改?",
				onSkip: () => callback(),
				onConfirm: () => onProjectSave().then(() => setTimeout(callback, delay || 400))
			});
		} else {
			callback();
		}
	}

	return {
		init: init,
	}
});

define(['vendor/jquery', 'vendor/lodash', 'app/common/config/config', 'app/common/util/util', 'app/common/util/emitor', 'app/common/util/progress', '../config/schema', '../view/hardware', '../view/software', '../view/code'], function($1, _, config, util, emitor, progress, schema, hardware, software, code) {
	var currentProject;
	var savePath;

	function init() {
		emitor.on('app', 'start', onAppStart)
		    .on('project', 'new', onProjectNew)
			.on('project', 'open', onProjectOpen)
			.on('project', 'save', onProjectSave)
			.on('project', 'upload', onProjectUpload)
			.on('project', 'check', onProjectCheck)
			.on('code', 'refresh', onCodeRefresh)
			.on('code', 'copy', onCodeCopy)
			.on('software', 'update-block', onSoftwareBlockUpdate);

		kenrobot.on("project", "open", onProjectOpen).on("project", "save", onProjectSave);
	}

	function openProject(projectInfo) {
		emitor.trigger("code", "stop-refresh");

		currentProject && (currentProject.project_data = getProjectData());
		currentProject = projectInfo;

		var projectData = projectInfo.project_data;
		hardware.setData(projectData.hardware);
		software.setData(projectData.software);
		code.setData(projectData.code);
		code.setMode(projectData.mode);

		projectData.mode == "block" && emitor.trigger("code", "start-refresh");
		emitor.trigger("app", "activeTab", projectData.mode == "text" ? "software" : "hardware");
	}

	function onAppStart() {
		loadPackages().then(function() {
			hardware.loadSchema(schema);
			software.loadSchema(schema);

			loadRecentProject().then(result => {
				savePath = result.path;
				openProject(result.projectInfo);
				kenrobot.trigger("app", "setTitle", savePath);
				emitor.trigger("code", "start-refresh");
			}, () => {
				savePath = null;
				openProject(getDefaultProject());
				kenrobot.trigger("app", "setTitle", savePath);
				localStorage.recentProject = savePath;
				emitor.trigger("code", "start-refresh");
			});
		});
	}

	function loadPackages() {
		var promise = $.Deferred();

		kenrobot.postMessage("app:loadPackages").then(pkgs => {
			schema.packages = _.sortBy(schema.packages.concat(pkgs), ["order"]);

			schema.packages.forEach(pkg => {
				pkg.logo = pkg.logo ? `${pkg.protocol}${pkg.path}/${pkg.logo}` : "../assets/image/default-vendor-logo.png";
				pkg.boards && pkg.boards.forEach(board => {
					board.imageUrl = `${pkg.protocol}${pkg.path}/${board.imageUrl}`;
					schema.boards.push(board);

					board.blocks && board.blocks.forEach(block => schema.blocks.push(block));
				});

				pkg.components && pkg.components.forEach(component => {
					component.imageUrl = `${pkg.protocol}${pkg.path}/${component.imageUrl}`;
					schema.components.push(component);

					component.blocks && component.blocks.forEach(block => schema.blocks.push(block));
				});

				pkg.blocks && pkg.blocks.forEach(block => schema.blocks.push(block));
			});
		})
		.fin(function() {
			promise.resolve()
		});

		return promise
	}

	function loadRecentProject() {
		var promise = $.Deferred();
		var recentProjectPath = localStorage.recentProject;
		if(!recentProjectPath || recentProjectPath === "null" || recentProjectPath === "undefined") {
			setTimeout(() => promise.reject(), 10);
			return promise;
		}

		kenrobot.postMessage("app:projectRead", recentProjectPath).then(result => {
			promise.resolve(result);
		}, () => {
			promise.reject();
		});

		return promise;
	}

	function onProjectNew() {
		savePath = null;
		openProject(getDefaultProject());
		kenrobot.trigger("app", "setTitle", savePath);
		localStorage.recentProject = savePath;
		util.message("新建成功");
	}

	function onProjectOpen(projectInfo) {
		if(projectInfo) {
			savePath = null;
			openProject(projectInfo);
			kenrobot.trigger("app", "setTitle", savePath);
			localStorage.recentProject = savePath;
			util.message({
				text: "打开成功",
				type: "success"
			});
		} else {
			kenrobot.postMessage("app:projectOpen").then(function(result) {
				savePath = result.path;
				openProject(result.projectInfo);
				kenrobot.trigger("app", "setTitle", savePath);
				localStorage.recentProject = savePath;
				util.message({
					text: "打开成功",
					type: "success"
				});
			}, function(err) {
				util.message({
					text: "打开失败",
					type: "error",
				});
			});
		}
	}

	function onProjectSave(saveAs, exitAfterSave) {
		onCodeRefresh();

		var projectInfo = getCurrentProject();
		projectInfo.project_data = getProjectData();
		saveAs = saveAs == true ? true : savePath == null;

		doProjectSave(projectInfo, saveAs).then(function(result) {
			localStorage.recentProject = result.path;
			util.message({
				text: "保存成功",
				type: "success"
			});

			exitAfterSave && setTimeout(() => kenrobot.postMessage("app:exit"), 400);
		}, function() {
			util.message({
				text: "保存失败",
				type: "warning",
			});
		});
	}

	function onProjectUpload() {
		onCodeRefresh();

		var projectInfo = getCurrentProject();
		projectInfo.project_data = getProjectData();
		var saveAs = savePath == null;
		var boardData = hardware.getBoardData();

		doProjectSave(projectInfo, saveAs).then(function(result) {
			localStorage.recentProject = result.path;
			emitor.trigger("ui", "lock", "build", true);
			util.message("保存成功，开始编译");
			kenrobot.postMessage("app:buildProject", result.path, boardData.build).then(function() {
				util.message("编译成功，正在上传");
				setTimeout(function() {
					var uploadProgressHelper = {};
					kenrobot.postMessage("app:upload", result.path, boardData.upload).then(function() {
						emitor.trigger("ui", "lock", "build", false);
						util.message({
							text: "上传成功",
							type: "success"
						});
					}, function(err) {
						if(err.status == "SELECT_PORT") {
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
									kenrobot.postMessage("app:upload2", result.path, port.comName, boardData.upload).then(function() {
										emitor.trigger("ui", "lock", "build", false);
										util.message({
											text: "上传成功",
											type: "success"
										});
									}, function(err1) {
										emitor.trigger("ui", "lock", "build", false);
										kenrobot.trigger("build", "error", "上传失败", err1);
									}, function(progressData) {
										emitor.trigger("progress", "upload", progress.matchUploadProgress(uploadProgressHelper, progressData.data, boardData.type), "upload");
									});
								}
							});
						} else if(err.status == "NOT_FOUND_PORT") {
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
		}, function() {
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

		util.message("正在验证，请稍候");
		doProjectSave(projectInfo, true, true).then(function(result) {
			emitor.trigger("ui", "lock", "build", true);
			kenrobot.postMessage("app:buildProject", result.path, boardData.build).then(function() {
				emitor.trigger("ui", "lock", "build", false);
				util.message("验证成功");
			}, function(err) {
				emitor.trigger("ui", "lock", "build", false);
				kenrobot.trigger("build", "error", "验证失败", err);
			}, function(progressData) {
				emitor.trigger("progress", "check", progress.matchBuildProgress(progressData.data))
			});
		}, function() {
			util.message({
				text: "保存失败",
				type: "warning",
			});
		});
	}

	function doProjectSave(projectInfo, saveAs, isTemp) {
		var promise = $.Deferred();

		kenrobot.postMessage("app:projectSave", saveAs ? null : savePath, projectInfo, isTemp).then(function(result) {
			projectInfo.updated_at = result.updated_at;
			if(saveAs && !isTemp) {
				savePath = result.path;
				projectInfo.project_name = result.project_name;
				kenrobot.trigger("app", "setTitle", savePath);
				localStorage.recentProject = savePath;
			}
			promise.resolve(result);
		}, function() {
			promise.reject();
		});

		return promise;
	}

	function onCodeRefresh() {
		if(code.getMode() != "block") {
			return;
		}

		var hardwareBlockData = hardware.getBlockData();
		var codeInfo = software.getCode(hardwareBlockData);

		var projectInfo = getCurrentProject();
		codeInfo.name = projectInfo.project_name;
		codeInfo.author = "啃萝卜";
		code.genCode(codeInfo);
	}

	function onCodeCopy() {
		kenrobot.postMessage("app:copy", code.getData(), "code").then(function() {
			util.message("复制成功");
		}, function(err) {
			util.message({
				text: "复制失败",
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
			created_at: now,
			updated_at: now,
		};
	}

	return {
		init: init,
	}
});

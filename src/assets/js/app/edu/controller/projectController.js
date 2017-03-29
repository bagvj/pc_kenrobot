define(['vendor/jquery', 'app/common/config/config', 'app/common/util/util', 'app/common/util/emitor', '../config/schema', '../view/hardware', '../view/software', '../view/code'], function($1, config, util, emitor, schema, hardware, software, code) {
	var currentProject;
	var savePath;
	var uploadProgressHelper;

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

		kenrobot.on("project", "open", onProjectOpen);
	}

	function openProject(projectInfo) {
		emitor.trigger("code", "stop-refresh");

		currentProject && (currentProject.project_data = getProjectData());
		currentProject = projectInfo;

		var projectData = projectInfo.project_data;
		hardware.setData(projectData.hardware);
		software.setData(projectData.software);
		code.setData(projectData.code);

		emitor.trigger("code", "start-refresh");
	}

	function onAppStart() {
		loadPackages().then(function() {
			hardware.loadSchema(schema);
			software.loadSchema(schema);
			
			openProject(getDefaultProject());
			emitor.trigger("code", "start-refresh");
		});	
	}

	function loadPackages() {
		var promise = $.Deferred();

		kenrobot.postMessage("app:loadPackages").then(function(packages) {
			packages.forEach(function(pkg) {
				pkg.boards && pkg.boards.forEach(function(board) {
					board.imageUrl = pkg.path + "/" + board.imageUrl;
					schema.boards.push(board);
				});

				pkg.components && pkg.components.forEach(function(component) {
					component.imageUrl = pkg.path + "/" + component.imageUrl;
					schema.components.push(component);

					component.blocks && component.blocks.forEach(function(block) {
						schema.blocks.push(block);
					});
				});
			});
		})
		.fin(function() {
			promise.resolve()
		});

		return promise
	}

	function onProjectNew() {
		savePath = null;
		openProject(getDefaultProject());
		util.message("新建成功");
	}

	function onProjectOpen(projectInfo) {
		if(projectInfo) {
			openProject(projectInfo);
			util.message({
				text: "打开成功",
				type: "success"
			});
		} else {
			kenrobot.postMessage("app:openProject").then(function(result) {
				savePath = result.path;
				openProject(result.projectInfo);
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

	function onProjectSave(saveAs) {
		onCodeRefresh();

		var projectInfo = getCurrentProject();
		projectInfo.project_data = getProjectData();
		saveAs = saveAs == true ? true : savePath == null;

		doProjectSave(projectInfo, saveAs).then(function() {
			util.message({
				text: "保存成功",
				type: "success"
			});
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

		doProjectSave(projectInfo, saveAs).then(function() {
			emitor.trigger("ui", "lock", "build", true);
			util.message("保存成功，开始编译");
			kenrobot.postMessage("app:buildProject", savePath, {type: boardData.type, fqbn: boardData.fqbn}).then(function(target) {
				util.message("编译成功，正在上传");
				setTimeout(function() {
					uploadProgressHelper = {};
					kenrobot.postMessage("app:upload", target, {type: boardData.type}).then(function() {
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
									kenrobot.postMessage("app:upload2", target, port.comName, {type: boardData.type}).then(function() {
										emitor.trigger("ui", "lock", "build", false);
										util.message({
											text: "上传成功",
											type: "success"
										});
									}, function(err1) {
										emitor.trigger("ui", "lock", "build", false);
										showErrorConfirm("上传失败", err1);
									}, function(progress1) {
										emitor.trigger("progress", "upload", matchUploadProgress(progress1.data, boardData.type), "upload");
									});
								}
							});
						} else if(err.status == "NOT_FOUND_PORT") {
							emitor.trigger("ui", "lock", "build", false);
							kenrobot.trigger('common', 'show', {
								type: 'warn warn-info',
								content: '未检测到有Arduino开发板或其他串口设备插入。<span class="link" data-type="link" data-close-dialog="true">驱动问题</span>？解决后请关闭窗口，然后重试',
								onLink: function(type) {
									setTimeout(function() {
										util.confirm({
											type: "info",
											title: "驱动问题",
											text: '如果你遇到了Arduino驱动问题，请点击<br />菜单"帮助"->"Arduino驱动下载"',
											confirmLabel: "我知道了",
										});
									}, 400);
								}
							});
						} else {
							emitor.trigger("ui", "lock", "build", false);
							showErrorConfirm("上传失败", err);
						}
					}, function(progress) {
						emitor.trigger("progress", "upload", matchUploadProgress(progress.data, boardData.type), "upload");
					});
				}, 2000);
			}, function(err) {
				emitor.trigger("ui", "lock", "build", false);
				showErrorConfirm("编译失败", err);
			}, function(progress) {
				emitor.trigger("progress", "upload", matchBuildProgress(progress.data), "build");
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
		doProjectSave(projectInfo, true, true).then(function(path) {
			emitor.trigger("ui", "lock", "build", true);
			kenrobot.postMessage("app:buildProject", path, {type: boardData.type, fqbn: boardData.fqbn}).then(function() {
				emitor.trigger("ui", "lock", "build", false);
				util.message("验证成功");
			}, function(err) {
				emitor.trigger("ui", "lock", "build", false);
				showErrorConfirm("验证失败", err);
			}, function(progress) {
				emitor.trigger("progress", "check", matchBuildProgress(progress.data))
			});
		}, function() {
			util.message({
				text: "保存失败",
				type: "warning",
			});
		});
	}

	function matchBuildProgress(output) {
		var reg = /===info \|\|\| Progress \{\d+\} \|\|\| \[(\d+\.\d+)\]/g;
		var result;
		var temp;
		do {
			result = temp;
			temp = reg.exec(output);
		} while(temp);

		return result ? parseInt(result[1]) : -1;
	}


	function matchUploadProgress(output, type) {
		var reg;
		if(type == "genuino101") {
			reg = /Download	\[[= ]+\][ ]+(\d+)\%/g;
			if(!reg.test(output)) {
				return 0;
			}

			var temp;
			var match = reg.exec(output);
			do {
				temp = match;
				match = reg.exec(output);
			} while(match)
			
			return parseInt(temp[1]);
		} else {
			var state = uploadProgressHelper.state;
			if(!state) {
				reg = /Writing \|/g;
				if(reg.test(output)) {
					uploadProgressHelper.state = "writing";
					return 20;
				}
				return 0;
			} else if(state == "writing") {
				reg = / \| 100\% \d+\.\d+/g;
				if(reg.test(output)) {
					uploadProgressHelper.state = "checking";
					return 60;
				}

				reg = /#/g;
				uploadProgressHelper.writeCount = uploadProgressHelper.writeCount || 0;
				while(reg.exec(output)) {
					uploadProgressHelper.writeCount++;
				}
				return 20 + parseInt(40 * uploadProgressHelper.writeCount / 50);
			} else {
				reg = / \| 100\% \d+\.\d+/g;
				if(reg.test(output)) {
					return 100;
				}

				reg = /#/g;
				uploadProgressHelper.checkCount = uploadProgressHelper.checkCount || 0;
				while(reg.exec(output)) {
					uploadProgressHelper.checkCount++;
				}
				return 60 + parseInt(40 * uploadProgressHelper.checkCount / 50);
			}
		}
	}

	function showErrorConfirm(message, err) {
		util.confirm({
			text: message,
			cancelLabel: "确定",
			confirmLabel: "查看日志",
			onConfirm: function() {
				kenrobot.delayTrigger(500, "error", "show", {output: [message, err]});
			}
		});
	}

	function doProjectSave(projectInfo, saveAs, isTemp) {
		var promise = $.Deferred();

		kenrobot.postMessage("app:saveProject", saveAs ? null : savePath, projectInfo, isTemp).then(function(result) {
			projectInfo.updated_at = result.updated_at;
			if(saveAs && !isTemp) {
				savePath = result.path;
				projectInfo.project_name = result.project_name;
			}
			promise.resolve(result.path);
		}, function() {
			promise.reject();
		});

		return promise;
	}

	function onCodeRefresh() {
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
		})
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

	function convertProject(projectInfo) {
		if (typeof projectInfo.project_data == "string") {
			try {
				projectInfo.project_data = JSON.parse(projectInfo.project_data);
			} catch (ex) {
				projectInfo.project_data = {};
			}
		}

		if (typeof projectInfo.created_at == "string") {
			projectInfo.created_at = new Date(projectInfo.created_at);
		}

		if (typeof projectInfo.updated_at == "string") {
			projectInfo.updated_at = new Date(projectInfo.updated_at);
		}

		return projectInfo;
	}

	return {
		init: init,
	}
});
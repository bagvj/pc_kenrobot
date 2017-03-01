define(['vendor/jquery', 'app/config/config', 'app/util/util', 'app/util/emitor', 'app/config/schema', 'app/component/content/hardware', 'app/component/content/software', 'app/component/content/code'], function($1, config, util, emitor, schema, hardware, software, code) {
	var currentProject;
	var savePath;

	function init() {
		emitor.on('app', 'start', onAppStart)
		    .on('project', 'new', onProjectNew)
			.on('project', 'open', onProjectOpen)
			.on('project', 'save', onProjectSave)
			.on('project', 'upload', onProjectUpload)
			.on('code', 'refresh', onCodeRefresh)
			.on('software', 'update-block', onSoftwareBlockUpdate);
	}

	function openProject(projectInfo) {
		currentProject && (currentProject.project_data = getProjectData());
		currentProject = projectInfo;

		var projectData = projectInfo.project_data;
		hardware.setData(projectData.hardware);
		software.setData(projectData.software);
		code.setData(projectData.code);
	}

	function onAppStart() {
		hardware.loadSchema(schema);
		software.loadSchema(schema);
		
		openProject(getDefaultProject());
	}

	function onProjectNew() {
		savePath = null;
		openProject(getDefaultProject());
		util.message("新建成功");
	}

	function onProjectOpen() {
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
		var boardType = hardware.getBoardData().type;

		doProjectSave(projectInfo, saveAs).then(function() {
			util.modalMessage("保存成功，开始编译");
			kenrobot.postMessage("app:buildProject", savePath, {board_type: boardType}).then(function(target) {
				util.modalMessage("编译成功，正在上传请稍候");
				setTimeout(function() {
					kenrobot.postMessage("app:upload", target, {board_type: boardType}).then(function() {
						util.hideModalMessage();
						util.message({
							text: "上传成功",
							type: "success"
						});
					}, function(err) {
						util.hideModalMessage();
						onProjectUploadFail(err).then(function(port) {
							util.modalMessage("正在上传请稍候");
							kenrobot.postMessage("app:upload2", target, port.comName, {board_type: boardType}).then(function() {
								util.hideModalMessage();
								util.message({
									text: "上传成功",
									type: "success"
								});
							}, function() {
								util.hideModalMessage();
								util.message({
									text: "上传失败",
									type: "error"
								});
							});
						});
					});
				}, 2000);
			}, function() {
				util.hideModalMessage();
				util.message({
					text: "编译失败",
					type: "error",
				});
			});
		}, function() {
			util.message({
				text: "保存失败",
				type: "warning",
			});
		});
	}

	function doProjectSave(projectInfo, saveAs) {
		var promise = $.Deferred();

		kenrobot.postMessage("app:saveProject", saveAs ? null : savePath, projectInfo).then(function(result) {
			projectInfo.updated_at = result.updated_at;
			if(saveAs) {
				savePath = result.path;
				projectInfo.project_name = result.project_name;
			}
			promise.resolve();
		}, function() {
			promise.reject();
		});

		return promise;
	}

	function onProjectUploadFail(err) {
		var promise = $.Deferred();
		var status = err.status;

		if(status == "SELECT_PORT") {
			var ports = err.ports;
			emitor.trigger("port", "show", {
				ports: ports,
				callback: function(port) {
					promise.resolve(port);
				}
			});
		} else if(status == "NOT_FOUND_PORT") {
			emitor.trigger('common', 'show', {
				type: 'warn warn-info',
				content: '未检测到有Arduino开发板或其他串口设备插入。<span class="link" data-type="link" data-close-dialog="true">驱动问题</span>？解决后请关闭窗口，然后重试',
				onLink: function(type) {
					setTimeout(function() {
						emitor.trigger("installDriver", "show");
					}, 400);
				}
			});
		} else {
			util.message({
				text: "上传失败",
				type: "error",
			});
		}

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
define(['vendor/jquery', 'app/config/config', 'app/util/util', 'app/util/emitor', 'app/config/schema', 'app/component/content/hardware', 'app/component/content/software', 'app/component/content/code'], function($1, config, util, emitor, schema, hardware, software, code) {
	var currentProject;
	var savePath;

	function init() {
		emitor.on('app', 'start', onAppStart);

		emitor.on('project', 'new', onProjectNew);
		emitor.on('project', 'open', onProjectOpen);
		emitor.on('project', 'save', onProjectSave);
		emitor.on('project', 'upload', onProjectUpload);

		emitor.on('code', 'refresh', onCodeRefresh);
		emitor.on('software', 'update-block', onSoftwareBlockUpdate);
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
		hardware.loadSchema(schema.hardware);
		software.loadSchema(schema.software);
		
		openProject(getDefaultProject());
	}

	function onProjectNew() {
		openProject(getDefaultProject());
	}

	function onProjectOpen() {

	}

	function onProjectSave(saveAs) {
		var project_data = getProjectData();
		kenrobot.postMessage("app:saveProject", saveAs ? null : savePath, project_data.code).then(function(path) {
			savePath = path;
			util.message("保存成功");
		});
	}

	function onProjectUpload() {
		onCodeRefresh();

		var project_data = getProjectData();
		kenrobot.postMessage("app:saveProject", savePath, project_data.code).then(function(path) {
			savePath = path;
			util.message("保存成功，开始编译");
			kenrobot.postMessage("app:buildProject", path).then(function(hex) {
				util.message("编译成功，正在上传请稍候");
				kenrobot.postMessage("app:uploadHex", hex).then(function() {
					util.message("上传成功");
				}, function(err) {
					console.log("upload fail");
					if(err.status && err.status == "SELECT_PORT") {
						onProjectUploadFail(3, err.ports).then(function(portPath) {
							kenrobot.postMessage("app:uploadHex2", hex, portPath);
						});
					} else if(err.status && err.status == "NOT_FOUND_PORT") {
						onProjectUploadFail(1);
					} else {
						util.message("上传失败")
					}
				});
			}, function() {
				util.message("编译失败");
			});
		}, function() {
			util.message("保存失败");
		});
	}

	function onProjectUploadFail(code, args) {
		var promise = $.Deferred();

		switch (code) {
			case 1:
			case 2:
				emitor.trigger('common', 'show', {
					type: 'warn warn-info',
					content: '未检测到有Arduino开发板或其他串口设备插入。<span class="link" data-type="link" data-close-dialog="true">驱动问题</span>？解决后请关闭窗口，然后重试',
					onLink: function(type) {
						setTimeout(function() {
							emitor.trigger("installDriver", "show");
						}, 400);
					}
				});
				break;
			case 3:
				var ports = args;
				emitor.trigger("port", "show", {
					ports: ports,
					callback: function(portPath) {
						promise.resolve(portPath);
					}
				});
				break;
			case 4:
				util.message("连接失败");
				break;
			case 5:
				util.message("上传失败");
				break;
			case 101:
				util.message("暂时不支持上传");
				break;
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
			id: 0,
			project_name: "我的项目",
			project_intro: "项目简介",
			public_type: 2,
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
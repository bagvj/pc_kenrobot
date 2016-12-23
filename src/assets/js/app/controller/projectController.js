define(['vendor/jquery', 'app/config/config', 'app/util/util', 'app/util/emitor', 'app/model/userModel', 'app/model/projectModel', 'app/model/uploadModel', 'app/component/content/hardware', 'app/component/content/software', 'app/component/content/code'], function($1, config, util, emitor, userModel, projectModel, uploadModel, hardware, software, code) {
	var currentProject;
	var tempProject;
	var myProjects;
	var savePath;

	function init() {
		myProjects = [];

		emitor.on('app', 'start', onAppStart);
		emitor.on('user', 'login', onUserLogin);
		emitor.on('project', 'view', onProjectView);
		emitor.on('project', 'open', onProjectOpen);
		emitor.on('project', 'save', onProjectSave);
		emitor.on('project', 'edit', onProjectEdit);
		emitor.on('project', 'delete', onProjectDelete);
		emitor.on('project', 'upload', onProjectUpload);
		emitor.on('project', 'copy', onProjectCopy);
		emitor.on('project', 'share', onProjectShare);
		emitor.on('code', 'refresh', onCodeRefresh);
		emitor.on('software', 'update-block', onSoftwareBlockUpdate);
	}

	function openProject(projectInfo) {
		var userId = userModel.getUserId();
		if(projectInfo.id == 0 || projectInfo.user_id != userId) {
			projectInfo.id = 0;
			tempProject = projectInfo;
		}

		currentProject && (currentProject.project_data = getProjectData());
		currentProject = projectInfo;

		var projectData = projectInfo.project_data;
		hardware.setData(projectData.hardware);
		software.setData(projectData.software);
		code.setData(projectData.code);

		var author = projectInfo.author || userModel.getUserName();
		var title = projectInfo.project_name + " - " + (author == "" ? "" : author + " - ") + "啃萝卜";
		document.title = title;

		util.isWeiXin() && emitor.trigger("weixin", "share", {
			title: title,
			desc: projectInfo.project_intro,
		});
	}

	function loadMyProject() {
		var promise = $.Deferred();

		projectModel.getAll().then(function(result) {
			if (result.status != 0) {
				promise.reject();
				return;
			}

			if (result.data.length == 0) {
				promise.reject();
				return;
			}

			result.data.forEach(function(projectInfo) {
				projectInfo = convertProject(projectInfo);
				myProjects.push(projectInfo);
			});
			promise.resolve();
		}, function() {
			promise.reject();
		});

		return promise;
	}

	function onAppStart() {
		uploadModel.init(config.target, config.chromeExt);

		projectModel.getSchema().done(function(schema) {
			hardware.loadSchema(schema.hardware);
			software.loadSchema(schema.software);
		}).then(function() {
			userModel.attach().done(function() {
				userModel.authCheck().then(function() {
					loadMyProject().then(function() {
						emitor.trigger("route", "init");
					}, function() {
						emitor.trigger("route", "init");
					});
				}, function() {
					emitor.trigger("route", "init");
				});
			});
		});
	}

	function onUserLogin() {

	}

	function onProjectView(hash) {
		if(!hash) {
			myProjects.length ? emitor.trigger("route", "set", "/project/" + myProjects[0].hash) : openProject(getDefaultProject());
			return;
		} else if(hash == "new") {
			savePath = null;
			openProject(getDefaultProject());
			return;
		} else if(hash == "temp") {
			tempProject ? openProject(tempProject) : emitor.trigger("route", "set", "/");
			return;
		}

		projectModel.get(hash, "hash").done(function(result) {
			if (result.status != 0) {
				util.message(result.message);
				emitor.trigger("route", "set", "/");
				return;
			}

			var projectInfo = convertProject(result.data);
			openProject(projectInfo);
		});
	}

	function onProjectOpen(id, force) {
		var info = getCurrentProject();
		if (!force && id == info.id) {
			return;
		}

		if (id == 0) {
			emitor.trigger("route", "set", "/project/temp");
			return;
		}

		var index = findProjectIndex(myProjects, id);
		if (index < 0) {
			return;
		}

		emitor.trigger("route", "set", "/project/" + myProjects[index].hash);
	}

	function onProjectSave(projectInfo, saveType, newSave) {
		projectInfo = projectInfo || {};
		if (saveType == "edit") {
			//编辑
			if (projectInfo.id == 0) {
				saveType = "save";
				newSave = true;

				projectInfo.project_data = JSON.stringify(getProjectData());
			}
		} else if (saveType == "save") {
			//保存
			var info = getCurrentProject();
			if (!newSave && info.id == 0) {
				emitor.trigger('project', 'show', {
					data: info,
					type: 'save'
				});
				return;
			}

			projectInfo.id = info.id;
			projectInfo.project_data = JSON.stringify(getProjectData());
		} else if(saveType == "file") {
			var project_data = getProjectData();
			kenrobot.postMessage("app:saveProject", savePath, project_data.code).then(function(path) {
				savePath = path;
				util.message("保存成功");
			});
			return;
		} else {
			//新建
			projectInfo.project_data = "";
		}
		projectInfo.user_id = userModel.getUserId();

		projectModel.save(projectInfo).done(function(result) {
			result.status == 0 ? onProjectSaveSuccess(result.data.project_id, saveType, newSave) : util.message(result.message);
		});
	}

	function onProjectEdit(id) {
		if(config.target != "web") {
			util.message("暂时不支持");
			return;
		}

		var projectInfo;
		if (id == 0) {
			projectInfo = getCurrentProject();
		} else {
			var index = findProjectIndex(myProjects, id);
			index >= 0 && (projectInfo = myProjects[index]);
		}

		projectInfo && emitor.trigger('project', 'show', {
			data: projectInfo,
			type: 'edit'
		});
	}

	function onProjectDelete(id) {
		if(config.target != "web") {
			util.message("暂时不支持");
			return;
		}

		var projectInfo;
		if (id == 0) {
			projectInfo = getCurrentProject();
			projectInfo && emitor.trigger('common', 'show', {
				type: 'warn',
				content: '正在删除项目『' + projectInfo.project_name + '』，删除后不可恢复。确定要删除吗？',
				onConfirm: function() {
					util.message("删除成功");
					onProjectDeleteSuccess(id);
				},
			});
		} else {
			var index = findProjectIndex(myProjects, id);
			index >= 0 && (projectInfo = myProjects[index]);
			projectInfo && emitor.trigger('common', 'show', {
				type: 'warn',
				content: '正在删除项目『' + projectInfo.project_name + '』，删除后不可恢复。确定要删除吗？',
				onConfirm: function() {
					projectModel.remove(id).done(function(result) {
						util.message(result.message);
						result.status == 0 && onProjectDeleteSuccess(id);
					});
				},
			});
		}
	}

	function onProjectCopy(id) {
		if(config.target != "web") {
			util.message("暂时不支持");
			return;
		}

		var projectInfo;
		if (id == 0) {
			util.message("请先保存项目");
			return;
		}

		var index = findProjectIndex(myProjects, id);
		index >= 0 && (projectInfo = myProjects[index]);
		if (!projectInfo) {
			return;
		}

		var copyProjectInfo = $.extend({}, projectInfo);
		copyProjectInfo.id = 0;
		copyProjectInfo.user_id = userModel.getUserId();
		copyProjectInfo.project_name = copyProjectInfo.project_name + " - 副本";
		copyProjectInfo.project_data = JSON.stringify(copyProjectInfo.project_data);
		projectModel.save(copyProjectInfo).done(function(result) {
			result.status == 0 ? onProjectSaveSuccess(result.data.project_id, "copy") : util.message(result.message);
		});
	}

	function onProjectShare() {
		if(config.target != "web") {
			util.message("暂时不支持");
			return;
		}

		userModel.authCheck(true).done(function() {
			var info = getCurrentProject();
			if(info.id == 0) {
				util.message("请先保存项目");
				return;
			}

			if(info.public_type != 2) {
				util.message("分享需要公开项目");
				return;
			}

			emitor.trigger("share", "show", {
				projectInfo: info
			});
		});
	}

	function onProjectSaveSuccess(id, saveType, newSave) {
		projectModel.get(id).done(function(result) {
			if (result.status != 0) {
				util.message(result.message);
				return;
			}

			var projectInfo = convertProject(result.data);
			if (saveType == "new") {
				myProjects.unshift(projectInfo);

				util.message("新建成功");
				emitor.trigger("route", "set", "/project/" + projectInfo.hash);
			} else if (saveType == "copy") {
				myProjects.unshift(projectInfo);

				util.message("复制成功");
				emitor.trigger("route", "set", "/project/" + projectInfo.hash);
			} else if (saveType == "save") {
				if (newSave) {
					myProjects.unshift(projectInfo);
					currentProject = projectInfo;
					tempProject = null;
				} else {
					var index = findProjectIndex(myProjects, projectInfo.id);
					myProjects[index] = projectInfo;
				}
				util.message("保存成功");
			} else {
				var index = findProjectIndex(myProjects, projectInfo.id);
				myProjects[index] = projectInfo;

				util.message("更新成功");
			}
		});
	}

	function onProjectDeleteSuccess(id) {
		var index = findProjectIndex(myProjects, id);
		index >= 0 && myProjects.splice(index, 1);

		var info = getCurrentProject();
		if (info.id != id) {
			return;
		}

		currentProject = null;
		onProjectView();
	}

	function onProjectUpload() {
		onCodeRefresh();

		if(config.target == "pc") {
			var project_data = getProjectData();
			kenrobot.postMessage("app:saveProject", savePath, project_data.code).then(function(path) {
				savePath = path;
				util.message("保存成功，开始编译");
				kenrobot.postMessage("app:buildProject", path).then(function(hex) {
					util.message("编译成功，正在上传请稍候");
					kenrobot.postMessage("app:uploadHex", hex).then(function(result) {
						util.message("上传成功");
					}, function(err) {
						if(err.status && err.status == "SELECT_PORT") {
							onProjectUploadFail(3, err.ports).then(function(portPath) {
								kenrobot.postMessage("app:uploadHex2", hex, portPath);
							});
						} else {
							util.message("上传失败")
						}
					});
				}, function(err) {
					util.message("编译失败");
				});
			}, function(result) {
				util.message("保存失败");
			});
			return;
		}

		var projectInfo = getCurrentProject();
		if (projectInfo.id == 0) {
			emitor.trigger('project', 'show', {
				data: projectInfo,
				type: 'save'
			});
			return;
		}

		projectInfo.project_data = JSON.stringify(getProjectData());
		projectInfo.user_id = userModel.getUserId();

		projectModel.save(projectInfo).done(function(result) {
			if (result.status != 0) {
				util.message(result.message);
				return;
			}

			var boardData = hardware.getBoardData();
			projectModel.build(projectInfo.id, boardData.type).done(function(res) {
				if (res.status != 0) {
					util.message(res.message);
					return;
				}

				util.message("编译成功，正在上传请稍候");
				uploadModel.check(true).then(function() {
					uploadModel.upload(res.url).then(function() {
						util.message("上传成功");
					}, function(code, args) {
						onProjectUploadFail(code, args).done(function(portPath) {
							uploadModel.upload(res.url, portPath).then(function() {
								util.message("上传成功");
							}, onProjectUploadFail);
						});
					});
				}, function(code) {
					code > 100 && util.message("暂时不支持上传");
				});
			});
		});
	}

	function onProjectUploadFail(code, args) {
		var promise = $.Deferred();

		switch (code) {
			// case 1:
			// 	util.message("找不到串口");
			// 	break;
			// case 2:
			// 	util.message("找不到Arduino");
			// 	break;
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
		codeInfo.author = userModel.getUserName();
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

	function findProjectIndex(projects, id) {
		var index = -1;
		projects && projects.forEach(function(projectInfo, i) {
			if (projectInfo.id == id) {
				index = i;
				return true;
			}
		});

		return index;
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
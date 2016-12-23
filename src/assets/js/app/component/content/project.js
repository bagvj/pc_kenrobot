define(['vendor/jquery', 'vendor/perfect-scrollbar', 'app/util/emitor', 'app/util/util', 'app/config/config', 'app/model/userModel'], function($1, $2, emitor, util, config, userModel) {
	var region;
	var projectList;
	var boardList;
	var projectTemplate = '<li data-id="{{id}}"><div class="project-title"><div class="name ellipsis">{{name}}</div><div class="arrow"><ul class="project-menu"><li data-action="edit">编辑项目</li><li data-action="copy">复制项目</li><li data-action="delete">删除项目</li></ul></div></div><div class="project-image" style="background-image: {{imageUrl}};"></div><div class="project-intro">{{intro}}</div><div class="project-footer"><div class="public" data-action="{{public_type}}">{{public}}</div><div>最后更新：</div><div class="time">{{time}}</div></div></li>';
	var boardTemplate = '<li data-value="{{name}}"><div class="board {{name}}" style="background-image: url({{src}})"></div><div class="board-name">{{label}}</div></li>';
	var publicTypes = ["仅自己可见", "好友公开", "完全公开"];

	function init() {
		$(window).on('click', onWindowClick);

		region = $('.project-region');

		$('.new', region).on('click', onNewClick);
		$('.save', region).on('click', onSaveClick);
		$('.upload', region).on('click', onUploadClick);
		$('.name', region).on('click', onNameClick);

		projectList = $('.sidebar-tabs .tab-project .list');
		projectList.parent().perfectScrollbar();
		$('.sidebar-tabs .tab-project .new-project').on('click', onNewClick);

		boardList = $('.boards', region).on('click', '.placeholder', onShowBoardSelect).on('click', 'ul > li', onBoardSelectClick);

		emitor.on('project', 'update', onProjectUpdate);
		emitor.on('hardware', 'removeBoard', onRemoveBoard);
	}

	function updateList(projects, clear) {
		clear !== false && projectList.empty();
		projects.forEach(function(projectInfo) {
			addProject(projectInfo, false, false);
		});
		liveItemEvent();
	}

	function setBoard(name) {
		boardList.find('> ul > li[data-value="' + name + '"]').click();
	}

	function updateBoards(boards) {
		var ul = boardList.find("> ul").empty();
		boards.forEach(function(board) {
			var li = boardTemplate.replace(/\{\{name\}\}/g, board.name)
				.replace(/\{\{label\}\}/, board.label)
				.replace(/\{\{src\}\}/, board.imageUrl);
			ul.append(li);
		});
		ul.find("> li").eq(0).click();
	}

	function addProject(projectInfo, prepend, liveEvent) {
		var li = projectTemplate.replace(/\{\{id\}\}/, projectInfo.id)
			.replace(/\{\{name\}\}/, projectInfo.project_name)
			.replace(/\{\{imageUrl\}\}/, genProjectImageUrl(projectInfo.imageHash || "default"))
			.replace(/\{\{intro\}\}/, projectInfo.project_intro)
			.replace(/\{\{public\}\}/, publicTypes[projectInfo.public_type])
			.replace(/\{\{public_type\}\}/, projectInfo.public_type)
			.replace(/\{\{time\}\}/, util.formatDate(projectInfo.updated_at, "yyyy/MM/dd"));
		prepend !== false && projectList.prepend(li) || projectList.append(li);
		liveEvent !== false && liveItemEvent();
	}

	function updateProject(projectInfo, newProject) {
		var id = newProject ? 0 : projectInfo.id;

		var li = $('li[data-id="' + id + '"]', projectList);
		if(li.length == 0) {
			addProject(projectInfo);
		} else {
			newProject && li.data("id", projectInfo.id).attr("data-id", projectInfo.id);

			$('.name', li).text(projectInfo.project_name);
			var imageHash = projectInfo.imageHash || "default";
			$('.project-image', li).css('background-image', genProjectImageUrl(imageHash));
			$('.project-intro', li).text(projectInfo.project_intro);
			$('.public', li).text(publicTypes[projectInfo.public_type]).attr('data-action', projectInfo.public_type);
			$('.time', li).text(util.formatDate(projectInfo.updated_at, "yyyy.MM.dd"));

			projectList.find("> li.active").data('id') == projectInfo.id && updateCurrentProject(projectInfo);
		}
	}

	function genProjectImageUrl(hash) {
		var url = "/project/image/" + hash;
		url = config.target == "pc" ? config.host + url : url;
		return "url('" + url + "')";
	}

	function updateCurrentProject(projectInfo) {
		$('.name', region).text(projectInfo.project_name);
		projectList.find('> li').removeClass("active").filter('[data-id="' + projectInfo.id + '"]').addClass("active");
	}

	function removeProject(projectId) {
		$('li[data-id=' + projectId + ']', projectList).remove();
	}

	function onNameClick(e) {
		if(!util.isMobile()) {
			return false;
		}

		if(region.hasClass("active")) {
			region.removeClass("slide-in").addClass("slide-out").delay(300, "slide-out").queue("slide-out", function() {
				region.removeClass("active").removeClass("slide-out");
			});
			region.dequeue("slide-out");
		} else {
			region.addClass("slide-in").delay(300, "slide-in").queue("slide-in", function() {
				region.addClass("active");
			});
			region.dequeue("slide-in");
		}

		return false;
	}

	function onNewClick(e) {
		userModel.authCheck(true).done(function() {
			if(config.target == "web") {
				emitor.trigger('project', 'show');
			} else {
				emitor.trigger('project', 'view', 'new');
			}
		});
	}

	function onSaveClick(e) {
		userModel.authCheck(true).done(function() {
			if(config.target == "web") {
				emitor.trigger('project', 'save', null, 'save');
			} else {
				emitor.trigger('project', 'save', null, 'file');
			}
		});
	}

	function onUploadClick(e) {
		userModel.authCheck(true).done(function() {
			emitor.trigger('project', 'upload');
		});
	}

	function onShowBoardSelect(e) {
		boardList.toggleClass("active");
		return false;
	}

	function onBoardSelectClick(e) {
		var li = $(this);
		var name = li.data("value");
		boardList.removeClass("active").find(".placeholder").html(li.html());
		boardList.data("value", name);

		name && emitor.trigger("hardware", "boardChange", name);
	}

	function onRemoveBoard() {
		// boardList.val("");
	}

	function onProjectMenuClick(e) {
		var li = $(this);
		var action = li.data('action');
		var itemLi = li.parent().closest('li');
		var id = itemLi.data('id');

		userModel.authCheck(true).done(function() {
			switch (action) {
				case "delete":
					emitor.trigger('project', 'delete', id);
					break;
				case "edit":
					emitor.trigger('project', 'edit', id);
					break;
				case "copy":
					emitor.trigger('project', 'copy', id);
					break;
			}
		});
	}

	function onProjectClick(e) {
		var li = $(this).closest('li');
		!li.hasClass("active") && emitor.trigger("project", "open", li.data('id'));
	}

	function onLiMouseOut(e) {
		var li = $(this);
		var projectMenu = $('.project-menu', li);
		projectMenu.hasClass("active") && projectMenu.removeClass("active");
	}

	function onProjectUpdate(projectInfo) {
		if (saveType == "edit") {

			util.message("保存成功");
		} else if (saveType == "save") {
			util.message("保存成功");
		} else {
			util.message("新建成功");
		}
	}

	function liveItemEvent() {
		$('.project-menu li', projectList).off('click', onProjectMenuClick).on('click', onProjectMenuClick);
		$('> li', projectList).off('mouseleave', onLiMouseOut).on('mouseleave', onLiMouseOut);
		$('.project-title .name', projectList).off('click', onProjectClick).on('click', onProjectClick);
		$('.project-image', projectList).off('click', onProjectClick).on('click', onProjectClick);
	}

	function onWindowClick(e) {
		if(!e.pageX || !e.pageY || !util.isMobile() || !region.hasClass("active")) {
			return;
		}

		var rect = $('.project-wrap', region)[0].getBoundingClientRect();
		if(e.pageX >= rect.left && e.pageX <= rect.right && e.pageY >= rect.top && e.pageY <= rect.bottom) {
			return;
		}

		rect = $('.name', region)[0].getBoundingClientRect();
		if(e.pageX >= rect.left && e.pageX <= rect.right && e.pageY >= rect.top && e.pageY <= rect.bottom) {
			return;
		}

		$('.name', region).click();
	}

	return {
		init: init,

		updateList: updateList,
		addProject: addProject,
		removeProject: removeProject,
		updateProject: updateProject,
		updateCurrentProject: updateCurrentProject,

		setBoard: setBoard,
		updateBoards: updateBoards,
	};
});
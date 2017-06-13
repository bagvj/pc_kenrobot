define(['vendor/jquery', 'vendor/lodash', 'vendor/perfect-scrollbar', 'app/common/util/util', 'app/common/config/config'], function($1, _, $2, util, config) {
	var dialogWin;
	var toolbar;
	var projectList;

	var projectTypes = {
		edu: "教育版",
		ide: "开发版",
		scratch2: "scratch 2",
		scratch3: "scratch 3",
	};

	function init() {
		dialogWin = $('.project-dialog');
		toolbar = dialogWin.find(".toolbar").on("click", ".x-checkbox-label", onSelectAll).on("click", ".new-project", onNewProject).on("click", ".delete-project", onDeleteProject);

		projectList = dialogWin.find(".list > ul");
		projectList.parent().perfectScrollbar();
		

		kenrobot.on("project", "show", onShow, {canReset: false});
	}

	function onShow(args) {
		setTimeout(() => update(), 200);
		util.dialog({
			selector: dialogWin,
			onClosed: onClosed,
		});
	}

	function onClosed() {
		projectList.empty();
		projectList.parent().perfectScrollbar("update");
	}

	function update() {
		kenrobot.postMessage("app:syncList").then(result => {
			if(result.status != 0) {
				util.message(result.message);
				return;
			}

			var data = _.sortBy(result.data, ["modify_time"]);
			data.reverse().forEach(projectData => {
				var uid = util.uuid(6);
				var time = util.formatDate(new Date(projectData.modify_time * 1000), "yyyy-MM-dd hh:mm");
				var li = $(`<li>
					<input class="x-checkbox" type="checkbox" id="project-${uid}" /><label class="x-checkbox-label" for="project-${uid}"></label>
					<span class="title-wrap"><span class="title ellipsis" title="${projectData.name}">${projectData.name}</span></span>
					<span class="type">${formatProjectType(projectData.type)}</span>
					<span class="modify-time">${time}</span>
					<span class="actions"><i class="kenrobot ken-clear" data-action="delete"></i></span>
				</li>`);
				li.data("name", projectData.name).data("type", projectData.type);
				projectList.append(li);
			});

			projectList.off("click", "li", onItemClick).on("click", "li", onItemClick)
				.off("change", "li .x-checkbox", onItemSelectChange).on("change", "li .x-checkbox", onItemSelectChange)
				.off("click", "li .title").on("click", "li .title", onTitleClick)
				.off("click", "li .actions > i", onActionClick).on("click", "li .actions > i", onActionClick);

			projectList.parent().perfectScrollbar("update");
		});
	}

	function onItemClick(e) {
		if($(e.target).hasClass("x-checkbox-label")) {
			return;
		}

		var li = $(this);
		li.find(".x-checkbox").trigger("click");
	}

	function onItemSelectChange(e) {
		var checkedItems = projectList.find("li .x-checkbox:checked");
		checkedItems.length > 1 ? toolbar.addClass("delete-mode") : toolbar.removeClass("delete-mode");
	}

	function onTitleClick(e) {
		var li = $(this).parents("li");
		var name = li.data("name");
		var type = li.data("type");

		console.log("open project", name, type);

		return false;
	}

	function onActionClick(e) {
		var action = $(this).data("action");
		var li = $(this).parents("li");
		var name = li.data("name");
		var type = li.data("type");

		console.log("project action", action, name, type);

		return false;
	}

	function onSelectAll(e) {
		var checks = projectList.find("li .x-checkbox");
		if(checks.filter(":checked").length == checks.length) {
			checks.prop("checked", false);
		} else {
			checks.prop("checked", true);
		}
		onItemSelectChange();
	}

	function onNewProject(e) {

	}

	function onDeleteProject(e) {
		
	}

	function formatProjectType(type) {
		return projectTypes[type] || "未知";
	}

	return {
		init: init,
	};
});
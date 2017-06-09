define(['vendor/jquery', 'vendor/lodash', 'vendor/perfect-scrollbar', 'app/common/util/util', 'app/common/config/config'], function($1, _, $2, util, config) {
	var dialogWin;
	var projectList;
	var projectTypes = {
		edu: "教育版",
		ide: "开发版",
		scratch2: "scratch 2",
		scratch3: "scratch 3",
	};

	function init() {
		dialogWin = $('.project-dialog').on("click", ".toolbar .new-project", onNewProject).on("click", ".toolbar .delete-project", onDeleteProject);

		projectList = dialogWin.find(".list > ul");
		projectList.parent().perfectScrollbar();
		

		kenrobot.on("project", "show", onShow, {canReset: false});
	}

	function onShow(args) {
		update();

		util.dialog({
			selector: dialogWin
		});
	}

	function update() {
		var data = [{
			name: "Blink",
			type: "edu",
			modify_time: 1496906096,
		}, {
			name: "Fade",
			type: "ide",
			modify_time: 1496106096,
		}, {
			name: "String",
			type: "scratch2",
			modify_time: 1496006096,
		}, {
			name: "Blink",
			type: "scratch3",
			modify_time: 1492906096,
		}];

		projectList.empty();
		data.forEach(projectData => {
			var uid = util.uuid(6);
			var time = util.formatDate(new Date(projectData.modify_time * 1000), "yyyy-MM-dd hh:mm");
			var li = $(`<li>
				<input class="x-checkbox" type="checkbox" id="project-${uid}" /><label for="project-${uid}"></label>
				<span class="title-wrap"><span class="title ellipsis">${projectData.name}</span></span>
				<span class="type">${formatProjectType(projectData.type)}</span>
				<span class="modify-time">${time}</span>
				<span class="actions"><i class="delete kenrobot ken-clear"></i></span>
			</li>`);
			projectList.append(li);
		});

		projectList.parent().perfectScrollbar("update");
	}

	function onNewProject() {

	}

	function onDeleteProject() {
		
	}

	function formatProjectType(type) {
		return projectTypes[type] || "未知";
	}

	return {
		init: init,
	};
});
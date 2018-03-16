define(['vendor/jquery', 'app/common/util/util', 'app/common/util/emitor', '../model/codeModel'], function($1, util, emitor, codeModel) {
	var refreshTimerId;
	var region;
	var toolbar;
	var mode;
	var container;

	function init() {
		mode = "block";

		region = $('.content-region .code-region')
		toolbar = region.find(".toolbar").on('click', ".hover-button", onButtonClick);

		container = $(".code-container", region);
		codeModel.init(container[0]);

		emitor.on("code", "start-refresh", onStartRefresh)
			.on('code', 'stop-refresh', onStopRefresh)
			.on('code', 'toggle-comment', onToggleComment)
			.on('code', 'undo', onUndo)
			.on('code', 'redo', onRedo)
			.on('app', 'will-leave', onAppWillLeave)
			.on('app', 'start', onAppStart)
			.on("ui", "lock", onUILock)
			.on('progress', "check", onCheckProgress)
			.on("progress", "upload", onUploadProgress);

		kenrobot.on("setting", "change", onSettingChange);
	}

	function getData() {
		return codeModel.getData();
	}

	function setData(data) {
		codeModel.setData(data);
	}

	function genCode(codeInfo) {
		codeModel.genCode(codeInfo);
	}

	function getCopyText() {
		if(mode != "text") {
			return getData();
		}

		return codeModel.getCopyText();
	}

	function getMode() {
		return mode;
	}

	function setMode(value) {
		mode = value || "block";

		emitor.trigger("code", "changeMode", mode);

		showButtons();

		if(mode == "text") {
			onStopRefresh();
			codeModel.setMode(mode);
		} else {
			codeModel.setMode(mode);
			onStartRefresh();
		}
	}

	function onToggleComment() {
		codeModel.toggleComment();
	}

	function showButtons() {
		toolbar.find(".hover-button").each((index, item) => {
			var button = $(item);
			var buttonMode = button.data("mode");
			buttonMode == "always" || buttonMode == mode ? button.show() : button.hide();
		});
	}

	function onStartRefresh() {
		onStopRefresh();
		refreshTimerId = setInterval(function() {
			emitor.trigger("code", "refresh");
		}, 1000);
	}

	function onStopRefresh() {
		refreshTimerId && clearInterval(refreshTimerId);
	}

	function onUndo() {
		if(mode !== "text") {
			return;
		}

		codeModel.undo();
	}

	function onRedo() {
		if(mode !== "text") {
			return;
		}

		codeModel.redo();
	}

	function onAppStart() {
		showButtons();
	}

	function onAppWillLeave() {
		onStopRefresh();
	}

	function onButtonClick(e) {
		var action = $(this).data("action");
		switch(action) {
			case "copy":
				emitor.trigger("code", "copy");
				break;
			case "edit":
				util.confirm({
					text: "文本编程模式下所作出的更改，无法同步回图形模式。",
					confirmLabel: "继续",
					onConfirm: () => setMode("text")
				});
				break;
			case "back":
				util.confirm({
					text: "返回图形模式将放弃此次在文本模式下的所有更改！",
					onConfirm: () => setMode("block")
				});
				break;
			case "upload":
				emitor.trigger("project", "upload");
				break;
			case "check":
				emitor.trigger("project", "check");
				break;
			case "show-monitor":
				kenrobot.trigger('monitor', 'toggle');
				break;
			case "save":
				emitor.trigger("project", "save");
				break;
		}
	}

	function onUILock(type, value) {
		if (type == "build") {
			if (value) {
				toolbar.find(".check").attr("disabled", true);
				toolbar.find(".upload").attr("disabled", true);
			} else {
				toolbar.find(".check").attr("disabled", false).find(".x-progress").hide().css("left", "-100%");
				toolbar.find(".upload").attr("disabled", false).find(".x-progress").hide().css("left", "-100%");
			}
		}
	}

	function onCheckProgress(value) {
		if (value < 0) {
			return;
		}

		toolbar.find(".check .x-progress").show().css({
			left: "-" + (100 - value) + "%"
		});
	}

	function onUploadProgress(value, type) {
		if (value < 0) {
			return;
		}

		if (type == "build") {
			value = 80 * value / 100;
		} else {
			value = value / 100 + 80;
		}

		toolbar.find(".upload .x-progress").show().css({
			left: "-" + (100 - value) + "%"
		});
	}

	function onSettingChange(type, name, value) {
		if(type != "editor") {
			return;
		}

		switch(name) {
			case "line-height":
				container.css("line-height", `${value}px`);
				break;
			case "font-size":
				container.css("font-size", `${value}px`);
				break;
		}
	}

	return {
		init: init,
		getData: getData,
		setData: setData,
		genCode: genCode,
		getCopyText: getCopyText,

		getMode: getMode,
		setMode: setMode,
	};
});

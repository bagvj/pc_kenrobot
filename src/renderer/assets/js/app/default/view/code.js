define(['vendor/jquery', 'app/common/util/util', 'app/common/util/emitor', '../model/codeModel'], function($1, util, emitor, codeModel) {
	var refreshTimerId;
	var region;
	var toolbar;
	var mode;

	function init() {
		mode = "block";

		region = $('.content-region .code-region')
		toolbar = region.find(".toolbar").on('click', ".hover-button", onButtonClick);

		var container = $(".code-container", region);
		codeModel.init(container[0]);

		emitor.on("code", "start-refresh", onStartRefresh)
			.on('code', 'stop-refresh', onStopRefresh)
			.on('code', 'toggle-comment', onToggleComment)
			.on('app', 'will-leave', onAppWillLeave)
			.on('app', 'start', onAppStart)
			.on("ui", "lock", onUILock)
			.on('progress', "check", onCheckProgress)
			.on("progress", "upload", onUploadProgress);
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
					text: "文本模式与图形模式不兼容，文本编程模式下暂时无法转换为图形代码。",
					confirmLabel: "文本编程，我已了解后果",
					onConfirm: () => setMode("text")
				});
				break;
			case "back":
				util.confirm({
					text: "放弃所有文本模式下的修改，返回图形模式？",
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
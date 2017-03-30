define(['vendor/jquery', 'app/common/util/emitor'], function($1, emitor) {
	var region;

	function init() {
		region = $('.toolbar-region').on('click', "span", onToolClick);
		emitor.on("ui", "lock", onUILock)
			.on('progress', "check", onCheckProgress)
			.on("progress", "upload", onUploadProgress);
	}
	
	function onToolClick(e) {
		var action = $(this).data('action');
		switch(action) {
			case "check":
				emitor.trigger("project", "check");
				break;
			case "upload":
				emitor.trigger("project", "upload");
				break;
			case "monitor":
				kenrobot.trigger("monitor", "toggle");
				break;
			case "copy":
				emitor.trigger("code", "copy");
				break;
		}
	}

	function onUILock(type, value) {
		if(type == "build") {
			if(value) {
				region.find(".check").attr("disabled", true);
				region.find(".upload").attr("disabled", true);
			} else {
				region.find(".check").attr("disabled", false).find(".x-progress").hide().css("transform", "");
				region.find(".upload").attr("disabled", false).find(".x-progress").hide().css("transform", "");
			}
		}
	}

	function onCheckProgress(value) {
		if(value < 0) {
			return;
		}

		region.find(".check .x-progress").show().css({
			transform: "translateX(-" + (100 - value) + "%)"
		});
	}

	function onUploadProgress(value, type) {
		if(value < 0) {
			return;
		}

		if(type == "build") {
			value = 80 * value / 100;
		} else {
			value = value / 100 + 80;
		}

		region.find(".upload .x-progress").show().css({
			transform: "translateX(-" + (100 - value) + "%)"
		});
	}

	return {
		init: init,
	};
});
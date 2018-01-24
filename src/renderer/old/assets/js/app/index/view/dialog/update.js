define(['vendor/jquery', 'app/common/util/util', 'app/common/util/emitor'], function($1, util, emitor) {
	var dialogWin;

	var versionInfo;
	var action;
	var versionPath;

	function init() {
		dialogWin = $('.update-dialog').on("click", ".thanks", onThanksClick).on("click", ".download", onDownloadClick);

		kenrobot.on('update', 'show', onShow, {canReset: false});
	}

	function onShow(args) {
		if(action == "background-download") {
			action = "downloading";
			setBackground(false);
		} else if(action == "install" || action == "open") {
			doShow();
		} else {
			versionInfo = args;
			action = "download";

			dialogWin.find(".download").val("立即更新").attr("disabled", false);
			dialogWin.find(".thanks").val("暂不下载").show();
			dialogWin.find(".name").text(versionInfo.appname);
			dialogWin.find(".version").text(versionInfo.version);
			updateContent(dialogWin.find(".features-wrap"), versionInfo.changelog.features);
			updateContent(dialogWin.find(".bugs-wrap"), versionInfo.changelog.bugs);

			doShow();
		}
	}

	function onCancel() {
		if(action == "downloading") {
			action = "background-download";
			util.message(`新版本${versionInfo.version}已进入后台下载`);
		}
	}

	function onClosed() {
		dialogWin.removeClass("x-into-background");
	}

	function afterShow() {
		dialogWin.removeClass("x-into-front");
		if(action == "downloading") {
			dialogWin.addClass("x-into-background");
		}
	}

	function doShow() {
		util.dialog({
			selector: dialogWin,
			onCancel: onCancel,
			onClosed: onClosed,
			afterShow: afterShow,
		});
	}

	function updateContent(element, list) {
		element.find(".list").empty();

		if(!list || list.length == 0) {
			element.removeClass("active");
			return;
		}

		element.find(".list").append(list.map(item => $(`<li>${item}</li>`)));
		element.addClass("active");
	}

	function onThanksClick() {
		if(action == "downloading") {
			action = "background-download";
			setBackground(true);
			util.message(`新版本${versionInfo.version}已进入后台下载`);
		} else {
			dialogWin.find(".x-dialog-close").trigger("click");
		}
	}

	function onDownloadClick() {
		if(action == "download") {
			action = "downloading";
			var downloadBtn = dialogWin.find(".download").val("下载中 0%").attr("disabled", true);
			var thanksBtn = dialogWin.find(".thanks").val("后台下载");
			dialogWin.addClass("x-into-background");

			kenrobot.postMessage("app:download", versionInfo.download_url, {checksum: versionInfo.checksum}).then(result => {
				versionPath = result.path;

				kenrobot.postMessage("app:removeOldVersions", versionInfo.version).fin(() => {
					var oldAction = action;
					var info = kenrobot.appInfo;
					if(info.platform == "win") {
						downloadBtn.val("安装").attr("disabled", false);
						action = "install";
					} else {
						downloadBtn.val("打开").attr("disabled", false);
						action = "open";
					}
					thanksBtn.hide();
					if(oldAction == "background-download") {
						setBackground(false);
					}
				});

				emitor.trigger("update", "download", true);
			}, err => {
				if(action == "background-download") {
					util.error(`新版本${versionInfo.version}下载失败`);
				}
				downloadBtn.attr("disabled", false).val("下载失败");
				action = "download";

				emitor.trigger("update", "download", false);
			}, progress => {
				var totalSize = progress.totalSize || 100 * 1024 * 1024;
				var percent = parseInt(100 * progress.size / totalSize);
				downloadBtn.val(`下载中 ${percent}%`);

				emitor.trigger("update", "download", percent);
			});
		} else if(action == "install") {
			onThanksClick();
			kenrobot.postMessage("app:execFile", versionPath).then(() => {
				util.message("安装成功");
			}, err => {
				util.error("安装失败");
			});
		} else if(action == "open") {
			onThanksClick();
			kenrobot.postMessage("app:showItemInFolder", versionPath);
		}
	}

	function setBackground(value) {
		if(value) {
			dialogWin.addClass("x-into-background");
			dialogWin.find(".x-dialog-close").trigger("click");
		} else {
			dialogWin.addClass("x-into-front");

			doShow();
		}
	}

	return {
		init: init,
	};
});

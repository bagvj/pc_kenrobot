define(['vendor/jquery', 'app/common/util/util', 'app/common/util/emitor'], function($1, util, emitor) {
	var dialogWin;

	var canClose;
	var versionInfo;
	var action;
	var versionPath;

	function init() {
		dialogWin = $('.update-dialog').on("click", ".cancel", onCancelClick).on("click", ".download", onDownloadClick);

		kenrobot.on('update', 'show', onShow, {canReset: false});
	}

	function onShow(args) {
		canClose = true;

		versionInfo = args;
		action = "download";

		dialogWin.find(".download").val("立即更新").attr("disabled", false);
		dialogWin.find(".name").text(versionInfo.appname);
		dialogWin.find(".version").text(versionInfo.version);
		updateContent(dialogWin.find(".features-wrap"), versionInfo.changelog.features);
		updateContent(dialogWin.find(".bugs-wrap"), versionInfo.changelog.bugs);

		util.dialog({
			selector: dialogWin,
			onClosing: onClosing,
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

	function onCancelClick() {
		dialogWin.find(".x-dialog-close").trigger("click");
	}

	function onDownloadClick() {
		if(action == "download") {
			canClose = false;
			var downloadBtn = dialogWin.find(".download").val("下载中 0%").attr("disabled", true);
			kenrobot.postMessage("app:download", versionInfo.download_url, {checksum: versionInfo.checksum}).then(result => {
				versionPath = result.path;

				kenrobot.postMessage("app:removeOldVersions", versionInfo.version).fin(() => {
					var info = kenrobot.appInfo;
					if(info.platform == "win") {
						downloadBtn.val("安装").attr("disabled", false);
						action = "install";
					} else {
						downloadBtn.val("打开").attr("disabled", false);
						action = "open";
					}
					canClose = true;
				});
			}, err => {
				downloadBtn.attr("disabled", false).val("下载失败");
				canClose = true;
			}, progress => {
				var totalSize = progress.totalSize || 100 * 1024 * 1024;
				var percent = parseInt(100 * progress.size / totalSize);
				downloadBtn.val(`下载中 ${percent}%`);
			});
		} else if(action == "install") {
			onCancelClick();
			kenrobot.postMessage("app:execFile", versionPath).then(() => {
				util.message("安装成功");
			}, err => {
				util.message("安装失败");
			});
		} else {
			onCancelClick();
			kenrobot.postMessage("app:showItemInFolder", versionPath);
		}
	}

	function onClosing() {
		return canClose;
	}

	return {
		init: init,
	};
});

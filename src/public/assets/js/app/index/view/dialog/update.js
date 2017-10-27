define(['vendor/jquery', 'app/common/util/util', 'app/common/util/emitor'], function($1, util, emitor) {
	var dialogWin;
	var show;
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

		dialogWin.find(".download").val("下载").attr("disabled", false);
		dialogWin.find(".message").text(`发现新版本${versionInfo.version}，是否下载？`);

		util.dialog({
			selector: dialogWin,
			onClosed: onClosed,
			onClosing: onClosing,
		});
	}

	function onCancelClick() {
		dialogWin.find(".x-dialog-close").trigger("click");
	}

	function onDownloadClick() {
		if(action == "download") {
			canClose = false;
			var messageTxt = dialogWin.find(".message").text(`正在下载 0%`);
			var downloadBtn = dialogWin.find(".download").text("下载中").attr("disabled", true);
			kenrobot.postMessage("app:download", versionInfo.download_url, {checksum: versionInfo.checksum}).then(result => {
				versionPath = result.path;

				kenrobot.postMessage("app:removeOldVersions", versionInfo.version).fin(() => {
					var info = kenrobot.appInfo;
					if(info.platform == "win") {
						downloadBtn.val("安装").attr("disabled", false);
						messageTxt.text(`下载成功，是否安装新版本${versionInfo.version}?`);
						action = "install";
					} else {
						downloadBtn.val("打开").attr("disabled", false);
						messageTxt.text(`下载成功，是否打开文件所在位置?`);
						action = "open";
					}
					canClose = true;
				});
			}, err => {
				downloadBtn.attr("disabled", false);
				messageTxt.text(`新版本${versionInfo.version}下载失败`);
				canClose = true;
			}, progress => {
				var totalSize = progress.totalSize || 100 * 1024 * 1024;
				var percent = parseInt(100 * progress.size / totalSize);
				messageTxt.text(`正在下载 ${percent}%`);
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

	function onClosed() {
		show = false;
		dialogWin.find(".name").text("");
		dialogWin.find(".count").text("");
		dialogWin.find(".x-progress").text("");
	}

	return {
		init: init,
	};
});

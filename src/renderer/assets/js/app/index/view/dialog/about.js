define(['vendor/jquery', 'app/common/util/util', 'app/common/util/emitor'], function($1, util, emitor) {
	var dialogWin;
	var platforms = {
		win: "Windows",
		mac: "Mac",
		linux: "Linux",
	};

	function init() {
		dialogWin = $('.about-dialog');
		dialogWin.find(".office-web").on("click", onLink);

		kenrobot.on('about', 'show', onShow, {canReset: false});
	}

	function onLink(e) {
		var url = $(this).data("href");
		kenrobot.postMessage("app:openUrl", url);
	}

	function onShow(args) {
		dialogWin.find(".office-web").data("href", args.url).text(args.url);

		var platform = platforms[args.platform] || "未知";
		var appBit = args.platform == "mac" ? "" : ` ${args.appBit}位`
		dialogWin.find(".version").text(`${args.version}.${args.buildNumber} (${platform}${appBit})`);
		dialogWin.find(".date").text(util.formatDate(args.date * 1000, "yyyy-MM-dd"));

		util.dialog({
			selector: dialogWin
		});
	}

	return {
		init: init,
	};
});
define(['vendor/jquery', 'app/util/util', 'app/util/net', 'app/util/emitor', 'app/config/config'], function($1, util, net, emitor, config) {
	var dialogWin;
	var qrcode;
	var projectInfo;
	var host;

	function init() {
		dialogWin = $('.share-dialog');

		$('.right li', dialogWin).on('click', onShareClick);
		qrcode = $('.qrcode', dialogWin);
		host = window.location.host;

		emitor.on('share', 'show', onShow);
	}

	function onShow(args) {
		args = args || {};
		projectInfo = args.projectInfo;

		args.selector = dialogWin;
		args.onClosed = onClosed;

		var src = "/qrcode?content=http://" + host + "/%23/project/" + projectInfo.hash;
		qrcode.attr("src", src);

		util.dialog(args);
	}

	function onClosed() {
		qrcode.attr("src", "");
	}

	function onShareClick(e) {
		var action = $(this).data('action');
		switch(action) {
			case "weibo":
				var shareConfig = config.share.weibo;
				var url = shareConfig.url + "?appKey=" + shareConfig.appKey + "&title=" + projectInfo.project_name + " " + projectInfo.project_intro + " http://" + host + "/%23/project/" + projectInfo.hash;
				url += '，来自%23啃萝卜%23教育版';
				if(projectInfo.imageHash) {
					url += "&pic=http://" + host + "/project/image/" + projectInfo.imageHash;
				}
				net.open(encodeURI(url));
				break;
			case "qzone":
				util.message("敬请期待");
				break;
			case "kenrobot":
				util.message("敬请期待");
				break;
		}
	}

	return {
		init: init,
	};
});
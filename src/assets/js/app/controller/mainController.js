define(['vendor/jquery', 'vendor/director', 'app/config/config', 'app/util/util', 'app/util/emitor'], function($1, $2, config, util, emitor) {
	var mainWrap;
	var router;

	function init() {
		printJoinUs();
		configAjax();
		configRoute();
		configWeiXin();

		targetHandle();

		$(window).on('contextmenu', onContextMenu).on('click', onWindowClick).on('resize', onWindowResize);

		emitor.on('app', 'start', onAppStart);
		emitor.on('upload', 'check-fail', onUploadCheckFail);
		emitor.on('route', 'set', onSetRoute);
		emitor.on('route', 'init', onInitRoute);
	}

	function onAppStart() {

	}

	function targetHandle() {
		if(config.target == "pc") {
			$('.open-url').off('click').on('click', function() {
				var url = $(this).data('href');
				kenrobot && kenrobot.postMessage("app:openUrl", url);
			});
		}
	}

	function onContextMenu(e) {
		e.preventDefault();

		hideContextMenu();
		hideSelectMenu();

		emitor.trigger("app", "contextMenu", e);

		return false;
	}

	function onWindowClick(e) {
		hideContextMenu();
		hideSelectMenu();
	}

	function onWindowResize(e) {
		hideContextMenu();
		hideSelectMenu();
	}

	function onUploadCheckFail(code) {
		var isMobile = navigator.userAgent.match(/Android|iPhone|iPad/i) ? true : false;
		if (isMobile) {
			util.message("您的浏览器环境目前暂时不支持上传");
			return;
		}

		if (code == 1) {
			util.message("上传功能目前只支持chrome浏览器");
		} else {
			emitor.trigger("install", "show");
		}
	}

	function printJoinUs() {
		try {
			!config.debug && console.log(config.greet);
		} catch (e) {}
	}

	function configWeiXin() {
		if(!util.isWeiXin() || !wx) {
			return;
		}

		wx.ready(function() {
			emitor.on('weixin', 'share', onWeiXinShare);
			onWeiXinShare();
		});
	}

	function onWeiXinShare(shareData) {
		var weixinConfig = config.share.weixin;
		shareData = shareData || {};
		shareData.title = shareData.title || document.title;
		shareData.desc = shareData.desc || weixinConfig.shareData.desc;
		shareData.imgUrl = weixinConfig.shareData.imgUrl;
		shareData.link = window.location.href;

		// 分享给朋友
		wx.onMenuShareAppMessage({
			title: shareData.title,
			desc: shareData.desc,
			link: shareData.link,
			imgUrl: shareData.imgUrl,
		});
		//分享到朋友圈
		wx.onMenuShareTimeline({
			title: shareData.title,
			link: shareData.link,
			imgUrl: shareData.imgUrl,
		});
		//分享到QQ
		wx.onMenuShareQQ({
			title: shareData.title,
			desc: shareData.desc,
			link: shareData.link,
			imgUrl: shareData.imgUrl,
		});
		//分享到微博
		wx.onMenuShareWeibo({
			title: shareData.title,
			desc: shareData.desc,
			link: shareData.link,
			imgUrl: shareData.imgUrl,
		});
		//分享到QQ空间
		wx.onMenuShareQZone({
			title: shareData.title,
			desc: shareData.desc,
			link: shareData.link,
			imgUrl: shareData.imgUrl,
		});
	}

	function configAjax() {
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
	}

	function configRoute() {
		router = Router({
			'/': onRouteDefault,
			'/project/([0-9a-zA-Z]{6}|new|temp)/?': onRouteViewProject,
			'.*': onRouteOther, 
		});
	}

	function onInitRoute() {
		router.init("/");
	}

	function onRouteDefault() {
		emitor.trigger("project", "view");
	}

	function onRouteViewProject(hash) {
		emitor.trigger("project", "view", hash);
	}

	function onRouteOther() {
		onSetRoute("/");
	}

	function onSetRoute(path) {
		router.setRoute(path);
	}

	function hideSelectMenu() {
		$('.x-select').removeClass("active");
	}

	function hideContextMenu() {
		$('.x-context-menu').removeClass("active");
	}

	return {
		init: init,
	};
});
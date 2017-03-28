define(['vendor/jquery', 'vendor/mousetrap', 'app/util/util', 'app/util/emitor', 'app/config/config'], function($1, Mousetrap, util, emitor, config) {
	var mainWrap;

	function init() {
		targetHandle();

		$(window).on('contextmenu', onContextMenu).on('click', onWindowClick).on('resize', onWindowResize);

		emitor.on('app', 'start', onAppStart).on('app', 'shortcut', onShortcut).on('app', 'check-update', onCheckUpdate);

		kenrobot.on("app:onDownloadSuccess", onDownloadSuccess).on("app:debug", onAppDebug);
	}

	function onAppStart() {
		registerShortcut();
	}

	function onShortcut(name) {
		switch(name) {
			case "new-project":
				emitor.trigger('project', 'new');
				break;
			case "open-project":
				emitor.trigger('project', 'open');
				break;
			case "save-project":
				emitor.trigger('project', 'save');
				break;
			case "save-as-project":
				emitor.trigger('project', 'save', true);
				break;
			case "toggle-comment":

				break;
			case "copy":

				break;
		}
	}

	function onCheckUpdate() {
		kenrobot.postMessage("app:getAppInfo").then(function(info) {
			var data = {
				version: info.version,
				platform: info.platform,
				arch: info.arch,
				features: info.features,
				ext: info.ext,
			};

			$.ajax({
				type: "GET",
				url: config.url.checkUpdate + "&" + $.param(data),
				dataType: "json",
			}).then(function(result) {
				if(result.status == 0) {
					util.confirm({
						title: "检查更新",
						text: "发现新版本" + result.data.version + "，是否下载？",
						onConfirm: function() {
							kenrobot.postMessage("app:download", result.data.download_url, "update-download").then(function(path) {
								util.message("开始下载");
							});
						}
					});
				} else {
					util.message("已经是最新版本了");
				}
			}, function(err) {
				util.message("检查更新失败");
			});
		});
		
		// kenrobot.postMessage("app:checkUpdate", config.url.checkUpdate).then(function(result) {
		// 	if(result.status == 0) {
		// 		util.confirm({
		// 			title: "检查更新",
		// 			text: "发现新版本" + result.data.version + "，是否下载？",
		// 			onConfirm: function() {
		// 				kenrobot.postMessage("app:download", result.data.download_url, "update-download").then(function(path) {
		// 					util.message("开始下载");
		// 				});
		// 			}
		// 		});
		// 	} else {
		// 		util.message("已经是最新版本了");
		// 	}
		// });
	}

	function onDownloadSuccess(path, action) {
		switch(action) {
			case "driver-download":
				util.confirm({
					text: "驱动下载成功，是否安装?",
					onConfirm: function() {
						kenrobot.postMessage("app:installDriver", path).then(function() {
							util.message("驱动安装成功");
						}, function(err) {
							util.message({
								text: "驱动安装失败",
								type: "error"
							});
						});
					}
				});
				break;
			case "update-download":
				util.confirm({
					text: "下载成功，是否安装新版本?",
					onConfirm: function() {
						kenrobot.postMessage("app:execFile", path).then(function() {
							util.message("安装成功");
						}, function(err) {
							util.message({
								text: "安装失败",
								type: "error"
							});
						});
					}
				});
				break;
		}
	}

	function onAppDebug() {
		var args = Array.from(arguments);
		var type = args[0];
		switch(type) {
			case "emitor":
				emitor.trigger.apply(this, args.slice(1))
				break;
		}
	}

	function onContextMenu(e) {
		e.preventDefault();

		hideMenu();

		emitor.trigger("app", "contextMenu", e);

		return false;
	}

	function onWindowClick(e) {
		hideMenu();
	}

	function onWindowResize(e) {
		hideMenu();
		emitor.trigger("app", "resize", e);
	}

	function hideMenu() {
		$('.x-select, .x-context-menu').removeClass("active");
	}

	function targetHandle() {
		$('.open-url').off('click').on('click', function() {
			var url = $(this).data('href');
			kenrobot.postMessage("app:openUrl", url);
		});
	}

	function registerShortcut() {
		var shortcuts = [{
			key: ["ctrl+n", "command+n"],
			name: "new-project"
		}, {
			key: ["ctrl+o", "command+o"],
			name: "open-project"
		}, {
			key: ["ctrl+s", "command+s"],
			name: "save-project"
		}, {
			key: ["ctrl+shift+s", "command+shift+s"],
			name: "save-as-project"
		}, {
			key: ["ctrl+/", "command+/"],
			name: "toggle-comment"
		}, {
			key: ["ctrl+c", "command+c"],
			name: "copy"
		}];

		shortcuts.forEach(function(shortcut){
			Mousetrap.bind(shortcut.key, function() {
				onShortcut(shortcut.name);

				return false;
			});
		});
	}


	return {
		init: init,
	};
});
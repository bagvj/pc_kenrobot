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

			data.version = "0.2.0";

			$.ajax({
				type: "GET",
				url: config.url.checkUpdate + "&" + $.param(data),
				dataType: "json",
			}).then(function(result) {
				if(result.status == 0) {
					util.confirm({
						title: "������",
						text: "�����°汾" + result.data.version + "���Ƿ����أ�",
						onConfirm: function() {
							kenrobot.postMessage("app:download", result.data.download_url, "update-download").then(function(path) {
								util.message("��ʼ����");
							});
						}
					});
				} else {
					util.message("�Ѿ������°汾��");
				}
			}, function(err) {
				util.message("������ʧ��");
			});
		});
		
		// kenrobot.postMessage("app:checkUpdate", config.url.checkUpdate).then(function(result) {
		// 	if(result.status == 0) {
		// 		util.confirm({
		// 			title: "������",
		// 			text: "�����°汾" + result.data.version + "���Ƿ����أ�",
		// 			onConfirm: function() {
		// 				kenrobot.postMessage("app:download", result.data.download_url, "update-download").then(function(path) {
		// 					util.message("��ʼ����");
		// 				});
		// 			}
		// 		});
		// 	} else {
		// 		util.message("�Ѿ������°汾��");
		// 	}
		// });
	}

	function onDownloadSuccess(path, action) {
		switch(action) {
			case "driver-download":
				util.confirm({
					text: "�������سɹ����Ƿ�װ?",
					onConfirm: function() {
						kenrobot.postMessage("app:installDriver", path).then(function() {
							util.message("������װ�ɹ�");
						}, function(err) {
							util.message({
								text: "������װʧ��",
								type: "error"
							});
						});
					}
				});
				break;
			case "update-download":
				util.confirm({
					text: "���سɹ����Ƿ�װ�°汾?",
					onConfirm: function() {
						kenrobot.postMessage("app:execFile", path).then(function() {
							util.message("��װ�ɹ�");
						}, function(err) {
							util.message({
								text: "��װʧ��",
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
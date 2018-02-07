define(function() {
	var menu = [{
		placeholder: "文件",
	}, {
		placeholder: "编辑",
	}, {
		placeholder: "案例",
	}, {
		placeholder: "选项",
		menu: [{
			text: "全屏",
			action: "fullscreen",
		}, {
			text: "语言",
			action: "language",
		}, {
			text: "主题",
			action: "theme",
		}, "_", {
			text: "设置",
			action: "setting",
		}]
	}, {
		placeholder: "帮助",
		menu: [{
			text: "Arduino驱动下载",
			action: "download-arduino-driver",
		}, "_", {
			text: "检查更新",
			action: "check-update",
		}, {
			text: "访问官网",
			action: "visit-kenrobot",
		}, {
			text: "Arduino论坛",
			action: "visit-arduino",
		}, "_", {
			text: "建议反馈",
			action: "suggestion",
		}, {
			text: "关于软件",
			action: "about-kenrobot",
		}]
	}];

	return menu;
});

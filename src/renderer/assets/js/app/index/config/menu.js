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
			text: "驱动下载",
			action: "download-driver",
		}, "_", {
			text: "检查更新",
			action: "check-update",
		}, {
			text: "吖扑科学官网",
			action: "visit-uper",
		}, "_", {
			text: "建议反馈",
			action: "suggestion",
		}, {
			text: "关于软件",
			action: "about-software",
		}]
	}];

	return menu;
});
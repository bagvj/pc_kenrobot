define(function() {
	var menu = [{
		id: "file",
		placeholder: "文件",
		menu: [{
			text: "新建",
			action: "new-project",
			shortcut: {
				key: ["ctrl+n", "command+n"],
				text: "Ctrl+N",
			}
		}, "_", {
			text: "打开",
			action: "open-project",
			shortcut: {
				key: ["ctrl+o", "command+o"],
				text: "Ctrl+O",
			}
		}, {
			text: "保存",
			action: "save-project",
			shortcut: {
				key: ["ctrl+s", "command+s"],
				text: "Ctrl+S",
			}
		}, {
			text: "另存为",
			action: "save-as-project",
			shortcut: {
				key: ["ctrl+shift+s", "command+shift+s"],
				text: "Ctrl+Shift+S",
			}
		}]
	}, {
		id: "edit",
		placeholder: "编辑",
		menu: [{
			text: "注释/取消注释",
			action: "toggle-comment",
			shortcut: {
				key: ["ctrl+/", "command+/"],
				text: "Ctrl+/",
			}
		}, "_", {
			text: "复制",
			action: "copy",
			shortcut: {
				key: ["ctrl+c", "command+c"],
				text: "Ctrl+C",
			}
		}]
	}, {
		id: "example",
		placeholder: "案例",
		menu: [{
			id: "example-built-in",
			placeholder: "内置示例",
			arrow: true,
			menuCls: "example-built-in",
		}, "_", {
			id: "example-third-party",
			placeholder: "第三方示例",
			arrow: true,
			menuCls: "example-third-party"
		}]
	}, {
		id: "options",
		placeholder: "选项",
		menu: [{
			id: "boards",
			placeholder: "开发板",
			arrow: true,
			menuCls: "boards",
			menuWidth: 300,
		}, "_", {
			id: "fullscreen",
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
		id: "help",
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
	}, {
		id: "version",
		placeholder: "版本",
		menu: [{
			text: "教育版",
			action: "switch",
			cls: "check",
			extra: {
				type: "edu"
			},
		}, {
			text: "开发版",
			action: "switch",
			cls: "check",
			extra: {
				type: "ide"
			},
		}]
	}];

	return menu;
});
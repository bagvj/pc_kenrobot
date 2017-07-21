define(function() {
	var menu = [{
		id: "file",
		placeholder: "文件",
		menu: [{
			text: "新建项目",
			action: "new-project",
			shortcut: {
				key: ["ctrl+n", "command+n"],
				text: "Ctrl+N",
			}
		}, "_", {
			text: "打开项目",
			action: "open-project",
			shortcut: {
				key: ["ctrl+o", "command+o"],
				text: "Ctrl+O",
			}
		}, {
			text: "保存项目",
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
			text: "撤消删除",
			action: "undelete",
		}, "_", {
			text: "小舞台布局模式",
			action: "toggle-samll-stage",
		}, {
			text: "加速模式",
			action: "toggle-turbo-mode",
		}, "_", {
			text: "编辑块颜色",
			action: "edit-block-colors",
		}]
	}, {
		id: "example",
		placeholder: "案例",
	}, {
		id: "options",
		placeholder: "选项",
		menu: [{
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
		}, "_", {
			text: "上传ArduBits固件",
			action: "upload-firmware",
			extra: {
				name: "ardubits.hex",
				options: {
					mcu: "atmega328p",
					baudrate: 57600,
				}
			},
		}]
	}, {
		id: "help",
		placeholder: "帮助",
		menu: [{
			text: "Arduino驱动下载",
			action: "download-arduino-driver",
		}, "_", {
			text: "检查更新",
			action: "check-update",
		}, {
			text: "啃萝卜官网",
			action: "visit-kenrobot",
		}, {
			text: "Arduino论坛",
			action: "visit-arduino",
		}, "_", {
			text: "建议反馈",
			action: "suggestion",
		}, {
			text: "关于啃萝卜",
			action: "about-kenrobot",
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
		}, {
			text: "scratch 2",
			action: "switch",
			cls: "check",
			extra: {
				type: "scratch2"
			},
		}, {
			text: "scratch 3",
			action: "switch",
			cls: "check",
			extra: {
				type: "scratch3"
			},
		}]
	}];

	return menu;
});
define(['app/common/util/util', 'app/common/util/emitor', 'vendor/beautify', 'vendor/ace/ace', 'vendor/ace/theme-default', 'vendor/ace/theme-black', 'vendor/ace/mode-arduino', 'vendor/ace/snippets/text', 'vendor/ace/snippets/arduino', 'vendor/ace/ext-language_tools'], function(util, emitor, beautify) {
	var editor;
	var codeTemplate = '/**\n * Copyright(C), 2018-2038, uper.cc\n * FileName: {{name}}.ino\n * Author: {{author}}\n * Create: {{created_at}}\n * Modify: {{updated_at}}\n */\nINCLUDE_CODE CONST_CODE {{global}}\nvoid setup()\n{\n{{setup}}\n}\n\nvoid loop()\n{\n{{loop}}\n}{{end}}';

	function init(container) {
		editor = ace.edit(container);
		editor.setOptions({
			enableSnippets: true,
			enableBasicAutocompletion: true,
			enableLiveAutocompletion: true,
		});
		editor.setReadOnly(true);
		editor.setShowPrintMargin(false);
		editor.$blockScrolling = Infinity;
		editor.setTheme("ace/theme/black");
		editor.session.setMode("ace/mode/arduino");

		editor.commands.addCommands([{
			name: "saveProject",
			bindKey: {
				win: "Ctrl-S",
				mac: "Command-S"
			},
			exec: function() {}
		}, {
			name: "formatCode",
			bindKey: {
				win: "Ctrl-U",
				mac: "Command-U"
			},
			exec: function() {}
		}, {
			name: "movelinesup",
			bindKey: {
				win: "Ctrl-Up",
				mac: "Command-Up"
			},
			exec: function(e) {
				e.moveLinesUp();
			},
			scrollIntoView: "cursor"
		}, {
			name: "movelinesdown",
			bindKey: {
				win: "Ctrl-Down",
				mac: "Command-Down"
			},
			exec: function(e) {
				e.moveLinesDown();
			},
			scrollIntoView: "cursor"
		}, {
			name: "unfind",
			bindKey: {
				win: "Ctrl-F",
				mac: "Command-F"
			},
			exec: function() {},
		}, {
			name: "unreplace",
			bindKey: {
				win: "Ctrl-H",
				mac: "Command-Option-F"
			},
			exec: function() {},
		}, {
			name: "showSettingsMenu",
			bindKey: {
				win: "Ctrl-,",
				mac: "Command-,"
			},
			exec: function() {},
		}, {
			name: "centerselection",
			bindKey: {
				win: "Ctrl-L",
				mac: "Command-L",
			},
			exec: function() {},
		}]);

		kenrobot.on("setting", "change", onSettingChange);
	}

	function getData() {
		return editor.getValue();
	}

	function setData(data) {
		if(data) {
			data !== getData() && editor.setValue(data, 1);
		} else {
			genCode();
		}
	}

	function genCode(codeInfo) {
		codeInfo = codeInfo || {};
		var date = new Date();
		var code = codeTemplate.replace(/\{\{name\}\}/, codeInfo.name || "我的项目")
			.replace(/\{\{author\}\}/, codeInfo.author || "uper")
			.replace(/\{\{created_at\}\}/, util.formatDate(codeInfo.created_at || date, "yyyy/MM/dd"))
			.replace(/\{\{updated_at\}\}/, util.formatDate(codeInfo.updated_at || date, "yyyy/MM/dd"))
			.replace(/\{\{global\}\}/, codeInfo.global ? "\n" + codeInfo.global + "\n" : "")
			.replace(/\{\{setup\}\}/, codeInfo.setup || "    ")
			.replace(/\{\{loop\}\}/, codeInfo.loop || "    ")
			.replace(/\{\{end\}\}/, codeInfo.end ? "\n\n" + codeInfo.end : "");

		code = beautify.js_beautify(code, {
			brace_style: "collapse-preserve-inline"
		}).replace(/INCLUDE_CODE/, codeInfo.include ? "\n" + codeInfo.include + "\n" : "").replace(/CONST_CODE/, codeInfo.const ? "\n" + codeInfo.const + "\n" : "");

		editor.setValue(code, 1);
	}

	function setMode(mode) {
		if(mode == "text") {
			editor.setReadOnly(false);
		} else {
			editor.setReadOnly(true);
		}
	}

	function toggleComment() {
		editor.execCommand("togglecomment");
	}

	function getCopyText() {
		return editor.getCopyText() || getData();
	}

	function onSettingChange(type, name, value) {
		if(type != "editor") {
			return;
		}

		switch(name) {
			case "tab-size":
				editor.getSession().setTabSize(value);
				editor.setValue(editor.getValue(), 1);
				break;
		}
	}

	return {
		init: init,
		getData: getData,
		setData: setData,

		genCode: genCode,
		getCopyText: getCopyText,

		setMode: setMode,
		toggleComment: toggleComment,
	}
});

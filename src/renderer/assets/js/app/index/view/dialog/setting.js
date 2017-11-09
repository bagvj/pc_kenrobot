define(['vendor/jquery', 'app/common/util/util', 'app/common/util/emitor'], function($1, util, emitor) {
	var dialogWin;
	var setting;
	var tabs;

	function init() {
		dialogWin = $(".setting-dialog").on('click', '.left ul > li', onTabClick);
		tabs = dialogWin.find(".right .tab");

		tabs.filter(".tab-ide").on("change", '.font-size', function() {
			applySetting("ide", "font-size", parseInt($(this).val()));
			saveSetting();
		}).on("change", '.line-height', function() {
			applySetting("ide", "line-height", parseInt($(this).val()));
			saveSetting();
		}).on("change", '.tab-size', function() {
			applySetting("ide", "tab-size", parseInt($(this).val()));
			saveSetting();
		});

		kenrobot.on('setting', 'show', onShow, {canReset: false});
	}

	function onShow(args) {
		setTimeout(() => update(), 500);
		util.dialog({
			selector: dialogWin
		});
	}

	function onTabClick(e) {
		var li = $(this);
		var action = li.data('action');
		util.toggleActive(li);

		var tab = dialogWin.find('.right .tab-' + action);
		util.toggleActive(tab);

		var text = li.text();
		dialogWin.find('.x-dialog-title').text("设置 > " + text);

		if(action != "ide") {
			util.message("敬请期待");
		}
	}

	function update() {
		if(!tabs.filter("> .active").length) {
			dialogWin.find(`.left ul > li[data-action="${kenrobot.viewType}"]`).click();
		}

		kenrobot.postMessage("app:loadSetting").then(result => {
			setting = result;

			var ideSetting = setting.ide || {}
			if(ideSetting) {
				var ideTab = tabs.filter(".tab-ide");
				ideTab.find(".font-size").val(ideSetting["font-size"] || 16);
				ideTab.find(".line-height").val(ideSetting["line-height"] || 24);
				ideTab.find(".tab-size").val(ideSetting["tab-size"] || 4);
			}
		});
	}

	function saveSetting() {
		kenrobot.postMessage("app:saveSetting", setting);
	}

	function applySetting(type, name, value) {
		var specSetting = setting[type] || (setting[type] = {});
		specSetting[name] = value;
		kenrobot.trigger("setting", "change", type, name, value);
	}

	return {
		init: init,
	}
});
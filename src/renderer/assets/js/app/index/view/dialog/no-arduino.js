define(['vendor/jquery', 'app/common/util/util', 'app/common/util/emitor'], function($1, util, emitor) {

	function init() {
		kenrobot.on("no-arduino", "show", onShow, {canReset: false});
	}

	function onShow() {
		kenrobot.delayTrigger(10, 'common', 'show', {
			type: 'warn warn-info',
			content: '未检测到有Arduino开发板或其他串口设备插入。<span class="link" data-type="link" data-close-dialog="true">驱动问题</span>？解决后请关闭窗口，然后重试',
			onLink: function(type) {
				setTimeout(function() {
					util.confirm({
						type: "info",
						title: "驱动问题",
						text: '如果你遇到了Arduino驱动问题，请点击<br />菜单"帮助"->"修复Arduino驱动"',
						confirmLabel: "我知道了",
					});
				}, 400);
			}
		});
	}

	return {
		init: init,
	}
});

define(['vendor/jquery'], function($1) {
	var region;
	function init() {
		region = $('.titlebar-region');

		$('.window-btns li', region).on('click', onWindowBtnClick);
	}

	function onWindowBtnClick(e) {
		var action = $(this).data("action");
		switch(action) {
			case "min":
				kenrobot.postMessage("app:min");
				break;
			case "max":
				kenrobot.postMessage("app:max");
				break;
			case "close":
				kenrobot.postMessage("app:quit");
				break;
		}
	}

	return {
		init: init,
	}
});
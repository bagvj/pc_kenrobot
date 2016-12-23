define(['./content/content', './dialog/dialog'], function(content, dialog) {

	function init() {
		content.init();
		dialog.init();
	}

	return {
		init: init,
	};
});
define(['./code', './toolbar'], function(code, toolbar) {

	function init() {
		code.init();
		toolbar.init();
	}

	return {
		init: init,
	};
});
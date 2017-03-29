define(['vendor/jquery', 'app/common/util/emitor'], function($1, emitor) {
	var region;

	function init() {
		region = $('.toolbar-region').on('click', "span", onToolClick);
	}
	
	function onToolClick(e) {
		var action = $(this).data('action');
		switch(action) {
			case "check":
				emitor.trigger("project", "check");
				break;
			case "upload":
				emitor.trigger("project", "upload");
				break;
			case "copy":
				emitor.trigger("code", "copy");
				break;
		}
	}

	return {
		init: init,
	};
});
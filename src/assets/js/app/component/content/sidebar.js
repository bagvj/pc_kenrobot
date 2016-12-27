define(['vendor/jquery', 'app/config/config', 'app/util/util', 'app/util/emitor'], function($1, config, util, emitor) {
	var region;

	function init() {
		region = $('.sidebar-region').on('click', 'li', onTabClick);

		emitor.on('app', 'start', onAppStart);
	}

	function onAppStart() {
		$('li[data-action="hardware"]', region).click();
	}

	function onTabClick(e) {
		var li = $(this);
		var action = li.data('action');
		if(action == "upload") {
			emitor.trigger("project", "upload")
			return;	
		}

		if(li.hasClass("active")) {
			return;
		}

		util.toggleActive(li)
		util.toggleActive($('.content-region .tab-' + action));

		emitor.trigger("sidebar", "activeTab", action);
	}

	return {
		init: init,
	};
});
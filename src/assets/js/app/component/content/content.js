define(['vendor/jquery', 'app/util/util', 'app/util/emitor', './sidebar', './login', './project', './hardware', './software', './code'], function($1, util, emitor, sidebar, login, project, hardware, software, code) {
	var region;

	function init() {
		region = $('.content-tabs');

		sidebar.init();
		login.init();
		project.init();
		hardware.init();
		software.init();
		code.init();

		emitor.on('app', 'start', onAppStart);
		emitor.on('sidebar', 'activeTab', onActiveTab);
	}

	function onAppStart() {

	}

	function onActiveTab(name) {
		var tab = $('.tab-' + name, region);
		tab.length && util.toggleActive(tab);
		var target = tab.length ? name : $('.tab.active', region).data('action');
		setTimeout(function() {
			emitor.trigger(target, "resize");
		}, 300);
	}

	return {
		init: init,
	};
});
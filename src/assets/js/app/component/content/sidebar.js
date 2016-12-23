define(['vendor/jquery', 'app/config/config', 'app/util/util', 'app/util/net', 'app/util/emitor'], function($1, config, util, net, emitor) {
	var tabs;
	var region;

	function init() {
		$(window).on('click', onWindowClick);

		var region = $('.sidebar-region');

		$('.logo', region).on('click', onLogoClick);
		$('.center > li', region).on('click', onTabClick);
		$('.bottom > li', region).on('click', onBottomTabClick);

		tabs = $('.sidebar-tabs');

		emitor.on('app', 'start', onAppStart);
		emitor.on('sidebar', 'toggle', onTabToggle);
	}

	function onAppStart() {
		$('li[data-action="hardware"]', region).click();
	}

	function onTabClick(e) {
		var li = $(this);
		util.toggleActive(li);

		var action = li.data('action');
		if(action == "code") {
			li.addClass("fold");
			tabs.find('.tab.active').removeClass("active");
			tabs.removeClass("slide-in").removeClass("slide-out").removeClass("active");
		} else {
			var tab = tabs.find(".tab-" + action);
			var activeTab = tabs.find(".tab.active");
			if(activeTab.length == 0) {
				li.removeClass("fold");
				tab.addClass("active");

				tabs.removeClass("slide-out").addClass("active").addClass("slide-in");
			} else if(tab.hasClass("active")) {
				li.addClass("fold");
			
				tabs.removeClass("slide-in").addClass("slide-out").delay(300, "slide-out").queue("slide-out", function() {
					tab.removeClass("active");
					tabs.removeClass("active").removeClass("slide-out");
				});
				tabs.dequeue("slide-out");
			} else {
				activeTab.removeClass("active");
				tab.addClass("active");
			}
		}

		emitor.trigger("sidebar", "activeTab", action);
		
		return false;
	}

	function onLogoClick(e) {
		var isWeixin = navigator.userAgent.match(/MicroMessenger/) ? true : false;
		if(isWeixin) {
			window.location.href = window.location.pathname + "?" + new Date().getTime();
		} else {
			var url = $(this).data('href')
			config.target == "pc" ? net.open(url) : (window.location.href = url);
		}
	}

	function onBottomTabClick(e) {
		var li = $(this);
		var action = li.data('action');
		switch(action) {
			case "share":
				emitor.trigger("project", "share");
				break;
			case "help": 
				net.open(li.data("href"));
				break;
		}

		return false;
	}

	function onTabToggle() {
		util.isMobile() && $('.center > li.active', region).click();
	}

	function onWindowClick(e) {
		if(!e.pageX || !e.pageY || !util.isMobile() || !tabs.hasClass("active")) {
			return;
		}

		var rect = tabs[0].getBoundingClientRect();
		if(e.pageX >= rect.left && e.pageX <= rect.right && e.pageY >= rect.top && e.pageY <= rect.bottom) {
			return;
		}

		rect = $('.center', region)[0].getBoundingClientRect();
		if(e.pageX >= rect.left && e.pageX <= rect.right && e.pageY >= rect.top && e.pageY <= rect.bottom) {
			return;
		}

		$('.center > li.active', region).click();
	}

	return {
		init: init,
	};
});
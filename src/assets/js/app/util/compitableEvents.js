define(function() {
	var events;

	var isMobile = navigator.userAgent.match(/Android|iPhone|iPad/i) ? true : false;
	if (isMobile) {
		events = {
			down: 'touchstart',
			move: 'touchmove',
			up: 'touchend',
		};
	} else {
		events = {
			down: 'mousedown',
			move: 'mousemove',
			up: 'mouseup',
		};
	}
	events.isMobile = isMobile;

	return events;
});
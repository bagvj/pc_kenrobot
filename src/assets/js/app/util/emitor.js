define(function() {
	var hanlderMap = {};
	var delayTimers = {};

	function getEventName(target, type) {
		return target + "_" + type;
	}

	function on(target, type, callback, priority) {
		priority = priority || 0;
		var name = getEventName(target, type);
		var hanlders = hanlderMap[name];
		if(!hanlders) {
			hanlders = [];
			hanlderMap[name] = hanlders;
		}
		hanlders.push({
			callback: callback,
			priority: priority,
		});
	}

	function off(target, type, callback) {
		var name = getEventName(target, type);
		var hanlders = hanlderMap[name];
		if(!hanlders) {
			return;
		}

		for(var i = 0; i < hanlders.length; i++) {
			var handler = hanlders[i];
			if(handler.callback == callback) {
				hanlders.splice(i, 1);
				break;
			}
		}
	}

	function trigger(target, type) {
		var name = getEventName(target, type);
		var hanlders = hanlderMap[name];
		if(!hanlders) {
			return;
		}

		hanlders = hanlders.concat().sort(function(a, b) {
			return b.priority - a.priority;
		});

		var args = [].slice.call(arguments, 2);
		for(var i = 0; i < hanlders.length; i++) {
			var handler = hanlders[i];
			handler.callback.apply(this, args);
		}
	}

	function delayTrigger(target, type) {
		var args = [].concat.call(arguments)[0];
		var self = this;
		var name = getEventName(target, type);
		var timerId = delayTimers[name];
		timerId && clearTimeout(timerId);
		timerId = setTimeout(function() {
			delayTimers[name] = null;
			trigger.apply(self, args);
		}, 100);
		delayTimers[name] = timerId;
	}

	return {
		on: on,
		off: off,
		trigger: trigger,
		delayTrigger: delayTrigger,
	}
});
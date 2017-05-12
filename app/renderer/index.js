(function(global, exports) {
	const {ipcRenderer} = require('electron')
	const log = require('electron-log')
	const is = require('electron-is')
	const Q = require('q')

	var registeredEvents = []
	var defers = {}
	var deferAutoId = 0

	function onMessage(e, deferId, type, ...args) {
		var deferred = defers[deferId]
		if(!deferred) {
			return
		}

		var callback
		if(type == "notify") {
			callback = deferred.notify
		} else {
			delete defers[deferId]
			callback = type ? deferred.resolve : deferred.reject
		}
		callback.apply(this, args)
	}
	
	function postMessage(name, ...args) {
		if(registeredEvents.indexOf(name) < 0) {
			ipcRenderer.on(name, onMessage)
			registeredEvents.push(name)
		}

		var deferred = Q.defer()
		deferAutoId++
		defers[deferAutoId] = deferred

		is.dev() && log.debug(`postMessage: ${name}, ${args.join(", ")}`)

		ipcRenderer.send.apply(this, [name, deferAutoId].concat(args))

		return deferred.promise
	}

	function listenMessage(name, callback) {
		ipcRenderer.on(name, (e, args) => {
			callback.apply(this, args)
		})

		return this
	}

	var hanlderMap = {}
	var delayTimers = {}

	function getEventName(target, type) {
		return target + "_" + type
	}

	function on(target, type, callback, options) {
		options = options || {}
		options.priority = options.priority || 0
		options.canReset = options.canReset !== false

		var name = getEventName(target, type)
		var hanlders = hanlderMap[name]
		if(!hanlders) {
			hanlders = []
			hanlderMap[name] = hanlders
		}
		hanlders.push({
			callback: callback,
			options: options,
		})

		return this
	}

	function off(target, type, callback) {
		var name = getEventName(target, type)
		var hanlders = hanlderMap[name]
		if(!hanlders) {
			return this
		}

		for(var i = 0; i < hanlders.length; i++) {
			var handler = hanlders[i]
			if(handler.callback == callback) {
				hanlders.splice(i, 1)
				break
			}
		}

		return this
	}

	function trigger(target, type, ...args) {
		var name = getEventName(target, type)
		var hanlders = hanlderMap[name]
		if(!hanlders) {
			return this
		}

		hanlders = hanlders.concat().sort(function(a, b) {
			return b.options.priority - a.options.priority
		})

		for(var i = 0; i < hanlders.length; i++) {
			var handler = hanlders[i]
			handler.callback.apply(this, args)
		}

		return this
	}

	function delayTrigger(time, target, type, ...args) {
		var self = this
		var name = getEventName(target, type)
		var timerId = delayTimers[name]
		timerId && clearTimeout(timerId)
		timerId = setTimeout(function() {
			delete delayTimers[name]
			trigger.apply(self, [target, type].concat(args))
		}, time)
		delayTimers[name] = timerId

		return this
	}

	var view = {}

	function reset() {
		for(var key in hanlderMap) {
			var hanlders = hanlderMap[key]
			for(var i = hanlders.length - 1; i >= 0; i--) {
				var hanlder = hanlders[i]
				if(hanlder.options.canReset) {
					hanlders.splice(i, 1)
				}
			}
			if(hanlders.length == 0) {
				delete hanlderMap[key]
			}
		}
		for(var key in delayTimers) {
			var timerId = delayTimers[key]
			timerId && clearTimeout(timerId)
			delete delayTimers[key]
		}
		delayTimers = {}

		Object.keys(view).forEach(key => {
			delete view[key]
		})

		return this
	}

	exports.postMessage = postMessage
	exports.listenMessage = listenMessage

	exports.on = on
	exports.off = off

	exports.trigger = trigger
	exports.delayTrigger = delayTrigger

	exports.reset = reset
	exports.view = view
})(window, window.kenrobot || (window.kenrobot = {}))
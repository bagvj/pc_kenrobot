(function(global, exports) {
	const {ipcRenderer} = require('electron')
	const log = require('electron-log')
	const is = require('electron-is')
	const Q = require('q')

	var registeredEvents = []
	var defers = {}
	var deferAutoId = 0

	function onMessage(e, deferId, type) {
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
		callback.apply(this, Array.from(arguments).slice(3))
	}
	
	function postMessage(name) {
		if(registeredEvents.indexOf(name) < 0) {
			ipcRenderer.on(name, onMessage)
			registeredEvents.push(name)
		}

		var deferred = Q.defer()
		deferAutoId++
		defers[deferAutoId] = deferred

		var args = Array.from(arguments)
		is.dev() && log.debug(args.join(", "))

		args.splice(1, 0, deferAutoId)
		ipcRenderer.send.apply(this, args)

		return deferred.promise
	}

	function on(name, callback) {
		ipcRenderer.on(name, (e, args) => {
			callback.apply(this, args)
		})

		return this
	}

	exports.postMessage = postMessage
	exports.on = on
})(window, window.kenrobot || (window.kenrobot = {}))
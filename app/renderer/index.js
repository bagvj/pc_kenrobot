(function(global, exports) {
	const {ipcRenderer} = require('electron')
	const Q = require('q')

	var registeredEvents = []
	var defers = {}
	var deferAutoId = 0

	function onMessage(e, deferId, success) {
		var deferred = defers[deferId]
		if(!deferred) {
			return
		}

		delete defers[deferId]
		var callback = success ? deferred.resolve : deferred.reject
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
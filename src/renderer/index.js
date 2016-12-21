(function(global, exports) {
	const Q = require('q')
	const electron = require('electron')
	const ipcRenderer = electron.ipcRenderer

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

	exports.postMessage = postMessage
})(window, window.kenrobot || (window.kenrobot = {}))
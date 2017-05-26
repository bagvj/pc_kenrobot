define(function() {
	var debug;

	function init(_debug) {
		debug = _debug;
		window.onerror = onAppError;
	}

	function onAppError(message, src, line, col, err) {
		var key = message + "-" + src + "-" + line + "-" + col;
		debug && err && console.error(err.stack);
		
		var error = {
			message: message,
			src: src,
			line: line,
			col: col,
			stack: err.stack || ""
		};

		kenrobot.postMessage("app:errorReport", error);

		return true;
	}

	return {
		init: init,
	}
});
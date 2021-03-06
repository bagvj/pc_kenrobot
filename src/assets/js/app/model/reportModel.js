define(['app/config/config'], function(config) {

	function init() {
		window.onerror = onAppError;
	}

	function onAppError(message, src, line, col, err) {
		var key = message + "-" + src + "-" + line + "-" + col;
		config.debug && err && console.error(err.stack);
		
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
define(function() {

	function init() {
		window.onerror = onError;

		kenrobot.on("app", "error", onAppError, {canReset: false});
	}

	function onAppError(message) {
		kenrobot.postMessage("app:errorReport", message, "AppError");
	}

	function onError(message, src, line, col, err) {
		var key = message + "-" + src + "-" + line + "-" + col;
		kenrobot.appInfo.dev && err && console.error(err.stack);

		var error = {
			message: message,
			src: src,
			line: line,
			col: col,
			stack: err.stack || ""
		};

		message = `------ error message ------\n${err.message}(${err.src} at line ${err.line}:${err.col})\n${err.stack}`

		kenrobot.postMessage("app:errorReport", message, "SystemError");

		return true;
	}

	return {
		init: init,
	}
});

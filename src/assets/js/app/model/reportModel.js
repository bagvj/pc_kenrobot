define(['app/util/emitor', 'app/config/config', 'app/util/net'], function(emitor, config, net) {
	var errors;
	var lastReportTime;
	var counts;

	function init() {
		window.onerror = onAppError;

		errors = [];
		counts = {};
		debugs = [];

		emitor.on("app", "debug", onAppDebug);
	}

	function onAppDebug(message) {
		config.debug && console.log("debug: " + message);
		debugs.push(message);

		if(debugs.length < 10 && !timeToReport()) {
			return
		}

		report("debug", JSON.stringify(debugs));
		debugs = [];
	}

	function onAppError(message, src, line, col, error) {
		var key = message + "-" + src + "-" + line + "-" + col;
		error && config.debug && console.error(error.stack || key);

		if (counts[key]) {
			counts[key]++;
			errors.forEach(function(e) {
				if (e.message == message && e.src == src && e.line == line && e.col == col) {
					e.count = counts[key];
					return true;
				}
			});
		} else {
			counts[key] = 1;
			errors.push({
				message: message,
				src: src,
				line: line,
				col: col,
				stack: error && error.stack || "",
				count: counts[key],
			});
		}

		if (errors.length < 10 && !timeToReport()) {
			return true;
		}
		
		report("error", JSON.stringify(errors));
		errors = [];
		counts = {};

		return true;
	}

	function timeToReport() {
		var now = new Date().getTime();
		return !lastReportTime || lastReportTime + 60 * 1000 < now
	}

	function updateLastReport() {
		lastErrorTime = new Date().getTime();
	}

	function report(type, content) {
		if(config.target == "web") {
			net.request({
				type: "POST",
				url: "/api/report",
				data: {
					type: type,
					content: content
				},
				dataType: "json",
			});
		} else {
			kenrobot.postMessage("app:errorReport", type, content)
		}

		updateLastReport();
	}

	return {
		init: init,
	}
});
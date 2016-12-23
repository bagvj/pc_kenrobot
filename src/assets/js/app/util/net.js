define(['vendor/jquery', 'app/config/config'], function($1, config) {

	function request(options) {
		if(config.target != "pc") {
			return $.ajax(options);
		}

		options.method = options.type;
		delete options.type;

		options.json = true;
		delete options.dataType;

		options.url = config.host + options.url + "?" + $.param(options.data);
		delete options.data;

		return kenrobot && kenrobot.postMessage("app:netRequest", options);
	}

	function open(url) {
		if(config.target != "pc") {
			return window.open(url);
		}

		return kenrobot && kenrobot.postMessage("app:openUrl", url);
	}

	return {
		request: request,
		open: open,
	}
})
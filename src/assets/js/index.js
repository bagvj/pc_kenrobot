require.config({
	baseUrl: "assets/js",
	shim: {
		"vendor/bootstrap": {
			deps: ['./jquery'],
		},
		"vendor/jquery.cookie": {
			deps: ['./jquery'],
		},
		"vendor/ace/mode-arduino": {
			deps: ['./ace'],
		},
		"vendor/ace/snippets/text": {
			deps: ['../ace'],
		},
		"vendor/ace/snippets/arduino": {
			deps: ['../ace', './text'],
		},
		"vendor/ace/theme-default": {
			deps: ['./ace'],
		},
		"vendor/ace/ext-language_tools": {
			deps: ['./ace', "./mode-arduino", "./snippets/text", "./snippets/arduino", "./theme-default"],
		},
	},
});

require(['./app/app'], function(app) {
	app.init();
});

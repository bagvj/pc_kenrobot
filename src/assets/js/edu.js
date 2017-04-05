require.config({
	baseUrl: "assets/js",
	shim: {
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
		"vendor/ace/theme-black": {
			deps: ['./ace'],
		},
		"vendor/ace/theme-white": {
			deps: ['./ace'],
		},
		"vendor/ace/ext-language_tools": {
			deps: ['./ace', "./mode-arduino", "./snippets/text", "./snippets/arduino", "./theme-default", "./theme-black", './theme-white'],
		},
	},
});

require(['./app/edu/index'], function(app) {
	app.init();
});

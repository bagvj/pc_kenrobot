require.config({
	baseUrl: "assets/js",
});

require(['./app/index/index'], function(app) {
	app.init();
});

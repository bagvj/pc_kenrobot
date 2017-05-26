require.config({
	baseUrl: "../assets/js",
});

require(['./app/scratch2/index'], function(app) {
	app.init();
});

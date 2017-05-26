require.config({
	baseUrl: "../assets/js",
});

require(['./app/scratch3/index'], function(app) {
	app.init();
});

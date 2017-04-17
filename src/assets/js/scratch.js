require.config({
	baseUrl: "../assets/js",
});

require(['./app/scratch/index'], function(app) {
	app.init();
});

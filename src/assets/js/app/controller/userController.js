define(['app/util/emitor', 'app/config/config', 'app/model/userModel'], function(emitor, config, userModel) {

	function init() {
		emitor.on('user', 'logout', onUserLogout);
	}

	function onUserLogout() {
		userModel.logout().then(function() {
			kenrobot && kenrobot.postMessage("app:reload").then(function() {
				document.title = config.title;
			});
		});
	}

	return {
		init: init,
	}
});
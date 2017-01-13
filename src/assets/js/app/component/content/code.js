define(['vendor/jquery', 'app/util/emitor', 'app/model/codeModel'], function($1, emitor, codeModel) {
	function init() {
		var region = $('.content-region .code-region');
		var container = $(".code-container", region);
		codeModel.init(container[0]);

		emitor.on('app', 'start', onAppStart);
	}

	function getData() {
		return codeModel.getData();
	}

	function setData(data) {
		codeModel.setData(data);
	}

	function genCode(codeInfo) {
		codeModel.genCode(codeInfo);
	}

	function onAppStart() {
		setInterval(function() {
			emitor.trigger("code", "refresh");
		}, 1000);
	}

	return {
		init: init,
		getData: getData,
		setData: setData,
		genCode: genCode,
	};
});
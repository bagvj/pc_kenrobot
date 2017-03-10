define(['vendor/jquery', 'app/util/emitor', 'app/model/codeModel'], function($1, emitor, codeModel) {
	function init() {
		var region = $('.content-region .code-region').on('click', ".copy", onCopyClick);
		var container = $(".code-container", region);
		codeModel.init(container[0]);

		emitor.on("code", "startRefresh", onStartRefresh);
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

	function onStartRefresh() {
		setInterval(function() {
			emitor.trigger("code", "refresh");
		}, 1000);
	}

	function onCopyClick(e) {
		emitor.trigger("code", "copy");
	}

	return {
		init: init,
		getData: getData,
		setData: setData,
		genCode: genCode,
	};
});
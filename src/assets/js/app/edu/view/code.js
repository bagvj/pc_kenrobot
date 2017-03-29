define(['vendor/jquery', 'app/common/util/emitor', '../model/codeModel'], function($1, emitor, codeModel) {
	var refreshTimerId;

	function init() {
		var region = $('.content-region .code-region').on('click', ".copy", onCopyClick);
		var container = $(".code-container", region);
		codeModel.init(container[0]);

		emitor.on("code", "start-refresh", onStartRefresh)
			.on('code', 'stop-refresh', onStopRefresh);
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
		onStopRefresh();
		refreshTimerId = setInterval(function() {
			emitor.trigger("code", "refresh");
		}, 1000);
	}

	function onStopRefresh() {
		refreshTimerId && clearInterval(refreshTimerId);
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
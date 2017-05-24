define(['vendor/jquery', 'app/common/util/emitor', '../model/codeModel'], function($1, emitor, codeModel) {
	var refreshTimerId;

	function init() {
		var region = $('.code-region');
		var container = $(".code-container", region);
		codeModel.init(container[0]);
	}

	function getData() {
		return codeModel.getData();
	}

	function setData(data) {
		codeModel.setData(data);
	}

	return {
		init: init,
		getData: getData,
		setData: setData,
	};
});
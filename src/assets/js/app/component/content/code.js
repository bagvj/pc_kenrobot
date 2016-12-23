define(['vendor/jquery', 'app/util/util', 'app/util/emitor', 'app/model/codeModel'], function($1, util, emitor, codeModel) {
	var region;
	var container;

	function init() {
		region = $('.content-tabs .tab-code');
		container = $(".code-container", region);
		codeModel.init(container[0]);

		emitor.on('app', 'start', onAppStart);
		emitor.on('sidebar', 'activeTab', onActiveTab);
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

	}

	function onActiveTab(name) {
		name == "code" && emitor.trigger("code", "refresh");
	}

	return {
		init: init,
		getData: getData,
		setData: setData,
		genCode: genCode,
	};
});
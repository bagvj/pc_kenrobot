define(['vendor/jquery', 'app/common/util/emitor', '../model/codeModel'], function($1, emitor, codeModel) {
	var refreshTimerId;
	var container;

	function init() {
		var region = $('.code-region');
		container = $(".code-container", region);
		codeModel.init(container[0]);

		emitor.on("setting", "change", onSettingChange);
	}

	function getData() {
		return codeModel.getData();
	}

	function setData(data) {
		codeModel.setData(data);
	}

	function onSettingChange(name, value) {
		switch(name) {
			case "line-height":
				container.css("line-height", `${value}px`);
				break;
			case "font-size":
				container.css("font-size", `${value}px`);
				break;
		}
	}

	return {
		init: init,
		getData: getData,
		setData: setData,
	};
});
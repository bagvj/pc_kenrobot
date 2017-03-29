define(['vendor/jquery', 'app/common/util/util', 'app/common/util/emitor'], function($1, util, emitor) {
	var dialogWin;
	var types;
	var themes;
	var filter;
	var libraryList;

	function init() {
		dialogWin = $('.library-dialog');
		types = dialogWin.find('.types').on('click', '.placeholder', onShowTypeSelect).on('click', 'ul > li', onTypeSelectClick);
		themes = dialogWin.find('.themes').on('click', '.placeholder', onShowThemeSelect).on('click', 'ul > li', onThemeSelectClick);
		libraryList = dialogWin.find(".list > ul").on("click", "> li", onLibraryClick);

		types.find('> ul > li[data-value="all"]').click();
		themes.find('> ul > li[data-value="all"]').click();

		kenrobot.on('library', 'show', onShow, {canReset: false});
	}

	function onShow() {
		reset();

		util.dialog({
			selector: dialogWin,
			onClosed: onClosed,
		});
	}

	function onClosed() {
		reset();
	}

	function reset() {

	}

	function onShowTypeSelect(e) {
		types.toggleClass("active");
		return false;
	}

	function onTypeSelectClick(e) {
		var li = $(this);
		var type = li.data("value");
		types.removeClass("active").find(".placeholder").html(li.html());
		types.data("value", type);
		util.toggleActive(li);
	}

	function onShowThemeSelect(e) {
		themes.toggleClass("active");
		return false;
	}

	function onThemeSelectClick(e) {
		var li = $(this);
		var theme = li.data("value");
		themes.removeClass("active").find(".placeholder").html(li.html());
		themes.data("value", theme);
		util.toggleActive(li);
	}

	function onLibraryClick(e) {
		var li = $(this);
		util.toggleActive(li);
	}

	return {
		init: init,
	}
});
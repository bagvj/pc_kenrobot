define(['vendor/jquery', 'vendor/lodash', 'vendor/perfect-scrollbar', 'app/common/util/util', 'app/common/config/config'], function($1, _, $2, util, config) {
	var dialogWin;
	var types;
	var categories;
	var filter;
	var libraryList;
	var doKeyFilter;
	var closeLock;

	var libraryTemplate = `<li class="item"><div class="x-progress"></div><div class="wrap"><div class="title"><span class="name"></span>by<span class="author"></span></div><div class="des"><span class="sentence"></span><span class="paragraph"></span></div><div class="toolbar"><span class="more">更多信息</span><span class="placeholder"></span><div class="x-select versions"><div class="placeholder"></div><ul></ul></div><input type="button" class="install" value="安装" /><input type="button" class="delete" value="删除" /></div></div></li>`

	var libraries;
	var installedLibraries;
	var isCreated;

	function init() {
		dialogWin = $('.library-dialog');
		types = dialogWin.find('.types').on('click', '.placeholder', onShowTypeSelect).on('click', 'ul > li', onTypeSelectClick);
		categories = dialogWin.find('.categories').on('click', '.placeholder', onShowCategorySelect).on('click', 'ul > li', onCategorySelectClick);

		libraryList = dialogWin.find(".list > ul");
		libraryList.parent().perfectScrollbar();

		filter = dialogWin.find(".filter").on("keyup", onFilterKeyUp);
		doKeyFilter = util.throttle(() => {
			var key = filter.val();
			if(key.length < 2) {
				return;
			}

			var category = categories.data("value");
			doFilter(lib => (category == "all" || lib.category == category) && (lib.name.indexOf(key) >= 0 || lib.author.indexOf(key) >= 0 || lib.sentence.indexOf(key) >= 0));
		}, 500);

		types.find('> ul > li[data-value="all"]').click();
		categories.find('> ul > li[data-value="all"]').click();

		kenrobot.on('library', 'show', onShow, {canReset: false});
	}

	function onShow() {
		reset();

		util.dialog({
			selector: dialogWin,
			onShow: onDialogShow,
			onClosed: onDialogClosed,
			onClosing: onDialogClosing,
		});
	}

	function onDialogShow() {
		$.when(loadLibraries(), getInstalledLibraries(true)).then(() => update(), err => {
			util.message("加载包配置失败");
		});
	}

	function onDialogClosed() {
		reset();
	}

	function onDialogClosing() {
		if(closeLock > 0) {
			util.message({
				text: "现在还不能关闭，请等待操作完成",
				type: "warning",
			});
			return false;
		}

		return true;
	}

	function reset() {
		closeLock = 0;
	}

	function getInstalledLibraries(forece) {
		var promise = $.Deferred();
		if(!forece && installedLibraries) {
			setTimeout(() => {
				promise.resolve(installedLibraries);
			}, 10);
			return promise;
		}

		kenrobot.postMessage("app:getInstalledLibraries").then(list => {
			installedLibraries = list.map(lib => {
				return {
					name: lib.name,
					version: lib.version,
				}
			});
			promise.resolve(installedLibraries);
		}, err => {
			installedLibraries = [];
			promise.resolve();
		});

		return promise;
	}

	function loadLibraries() {
		var promise = $.Deferred();
		if(libraries) {
			setTimeout(() => {
				promise.resolve(libraries);
			}, 10);
			return promise;
		}

		kenrobot.postMessage("app:loadLibraries").then(_libraries => {
			libraries = _.orderBy(_libraries, ["name", "version"], ['asc', 'desc']);
			promise.resolve(libraries);
		}, err => {
			promise.reject(err);
		});

		return promise;
	}

	function update() {
		if(!isCreated) {
			libraryList.empty();
			_.forEach(_.groupBy(libraries, "name"), group => {
				var lib = group[0];
				var li = $(libraryTemplate);
				var liList = group.map(l => {
					return $('<li>').data('value', l).text(l.version)
				});
				li.data("value", lib).data("name", lib.name);
				li.find(".name").text(lib.name);
				li.find(".author").text(lib.author);
				li.find(".des .sentence").text(lib.sentence);
				li.find(".versions > ul").append(liList);
				li.find(".versions .placeholder").html(liList[0].html());
				li.find('.install').attr("disabled", false).val("安装").data("action", "install");
				li.find('.delete').attr("disabled", false).removeClass("active");

				libraryList.append(li);

				var versions = group.map(l => l.version);
				group.forEach(l => {l.versions = versions});
			});

			libraryList.find("> .item").on("click", onLibraryClick)
				.on("click", ".versions .placeholder", onShowVersionSelect)
				.on("click", ".versions > ul > li", onVersionSelectClick)
				.on("click", ".more", onMoreClick)
				.on("click", ".install", onInstallClick)
				.on("click", ".delete", onDeleteClick);

			isCreated = true;
		}

		types.find('> ul > li[data-value="all"]').click();
		categories.find('> ul > li[data-value="all"]').click();

		doUpdate();
	}

	function doUpdate() {
		var items = libraryList.find(".item");
		installedLibraries.forEach(l => {
			var item = items.filter(item => item.data("name") == l.name);
			item.find(".versions li:eq(0)").click();
		});
	}

	function onShowVersionSelect(e) {
		var select = $(this).parent();
		select.toggleClass("active");
		return false;
	}

	function onVersionSelectClick(e) {
		var li = $(this);
		var select = li.parents(".x-select");
		select.removeClass("active").find(".placeholder").html(li.html());
		util.toggleActive(li);

		var lib = li.data("value");
		var item = li.parents(".item").data("value", lib).data("name", lib.name);
		item.find(".name").text(lib.name);
		item.find(".author").text(lib.author);
		item.find(".des .sentence").text(lib.sentence);
		// item.find(".des .paragraph").text(lib.paragraph);s

		var installBtn = item.find('.install');
		var deleteBtn = item.find(".delete");

		var installedLibrary = installedLibraries.find(l => l.name == lib.name);
		if(installedLibrary) {
			deleteBtn.attr("disabled", false).addClass("active");
			var result = util.versionCompare(installedLibrary.version, lib.version);
			if(result < 0) {
				installBtn.attr("disabled", false).val("更新").data("action", "update");
			} else if(result == 0) {
				installBtn.attr("disabled", true).val("已安装");
			} else {
				installBtn.attr("disabled", false).val("安装").data("action", "install");
			}
		} else {
			installBtn.attr("disabled", false).val("安装").data("action", "install");
			deleteBtn.attr("disabled", false).removeClass("active");
		}
	}

	function onMoreClick(e) {
		var item = $(this).parents(".item");
		var lib = item.data("value");
		kenrobot.postMessage("app:openUrl", lib.website);
	}

	function onInstallClick(e) {
		var installBtn = $(this);
		var action = installBtn.data("action");
		var item = installBtn.parents(".item");
		var lib = item.data("value");

		item.find(".versions").attr("disabled", true);
		item.find(".delete").attr("disabled", true);
		var oldText = installBtn.val();
		installBtn.attr("disabled", true).val("下载中");

		var prefix = `${lib.name}-${lib.version}`;
		kenrobot.postMessage("app:download", lib.url, {checksum: lib.checksum}).then(result => {
			item.find(".x-progress").removeClass("active").css("transform", "");
			installBtn.val("安装中");
			kenrobot.postMessage("app:unzipLibrary", lib.name, result.path).then(() => {
				item.find(".x-progress").removeClass("active").css("transform", "");
				_.pull(installedLibraries, _.find(installedLibraries, l => l.name == lib.name));
				installedLibraries.push({
					name: lib.name,
					version: lib.version,
				});
				setTimeout(() => {
					item.find(".versions > ul > li:eq(0)").trigger("click");
				}, 10);
				var info = kenrobot.appInfo;
				closeLock--;
				util.message(`${prefix}安装成功`);
			}, err => {
				item.find(".x-progress").removeClass("active").css("transform", "");
				util.message(`${prefix}安装失败`);
				closeLock--;
			}, progress => {
				var percent = progress;
				item.find(".x-progress").addClass("active").css("transform", `translateX(${percent - 100}%)`);
			})
		}, err => {
			item.find(".x-progress").removeClass("active").css("transform", "");
			item.find(".versions").attr("disabled", false);
			item.find(".delete").attr("disabled", false);
			installBtn.attr("disabled", false).val(oldText);

			util.message({
				text: `${prefix}下载失败`,
				type: "error",
			});
			closeLock--;
		}, progress => {
			var totalSize = progress.totalSize || 100 * 1024 * 1024;
			var percent = parseInt(100 * progress.size / totalSize);
			percent = percent > 100 ? 100 : percent;
			item.find(".x-progress").addClass("active").css("transform", `translateX(${percent - 100}%)`);
		});
		closeLock++;

		return false;
	}

	function onDeleteClick(e) {
		var item = $(this).parents(".item");
		var lib = item.data("value");

		var libName = `${lib.name}-${lib.version}`;
		util.confirm({
			text: `确定要删除“${libName}”吗？`,
			onConfirm: () => {
				kenrobot.postMessage("app:deleteLibrary", lib.name).then(() => {
					_.pull(installedLibraries, _.find(installedLibraries, l => l.name == lib.name));
					setTimeout(() => {
						item.find(".versions > ul > li:eq(0)").trigger("click");
					}, 10);
					util.message("删除${libName}成功");
				}, err => {
					util.message(`删除${libName}失败`);
				});
			}
		});

		return false;
	}

	function doFilter(predicate) {
		libraryList.children().each((index, item) => {
			var li = $(item);
			predicate(li.data("value")) ? li.removeClass("hide") : li.addClass("hide");
		});
		libraryList.parent().perfectScrollbar("update");
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

		var category = categories.data("value")

		switch(type) {
			case "all":
				doFilter(lib => category == "all" || lib.category == category);
				break;
			case "can-update":
				doFilter(lib => {
					var installedLibrary = installedLibraries.find(l => l.name == lib.name);
					if(!installedLibrary) {
						return false;
					}

					return (category == "all" || lib.category == category) && lib.versions.find(version => util.versionCompare(version, installedLibrary.version) > 0) != null;
				});
				break;
			case "installed":
				doFilter(lib => (category == "all" || lib.category == category) && installedLibraries.find(l => l.name == lib.name) != null);
				break;
			case "kenrobot":
				// doFilter(lib => lib.category == "kenrobot");
				break;
			case "arduino":
				// doFilter(lib => lib.category == "arduino");
				break;
			case "third-party":
				// doFilter(lib => lib.category == "third-party");
				break;
		}
	}

	function onShowCategorySelect(e) {
		categories.toggleClass("active");
		return false;
	}

	function onCategorySelectClick(e) {
		var li = $(this);
		var category = li.data("value");
		categories.removeClass("active").find(".placeholder").html(li.html());
		categories.data("value", category);
		util.toggleActive(li);

		var key = filter.val();
		doFilter(lib => (category == "all" || lib.category == category) && (key.length < 2 || lib.name.indexOf(key) >= 0 || lib.author.indexOf(key) >= 0 || lib.sentence.indexOf(key) >= 0));
	}

	function onFilterKeyUp(e) {
		doKeyFilter();
	}

	function onLibraryClick(e) {
		var li = $(this);
		util.toggleActive(li);
	}

	return {
		init: init,
	}
});

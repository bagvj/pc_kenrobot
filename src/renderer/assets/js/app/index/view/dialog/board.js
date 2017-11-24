define(['vendor/jquery', 'vendor/lodash', 'vendor/perfect-scrollbar', 'app/common/util/util', 'app/common/config/config'], function($1, _, $2, util, config) {
	var dialogWin;
	var types;
	var filter;
	var boardList;
	var doKeyFilter;
	var closeLock;

	var packages;
	var installedPackages;

	function init() {
		dialogWin = $('.board-dialog');
		types = dialogWin.find('.types').on('click', '.placeholder', onShowTypeSelect).on('click', 'ul > li', onTypeSelectClick);

		boardList = dialogWin.find(".list > ul");
		boardList.parent().perfectScrollbar();

		filter = dialogWin.find(".filter").on("keyup", onFilterKeyUp);
		doKeyFilter = util.throttle(() => {
			var key = filter.val();
			if(key.length < 2) {
				return;
			}

			doFilter(p => p.name.indexOf(key) >= 0 || p.author.indexOf(key) >= 0 || p.boards.filter(b => b.name.indexOf(key) >= 0).length > 0);
		}, 500);

		kenrobot.on('board', 'show', onShow, {canReset: false});
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
		$.when(loadPackages(), getInstalledPackages()).then(() => update(), err => {
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

	function getInstalledPackages() {
		var promise = $.Deferred();
		if(installedPackages) {
			setTimeout(() => {
				promise.resolve(installedPackages);
			}, 10);
			return promise;
		}

		kenrobot.postMessage("app:loadPackages", false).then(list => {
			installedPackages = list.map(p => {
				return {
					name: p.name,
					version: p.version,
				}
			});
			promise.resolve(installedPackages);
		}, err => {
			installedPackages = [];
			promise.resolve();
		});

		return promise;
	}

	function loadPackages() {
		var promise = $.Deferred();
		if(packages) {
			setTimeout(() => {
				promise.resolve(packages);
			}, 10);
			return promise;
		}

		kenrobot.postMessage("app:request", config.url.packages).then(_packages => {
			var info = kenrobot.appInfo;
			packages = _packages.filter(p => p.platform == info.platform);
			promise.resolve(packages);
		}, err => {
			promise.reject(err);
		});

		return promise;
	}

	function update() {
		boardList.empty();
		_.forEach(_.groupBy(packages, "name"), group => {
			var li = $(`<li class="item">
				<div class="x-progress"></div>
				<div class="wrap">
					<div class="title">
						<span class="name"></span>by
						<span class="author"></span>
					</div>
					<div class="des">此扩展包含：<span class="boards"></span></div>
					<div class="toolbar">
						<span class="more">更多信息</span>
						<span class="placeholder"></span>
						<div class="x-select versions">
							<div class="placeholder"></div>
							<ul></ul>
						</div>
						<input type="button" class="install" value="安装" />
						<input type="button" class="delete" value="删除" />
					</div>
				</div>
			</li>`);
			var versions = group.map(p => {
				return $('<li>').data('value', p).text(p.version)
			});
			li.find(".versions > ul").append(versions);
			boardList.append(li);

			versions = group.map(p => p.version).sort(util.versionCompare);
			group.forEach(p => {p.versions = versions});
		});

		boardList.off("click", "> li", onBoardClick).on("click", "> li", onBoardClick)
			.off("click", ".versions .placeholder", onShowVersionSelect).on("click", ".versions .placeholder", onShowVersionSelect)
			.off("click", ".versions > ul > li", onVersionSelectClick).on("click", ".versions > ul > li", onVersionSelectClick)
			.off("click", ".more", onMoreClick).on("click", ".more", onMoreClick)
			.off("click", ".install", onInstallClick).on("click", ".install", onInstallClick)
			.off("click", ".delete", onDeleteClick).on("click", ".delete", onDeleteClick);

		boardList.parent().perfectScrollbar("update");

		boardList.find(".versions > ul > li").filter((index, li) => $(li).index() == 0).click();
		types.find('> ul > li[data-value="all"]').click();
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

		var p = li.data("value");
		var item = li.parents(".item").data("value", p);
		item.find(".name").text(p.name);
		item.find(".author").text(p.author);
		item.find(".boards").text(p.boards.map(b => b.name).join(","));
		var installBtn = item.find('.install');
		var deleteBtn = item.find(".delete");

		var installedPackage = installedPackages.find(pack => pack.name == p.name);
		if(installedPackage) {
			deleteBtn.attr("disabled", false).addClass("active");
			var result = util.versionCompare(installedPackage.version, p.version);
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
		var p = item.data("value");
		kenrobot.postMessage("app:openUrl", p.help);
	}

	function onInstallClick(e) {
		var installBtn = $(this);
		var action = installBtn.data("action");
		var item = installBtn.parents(".item");
		var p = item.data("value");

		item.find(".versions").attr("disabled", true);
		item.find(".delete").attr("disabled", true);
		var oldText = installBtn.val();
		installBtn.attr("disabled", true).val("下载中");

		var prefix = `包${p.name}，版本${p.version}`;
		kenrobot.postMessage("app:download", p.url, {checksum: p.checksum}).then(result => {
			item.find(".x-progress").removeClass("active").css("transform", "");
			installBtn.val("安装中");
			kenrobot.postMessage("app:unzipPackage", result.path).then(() => {
				item.find(".x-progress").removeClass("active").css("transform", "");
				_.pull(installedPackages, _.find(installedPackages, pack => pack.name == p.name));
				installedPackages.push({
					name: p.name,
					version: p.version,
				});
				setTimeout(() => {
					item.find(".versions > ul > li:eq(0)").trigger("click");
				}, 10);
				var info = kenrobot.appInfo;
				closeLock--;
				util.confirm({
					text: `${prefix}安装成功，建议重新运行${info.name}`,
					onConfirm: () => kenrobot.postMessage("app:relaunch")
				});
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
		var p = item.data("value");

		util.confirm({
			text: `确定要删除“${p.name}”这个包吗？`,
			onConfirm: () => {
				kenrobot.postMessage("app:deletePackage", p.name).then(() => {
					_.pull(installedPackages, _.find(installedPackages, pack => pack.name == p.name));
					var info = kenrobot.appInfo;
					setTimeout(() => {
						item.find(".versions > ul > li:eq(0)").trigger("click");
					}, 10);
					util.confirm({
						text: `删除成功，建议重新运行${info.name}`,
						onConfirm: () => kenrobot.postMessage("app:relaunch")
					});
				}, err => {
					util.message("删除失败");
				});
			}
		});

		return false;
	}

	function doFilter(predicate) {
		boardList.children().each((index, item) => {
			var li = $(item);
			predicate(li.data("value")) ? li.removeClass("hide") : li.addClass("hide");
		});
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

		switch(type) {
			case "all":
				doFilter(p => true);
				break;
			case "can-update":
				doFilter(p => {
					var installedPackage = installedPackages.find(pack => pack.name == p.name);
					if(!installedPackage) {
						return false;
					}

					return p.versions.find(version => util.versionCompare(version, installedPackage.version) > 0) != null;
				});
				break;
			case "installed":
				doFilter(p => installedPackage.find(pack => pack.name == p.name) != null);
				break;
			case "kenrobot":
				doFilter(p => p.category == "kenrobot");
				break;
			case "arduino":
				doFilter(p => p.category == "arduino");
				break;
			case "third-party":
				doFilter(p => p.category == "third-party");
				break;
		}
	}

	function onFilterKeyUp(e) {
		doKeyFilter();
	}

	function onBoardClick(e) {
		var li = $(this);
		util.toggleActive(li);
	}

	return {
		init: init,
	}
});

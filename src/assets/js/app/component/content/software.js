define(['vendor/jquery', 'vendor/perfect-scrollbar', 'app/util/util', 'app/util/emitor', 'app/model/softwareModel', 'app/model/hardwareModel'], function($1, $2, util, emitor, softwareModel, hardwareModel) {
	var region;
	var container;
	var dragContainer;
	var filterList;
	var blockList;
	var filterWrap;
	var contextMenuTarget;
	var blockContextMenu;
	var modules;
	var codeRegion;
	var topRegion;

	function init() {
		dragContainer = $('.block-drag-layer');

		region = $('.content-region .tab-software').on('click', '.block-group-region .group-header > span', onGroupHeaderClick);

		topRegion = region.find('.top-region').on('click', '.tool-button', onToolButtonClick);

		filterList = $('.filters', region).on('click', '> li', onFilterClick);
		blockList = $('.blocks', region);
		blockList.parent().perfectScrollbar();

		filterWrap = $('.filter', region).on('click', '.advanced', onAdvancedClick).data('basic');

		container = $(".software-container", region);
		container.perfectScrollbar();

		softwareModel.init(container[0], dragContainer[0]);

		blockContextMenu = $('.block-menu', region).on('click', '> li', onBlockContextMenu);

		codeRegion = $('.code-region', region);

		emitor.on('app', 'start', onAppStart)
			.on('app', 'contextMenu', onContextMenu)
			.on('app', 'resize', onAppResize)
			.on('app', 'activeTab', onActiveTab)
			.on('monitor', 'close', onMonitorClose);
	}

	function loadSchema(schema) {
		softwareModel.loadSchema(schema);

		createBlocks(schema.blocks);
	}

	function getData() {
		return softwareModel.getData();
	}

	function setData(data) {
		softwareModel.setData(data);

		var globalBlock = softwareModel.getGroupBlock("global");
		var setupBlock = softwareModel.getGroupBlock("setup");
		var loopBlock = softwareModel.getGroupBlock("loop");

		globalBlock.setConnectable(true);
		setupBlock.setConnectable(true);
		loopBlock.setConnectable(true);
		
		$('.block-global', region).removeClass("active").addClass(globalBlock.hasChildren() ? "with-content" : "").find(".group-extension").append(globalBlock.dom);
		$('.block-setup', region).removeClass("active").addClass(setupBlock.hasChildren() ? "with-content" : "").find(".group-extension").append(setupBlock.dom);
		$('.block-loop', region).addClass("active").addClass(loopBlock.hasChildren() ? "with-content" : "").find(".group-extension").append(loopBlock.dom);
	}

	function getCode(hardwareData) {
		var codeInfo = softwareModel.getCode();

		var includeCode = [];
		var varCode = '';
		var setupCode = '';
		var tempCode;
		var code;

		var nameReg = new RegExp('{NAME}', 'g');
		hardwareData.components.sort(function(a, b) {
			return a.name.localeCompare(b.name);
		}).forEach(function(componentData) {
			code = componentData.code;
			if(code.include) {
				includeCode = includeCode.concat(code.include.split('\n'));
			}
			if(code.var) {
				tempCode = code.var.replace(nameReg, componentData.varName);
				var pins = componentData.pins;
				for(var name in pins) {
					tempCode = tempCode.replace(new RegExp('{' + name + '}', 'g'), pins[name]);
				}
				varCode += code.eval ? eval(tempCode) : tempCode;
			}
			if(code.setup) {
				tempCode = code.setup.replace(nameReg, componentData.varName);
				var pins = componentData.pins;
				for(var name in pins) {
					tempCode = tempCode.replace(new RegExp('{' + name + '}', 'g'), pins[name]);
				}
				setupCode += tempCode;
			}
		});
		includeCode = includeCode.sort().reduce(function(result, line) {
			(result.length == 0 || result[result.length - 1] != line) && result.push(line);
			return result;
		}, []).join('\n');

		codeInfo.include = includeCode;
		codeInfo.global = varCode + codeInfo.global;
		codeInfo.setup = setupCode + codeInfo.setup;

		return codeInfo;
	}

	function reset() {

	}

	function createBlocks(blocks) {
		blockList.empty();
		blocks.forEach(function(blockData) {
			if(blockData.type == "group") {
				return;
			}

			var block = softwareModel.createBlock(blockData.name);
			var li = $('<li>').data("filter", blockData.tags.concat());
			blockData.tags.indexOf("module") >= 0 && li.data("module", blockData.module);
			blockList.append(li.append(block.dom));
		});
	}

	function updateBlocks(hardwareData) {
		modules = ["default"];

		var groups = {};
		var group;
		var groupName;

		hardwareData.components.forEach(function(componentData) {
			modules.indexOf(componentData.type) < 0 && modules.push(componentData.type);
			groupName = componentData.type + "s";
			group = groups[groupName] || (groups[groupName] = []);
			group.push({
				id: componentData.uid,
				name: componentData.varName,
			});
		});

		if(hardwareData.components.length > 0) {
			var hardwareVariable = {
				name: "hardwareVariable",
				group: [],
			};
			var raw = {
				name: "raw",
				group: [],
			};

			hardwareData.components.forEach(function(componentData) {
				if(componentData.type == "serial") {
					return;
				}

				hardwareVariable.group.push({
					id: componentData.uid,
					name: componentData.varName,
				});

				var componentConfig = hardwareModel.getComponentConfig(componentData.name);
				if(componentConfig.raw) {
					raw.group.push({
						id: componentData.uid,
						name: componentData.varName,
					});
				}
			});

			if(hardwareVariable.group.length > 0) {
				modules.push(hardwareVariable.name);
				groups[hardwareVariable.name + "s"] = hardwareVariable.group;
			}
			if(raw.group.length > 0) {
				modules.push(raw.name);
				groups[raw.name + "s"] = raw.group;
			}
		}

		softwareModel.updateDynamicBlocks(groups);
		
		var li = filterList.find("li.active");
		li.length == 0 && (li = filterList.find("li:eq(0)"));
		li.click();
	}

	function onAppStart() {

	}

	function onAppResize(e) {
		toggleToolButton(topRegion.width() < 580);
	}

	function toggleToolButton(value) {
		if(value) {
			topRegion.find(".tool-button").addClass("simple");
		} else {
			topRegion.find(".tool-button").removeClass("simple");
		}
	}

	function onToolButtonClick(e) {
		var action = $(this).data('action');
		switch(action) {
			case "upload":
				emitor.trigger("project", "upload");
				break;
			case "check":
				emitor.trigger("code", "check");
				break;
			case "show-code":
				toggleCode();
				break;
			case "show-monitor":
				topRegion.find(".show-monitor").toggleClass("active");
				emitor.trigger('monitor', 'toggle');
				break;
			case "save":
				emitor.trigger("project", "save");
				break;
			case "switch-hardware":
				emitor.trigger("app", "activeTab", "hardware");
				break;
		}
	}

	function toggleCode() {
		if(codeRegion.hasClass("active")) {
			codeRegion.removeClass("slide-in").addClass("slide-out").delay(200, "slide-out").queue("slide-out", function() {
				codeRegion.removeClass("active").removeClass("slide-out");
			});
			codeRegion.dequeue("slide-out");
			toggleToolButton(false);
		} else {
			codeRegion.addClass("active").addClass("slide-in");
			toggleToolButton(true);
		}
	}

	function onMonitorClose() {
		topRegion.find(".show-monitor").removeClass("active");
	}

	function onActiveTab(name) {
		if(name == "software") {
			dragContainer.addClass("active");
			emitor.trigger("software", "update-block").trigger("code", "refresh");

		} else {
			dragContainer.removeClass("active");
		}
	}

	function onContextMenu(e) {		
		var target = $(e.target).closest(".block");
		if (target.length && (target.parents(container.selector).length || target.parents(dragContainer.selector).length) && !target.hasClass("block-group")) {
			contextMenuTarget = target;
			var blockDom = contextMenuTarget[0];
			var block = softwareModel.getBlock(blockDom.dataset.uid);

			block.isEnable() ? blockContextMenu.addClass("comment") : blockContextMenu.removeClass("comment");
			(!block.isEnable() && !block.isFree()) ? blockContextMenu.addClass("uncomment") : blockContextMenu.removeClass("uncomment");

			var height = blockContextMenu.height();
			var offset = blockContextMenu.parent().offset();
			var top = e.pageY - offset.top;
			var left = e.pageX - offset.left;

			if (e.pageY + height > $(window).innerHeight()) {
				top = top - height;
			}
			blockContextMenu.addClass("active").css({
				left: left,
				top: top,
			});
		}
	}

	function onBlockContextMenu(e) {
		if(!contextMenuTarget) {
			return;
		}

		var blockDom = contextMenuTarget[0];
		var block = softwareModel.getBlock(blockDom.dataset.uid);

		var li = $(this);
		var action = li.data('action');
		switch(action) {
			case "copy":
				var offset = 20;
				var copyBlock = block.copy();
				if(block.isFree()) {	
					var blockOffset = block.getOffset();
					copyBlock.setOffset(blockOffset.left + offset, blockOffset.top - offset);
				} else {
					var rect = blockDom.getBoundingClientRect();
					var containerOffset = dragContainer.offset();
					var left = rect.left - containerOffset.left;
					var top = rect.top - containerOffset.top;
					copyBlock.setOffset(left + offset, top - offset);
				}

				dragContainer.append(copyBlock.dom);
				break;
			case "comment":
				block.setEnable(false);
				break;
			case "uncomment":
				block.setEnable(true);
				break;
			case "delete":
				block.remove();
				break;
		}
	}

	function onFilterClick(e) {
		var li = $(this);
		util.toggleActive(li);

		var filter = li.data('filter');
		$('.filter-name', filterWrap).text(li.text());
		$('.advanced', filterWrap).data('action', "basic").val("高级");

		blockList.children().removeClass("active").each(function(index, child) {
			var blockLi = $(child);
			var filters = blockLi.data("filter");
			if(filters.indexOf(filter) < 0 || filters.indexOf("advanced") >= 0) {
				return;
			}

			if(filter == "module" && modules.indexOf(blockLi.data("module")) < 0) {
				return;
			}

			blockLi.addClass("active");
		});

		blockList.parent().perfectScrollbar("update");
	}

	function onAdvancedClick(e) {
		var li = filterList.find("li.active");
		if (!li.length) {
			return;
		}

		var filter = li.data('filter');
		var advanced = $(".advanced", filterWrap);
		var isAdvanced;
		if (advanced.data("action") == "advanced") {
			advanced.data('action', "basic").val("高级");
			isAdvanced = false;
		} else {
			advanced.data("action", "advanced").val("基础");
			isAdvanced = true;
		}

		blockList.children().removeClass("active").each(function(index, child) {
			var blockLi = $(child);
			var filters = blockLi.data('filter');

			if(filters.indexOf(filter) < 0) {
				//不是同一类block，(模块、数据)
				return;
			}

			var a = filters.indexOf("advanced") >= 0;
			if((isAdvanced && !a) || (!isAdvanced && a)) {
				//要显示高级但block不是高级的，或者要显示基础但block是高级的
				return;
			}

			if(filter == "module" && modules.indexOf(blockLi.data("module")) < 0) {
				//block是模块，但没有相应硬件
				return;
			}

			blockLi.addClass("active");
		});

		blockList.parent().perfectScrollbar("update");
	}

	function onGroupHeaderClick(e) {
		var group = $(this).parent().parent();
		group.toggleClass("active");

		var blockDom = $(".group-extension > .block");
		var block = softwareModel.getBlock(blockDom.data("uid"));
		block.setConnectable(group.hasClass("active"));

		container.perfectScrollbar();
	}

	return {
		init: init,
		loadSchema: loadSchema,
		getData: getData,
		setData: setData,
		reset: reset,

		getCode: getCode,
		updateBlocks: updateBlocks,
	};
});
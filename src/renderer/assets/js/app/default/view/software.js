define(['vendor/jquery', 'vendor/perfect-scrollbar', 'vendor/lodash', 'app/common/util/util', 'app/common/util/emitor', '../model/softwareModel', '../model/hardwareModel'], function($1, $2, _, util, emitor, softwareModel, hardwareModel) {
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
			.on("ui", "lock", onUILock)
			.on('progress', "check", onCheckProgress)
			.on("progress", "upload", onUploadProgress)
			.on("code", "changeMode", onCodeChangeMode);

		kenrobot.on('monitor', 'close', onMonitorClose).on("monitor", "toggle", onMonitorToggle);
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

		$('.block-global', region).removeClass("active").addClass(globalBlock.hasChildren() ? "active with-content" : "").find(".group-extension").append(globalBlock.dom);
		$('.block-setup', region).removeClass("active").addClass(setupBlock.hasChildren() ? "active with-content" : "").find(".group-extension").append(setupBlock.dom);
		$('.block-loop', region).addClass("active").addClass(loopBlock.hasChildren() ? "with-content" : "").find(".group-extension").append(loopBlock.dom);
	}

	function getCode(hardwareData) {
		var codeInfo = softwareModel.getCode();

		var includeCode = [];
		var constCode = '';
		var funcDeclareCode = '';
		var varCode = '';
		var setupCode = '';
		var loopCode = '';
		var funcImplementCode = '';
		var tempCode;
		var code;

		code = hardwareData.board.code
		if(code) {
			if (code.include) {
				includeCode = includeCode.concat(code.include.split('\n'));
			}

			if (code.var) {
				varCode += code.var;
			}

			if (code.setup) {
				setupCode += code.setup;
			}
		}

		var nameReg = new RegExp('{NAME}', 'g');
		var components = hardwareData.components.sort(function(a, b) {
			return a.name.localeCompare(b.name);
		});
		components.forEach(function(componentData) {
			code = componentData.code;
			if (code.include) {
				includeCode = includeCode.concat(code.include.split('\n'));
			}

			var componentConfig = hardwareModel.getComponentConfig(componentData.name);

			var pin;
			var pins = componentData.pins;
			var rxd = pins.rxd;
			var txd = pins.txd;
			var isSoftwareSerial;
			var isSerial;
			var isMultiSerial;
			var serialName;
			if (rxd && txd) {
				if (rxd.tags.includes("serial-rx") && txd.tags.includes("serial-tx") && (!rxd.extra || !txd.extra || rxd.extra.serial == txd.extra.serial)) {
					//硬串
					isSerial = true;
					var rxdPins = hardwareData.board.pins.filter(p => p.tags.includes("serial-tx"));
					if (rxdPins.length > 1) {
						isMultiSerial = true;
						serialName = rxd.extra.serial;
					}
				} else {
					//软串
					isSoftwareSerial = true;
					includeCode.push("#include <SoftwareSerial.h>");
					varCode += `SoftwareSerial ${componentData.varName}(${rxd.value || ""}, ${txd.value || ""});`;
				}
			}

			if (code.var) {
				var mutexName;
				componentConfig.pins.forEach(pinConfig => {
					pin = pins[pinConfig.name];
					if(pin && pinConfig.mutex) {
						mutexName = pinConfig.name;
						return true;
					}
				});
				var varTemplate = (code.var === true && mutexName) ? code.conditionVars[mutexName] : code.var;
				tempCode = varTemplate.replace(nameReg, componentData.varName);
				componentConfig.pins.forEach(pinConfig => {
					pin = pins[pinConfig.name];
					if(pin) {
						tempCode = tempCode.replace(new RegExp(`{${pinConfig.name}}`, 'g'), pin && pin.tupleValue || pin.value || pin.name || "");
					} else {
						tempCode = tempCode.replace(new RegExp(`{${pinConfig.name}}`, 'g'), pinConfig.defaultValue || "");
					}
				});
				varCode += code.eval ? eval(tempCode) : tempCode;
			}
			if(code.funcDeclare) {
				tempCode = code.funcDeclare.replace(nameReg, componentData.varName);
				funcDeclareCode += tempCode;
			}
			if(code.funcImplement) {
				tempCode = code.funcImplement.replace(nameReg, componentData.varName);
				funcImplementCode += tempCode;
			}

			if (code.setup) {
				tempCode = code.setup.replace(nameReg, componentData.varName);
				for (var name in pins) {
					pin = pins[name];
					tempCode = tempCode.replace(new RegExp(`{${name}}`, 'g'), pin && pin.tupleValue || pin.value || pin.name || "");
				}
				if (isSoftwareSerial) {
					tempCode = tempCode.replace("Serial", componentData.varName);
				} else if (isMultiSerial) {
					tempCode = tempCode.replace("Serial", serialName);
				}
				setupCode += tempCode;
			}

			if(code.loop) {
				loopCode += code.loop.replace(nameReg, componentData.varName);
			}
		});
		_.uniqBy(components, 'name').filter(componentData => componentData.code.const).forEach(componentData => {
			constCode += componentData.code.const;
		});
		includeCode = includeCode.sort().reduce(function(result, line) {
			(result.length == 0 || result[result.length - 1] != line) && result.push(line);
			return result;
		}, []).join('\n');

		codeInfo.include = includeCode;
		codeInfo.const = constCode;
		codeInfo.global = (funcDeclareCode ? funcDeclareCode + '\n\n' : '') + varCode + codeInfo.global;
		codeInfo.setup = setupCode + codeInfo.setup;
		codeInfo.loop = loopCode + codeInfo.loop;
		codeInfo.end = funcImplementCode;

		return codeInfo;
	}

	function reset() {

	}

	function createBlocks(blocks) {
		blockList.empty();
		blocks.forEach(function(blockData) {
			if (blockData.type == "group") {
				return;
			}

			var block;
			try {
				block = softwareModel.createBlock(blockData.name, true);
			} catch(err) {
				block = null;
				kenrobot.trigger("app", "error", `error when create block ${blockData.name}:${blockData.uid}, message: ${err.message}, stack: ${err.stack}`);
			}

			if(block) {
				var li = $('<li>').data("filter", blockData.tags.concat());
				blockData.tags.indexOf("module") >= 0 && li.data("module", blockData.module);
				blockData.board && li.data("board", blockData.board);
				blockList.append(li.append(block.dom));
			}
		});

		blockList.find("> li > .block").hover(onBlockHoverOver, onBlockHoverOut);
	}

	function updateBlocks(hardwareData) {
		modules = ["default"];

		var groups = {};
		var group;
		var groupName;

		var pins = hardwareData.board.pins;
		pins = pins.filter(pin => {
			var tags = pin.tags;
			if(!tags.includes("digital") && !tags.includes("analog-in")) {
				return false;
			}

			if(hardwareData.board.name == "upDuino") {
				if(pin.name == "0" || pin.name == "1") {
					return false;
				}
			}

			return true;
		}).map(pin => {
			return {
				id: pin.uid,
				name: pin.name,
			}
		});
		pins.sort((a, b) => {
			if(a.name.startsWith("A") && b.name.startsWith("A")) {
				return parseInt(a.name.substring(1)) - parseInt(b.name.substring(1));
			} else if(isNaN(a.name) || isNaN(b.name)) {
		       return a.name.localeCompare(b.name);
		    } else {
		       return parseInt(a.name) - parseInt(b.name);
		    }
		});

		hardwareData.components.forEach(componentData => {
			modules.indexOf(componentData.type) < 0 && modules.push(componentData.type);
			groupName = componentData.type + "s";
			group = groups[groupName] || (groups[groupName] = []);
			group.push({
				id: componentData.uid,
				name: componentData.varName,
			});
		});

		var raw = {
			name: "raw",
			group: [],
		};

		if (hardwareData.components.length > 0) {
			var hardwareVariable = {
				name: "hardwareVariable",
				group: [],
			};
			var serial = {
				name: "serial",
				group: [],
			};

			hardwareData.components.forEach(function(componentData) {
				if (componentData.type == "serial") {
					var pins = componentData.pins;
					var rxd = pins.rxd;
					var txd = pins.txd;
					var s = pins.s;
					if (rxd && txd) {
						if (rxd.tags.includes("serial-rx") && txd.tags.includes("serial-tx") && (!rxd.extra || !txd.extra || rxd.extra.serial == txd.extra.serial)) {
							//硬串
							serial.group.push({
								id: componentData.uid,
								name: rxd.extra && rxd.extra.serial || "Serial",
							});
						} else {
							//软串
							serial.group.push({
								id: componentData.uid,
								name: componentData.varName,
							});
						}
					} else if(s && s.tags.includes("serial")) {
						serial.group.push({
							id: componentData.uid,
							name: "Serial",
						});
					}
					return;
				}

				hardwareVariable.group.push({
					id: componentData.uid,
					name: componentData.varName,
				});

				var componentConfig = hardwareModel.getComponentConfig(componentData.name);
				if (componentConfig.raw) {
					raw.group.push({
						id: componentData.uid,
						name: componentData.varName,
					});
				}
			});

			if (hardwareVariable.group.length > 0) {
				modules.push(hardwareVariable.name);
				groups[hardwareVariable.name + "s"] = hardwareVariable.group;
			}
			groups[serial.name + "s"] = serial.group;
		}
		modules.push(raw.name);
		groups[raw.name + "s"] = raw.group.concat(pins);

		hardwareData.board.module && modules.push(hardwareData.board.module);

		softwareModel.updateDynamicBlocks(groups);

		var li = filterList.find("li.active");
		li.length == 0 && (li = filterList.find("li:eq(0)"));
		li.click();
	}

	function onAppStart() {

	}

	function onCodeChangeMode(mode) {
		mode == "text" ? region.addClass("text-mode") : region.removeClass("text-mode");
	}

	function onBlockHoverOver(e) {
		var sourceBlock = $(this);
		var offset = sourceBlock.offset();
		var pos = dragContainer.offset();
		sourceBlock.clone().addClass("fake").css({
			top: offset.top - pos.top - 2,
			left: offset.left - pos.left - 2,
		}).appendTo(dragContainer);
	}

	function onBlockHoverOut(e) {
		dragContainer.find(".block.fake").remove();
	}

	function onUILock(type, value) {
		if (type == "build") {
			if (value) {
				topRegion.find(".check").attr("disabled", true);
				topRegion.find(".upload").attr("disabled", true);
			} else {
				topRegion.find(".check").attr("disabled", false).find(".x-progress").hide().css("left", "-100%");
				topRegion.find(".upload").attr("disabled", false).find(".x-progress").hide().css("left", "-100%");
			}
		}
	}

	function onCheckProgress(value) {
		if (value < 0) {
			return;
		}

		topRegion.find(".check .x-progress").show().css({
			left: "-" + (100 - value) + "%"
		});
	}

	function onUploadProgress(value, type) {
		if (value < 0) {
			return;
		}

		if (type == "build") {
			value = 80 * value / 100;
		} else {
			value = value / 100 + 80;
		}

		topRegion.find(".upload .x-progress").show().css({
			left: "-" + (100 - value) + "%"
		});
	}

	function onAppResize(e) {
		toggleToolButton(topRegion.width() < 580);
	}

	function toggleToolButton(value) {
		if (value) {
			topRegion.find(".upload,.show-code,.switch-hardware").addClass("simple");
		} else {
			topRegion.find(".upload,.show-code,.switch-hardware").removeClass("simple");
		}
	}

	function onToolButtonClick(e) {
		var action = $(this).data('action');
		switch (action) {
			case "upload":
				emitor.trigger("project", "upload");
				break;
			case "check":
				emitor.trigger("project", "check");
				break;
			case "show-code":
				toggleCode();
				break;
			case "show-monitor":
				kenrobot.trigger('monitor', 'toggle');
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
		if (codeRegion.hasClass("active")) {
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

	function onMonitorToggle() {
		topRegion.find(".show-monitor").toggleClass("active");
	}

	function onActiveTab(name) {
		if (name == "software") {
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
			(!block.isEnable() && !block.isFree()) ? blockContextMenu.addClass("uncomment"): blockContextMenu.removeClass("uncomment");

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
		if (!contextMenuTarget) {
			return;
		}

		var blockDom = contextMenuTarget[0];
		var block = softwareModel.getBlock(blockDom.dataset.uid);

		var li = $(this);
		var action = li.data('action');
		switch (action) {
			case "copy":
				var offset = 20;
				var copyBlock = block.copy();
				if (block.isFree()) {
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
			if (filters.indexOf(filter) < 0 || filters.indexOf("advanced") >= 0) {
				return;
			}

			if (filter == "module" && filters.indexOf("always") < 0 && modules.indexOf(blockLi.data("module")) < 0 && modules.indexOf(blockLi.data("board")) < 0) {
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

			if (filters.indexOf(filter) < 0) {
				//不是同一类block，(模块、数据)
				return;
			}

			var a = filters.indexOf("advanced") >= 0;
			if ((isAdvanced && !a) || (!isAdvanced && a)) {
				//要显示高级但block不是高级的，或者要显示基础但block是高级的
				return;
			}

			if (filter == "module" && filters.indexOf("always") < 0 && modules.indexOf(blockLi.data("module")) < 0 && modules.indexOf(blockLi.data("board")) < 0) {
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
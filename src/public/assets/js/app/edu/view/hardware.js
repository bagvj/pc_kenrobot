define(['vendor/jquery', 'vendor/perfect-scrollbar', 'vendor/lodash', 'app/common/util/util', 'app/common/util/emitor', '../model/hardwareModel'], function($1, $2, _, util, emitor, hardwareModel) {
	var region;
	var filterList;
	var componentsWrap;

	var boardData;
	var boardList;

	var container;
	var componentOption;
	var topRegion;
	var componentContextMenu;
	var boardContextMenu;
	var contextMenuTarget;
	var componentTemplate = '<li class="component-item" data-name="{{name}}"><div class="image-wrap"><img class="image" draggable="false" src="{{src}}" style="width:{{width}}px;height:{{height}}px;" /></div><div class="name">{{label}}</div></li>'
	var boardTemplate = '<li data-value="{{name}}" title="{{label}}"><div class="board {{name}}" style="background-image: url({{src}})"></div><div class="board-name">{{label}}</div></li>';
	var vendorTemplate = '<li ><div class="placeholder"><img class="vendor-logo" src="{{logo}}" /><span class="vendor-name ellipsis">{{name}}</span></div><ul>{{items}}</ul></li>'

	var mouseDownComponentDom;
	var dragContainer;
	var dragComponentDom;
	var startPreMouseMove;
	var preMouseMoveX;
	var preMouseMoveY;
	var dragMouseX;
	var dragMouseY;

	function init() {
		region = $('.content-region .tab-hardware');
		topRegion = region.find(".top-region").on("click", ".tool-button", onToolButtonClick);

		componentsWrap = $('.components-wrap', region)
		componentsWrap.perfectScrollbar();

		var categories = region.find('.categories > li').on('click', onCategoryClick);
		filterList = $('.filters', region).on('click', '> li', onFilterClick);

		container = $('.hardware-container', region).on('containerEvent', onContainerEvent).on("keyup", onContainerKeyUp);
		hardwareModel.init(container[0]);
		dragContainer = $('.component-drag-layer')[0];

		boardList = $('.boards', region).on('click', '.placeholder', onShowBoardSelect).on('click', 'ul > li', onBoardSelectClick);
		componentOption = $('.component-option-region', region);
		componentOption.find(".name").on('blur', onComponentNameBlur).on('keyup', onComponentNameKeyUp);
		boardContextMenu = $('.board-menu', region).on('click', '> li', onBoardContextMenu);
		componentContextMenu = $('.component-menu', region).on('click', '> li', onComponentContextMenu);

		emitor.on('app', 'start', onAppStart)
			.on('app', 'contextMenu', onContextMenu)
			.on('app', 'activeTab', onActiveTab)
			.on('hardware', 'resize', onResize)
			.on('ui', 'lock', onUILock)
			.on('progress', 'check', onCheckProgress);

		kenrobot.on('monitor', 'close', onMonitorClose);

		categories.eq(0).click();
	}

	function loadSchema(schema) {
		hardwareModel.loadSchema(schema);

		updateBoards(schema.boards);
		updateComponents(schema.components);
		updatePackages(schema.packages);

		Array.from(componentsWrap[0].querySelectorAll(".component-item .image")).forEach(imageDom => {
			imageDom.addEventListener("mousedown", onComponentMouseDown);
			imageDom.addEventListener("touchstart", onComponentMouseDown);
		});

		filterList.find('[data-filter="all"]').click();
	}

	function getBoardData() {
		return boardData;
	}

	function getData() {
		return hardwareModel.getData();
	}

	function setData(hardwareData) {
		hardwareData = hardwareData || {};
		setBoard(hardwareData.board);
		
		hardwareModel.setData(hardwareData);

		hideComponentDialog();
	}

	function getBlockData() {
		var data = {};
		data.board = getBoardData();
		
		var hardwareData = getData();
		data.components = hardwareData.components.map(function(componentData) {
			return hardwareModel.getComponentData(componentData.uid);
		});

		return data;
	}

	function reset() {

	}

	function updateComponents(components) {
		var componentList = componentsWrap.find(".components").empty();
		components.forEach(component => componentList.append(buildComponent(component)));
	}

	function updatePackages(packages) {
		var vendorList = componentsWrap.find(".vendor-components").empty();
		packages.forEach(pkg => {
			if(!pkg.components || pkg.components.length == 0) {
				return
			}

			var name = pkg.company || pkg.name;
			var items = pkg.components.reduce((result, component) => result + buildComponent(component), '');
			var vendorLi = vendorTemplate.replace(/\{\{name\}\}/g, name).replace(/\{\{logo\}\}/g, pkg.logo).replace(/\{\{items\}\}/g, items);
			vendorList.append(vendorLi);
		});

		vendorList.find("> li .placeholder").on("click", onToggleVendor);
	}

	function onToggleVendor(e) {
		var li = $(this).parent("li");
		li.toggleClass("active");
		componentsWrap.perfectScrollbar("update");
	}

	function buildComponent(component) {
		return componentTemplate.replace(/\{\{name\}\}/g, component.name)
			.replace(/\{\{src\}\}/, component.imageUrl)
			.replace(/\{\{label\}\}/, component.label)
			.replace(/\{\{width\}\}/, component.width)
			.replace(/\{\{height\}\}/, component.height);
	}

	function onAppStart() {

	}

	function onMonitorClose() {
		topRegion.find(".show-monitor").removeClass("active");
	}

	function onUILock(type, value) {
		if(type == "build") {
			var check = topRegion.find(".check").attr("disabled", value);
			!value && check.find(".x-progress").hide();
		}
	}

	function onCheckProgress(value) {
		if(value < 0) {
			return
		}

		topRegion.find(".check .x-progress").show().css({
			transform: "translateX(-" + (100 - value) + "%)"
		});
	}

	function onToolButtonClick(e) {
		var action = $(this).data('action');
		switch(action) {
			case "check":
				emitor.trigger("project", "check");
				break;
			case "save":
				emitor.trigger("project", "save");
				break;
			case "show-monitor":
				topRegion.find(".show-monitor").toggleClass("active");
				kenrobot.trigger('monitor', 'toggle');
				break;
			case "switch-software":
				emitor.trigger("app", "activeTab", "software");
				break;
		}
	}

	function onActiveTab(name) {
		name == "hardware" ? dragContainer.classList.add("active") : dragContainer.classList.remove("active");
	}

	function onResize() {
		hardwareModel.repaint();
	}

	function onContextMenu(e) {
		var target = $(e.target);
		if (target.hasClass('component') && target.parents(container.selector).length) {
			contextMenuTarget = target;
			var offset = componentContextMenu.parent().offset();
			var top = e.pageY - offset.top;
			var height = componentContextMenu.height();

			if (e.pageY + height > $(window).innerHeight()) {
				top = top - height;
			}
			componentContextMenu.addClass("active").css({
				left: e.pageX - offset.left,
				top: top,
			});
		} else if ((target.hasClass('board') || target.closest('.board').length) && target.parents(container.selector).length) {
			var offset = boardContextMenu.parent().offset();
			boardContextMenu.addClass("active").css({
				left: e.pageX - offset.left,
				top: e.pageY - offset.top,
			});
		}
	}

	function onBoardContextMenu(e) {
		var li = $(this);
		var action = li.data('action');
		switch (action) {
			case "disconnect":
				hardwareModel.disconnectAllComponents();
				break;
			case "delete":
				hardwareModel.removeBoard();
				emitor.trigger("hardware", "removeBoard");
				break;
		}
	}

	function onComponentContextMenu(e) {
		if (!contextMenuTarget) {
			return;
		}

		var componentDom = contextMenuTarget[0];
		var li = $(this);
		var action = li.data('action');
		switch (action) {
			case "copy":
				var offset = 10;
				var x = 100 * (componentDom.offsetLeft + offset) / container.width();
				var y = 100 * (componentDom.offsetTop + offset) / container.height();
				var copyComponentDom = hardwareModel.addComponent({
					name: componentDom.dataset.name,
					x: x,
					y: y
				});
				hardwareModel.selectComponent(copyComponentDom);
				break;
			case "disconnect":
				hardwareModel.disconnectComponent(componentDom);
				break;
			case "delete":
				hardwareModel.removeComponent(componentDom);
				break;
		}
	}

	function onComponentMouseDown(e) {
		e.stopPropagation();
		e.returnValue = false;

		mouseDownComponentDom = e.currentTarget;
		startPreMouseMove = true;
		document.addEventListener("mouseup", onComponentMouseUpBeforeMove);
		document.addEventListener("touchend", onComponentMouseUpBeforeMove);
		document.addEventListener("mousemove", onComponentPreMouseMove);
		document.addEventListener("touchmove", onComponentPreMouseMove);
	}

	function onComponentMouseUpBeforeMove(e) {
		mouseDownComponentDom = null;
		document.removeEventListener("mouseup", onComponentMouseUpBeforeMove);
		document.removeEventListener("touchend", onComponentMouseUpBeforeMove);
		document.removeEventListener("mousemove", onComponentPreMouseMove);
		document.removeEventListener("touchmove", onComponentPreMouseMove);
	}

	function onComponentPreMouseMove(e) {
		var touch = e instanceof MouseEvent ? e : e.changedTouches[0];
		if (startPreMouseMove) {
			startPreMouseMove = false;
			preMouseMoveX = touch.pageX;
			preMouseMoveY = touch.pageY;

			var rect = mouseDownComponentDom.getBoundingClientRect();
			var containerRect = dragContainer.getBoundingClientRect();

			dragMouseX = touch.pageX - rect.left + containerRect.left - dragContainer.scrollLeft;
			dragMouseY = touch.pageY - rect.top + containerRect.top - dragContainer.scrollTop;
		} else {
			var distanceX = touch.pageX - preMouseMoveX;
			var distanceY = touch.pageY - preMouseMoveY;

			if ((Math.abs(distanceX) >= 5) || (Math.abs(distanceY) >= 5)) {
				document.removeEventListener("mousemove", onComponentPreMouseMove);
				document.removeEventListener("touchmove", onComponentPreMouseMove);
				document.addEventListener("mousemove", onComponentMouseMove);
				document.addEventListener("touchmove", onComponentMouseMove);
			}
		}
	}

	function onComponentMouseMove(e) {
		var touch = e instanceof MouseEvent ? e : e.changedTouches[0];
		
		if (mouseDownComponentDom) {
			document.removeEventListener("mouseup", onComponentMouseUpBeforeMove);
			document.removeEventListener("touchend", onComponentMouseUpBeforeMove);
			document.addEventListener("mouseup", onComponentMouseUp);
			document.addEventListener("touchend", onComponentMouseUp);
			
			var li = $(mouseDownComponentDom).closest("li")[0];
			dragComponentDom = document.createElement("img");
			dragComponentDom.src = mouseDownComponentDom.src;
			dragComponentDom.dataset.name = li.dataset.name;
			dragComponentDom.classList.add("drag-component");
			dragContainer.appendChild(dragComponentDom);
			container.addClass("can-drop");

			mouseDownComponentDom = null;
		}

		dragComponentMove(dragComponentDom, touch.clientX, touch.clientY);
	}

	function onComponentMouseUp(e) {
		var touch = e instanceof MouseEvent ? e : e.changedTouches[0];
		document.removeEventListener("mousemove", onComponentMouseMove);
		document.removeEventListener("touchmove", onComponentMouseMove);
		document.removeEventListener("mouseup", onComponentMouseUp);
		document.removeEventListener("touchend", onComponentMouseUp);
		var name = dragComponentDom.dataset.name;
		dragComponentDom.remove();
		dragComponentDom = null;
		container.removeClass("can-drop");
		onContainerDrop(name, touch.pageX, touch.pageY);
	}

	function dragComponentMove(componentDom, clientX, clientY) {
		var offset = 30;

		var x = clientX - dragMouseX;
		var y = clientY - dragMouseY;
		if (x < 0) {
			x = 0;
		} else if (x + offset >= dragContainer.offsetWidth) {
			x = dragContainer.offsetWidth - offset;
		}
		if (y < 0) {
			y = 0;
		} else if (y + offset >= dragContainer.offsetHeight) {
			y = dragContainer.offsetHeight - offset;
		}

		componentDom.style.transform = "translate(" + x + "px, " + y + "px)";
	}

	function onContainerDrop(name, pageX, pageY) {
		var rect = container[0].getBoundingClientRect();
		if(pageX < rect.left || pageX > rect.right || pageY < rect.top || pageY > rect.bottom) {
			return;
		}

		var schema = hardwareModel.getSchema();
		var component = schema.components[name];
		var x = 100 * (pageX - rect.left - 0.5 * component.width) / container.width();
		var y = 100 * (pageY - rect.top - 0.5 * component.height) / container.height();

		var componentDom = hardwareModel.addComponent({
			name: name,
			x: x,
			y: y
		});
		hardwareModel.selectComponent(componentDom);
		showComponentDialog(componentDom.dataset.uid);
	}

	function onContainerEvent(e) {
		var action = e.originalEvent.action;
		if(action == "select-component") {
			showComponentDialog(e.originalEvent.data.uid);
		} else if(action == "remove-component") {
			var uid = e.originalEvent.data.uid;
			uid == componentOption.data("uid") && hideComponentDialog();
		} else if(action == "remove-all-components") {
			hideComponentDialog();
		}
	}

	function onContainerKeyUp(e) {
		if(e.keyCode != 46 && e.keyCode != 8) {
			return;
		}

		//delete 或者 backspace
		var componentDom = hardwareModel.getSelectedComponent()
		componentDom && hardwareModel.removeComponent(componentDom);
	}

	function onBoardChange(name) {
		boardData = hardwareModel.addBoard(name);

		filterList.find(">li.active").click();
	}

	function onCategoryClick(e) {
		var li = $(this);
		util.toggleActive(li);

		var category = li.data("category");
		var componentList = category == "all" ? componentsWrap.find(".components") : componentsWrap.find(".vendor-components");
		util.toggleActive(componentList);

		filterList.find(">li.active").click();
	}

	function onFilterClick(e) {
		var li = $(this);
		util.toggleActive(li);

		var boardTags = boardData.tags;
		var componentList = componentsWrap.find("ul.active");
		componentList.find(".component-item").removeClass("active");
		var filter = li.data('filter');
		var list = componentList.find('.component-item').filter((index, componentDom) => {
			var name = componentDom.dataset.name;
			var componentConfig = hardwareModel.getComponentConfig(name);
			if(_.intersection(componentConfig.boards, boardTags).length == 0) {
				return false;
			}

			return filter == "all" ? true : componentConfig.category == filter;
		});
		list.addClass("active");

		componentsWrap.perfectScrollbar("update");
	}

	function onComponentNameBlur(e) {
		var uid = componentOption.data("uid");
		var name = componentOption.find(".name").val();
		var componentData = hardwareModel.getComponentData(uid);
		componentData && (componentData.varName = name);
		console.log("onComponentNameBlur", name);
	}

	function onComponentNameKeyUp(e) {
		if(e.keyCode != 13) {
			return;
		}

		onComponentNameBlur();
	}

	function hideComponentDialog() {
		componentOption.removeClass("active").data("uid", "").find(".name").val("");
	}

	function showComponentDialog(uid) {
		var componentData = hardwareModel.getComponentData(uid);
		if(componentData.type == "serial") {
			hideComponentDialog();
			return;
		}

		componentOption.addClass("active").data("uid", uid).find(".name").val(componentData.varName);
	}

	function setBoard(name) {
		if(name) {
			boardList.find('> ul > li[data-value="' + name + '"]').click();
		} else {
			boardList.find('> ul > li:eq(0)').click();
		}
	}

	function updateBoards(boards) {
		var ul = boardList.find("> ul").empty();
		boards.forEach(function(board) {
			var li = boardTemplate.replace(/\{\{name\}\}/g, board.name)
				.replace(/\{\{label\}\}/g, board.label)
				.replace(/\{\{src\}\}/, board.imageUrl);
			ul.append(li);
		});
		var defaultLi = '<li class="seperator"></li><li class="board-manager" data-value="board-manager" title="开发板管理"><i class="kenrobot ken-edu-hardware"></i><span>开发板管理<span></li>';
		ul.append(defaultLi);
		ul.find("> li").eq(0).click();
	}

	function onShowBoardSelect(e) {
		boardList.toggleClass("active");
		return false;
	}

	function onBoardSelectClick(e) {
		var li = $(this);
		var name = li.data("value");
		if(name == "board-manager") {
			boardList.removeClass("active");
			kenrobot.trigger("board", "show");
			return;
		}

		boardList.removeClass("active").find(".placeholder").html(li.html());
		boardList.data("value", name);

		name && onBoardChange(name);
	}

	return {
		init: init,
		loadSchema: loadSchema,
		getData: getData,
		setData: setData,
		getBoardData: getBoardData,
		getBlockData: getBlockData,
		reset: reset,
	};
});
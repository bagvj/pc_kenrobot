define(['app/util/compitableEvents', 'app/util/emitor'], function(compitableEvents, emitor) {
	var blocks = {};
	var connectors = {};
	var ioConnectors = {};
	var blockVars = {
		voidFunctions: [],
		returnFunctions: [],
		vars: [],
	};

	var activeConnectors = [];
	var activeIOConnectors = [];
	var schema;

	var mouseDownBlockDom;
	var dragBlock;
	var container;
	var dragContainer;

	var startPreMouseMove;
	var preMouseMoveX;
	var preMouseMoveY;
	var dragBlockPreX;
	var dragBlockPreY;
	var dragMouseX;
	var dragMouseY;
	var delayTimer;

	var translateRegExp = /translate\(((-)*(\d|\.)*)px, ((-)*(\d|\.)*)px\)/;
	var reservedWords = 'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,interger, constants,floating,point,void,bool,char,unsigned,byte,int,word,long,float,double,string,String,array,static, volatile,const,sizeof,pinMode,digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt,detachInterrupt,interrupts,noInterrupts';
	reservedWords = reservedWords.split(',');

	function Block(blockData) {
		this.data = blockData;
		this.uid = genUid();
		this.connectable = false;
		this.enable = true;
		this.connectors = [];
		this.ioConnectors = [];

		var dom = document.createElement('div');
		dom.draggable = false;
		dom.dataset.uid = this.uid;
		dom.classList.add("block");
		dom.classList.add("block-" + this.data.type);
		this.data.tags && this.data.tags.forEach(function(tag) {
			dom.classList.add(tag);
		});
		this.dom = dom;

		switch (this.data.type) {
			case "statement-input":
				this.dom.innerHTML = '<div class="statement-header"></div><div class="statement-extension"><div class="statement-extension-content"></div><div class="statement-extension-end"></div></div>';
				this.contentDom = this.dom.querySelector(".statement-header");

				buildContent(this);
				buildConnectors(this);
				this.dom.addEventListener(compitableEvents.down, onBlockMouseDown);
				break;
			case "statement":
				this.dom.innerHTML = '<div class="statement-content"></div>';
				this.contentDom = this.dom.querySelector(".statement-content");

				buildContent(this);
				buildConnectors(this);
				this.dom.addEventListener(compitableEvents.down, onBlockMouseDown);
				break;
			case "output":
				this.contentDom = this.dom;

				buildContent(this);
				buildConnectors(this);
				this.dom.addEventListener(compitableEvents.down, onBlockMouseDown);
				break;
			case "group":
				this.dom.innerHTML = '<div class="group-content"></div>';
				buildConnectors(this);
				this.connectable = true;
				break;
		}

		blocks[this.uid] = this;

		if (this.data.createDynamicContent) {
			var inputDom = this.dom.querySelector("input.var-input");
			if (inputDom) {
				var varName = validName(inputDom.value);
				if (varName) {
					updateBlockVar(this, varName)
				} else {
					removeBlockVar(this);
				}
			}
		}
	}

	Block.prototype.getCode = function() {
		return getBlockCode(this);
	}

	Block.prototype.copy = function() {
		return copyBlock(this);
	}

	Block.prototype.remove = function() {
		removeBlock(this);
	}

	Block.prototype.getStructure = function() {
		return getBlockStructure(this);
	}

	Block.prototype.isEnable = function() {
		return this.enable;
	}

	Block.prototype.setEnable = function(value) {
		setBlockEnable(this, value, false);
	}

	Block.prototype.isConnectable = function() {
		return this.connectable;
	}

	Block.prototype.setConnectable = function(value) {
		setBlockConnectable(this, value);
	}

	Block.prototype.isFree = function() {
		return !isInGroup(this.dom);
	}

	Block.prototype.hasChildren = function() {
		return blockHasChildren(this);
	}

	Block.prototype.getOffset = function() {
		return getBlockOffset(this);
	}

	Block.prototype.setOffset = function(x, y) {
		setBlockOffset(this, x, y);
	}

	function buildContent(block) {
		var extDom;
		block.data.content.forEach(function(elementData) {
			var elementDom = createBlockElement(block, elementData);
			if (elementData.extra && !extDom) {
				extDom = block.dom.querySelector(".statement-extension-end");
				extDom.classList.add("with-content");
			}
			elementData.extra ? extDom.appendChild(elementDom) : block.contentDom.appendChild(elementDom);
		});
	}

	function buildConnectors(block) {
		var connectorDom;
		var connectorUid;
		var connector;
		var containerDom;

		block.data.connectors.forEach(function(connectorData) {
			connectorUid = genUid();
			connector = {
				uid: connectorUid,
				data: connectorData,
				blockUid: block.uid,
				connectedTo: null
			};

			switch (connectorData.type) {
				case "connector-top":
					containerDom = block.data.type == "statement-input" ? block.dom.querySelector(".statement-header") : block.dom.querySelector(".statement-content");
					connectorDom = buildStatementConnector(block, connectorUid, connectorData, connector, containerDom);
					break;
				case "connector-bottom":
					containerDom = block.data.type == "statement-input" ? block.dom.querySelector(".statement-extension-end") : block.dom.querySelector(".statement-content");
					connectorDom = buildStatementConnector(block, connectorUid, connectorData, connector, containerDom);
					break;
				case "connector-root":
					containerDom = block.data.type == "statement-input" ? block.dom.querySelector(".statement-header") : block.dom;
					connectorDom = buildStatementConnector(block, connectorUid, connectorData, connector, containerDom);
					break;
				case "connector-input":
					connectorDom = block.dom.querySelector('.block-input[data-connector-name="' + connectorData.name + '"]');
					connectorDom.dataset.connectorUid = connectorUid;
					connectorDom.classList.add("connector");
					connectorDom.classList.add(connectorData.type);

					connector.contentId = connectorDom.dataset.contentId;
					ioConnectors[connectorUid] = connector;
					block.ioConnectors.push(connectorUid);
					break;
				case "connector-output":
					connectorDom = document.createElement("div");
					connectorDom.dataset.connectorUid = connectorUid;
					connectorDom.classList.add("connector");
					connectorDom.classList.add(connectorData.type);
					block.dom.appendChild(connectorDom);

					connector.returnType = block.data.returnType;
					ioConnectors[connectorUid] = connector;
					block.ioConnectors.push(connectorUid);
					break;
				case "connector-empty":
					connectorDom = document.createElement("div");
					connectors[connectorUid] = connector;
					block.connectors.push(connectorUid);
					break;
			}
			connector.dom = connectorDom;
		});
	}

	function createBlockElement(block, elementData) {
		var elementDom;
		switch (elementData.type) {
			case "static-select":
				elementDom = document.createElement("div");
				elementDom.classList.add("select-wrap");
				var selectDom = document.createElement("select");
				elementDom.appendChild(selectDom);

				selectDom.dataset.contentId = elementData.id;
				elementData.options.forEach(function(optionData) {
					var optionDom = document.createElement("option");
					optionDom.value = optionData.value;
					optionDom.innerHTML = optionData.label;
					selectDom.appendChild(optionDom);
				});
				elementData.value && (selectDom.value = elementData.value);
				selectDom.addEventListener("change", function() {
					block.data.returnType && block.data.returnType.type == "fromSelect" && updateBlockVar(block);
				});

				break;
			case "dynamic-select":
				elementDom = document.createElement("div");
				elementDom.classList.add("select-wrap");
				var selectDom = document.createElement("select");
				elementDom.appendChild(selectDom);

				selectDom.dataset.contentId = elementData.id;
				selectDom.dataset.options = elementData.options;
				var options = blockVars[elementData.options];
				options && updateSelectDom(selectDom, options);

				if(options && elementData.value) {
					selectDom.value = elementData.value;
					selectDom.dataset.value = elementData.value;

					var reference;
					options.forEach(function(optionData) {
						if(optionData.name == elementData.value) {
							reference = optionData.id;
							return true;
						}
					});
					selectDom.dataset.reference = reference || "";
				}

				selectDom.addEventListener("change", function(e) {
					if (block.data.type == "output") {
						var outputConnector = getOutputConnector(block);
						if (outputConnector.connectedTo) {
							var blockConnector = ioConnectors[outputConnector.connectedTo];
							var oldBlock = blocks[blockConnector.blockUid];
							oldBlock.data.returnType && oldBlock.data.returnType.type == "fromInput" && updateBlockVar(oldBlock);
						}
					}

					selectDom.dataset.value = selectDom.value;
					selectDom.dataset.reference = selectDom.selectedOptions[0].dataset.reference;
				});
				break;
			case "text":
				elementDom = document.createElement("span");
				elementDom.innerHTML = elementData.value;
				break;
			case "block-input":
				elementDom = document.createElement("div");
				elementDom.dataset.connectorName = elementData.name;
				elementDom.dataset.contentId = elementData.blockInputId;
				elementDom.classList.add("block-input");
				break;
			case "var-input":
				elementDom = createInputElement(elementData);
				elementDom.classList.add("var-input");
				elementDom.addEventListener("keyup", function() {
					delayDo(function() {
						var name = validName(elementDom.value);
						name ? updateBlockVar(block, name) : removeBlockVar(block);
					}, 1000);
				});
				break;
			case "number-input":
				elementDom = createInputElement(elementData);
				break;
			case "string-input":
				elementDom = createInputElement(elementData);
				break;
			case "char-input":
				elementDom = createInputElement(elementData);
				break;
			case "code-input":
				elementDom = createTextareaElement(elementData);
				break;
			case "comment-input":
				elementDom = createTextareaElement(elementData);
				break;
			default:
				elementDom = document.createElement("div");

				break;
		}

		return elementDom;
	}

	function createInputElement(elementData) {
		var inputDom = document.createElement("input");
		inputDom.type = "text";
		inputDom.value = elementData.value || "";
		inputDom.placeholder = elementData.placeholder || "";
		inputDom.dataset.contentId = elementData.id;

		return inputDom;
	}

	function createTextareaElement(elementData) {
		var textareaDom = document.createElement("textarea");
		textareaDom.name = elementData.id;
		textareaDom.spellcheck = false;
		textareaDom.cols = 40;
		textareaDom.rows = 1;
		textareaDom.value = elementData.value || "";
		textareaDom.placeholder = elementData.placeholder || "";
		textareaDom.dataset.contentId = elementData.id;
		textareaDom.dataset.contentType = elementData.type;

		return textareaDom;
	}

	function buildStatementConnector(block, connectorUid, connectorData, connector, containerDom) {
		var connectorDom = document.createElement("div");
		connectorDom.dataset.connectorUid = connectorUid;
		connectorDom.classList.add("connector");
		connectorDom.classList.add(connectorData.type);
		containerDom.appendChild(connectorDom);
		connectors[connectorUid] = connector;
		block.connectors.push(connectorUid);

		return connectorDom;
	}

	function updateSelectDom(selectDom, options) {
		selectDom.innerHTML = '';
		options.forEach(function(optionData) {
			var optionDom = document.createElement("option");
			optionDom.value = optionData.name;
			optionDom.dataset.reference = optionData.id;
			optionDom.innerHTML = optionData.name;
			selectDom.appendChild(optionDom);
		});
	}

	function onBlockMouseDown(e) {
		var tagName = e.target.tagName.toLowerCase();
		if (tagName == "select" || tagName == "input" || tagName == "textarea") {
			return;
		}

		e.stopPropagation();
		e.returnValue = false;

		mouseDownBlockDom = e.currentTarget;
		startPreMouseMove = true;
		document.addEventListener(compitableEvents.up, onBlockMouseUpBeforeMove);
		document.addEventListener(compitableEvents.move, onBlockPreMouseMove);
	}

	function onBlockMouseUpBeforeMove(e) {
		mouseDownBlockDom = null;
		document.removeEventListener(compitableEvents.up, onBlockMouseUpBeforeMove);
		document.removeEventListener(compitableEvents.move, onBlockPreMouseMove);
	}

	function onBlockPreMouseMove(e) {
		e = compitableEvents.isMobile ? e.changedTouches[0] : e;
		if (startPreMouseMove) {
			startPreMouseMove = false;
			preMouseMoveX = e.pageX;
			preMouseMoveY = e.pageY;

			var rect = mouseDownBlockDom.getBoundingClientRect();
			var containerRect = dragContainer.getBoundingClientRect();

			dragBlockPreX = rect.left
			dragBlockPreY = rect.top;
			dragMouseX = e.pageX - rect.left + containerRect.left - dragContainer.scrollLeft;
			dragMouseY = e.pageY - rect.top + containerRect.top - dragContainer.scrollTop;
		} else {
			var distanceX = e.pageX - preMouseMoveX;
			var distanceY = e.pageY - preMouseMoveY;

			if ((Math.abs(distanceX) >= 5) || (Math.abs(distanceY) >= 5)) {
				document.removeEventListener(compitableEvents.move, onBlockPreMouseMove);
				document.addEventListener(compitableEvents.move, onBlockMouseMove);
			}
		}
	}

	function onBlockMouseMove(e) {
		e = compitableEvents.isMobile ? e.changedTouches[0] : e;
		var block;
		if (mouseDownBlockDom) {
			document.removeEventListener(compitableEvents.up, onBlockMouseUpBeforeMove);
			document.addEventListener(compitableEvents.up, onBlockMouseUp);
			block = getBlock(mouseDownBlockDom.dataset.uid);

			if (!block.connectable) {
				block = copyBlock(block);
				setBlockConnectable(block, true);
				setBlockEnable(block, true);

				dragContainer.appendChild(block.dom);
			}
			setBlockDragging(block, true);

			switch (block.data.type) {
				case "statement":
				case "statement-input":
					statementDragStart(block);
					break;
				case "output":
					outputDragStart(block);
					break;
			}

			dragBlock = block;
			mouseDownBlockDom = null;

			emitor.trigger("block", "drag-start");
		}

		block = block || dragBlock;
		var instance = dragBlockMove(block, e.clientX, e.clientY);
		switch (block.data.type) {
			case "statement":
			case "statement-input":
				redrawTree(block);
				instance > 10 && handleCollision([block.connectors[0], getLastBottomConnectorUid(block.uid)]);
				break;
			case "output":
				instance > 10 && handleIOCollision(block);
				break;
		}
	}

	function onBlockMouseUp(e) {
		document.removeEventListener(compitableEvents.move, onBlockMouseMove);
		document.removeEventListener(compitableEvents.up, onBlockMouseUp);

		var block = dragBlock;
		var dropConnectorDom = container.querySelector(".connector.active") || dragContainer.querySelector(".connector.active");
		if (dropConnectorDom) {
			switch (block.data.type) {
				case "statement":
				case "statement-input":
					statementDragEnd(block, dropConnectorDom);
					break;
				case "output":
					outputDragEnd(block, dropConnectorDom);
					break;
			}
			setBlockEnable(block, isInGroup(dropConnectorDom));
		} else {
			setBlockEnable(block, false);
		}
		setBlockDragging(block, false);

		activeConnectors = [];
		activeIOConnectors = [];
		dragBlock = null;
		dragBlockPreX = 0;
		dragBlockPreY = 0;

		[].forEach.call(container.querySelectorAll(".block .connector.active"), function(connectorDom) {
			connectorDom.classList.remove("active");
		});
		[].forEach.call(dragContainer.querySelectorAll(".block .connector.active"), function(connectorDom) {
			connectorDom.classList.remove("active");
		});

		emitor.trigger("block", "drag-end");
	}

	function statementDragStart(block) {
		var preConnectorUid = connectors[block.connectors[0]].connectedTo;
		if (preConnectorUid) {
			var previousBlock = getBlockByConnector(preConnectorUid);
			var isInRoot = isInsideConnectorRoot(block);
			connectors[preConnectorUid].connectedTo = null;
			connectors[block.connectors[0]].connectedTo = null;

			if (isInRoot) {
				if (previousBlock.data.type === 'group') {
					previousBlock.dom.parentNode.parentNode.classList.remove('with-content');
				}
				removeFromStatementInput(block);
				redrawTree(previousBlock);
			}
		}

		activeConnectors = [];
		for (var connectorUid in connectors) {
			if (connectors[connectorUid].data.type !== "connector-empty" && getBlockByConnector(connectorUid).connectable && !connectorIsInBranch(connectorUid, block.uid)) {
				activeConnectors.push(connectorUid);
			}
		}
	}

	function statementDragEnd(block, dropConnectorDom) {
		var dropConnectorUid = dropConnectorDom.dataset.connectorUid;
		var dragConnectorUid = dropConnectorDom.dataset.canConnectWith;

		var isDropping = isConnectorRoot(connectors[dropConnectorUid]) || isInsideConnectorRoot(getBlockByConnector(dropConnectorUid));
		setLogicConnection(dropConnectorUid, dragConnectorUid);

		if (isDropping) {
			connectorRootDragEnd(block, dropConnectorDom);
		} else {
			placeNestBlock(dropConnectorUid, dragConnectorUid);
		}
	}

	function outputDragStart(block) {
		var outputConnector = getOutputConnector(block);
		if (outputConnector.connectedTo) {
			var blockConnector = ioConnectors[outputConnector.connectedTo];
			var oldBlock = blocks[blockConnector.blockUid];

			blockConnector.connectedTo = null;
			outputConnector.connectedTo = null;

			oldBlock.data.returnType && oldBlock.data.returnType.type === 'fromInput' && updateBlockVar(oldBlock);

			dragContainer.appendChild(block.dom);
		}

		activeIOConnectors = [];
		var ioConnector;
		var tempBlock;
		for (var connectorUid in ioConnectors) {
			ioConnector = ioConnectors[connectorUid];
			if (ioConnector.data.type === 'connector-input' && !ioConnector.connectedTo) {
				tempBlock = getBlockByConnector(connectorUid, true);
				if (tempBlock.connectable && sameConnectionType(block, tempBlock, ioConnector.data.acceptType) && !connectorIsInBranch(connectorUid, block.uid, true)) {
					activeIOConnectors.push(connectorUid);
				}
			}
		}
	}

	function outputDragEnd(block, dropConnectorDom) {
		var dropConnectorUid = dropConnectorDom.dataset.connectorUid;
		var dragConnectorUid = getOutputConnector(block).uid;

		dropConnectorDom.appendChild(block.dom);
		block.dom.style.transform = "none";

		ioConnectors[dropConnectorUid].connectedTo = dragConnectorUid;
		ioConnectors[dragConnectorUid].connectedTo = dropConnectorUid;

		var dropBlock = getBlockByConnector(dropConnectorUid, true);
		var dragBlock = getBlockByConnector(dragConnectorUid, true);
		dropBlock.data.returnType && dropBlock.data.returnType.type == 'fromInput' && dragBlock.data.returnType.pointer && updateBlockVar(dropBlock);
	}

	function connectorRootDragEnd(dragBlock, dropConnectorDom) {
		var dropConnectorUid = dropConnectorDom.dataset.connectorUid;
		var dropBlock = getBlockByConnector(dropConnectorUid);

		dragBlock.dom.style.transform = "none";

		if (isConnectorRoot(connectors[dropConnectorUid])) {
			var isGroup = dropBlock.data.type == "group";
			var childContainerDom = isGroup ? dropBlock.dom.querySelector('.group-content') : dropBlock.dom.querySelector(".statement-extension-content");
			childContainerDom.appendChild(dragBlock.dom);
			isGroup && dropBlock.dom.parentNode.parentNode.classList.add('with-content');
		} else {
			insertAfter(dragBlock.dom, dropBlock.dom);
		}

		var connectedUid = connectors[dragBlock.connectors[1]].connectedTo;
		var tempBlock = dragBlock;
		var branchBlock;
		while (connectedUid) {
			branchBlock = blocks[connectors[connectedUid].blockUid];
			insertAfter(branchBlock.dom, tempBlock.dom);
			branchBlock.dom.style.transform = "none";
			connectedUid = connectors[branchBlock.connectors[1]].connectedTo;
			tempBlock = branchBlock;
		}

		redrawTree(dropBlock);
	}

	function handleCollision(dragConnectors) {
		var found;
		var block;
		var dropConnector;
		var dragConnector;
		var uid;

		activeConnectors.forEach(function(dropConnectorUid) {
			dropConnector = connectors[dropConnectorUid];
			found = false;
			dragConnectors.forEach(function(dragConnectorUid) {
				dragConnector = connectors[dragConnectorUid];
				if ((dragConnector.data.type === dropConnector.data.accept) && itsOver(dragConnector.dom, dropConnector.dom, 10)) {
					found = true;
					uid = dragConnectorUid;
					return true;
				}
			});

			block = getBlockByConnector(dropConnectorUid);
			if (found) {
				dropConnector.dom.classList.add('active');
				dropConnector.dom.dataset.canConnectWith = uid;

				block.data.type === 'group' && block.dom.parentNode.classList.add('dragging');
			} else {
				block.data.type === 'group' && block.dom.parentNode.classList.remove('dragging');

				dropConnector.dom.classList.remove('active');
				dropConnector.dom.dataset.canConnectWith = "";
			}
		});
	}

	function handleIOCollision(block) {
		var dropConnector;
		var dragConnector = getOutputConnector(block);
		activeIOConnectors.forEach(function(connectorUid) {
			dropConnector = ioConnectors[connectorUid];
			if (itsOver(dragConnector.dom, dropConnector.dom) && sameConnectionType(blocks[dragConnector.blockUid], blocks[dropConnector.blockUid], dropConnector.data.acceptType)) {
				dropConnector.dom.classList.add('active');
			} else {
				dropConnector.dom.classList.remove('active');
			}
		});
	}

	function setLogicConnection(dropConnectorUid, dragConnectorUid) {
		if (connectors[dropConnectorUid].connectedTo) {
			var dropBottomConnectorUid, dragBlockLastBottomConnectorUid, dropTopConnectorUid, dragBlockFirstTopConnectorUid;
			switch (connectors[dropConnectorUid].data.type) {
				case 'connector-bottom':
					dropBottomConnectorUid = connectors[dropConnectorUid].connectedTo;
					dragBlockLastBottomConnectorUid = getLastBottomConnectorUid(connectors[dragConnectorUid].blockUid);
					connectors[dragBlockLastBottomConnectorUid].connectedTo = dropBottomConnectorUid;
					connectors[dropBottomConnectorUid].connectedTo = dragBlockLastBottomConnectorUid;
					break;
				case 'connector-top':
					dropTopConnectorUid = connectors[dropConnectorUid].connectedTo;
					dragBlockFirstTopConnectorUid = getFirstTopConnectorUid(connectors[dragConnectorUid].blockUid);
					connectors[dropTopConnectorUid].connectedTo = dragBlockFirstTopConnectorUid;
					connectors[dragBlockFirstTopConnectorUid].connectedTo = dropTopConnectorUid;
					break;
				case 'connector-root':
					dropBottomConnectorUid = connectors[dropConnectorUid].connectedTo;
					dragBlockLastBottomConnectorUid = getLastBottomConnectorUid(connectors[dragConnectorUid].blockUid);
					connectors[dragBlockLastBottomConnectorUid].connectedTo = dropBottomConnectorUid;
					connectors[dropBottomConnectorUid].connectedTo = dragBlockLastBottomConnectorUid;
					break;
			}
		}
		connectors[dropConnectorUid].connectedTo = dragConnectorUid;
		connectors[dragConnectorUid].connectedTo = dropConnectorUid;
	}

	function dragBlockMove(block, clientX, clientY) {
		var rect = block.dom.getBoundingClientRect();
		var distance = Math.round(Math.sqrt(Math.pow(dragBlockPreY - rect.top, 2) + Math.pow(dragBlockPreX - rect.left, 2)));
		if (distance > 10) {
			dragBlockPreX = rect.left;
			dragBlockPreY = rect.top;
		}

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
		setBlockOffset(block, x, y);
		block.data.type == "statement-input" && redrawTree(block);

		return distance;
	}

	function setBlockConnectable(block, value) {
		visitBlock(block, true, function(b) {
			b.connectable = value;
		});
	}

	function setBlockEnable(block, value) {
		visitBlock(block, true, function(b) {
			value ? b.dom.classList.remove("disabled") : b.dom.classList.add("disabled");
			b.enable = value;
		});
	}

	function setBlockDragging(block, value) {
		visitBlock(block, true, function(b) {
			value ? b.dom.classList.add("dragging") : b.dom.classList.remove("dragging");
		});
	}

	function visitBlock(block, includeConnected, callback) {
		callback(block);
		includeConnected = includeConnected != false;

		var connector;
		block.ioConnectors.forEach(function(connectorUid) {
			connector = ioConnectors[connectorUid];
			if (connector.data.type != "connector-input" || !connector.connectedTo) {
				return;
			}

			visitBlock(getBlockByConnector(connector.connectedTo, true), false, callback);
		});

		var tempBlock;
		var connectorUid;
		if (block.connectors[2]) {
			connectorUid = connectors[block.connectors[2]].connectedTo;
			while (connectorUid) {
				tempBlock = getBlockByConnector(connectorUid);
				visitBlock(tempBlock, false, callback);
				connectorUid = connectors[tempBlock.connectors[1]].connectedTo;
			}
		}

		if (!includeConnected || (block.data.type != "statement" && block.data.type != "statement-input")) {
			return;
		}

		connectorUid = connectors[block.connectors[1]].connectedTo;
		while (connectorUid) {
			tempBlock = getBlockByConnector(connectorUid);
			visitBlock(tempBlock, false, callback);
			connectorUid = connectors[tempBlock.connectors[1]].connectedTo;
		}
	}

	function blockHasChildren(block) {
		if (block.data.type != "statement-input" && block.data.type != "group") {
			return false;
		}

		return !!connectors[block.connectors[2]].connectedTo;
	}

	function copyBlock(block) {
		var newBlock = buildBlock(getBlockStructure(block));
		setBlockConnectable(newBlock, true);
		setBlockEnable(newBlock, false);

		return newBlock;
	}

	function removeBlock(block, redraw) {
		block.dom.removeEventListener(compitableEvents.down, onBlockMouseDown);
		if (mouseDownBlockDom && mouseDownBlockDom.dataset.uid == uid) {
			document.removeEventListener(compitableEvents.move, onBlockPreMouseMove);
			document.removeEventListener(compitableEvents.move, onBlockMouseMove);
			document.removeEventListener(compitableEvents.up, onBlockMouseUpBeforeMove);
			document.removeEventListener(compitableEvents.up, onBlockMouseUp);
		}

		switch (block.data.type) {
			case "statement-input":
			case "group":
				var tempBlock;
				var childConnector = connectors[block.connectors[2]].connectedTo;
				while (childConnector) {
					tempBlock = getBlockByConnector(childConnector);
					childConnector = connectors[tempBlock.connectors[1]].connectedTo;
					removeBlock(tempBlock);
				}
			case "statement":
				var topConnector = connectors[block.connectors[0]].connectedTo;
				var bottomConnector = connectors[block.connectors[1]].connectedTo;

				if (topConnector && bottomConnector) {
					connectors[topConnector].connectedTo = bottomConnector;
					connectors[bottomConnector].connectedTo = topConnector;
					redraw && redrawTree(getBlockByConnector(topConnector));
				} else if (topConnector) {
					connectors[topConnector].connectedTo = null;
					var previousBlock = blocks[connectors[topConnector].blockUid];
					if (previousBlock.data.type === 'group') {
						previousBlock.dom.parentNode.parentNode.classList.remove('with-content');
					}
					redraw && redrawTree(getBlockByConnector(topConnector));
				} else if (bottomConnector) {
					connectors[bottomConnector].connectedTo = null;
				}

				var tempConnector;
				block.ioConnectors.forEach(function(connectorUid) {
					tempConnector = ioConnectors[connectorUid];
					if ((tempConnector.data.type === 'connector-input') && tempConnector.connectedTo) {
						removeBlock(getBlockByConnector(tempConnector.connectedTo, true));
					}
				});
				break;
			case "output":
				var outputConnector = ioConnectors[block.ioConnectors[0]].connectedTo;
				outputConnector && (ioConnectors[outputConnector].connectedTo = null);
				break;
		}

		block.dom.remove();
		block.connectors.forEach(function(connectorUid) {
			delete connectors[connectorUid];
		});
		block.ioConnectors.forEach(function(connectorUid) {
			delete ioConnectors[connectorUid];
		});

		if (block.data.createDynamicContent) {
			removeBlockVar(block);
		} else {
			for (var key in blockVars) {
				updateBlockVarType(key);
			}
		}

		delete blocks[block.uid];
	}

	function getBlockOffset(block) {
		var match = translateRegExp.exec(block.dom.style.transform);
		var offset = {
			left: 0,
			top: 0
		};

		if (match) {
			offset.top = parseInt(match[4]);
			offset.left = parseInt(match[1]);
		}

		return offset;
	}

	function setBlockOffset(block, x, y) {
		block.dom.style.transform = "translate(" + x + "px, " + y + "px)";
	}

	function getBlockCode(block) {
		var code = block.data.code;
		var childBlock;
		var childConnectorId;
		var value = '';
		var elementTags = [];
		var childrenTags = [];
		block.data.content.forEach(function(elementData) {
			elementData.id && elementTags.push(elementData.id);
			elementData.blockInputId && childrenTags.push(elementData.blockInputId);
		});

		elementTags.forEach(function(elem) {
			var element;
			[].forEach.call(block.contentDom.childNodes, function(childDom) {
				if (childDom.dataset.contentId && childDom.dataset.contentId == elem) {
					element = childDom;
					return true;
				}
			});
			!element && (element = block.contentDom.querySelector('[data-content-id="' + elem + '"]'));
			value = element.value || '';

			// for (var j = 0; j < block.componentsArray.sensors.length; j++) {
			// 	if (value === block.componentsArray.sensors[j].name) {
			// 		type = block.componentsArray.sensors[j].type;
			// 		if (type === 'analog') {
			// 			value = 'analogRead(' + block.componentsArray.sensors[j].pin.s + ')';
			// 		} else if (type === 'digital') {
			// 			value = 'digitalRead(' + block.componentsArray.sensors[j].pin.s + ')';
			// 		} else if (type === 'LineFollower') { // patch. When the new Web2Board is launched with float * as return, remove block
			// 			value = '(float *)' + block.componentsArray.sensors[j].name + '.read()';
			// 		} else {
			// 			value = block.componentsArray.sensors[j].name + '.read()';
			// 		}
			// 		code = code.replace(new RegExp('{' + elem + '.type}', 'g'), value);
			// 	}
			// }
			if (element.dataset.contentType == 'string-input') {
				value = validString(value);
			} else if (element.dataset.contentType == 'char-input') {
				value = validChar(value);
			} else if (element.dataset.contentType == 'comment-input') {
				value = validComment(value);
			}
			var valueWithoutAsterisk = value.replace(' *', '');
			code = code.replace(new RegExp('{' + elem + '}.withoutAsterisk', 'g'), valueWithoutAsterisk);
			code = code.replace(new RegExp('{' + elem + '}', 'g'), value);
		});

		var blockInputConnectors = getBlockInputConnectors(block);
		if (childrenTags.length > 0) {
			// search for child blocks:
			for (var k = 0; k < blockInputConnectors.length; k++) {
				value = '';
				var connectionType = '';
				var returnType = '';
				if (ioConnectors[blockInputConnectors[k]]) {
					childConnectorId = ioConnectors[blockInputConnectors[k]].connectedTo;
					if (childConnectorId) {
						childBlock = getBlockByConnector(childConnectorId, true);
						value = getBlockCode(childBlock);
						returnType = childBlock.data.returnType;
					}
					if (returnType.type === 'fromDynamicSelect') {
						connectionType = getFromDynamicSelectType(childBlock || block, returnType.id, returnType.options);
					} else if (returnType.type === 'fromSelect') {
						connectionType = getTypeFromBlock(childBlock || block);
					} else {
						connectionType = returnType.value;
						if (connectionType === 'string') {
							connectionType = 'String';
						}
					}
				}

				connectionType = connectionType || '';
				code = code.replace(new RegExp('{' + childrenTags[k] + '.connectionType}', 'g'), connectionType);
				code = code.replace(new RegExp('{' + childrenTags[k] + '}', 'g'), value);
			}
		}

		block.data.eval && (code = eval(code));
		var children = [];
		if (block.connectors[2]) {
			value = '';
			childConnectorId = connectors[block.connectors[2]].connectedTo;
			if (childConnectorId) {
				childBlock = getBlockByConnector(childConnectorId);
				var branchConnectors = getBranchsConnectorsNoChildren(childBlock.uid);

				branchConnectors.forEach(function(branchConnector) {
					if (isInsideConnectorRoot(blocks[connectors[branchConnector].blockUid])) {
						var blockId = connectors[branchConnector].blockUid;
						if (blockId !== children[children.length - 1]) {
							children.push(blockId);
						}
					}
				});
			}
			children.forEach(function(uid) {
				value += getBlockCode(blocks[uid]);
			});
			code = code.replace(new RegExp('{STATEMENTS}', 'g'), value);
		}
		if (!block.enable) {
			code = '';
		}
		return code;
	}

	function getBlockStructure(block) {
		var structure = {
			name: block.data.name,
			content: [],
			children: [],
			enable: block.enable,
		};

		var rootConnectorUid = block.connectors[2];
		if (rootConnectorUid) {
			var connectorUid = connectors[rootConnectorUid].connectedTo;
			var tempBlock;
			while (connectorUid) {
				tempBlock = getBlockByConnector(connectorUid);
				structure.children.push(getBlockStructure(tempBlock));
				connectorUid = connectors[tempBlock.connectors[1]].connectedTo;
			}
		}

		var tempDom;
		block.data.content.forEach(function(elementData) {
			switch (elementData.type) {
				case 'var-input':
				case 'string-input':
				case 'number-input':
				case 'code-input':
				case 'comment-input':
				case 'char-input':
					tempDom = block.dom.querySelector('[data-content-id="' + elementData.id + '"]');
					if (tempDom && tempDom.value) {
						structure.content.push({
							id: elementData.id,
							type: elementData.type,
							value: tempDom.value
						});
					}
					break;
				case 'block-input':
					var connectedBlock;
					var uid = getIOConnectorUid(block, elementData.blockInputId);
					if ((ioConnectors[uid].data.type === 'connector-input') && ioConnectors[uid].connectedTo) {
						connectedBlock = getBlockByConnector(ioConnectors[uid].connectedTo, true);
						structure.content.push({
							type: elementData.type,
							blockInputId: elementData.blockInputId,
							value: getBlockStructure(connectedBlock)
						});
					}
					break;
				case 'dynamic-select':
					tempDom = block.contentDom.querySelector('select[data-content-id="' + elementData.id + '"][data-options="' + elementData.options + '"]');
					if (tempDom) {
						structure.content.push({
							id: elementData.id,
							type: elementData.type,
							value: tempDom.dataset.value || tempDom.value,
						});
					}
					break;
				case 'static-select':
					tempDom = block.contentDom.querySelector('select[data-content-id="' + elementData.id + '"]');
					if (tempDom && tempDom.value) {
						structure.content.push({
							id: elementData.id,
							type: elementData.type,
							value: tempDom.value
						});
					}
					break;
			}
		});

		return structure;
	}

	function fillBlockData(blockData, structure) {
		structure.content.forEach(function(elementData) {
			switch (elementData.type) {
				case 'static-select':
				case 'dynamic-select':
				case 'number-input':
				case 'string-input':
				case 'char-input':
				case 'var-input':
				case 'code-input':
				case 'comment-input':
					blockData.content.forEach(function(eleData) {
						if (elementData.id == eleData.id) {
							eleData.value = elementData.value;
							return true;
						}
					});
					break;
			}
		});

		return blockData;
	}

	function redrawTree(block) {
		var rootBlock = getBlockByConnector(getFirstTopConnectorUid(block.uid));
		var bottomUid = connectors[rootBlock.connectors[1]].connectedTo;
		var transformProperties = translateRegExp.exec(rootBlock.dom.style.transform);
		var top = 0;
		var left = 0;
		var marginOffset = 2;
		if (transformProperties) {
			top = parseInt(transformProperties[4]);
			left = parseInt(transformProperties[1]);
		}
		top += rootBlock.dom.offsetHeight + marginOffset;

		var branchBlock;
		while (bottomUid) {
			branchBlock = getBlockByConnector(bottomUid);
			setBlockOffset(branchBlock, left, top);
			top += branchBlock.dom.offsetHeight + marginOffset;
			bottomUid = connectors[branchBlock.connectors[1]].connectedTo;
		}
	}

	function removeFromStatementInput(block) {
		var totalBlocksToRemove = [block.dom];
		var childConnectorUid = connectors[block.connectors[1]].connectedTo;
		var blockToRemove;
		var top = block.dom.offsetHeight;

		while (childConnectorUid) {
			blockToRemove = blocks[connectors[childConnectorUid].blockUid];
			totalBlocksToRemove.push(blockToRemove.dom);
			setBlockOffset(blockToRemove, 0, top);
			top += blockToRemove.dom.offsetHeight;
			childConnectorUid = connectors[blockToRemove.connectors[1]].connectedTo;
		}

		totalBlocksToRemove.forEach(function(blockDom) {
			dragContainer.appendChild(blockDom);
		});
	}

	function placeNestBlock(dropConnectorUid, dragConnectorUid) {
		var dropBlock = getBlockByConnector(dropConnectorUid);
		switch (dropBlock.data.type) {
			case 'statement':
			case 'statement-input':
				redrawTree(getBlockByConnector(dragConnectorUid));
				break;
		}
	}

	function updateBlockVar(block, name, type, args) {
		var varName = block.data.createDynamicContent;
		if (!varName) {
			return;
		}

		var vars = blockVars[varName];
		var blockVar;
		vars && vars.forEach(function(_blockVar) {
			if (_blockVar.blockUid == block.uid) {
				blockVar = _blockVar;
				return true;
			}
		});
		type = type || getTypeFromBlock(block);
		if (block.data.type == "statement-input" && block.data.arguments) {
			args = args || getArgsFromBlock(block);
		} else {
			args = "";
		}
		if (blockVar) {
			blockVar.name = name || blockVar.name;
			blockVar.type = type;
			blockVar.args = args;
			if (blockVar.name) {
				[].forEach.call(document.querySelectorAll('option[data-reference="' + blockVar.id + '"]'), function(optionDom) {
					optionDom.value = blockVar.name;
					optionDom.innerHTML = blockVar.name;
				});
			} else {
				removeBlockVar(block);
			}
		} else if (name) {
			blockVar = {
				name: name,
				id: genUid(),
				blockUid: block.uid,
				type: type,
				args: args,
			};
			vars.push(blockVar);
			[].forEach.call(document.querySelectorAll('select[data-options="' + varName + '"]'), function(selectDom) {
				var optionDom = document.createElement("option");
				optionDom.dataset.reference = blockVar.id;
				optionDom.value = blockVar.name;
				optionDom.innerHTML = blockVar.name;
				selectDom.appendChild(optionDom);
			});
		}

		updateBlockVarType(varName);
	}

	function updateBlockVarType(varName) {
		var vars = blockVars[varName];
		var block;
		vars && vars.forEach(function(blockVar) {
			block = getBlock(blockVar.blockUid);
			blockVar.type = block ? getTypeFromBlock(block) : "";
		});
	}

	function removeBlockVar(block) {
		var varName = block.data.createDynamicContent;
		var vars = blockVars[varName];
		vars.forEach(function(blockVar, index) {
			if (blockVar.blockUid == block.uid) {
				[].forEach.call(document.querySelectorAll('option[data-reference="' + blockVar.id + '"]'), function(optionDom) {
					optionDom.remove();
				});
				vars.splice(index, 1);
				return true;
			}
		});

		updateBlockVarType(varName);
	}

	function isConnectorRoot(connector) {
		return connector.data.type == 'connector-root';
	}

	function isInsideConnectorRoot(block) {
		var topConnector = connectors[block.connectors[0]];
		if (connectors[topConnector.connectedTo]) {
			var connectedWithTopConnector = connectors[topConnector.connectedTo];
			return isConnectorRoot(connectedWithTopConnector) || isInsideConnectorRoot(getBlockByConnector(connectedWithTopConnector.uid));

		} else {
			return false;
		}
	}

	function sameConnectionType(dragBlock, dropBlock, dropConnectorAcceptType) {
		var dragConnectorType = getTypeFromBlock(dragBlock);
		if (typeof(dropConnectorAcceptType) === 'object') {
			dropConnectorAcceptType = getTypeFromDynamicSelect(dropBlock, dropConnectorAcceptType);
		}
		return (dragConnectorType === 'all') || (dropConnectorAcceptType === 'all') || (dragConnectorType === dropConnectorAcceptType);
	}

	function getTypeFromBlock(block) {
		var result;
		switch (block.data.returnType.type) {
			case 'simple':
				result = block.data.returnType.value;
				break;
			case 'fromInput':
				var elementData;
				block.data.content.forEach(function(eleData) {
					if (eleData.blockInputId == block.data.returnType.blockInputId) {
						elementData = eleData;
						return true;
					}
				});
				var connector;
				if(elementData) {
					var c;
					for(var key in ioConnectors) {
						c = ioConnectors[key];
						if (c.blockUid == block.uid && c.data.name == elementData.name) {
							conector = c;
							return true;
						}
					}
				}

				result = (connector && connector.connectedTo) ? getTypeFromBlock(getBlockByConnector(connector.connectedTo, true)) : '';
				break;
			case 'fromDynamicSelect':
				result = getFromDynamicSelectType(block, block.data.returnType.id, block.data.returnType.options);
				break;
			case 'fromSelect':
				result = block.dom.querySelector('[data-content-id="' + block.data.returnType.id + '"]').value;
				break;
		}
		return result;
	}

	function getArgsFromBlock(block) {
		var result = "";
		// while (!block.data.arguments) {
		// 	block = getParent(block, blocks, ioConnectors);
		// }
		// var contentData = _.find(block.data.content[0], {
		// 	blockInputId: block.data.arguments.blockInputId
		// });
		// var connector = _.find(ioConnectors, {
		// 	blockUid: block.uuid,
		// 	data: {
		// 		name: contentData.name
		// 	}
		// });
		// if (connector && connector.connectedTo) {
		// 	var childBlock = getBlockByConnector(connector.connectedTo, blocks, ioConnectors);
		// 	var code = childBlock.getCode();
		// 	result = {
		// 		code: code,
		// 		block: childBlock.uuid,
		// 		funcName: '',
		// 		size: occurrencesInString(code, ',', false) + 1
		// 	};
		// } else {
		// 	result = {
		// 		code: '',
		// 		block: '',
		// 		funcName: '',
		// 		size: 0
		// 	};
		// }
		return result;
	}

	function getTypeFromDynamicSelect(block, acceptType) {
		var tempDom = block.dom.querySelector('select[data-content-id="' + acceptType.id + '"][data-options="' + acceptType.options + '"]');
		if(!tempDom) {
			return "";
		}

		var varName = tempDom.dataset.value || tempDom.value;
		var vars = blockVars[acceptType.options];
		if(!vars) {
			return "";
		}

		var varData;
		vars.forEach(function(_varData) {
			if(_varData.name == varName) {
				varData = _varData;
				return true;
			}
		});

		if (varData) {
			if (acceptType.pointer) {
				varData.type = varData.type.replace(' *', '');
			}
			return varData.type;
		}

		return '';
	}

	function getFromDynamicSelectType(block, id, options) {
		// var attributeValue = block.$block.find('select[data-content-id="' + id + '"][data-dropdowncontent="' + options + '"]').attr('data-value');
		// var selectedValue = block.$block.find('select[data-content-id="' + id + '"][data-dropdowncontent="' + options + '"]').val();
		// var varName = attributeValue || selectedValue;

		// var softVar = _.find(softwareArrays[options], {
		// 	name: varName
		// });
		// if (!softVar) {
		// 	for (var j in componentsArray.sensors) {
		// 		if (componentsArray.sensors[j].name === varName) {
		// 			if (componentsArray.sensors[j].type === 'Joystick' || componentsArray.sensors[j].type === 'LineFollower') {
		// 				return 'float *';
		// 			} else if (componentsArray.sensors[j].type === 'ButtonPad') {
		// 				return 'char';
		// 			} else {
		// 				return 'float';
		// 			}
		// 		}
		// 	}
		// }
		// if (softVar) {
		// 	if (block.data && block.data.returnType && block.data.returnType.pointer) {
		// 		softVar.type = softVar.type.replace(' *', '');
		// 	}
		// 	return softVar.type;
		// }
		return '';
	}

	function getBlockInputConnectors(block) {
		var result = [];
		block.ioConnectors.forEach(function(uid) {
			if (ioConnectors[uid] && ioConnectors[uid].data.type == 'connector-input') {
				result.push(uid);
			}
		});
		return result;
	}

	function getBranchsConnectorsNoChildren(blockUid) {
		var block = blocks[blockUid];
		var result = block.connectors.concat();

		var bottomUid = connectors[block.connectors[1]].connectedTo;
		if (bottomUid) {
			var blockBranchUid = connectors[bottomUid].blockUid;
			result = result.concat(getBranchsConnectorsNoChildren(blockBranchUid));
		}
		return result;
	}

	function getIOConnectorUid(block, contentId) {
		var uid;
		block.ioConnectors.forEach(function(connectorUid) {
			if (ioConnectors[connectorUid].contentId == contentId) {
				uid = connectorUid;
				return true;
			}
		});

		return uid;
	}

	function insertAfter(newDom, targetDom) {
		var parentEl = targetDom.parentNode;
		if (parentEl.lastChild == targetDom) {
			parentEl.appendChild(newDom);
		} else {
			parentEl.insertBefore(newDom, targetDom.nextSibling);
		}
	}

	function getTreeExtreme(uid, connectorPosition) {
		var block = getBlock(uid);
		var connectorUid = block.connectors[connectorPosition];
		var connectedToUid = connectors[connectorUid].connectedTo;
		if (connectedToUid) {
			return getTreeExtreme(connectors[connectedToUid].blockUid, connectorPosition);
		} else {
			return connectorUid;
		}
	}

	function getLastBottomConnectorUid(uid) {
		return getTreeExtreme(uid, 1);
	}

	function getFirstTopConnectorUid(uid) {
		return getTreeExtreme(uid, 0);
	}

	function connectorIsInBranch(connectorUid, uid, tag) {
		var isInBranch = false;
		var i = 0;
		while (!isInBranch && (i < blocks[uid].connectors.length)) {
			if (blocks[uid].connectors[i] === connectorUid) {
				isInBranch = true;
			} else {
				i++;
			}
		}
		i = 0;
		while (!isInBranch && (i < blocks[uid].ioConnectors.length)) {
			if (blocks[uid].ioConnectors[i] === connectorUid) {
				isInBranch = true;
			} else {
				i++;
			}
		}

		var c = tag ? ioConnectors : connectors;
		if (!isInBranch && blocks[uid].connectors[2] && c[blocks[uid].connectors[2]].connectedTo) {
			isInBranch = connectorIsInBranch(connectorUid, c[c[blocks[uid].connectors[2]].connectedTo].blockUid, tag);
		}

		if (!isInBranch && blocks[uid].connectors[1] && c[blocks[uid].connectors[1]].connectedTo) {
			isInBranch = connectorIsInBranch(connectorUid, c[c[blocks[uid].connectors[1]].connectedTo].blockUid, tag);
		}
		return isInBranch;
	}

	function getOutputConnector(block) {
		var uid;
		block.ioConnectors.forEach(function(ioConnectorUid) {
			if (ioConnectors[ioConnectorUid].data.type == "connector-output") {
				uid = ioConnectorUid;
				return true;
			}
		});

		return ioConnectors[uid];
	}

	function getBlockByConnector(uid, tag) {
		var connector = tag ? ioConnectors[uid] : connectors[uid];
		return getBlock(connector.blockUid);
	}

	function isInGroup(dom) {
		var find = false;
		var node = dom;
		while(node && node.tagName != "BODY") {
			if([].indexOf.call(node.classList, "block-group") >= 0) {
				find = true;
				break;
			} else {
				node = node.parentNode;
			}
		}
		
		return find;
	}

	function itsOver(dragConnectorDom, dropConnectorDom, margin) {
		margin = margin || 0;
		var dragRect = dragConnectorDom.getBoundingClientRect();
		var dropRect = dropConnectorDom.getBoundingClientRect();
		return dragRect.left < (dropRect.left + dropRect.width + margin) && (dragRect.left + dropRect.width) > (dropRect.left - margin) && dragRect.top < (dropRect.top + dropRect.height + margin) && (dragRect.top + dropRect.height) > (dropRect.top - margin);
	}

	function isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	function validNumber(number) {
		var temp = number;
		var removedChar = 0;
		var i = 0;
		if (number[0] === '-') {
			temp = number.substring(1);
			i = 1;
		}

		var index = number.indexOf('.');
		while (i < number.length) {
			if ((number[i] === '.' && index < i) || (!isNumeric(number[i]) && number[i] !== '.')) {
				number = number.slice(0, i) + number.slice(i + 1, number.length);
				removedChar += 1;
			} else {
				i++;
			}
		}

		return {
			value: number,
			removedChar: removedChar
		};
	}

	function validString(value) {
		return value.replace(/(^|\b|[^\\])(\\\\)*\\$/g, '$&\\')
			.replace(/(^|\b|[^\\])((\\\\)*\")/g, '$1\\$2')
			.replace(/(^|\b|[^\\])((\\\\)*\/\*)/g, '$1\\$2')
			.replace(/(^|\b|[^\\])((\\\\)*\/\/)/g, '$1\\$2')
			.replace(/\$\'/g, '\$\\\'')
			.replace(/\$\&/g, '\$\\\&');
	}

	function validChar(value) {
		value = value.replace(/\$*/g, '');
		if (/^\\/g.test(value)) {
			if (/^\\([0-7]{1,3}|x[0-9A-F]{1,2}|u[0-9A-F]{1,4})/g.test(value)) {
				value = value.match(/^\\([0-7]{1,3}|x[0-9A-F]{1,2}|u[0-9A-F]{1,4})/g)[0];
			} else if (/^\\[bfnrtv0']/g.test(value)) {
				value = value.substring(0, 2);
			} else if (/^\\[%#!|"@~&?\/()=^`[+\]*,{};.:-]/g.test(value)) {
				value = value.charAt(1);
			} else {
				value = '\\\\';
			}
		} else if (/^(\')/g.test(value)) {
			value = '\\\'';
		} else {
			value = value.charAt(0);
		}

		return value;
	}

	function validComment(value) {
		return value.replace(/\*\//g, '')
			.replace(/\$\'/g, '\$\\\'')
			.replace(/\$\&/g, '\$\\\&');
	}


	function validName(name) {
		if (name && name.length > 0) {
			var i = 0,
				j = 0;
			while (i < name.length) {
				if (!isNaN(parseFloat(name[i]))) {
					name = name.substring(1, name.length);
				} else {
					break;
				}
			}

			i = 0;
			while (i < name.length) {
				if (!isNaN(parseFloat(name[i]))) {
					name = name.substring(1, name.length);
				} else {
					break;
				}
			}
			for (j = 0; j < reservedWords.length; j++) {
				if (name === reservedWords[j]) {
					name += '_';
					break;
				}
			}
		}
		return name;
	}

	function genUid() {
		var d = new Date().getTime();
		var uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
		return uid;
	}

	function clone(data) {
		return JSON.parse(JSON.stringify(data));
	}

	function delayDo(callback, ms) {
		delayTimer && clearTimeout(delayTimer);
		delayTimer = setTimeout(callback, ms);
	}

	function init(_container, _dragContainer) {
		container = _container;
		dragContainer = _dragContainer;
	}

	function loadSchema(_schema) {
		schema = _schema;
	}

	function getSchema() {
		return schema;
	}

	function getBlock(uid) {
		return blocks[uid];
	}

	function createBlock(name) {
		var blockData = clone(schema[name]);
		return new Block(blockData);
	}

	function buildBlock(structure) {
		var blockData = clone(schema[structure.name]);
		blockData = fillBlockData(blockData, structure);
		var block = new Block(blockData);

		structure.content && structure.content.forEach(function(elementData) {
			if (elementData.type != 'block-input') {
				return;
			}

			var connectorUid = getIOConnectorUid(block, elementData.blockInputId);
			var dropContainerDom = block.dom.querySelector('[data-connector-uid="' + connectorUid + '"]');
			var outputBlock = buildBlock(elementData.value);

			ioConnectors[connectorUid].connectedTo = outputBlock.ioConnectors[0];
			ioConnectors[outputBlock.ioConnectors[0]].connectedTo = connectorUid;

			dropContainerDom.appendChild(outputBlock.dom);
		});

		structure.children && structure.children.length && block.dom.classList.add('with-content');


		var dropContainerDom = block.data.type == "group" ? block.dom.querySelector('.group-content') : block.dom.querySelector(".statement-extension-content");
		var lastBottomConnector = block.connectors[2];
		structure.children && structure.children.forEach(function(childStructure) {
			var childBlock = buildBlock(childStructure);

			connectors[lastBottomConnector].connectedTo = childBlock.connectors[0];
			connectors[childBlock.connectors[0]].connectedTo = lastBottomConnector;
			lastBottomConnector = childBlock.connectors[1];

			dropContainerDom.appendChild(childBlock.dom);
		});

		setBlockEnable(block, structure.enable || false);
		block.data.createDynamicContent && updateBlockVar(block);

		return block;
	}

	function resetBlocks() {
		for (var uid in blocks) {
			var block = blocks[uid];
			if (block.connectable || block.data.type == "group") {
				removeBlock(block);
			}
		}

		blockVars = {
			voidFunctions: [],
			returnFunctions: [],
			vars: [],
		};
	}

	function updateDynamicBlocks(groups) {
		var oldBlockVars = blockVars;
		blockVars = {
			voidFunctions: oldBlockVars.voidFunctions,
			returnFunctions: oldBlockVars.returnFunctions,
			vars: oldBlockVars.vars,
		};

		for (var type in groups) {
			var options = groups[type];
			blockVars[type] = options;

			[].forEach.call(document.querySelectorAll('select[data-options="' + type + '"]'), function(selectDom) {
				updateDynamicBlock(selectDom, options);
			});
		}
	}

	function updateDynamicBlock(selectDom, options) {
		var value = selectDom.value;
		var reference = selectDom.dataset.reference;

		updateSelectDom(selectDom, options);

		if (value && reference) {
			options.forEach(function(optionData) {
				if(optionData.id == reference) {
					selectDom.value = optionData.name;
					selectDom.dataset.value = optionData.name;
					selectDom.dataset.reference = optionData.id;
					return true;
				}
			});
		}
	}

	return {
		init: init,

		loadSchema: loadSchema,
		getSchema: getSchema,

		getBlock: getBlock,
		createBlock: createBlock,
		buildBlock: buildBlock,
		resetBlocks: resetBlocks,

		updateDynamicBlocks: updateDynamicBlocks,
	};
});
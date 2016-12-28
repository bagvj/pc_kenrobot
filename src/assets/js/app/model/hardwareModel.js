define(['vendor/jsPlumb'], function() {

	var config = {
		color: '#F1C933',
		colorHover: '#F19833',
		labelColor: 'white',
		font: '14px Microsoft YaHei',
		endpoint: {
			radius: 4,
			color: "#f69c4d",
		}
	};

	var container;
	var dragComponentDom;
	var schema;
	var jsPlumbInstance;
	var boardData;
	var boardDom;
	var containerEvent = new CustomEvent('containerEvent');
	var components = {};
	var usedNames = {};

	function init(_container) {
		container = _container;
		boardDom = container.querySelector(".board");

		jsPlumbInstance = jsPlumb.getInstance();
		jsPlumbInstance.setContainer(container);

		jsPlumbInstance.importDefaults({
			DragOptions: {
				cursor: 'pointer',
				zIndex: 2000
			},
			DropOptions: {
				tolerance: 'touch',
				cursor: 'crosshair',
				hoverClass: 'drop-hover',
				activeClass: 'drag-active'
			},
			Connector: ['Flowchart', {
				cornerRadius: 5,
				alwaysRespectStubs: false,
				midpoint: 1,
				stub: [10, 40],
				gap: 2
			}],
			EndpointStyle: {
				fillStyle: config.color,
				strokeStyle: config.colorHover
			},
			EndpointHoverStyle: {
				fillStyle: config.colorHover
			},
			PaintStyle: {
				fillStyle: config.color,
				strokeStyle: config.color
			},
			HoverPaintStyle: {
				fillStyle: config.colorHover,
				strokeStyle: config.colorHover
			},
			LabelStyle: {
				font: config.font,
				color: config.labelColor,
			},
			MaxConnections: 1
		});
		jsPlumbInstance.registerConnectionTypes({
			'selected': {
				paintStyle: {
					strokeStyle: config.colorHover
				},
				hoverPaintStyle: {
					strokeStyle: config.colorHover
				}
			}
		});
		jsPlumbInstance.registerEndpointTypes({
			'selected': {
				paintStyle: {
					strokeStyle: config.colorHover,
					fillStyle: config.colorHover
				},
				hoverPaintStyle: {
					fillStyle: config.colorHover
				}
			}
		});
		jsPlumbInstance.registerEndpointTypes({
			'connected': {
				paintHoverStyle: {
					fillStyle: config.colorHover
				},
				endpointHoverStyle: {
					fillStyle: config.colorHover
				}
			}
		});

		connectionListeners();

		throttle(window, 'resize', 'optimizedResize');
		window.addEventListener('optimizedResize', function() {
			repaint();
		}, false);

		document.addEventListener("touchend", onDomMouseUp);
		document.addEventListener("mouseup", onDomMouseUp);
	};

	function getSchema() {
		return schema;
	}

	function loadSchema(_schema) {
		schema = {
			boards: {},
			components: {},
		};

		_schema.boards.forEach(function(board) {
			schema.boards[board.name] = board;
		});

		_schema.components.forEach(function(component) {
			schema.components[component.name] = component;
		});
	}

	function setData(data) {
		data = data || {};
		data.board && addBoard(data.board);

		data.components && data.components.forEach(function(componentData) {
			addComponent(componentData, false);
		});

		var connections = data.connections;
		connections && connections.forEach(function(connection) {
			var endpoint = jsPlumbInstance.getEndpoint(connection.sourceUid);
			if (endpoint && endpoint.isFull()) {
				return;
			}

			jsPlumbInstance.connect({
				uuids: [connection.sourceUid, connection.targetUid],
				type: 'automatic'
			});
		});

		repaint();
	}

	function getComponentData(uid) {
		return components[uid];
	}

	function getComponentConfig(name) {
		return schema.components[name];
	}

	function getData() {
		var data = {};
		data.board = boardData && boardData.name || null;

		data.components = [];

		var allConnections = jsPlumbInstance.getAllConnections();
		[].forEach.call(container.querySelectorAll('.component'), function(componentDom) {
			var connections = allConnections.filter(function(connection) {
				return connection.sourceId == componentDom.id || connection.targetId == componentDom.id;
			});
			if (!connections || !connections.length) {
				return
			}

			var endpoints = {};
			jsPlumbInstance.getEndpoints(componentDom).forEach(function(endpoint) {
				endpoints[endpoint.getParameter('pin')] = {
					uid: endpoint.getUuid(),
					type: endpoint.scope
				};
			});

			data.components.push({
				name: componentDom.dataset.name,
				uid: componentDom.dataset.uid,
				x: Math.round(1000 * componentDom.offsetLeft / container.offsetWidth) / 10,
				y: Math.round(1000 * componentDom.offsetTop / container.offsetHeight) / 10,
				endpoints: endpoints,
			});
		});

		data.connections = allConnections.map(function(connection) {
			var connectionParams = connection.getParameters();
			return {
				sourceUid: connectionParams.sourceUid,
				targetUid: connectionParams.targetUid
			};
		});

		return data;
	}

	function repaint() {
		setTimeout(function() {
			try {
				jsPlumbInstance.repaintEverything();
			} catch (e) {
				console.warn('repaint error', e);
			}
		}, 100);
	};

	function addBoard(name) {
		removeBoard();

		boardData = schema.boards[name];
		if(!boardData) {
			return;
		}

		boardDom.classList.add(boardData.name);
		boardDom.style.backgroundImage = "url(" + boardData.imageUrl + ")";
		boardData.pins.forEach(function(pin) {
			var epBoard = jsPlumbInstance.addEndpoint(boardDom, {
				anchor: [pin.x, pin.y, 0, -1, 0, 0],
				endpoint: ['Rectangle', {
					width: pin.rotate ? pin.height : pin.width,
					height: pin.rotate ? pin.width : pin.height,
				}],
				overlays: [
					['Label', {
						label: 'Pin ' + pin.name,
						labelStyle: {
							color: config.labelColor,
							font: config.font,
						},
						location: pin.overlay,
					}]
				],
				parameters: {
					pin: pin.name
				},
				cssClass: 'board-endpoint pin-' + pin.name,
				isTarget: true,
				isSource: false,
				scope: pin.tags.join(" "),
				uuid: pin.uid
			});

			epBoard.unbind('click');
			epBoard.bind('click', onBoardEndpointClick);
		});

		return boardData;
	};

	function removeBoard() {
		removeAllComponents();
		boardData && boardDom.classList.remove(boardData.name);
		jsPlumbInstance.removeAllEndpoints(boardDom);
		boardData = null;

		components = {};
		usedNames = {};
	};

	function addComponent(componentData, redraw) {
		var componentConfig = schema.components[componentData.name];
		if(!componentConfig) {
			return;
		}

		var x = componentData.x;
		var y = componentData.y;
		delete componentData.x;
		delete componentData.y;

		componentData.uid = componentData.uid || jsPlumbUtil.uuid();
		componentData.pins = componentData.pins || {};
		componentData.varName = componentData.varName || genVarName(componentData.name);
		componentData.code = clone(componentConfig.code);
		componentData.type = componentConfig.type;
		usedNames[componentData.varName] = true;

		components[componentData.uid] = componentData;

		var componentDom = document.createElement('img');
		container.appendChild(componentDom);

		componentDom.dataset.name = componentData.name;
		componentDom.dataset.uid = componentData.uid;
		componentDom.classList.add('component');
		componentDom.style.left = x + '%';
		componentDom.style.top = y + '%';
		componentDom.src = componentConfig.imageUrl;
		componentDom.style.width = componentConfig.width + 'px';
		componentDom.style.height = componentConfig.height + 'px';
		componentDom.draggable = false;
		componentDom.addEventListener("touchstart", onComponentMouseDown);
		componentDom.addEventListener("mousedown", onComponentMouseDown);

		[].forEach.call(container.querySelectorAll('.component-endpoint'), function(endpoint) {
			endpoint.classList.remove('selected');
		});

		var endpoints = componentData.endpoints || {};
		componentConfig.pins.forEach(function(pin) {
			var type = pin.tags.join(" ");
			!componentData.endpoints && (endpoints[pin.name] = {
				type: type,
				uid: jsPlumbUtil.uuid()
			});

			componentData.pins[pin.name] = componentData.pins[pin.name] || "";

			var epComponent = jsPlumbInstance.addEndpoint(componentDom, {
				anchor: pin.anchor,
				uuid: endpoints[pin.name].uid,
				parameters: {
					pin: pin.name,
					type: type,
				},
				endpoint: ['Dot', {
					radius: config.endpoint.radius
				}],
				isSource: true,
				isTarget: false,
				cssClass: 'component-endpoint',
				hoverClass: 'component-endpoint--hover',
				connectorStyle: {
					strokeStyle: config.color,
					fillStyle: 'transparent',
					lineWidth: 2,
					joinstyle: 'round',
				},
				connectorHoverStyle: {
					strokeStyle: config.colorHover
				}
			}, {
				scope: type
			});
			epComponent.canvas.classList.add('selected');
			epComponent.unbind('click');
			epComponent.bind('click', onComponentEndpointClick);

			if(!pin.spec) {
				return;
			}

			var epBoardDom = container.querySelector(".board-endpoint.pin-" + pin.spec);
			if(!epBoardDom) {
				return;
			}

			var epBoard = epBoardDom._jsPlumb;
			epBoard.detachAll();
			jsPlumbInstance.connect({
				uuids: [epComponent.getUuid(), epBoard.getUuid()],
				type: "automatic",
			});
		});

		jsPlumbInstance.draggable(componentDom, {
			containment: true,
			consumeStartEvent: false,
		});

		delete componentData.endpoints;
		redraw != false && repaint();

		return componentDom;
	};

	function removeComponent(componentDom) {
		var uid = componentDom.dataset.uid;
		var componentData = getComponentData(uid);
		
		componentDom.removeEventListener("touchstart", onComponentMouseDown);
		componentDom.removeEventListener("mousedown", onComponentMouseDown);

		getConnections(componentDom).forEach(function(connection) {
			connection.setType('removing');
		});
		jsPlumbInstance.detachAllConnections(componentDom);
		jsPlumbInstance.remove(componentDom);

		delete usedNames[componentData.varName];
		delete components[uid];

		onContainerEvent("remove-component", {
			uid: uid,
		});
	};

	function selectComponent(componentDom) {
		[].forEach.call(container.querySelectorAll('.component'), function(_componentDom) {
			_componentDom.classList.remove('selected');
		});
		componentDom.classList.add("selected");
	}

	function disconnectComponent(componentDom) {
		jsPlumbInstance.select({
			source: componentDom.id
		}).detach();
	};

	function disconnectAllComponents() {
		jsPlumbInstance.detachAllConnections(boardDom);
	};

	function removeAllComponents() {
		jsPlumbInstance.deleteEveryEndpoint();
		[].forEach.call(container.querySelectorAll('.component'), function(componentDom) {
			componentDom.removeEventListener("touchstart", onComponentMouseDown);
			componentDom.removeEventListener("mousedown", onComponentMouseDown);
			jsPlumb.remove(componentDom);
		});

		onContainerEvent("remove-all-components");
	};

	function removeSelectedConnection() {
		jsPlumbInstance.getAllConnections().forEach(function(connection) {
			if (connection.hasType('selected')) {
				connection.endpoints.forEach(function(endpoint) {
					endpoint.removeType('selected');
					endpoint.removeClass('selected');
				});
				jsPlumbInstance.detach(connection);
			}
		});
	};

	function unselectAllConnections() {
		jsPlumbInstance.getAllConnections().forEach(function(connection) {
			connection.removeType('selected');
			connection.canvas.classList.remove('selected');
			connection.endpoints.forEach(function(endpoint) {
				endpoint.removeType('selected');
				endpoint.canvas.classList.remove('selected');
			});
		});
	}

	function onComponentMouseDown(e) {
		var componentDom = this;
		dragComponentDom = componentDom;

		unselectAllConnections();

		[].forEach.call(container.querySelectorAll('.component'), function(com) {
			com.classList.remove('selected');
		});

		[].forEach.call(container.querySelectorAll('.component-endpoint'), function(endpoint) {
			endpoint.classList.remove('selected');
		});

		componentDom.classList.add("selected");
		jsPlumbInstance.selectEndpoints({
			source: componentDom
		}).addClass('selected');

		getConnections(componentDom).forEach(selectConnection);
		onContainerEvent("select-component", {
			uid: componentDom.dataset.uid
		});
	}

	function onDomMouseUp(e) {
		if (!dragComponentDom) {
			return;
		}

		dragComponentDom.style.left = ((dragComponentDom.offsetLeft * 100) / container.offsetWidth) + '%';
		dragComponentDom.style.top = ((dragComponentDom.offsetTop * 100) / container.offsetHeight) + '%';
		dragComponentDom = null;
	}

	function connectionListeners() {
		jsPlumbInstance.unbind('click');
		jsPlumbInstance.unbind('connection');
		jsPlumbInstance.unbind('connectionDetached');

		jsPlumbInstance.bind('connection', function(connection) {
			connection.connection.bind('click', function(c) {
				unselectAllConnections();
				selectConnection(c);
			});

			connection.targetEndpoint.setType('connected');
			connection.sourceEndpoint.setType('connected');

			connection.connection.setParameters({
				sourceUid: connection.sourceEndpoint.getUuid(),
				targetUid: connection.targetEndpoint.getUuid()
			});

			if([].indexOf.call(connection.target.classList, 'board') >= 0) {
				var componentUid = connection.source.dataset.uid;
				var componentData = components[componentUid];
				var sourcePin = connection.sourceEndpoint.getParameter('pin');
				var targetPin = connection.targetEndpoint.getParameter('pin');
				componentData.pins[sourcePin] = targetPin;
			}
		});

		jsPlumbInstance.bind('connectionDetached', function(connection) {
			unselectConnection(connection.connection);
			connection.connection.unbind('click');
			connection.targetEndpoint.removeType('connected');
			connection.sourceEndpoint.removeType('connected');

			if([].indexOf.call(connection.target.classList, 'board') >= 0) {
				var componentUid = connection.source.dataset.uid;
				var componentData = components[componentUid];
				var sourcePin = connection.sourceEndpoint.getParameter('pin');
				delete componentData.pins[sourcePin];
			}
		});

		jsPlumbInstance.bind('connectionMoved', function(connection) {
			connection.originalTargetEndpoint.removeType('selected');
			connection.originalTargetEndpoint.removeClass('selected');
			connection.originalTargetEndpoint.removeClass('endpointDrag');
		});
	}

	function onBoardEndpointClick(endpoint) {
		if (endpoint.hasType('selected')) {
			return false;
		}
		jsPlumbInstance.getAllConnections().forEach(function(connection) {
			connection.removeType('selected');
			connection.endpoints.forEach(function(ep) {
				ep.removeType('selected');
			});
		});

		endpoint.connections.forEach(function(connection) {
			connection.setType('selected');
			connection.endpoints.forEach(function(ep) {
				ep.setType('selected');
			});
		});
	}

	function onComponentEndpointClick(endpoint) {
		endpoint.canvas.classList.add('selected');
		unselectAllConnections();

		if (endpoint.hasType('selected')) {
			return false;
		}

		endpoint.connections.forEach(selectConnection);
	}

	function selectConnection(connection) {
		if (connection.hasType('selected')) {
			return false;
		}

		connection.setType('selected');
		connection.canvas.classList.add('selected');
		connection.endpoints.forEach(function(endpoint) {
			endpoint.setType('selected');
			endpoint.canvas.classList.add('selected');
		});
	}

	function unselectConnection(connection) {
		connection.removeType('selected');
		connection.canvas.classList.remove('selected');
		connection.endpoints.forEach(function(endpoint) {
			endpoint.removeType('selected');
			endpoint.canvas.classList.remove('selected');
		});
	}

	function getConnections(componentDom) {
		return jsPlumbInstance.getAllConnections().filter(function(connection) {
			return connection.sourceId == componentDom.id || connection.targetId == componentDom.id;
		});
	}

	function throttle(target, type, name) {
		var running = false;
		var func = function() {
			if (running) {
				return;
			}
			running = true;
			requestAnimationFrame(function() {
				target.dispatchEvent(new CustomEvent(name));
				running = false;
			});
		};
		target.addEventListener(type, func);
	};

	function genVarName(name) {
		var varName = null;
		var tempName;
		var i = 0;
		while(!varName) {
			tempName = name + "_" + i;
			!usedNames[tempName] && (varName = tempName);
			i++;
		}

		return varName;
	}

	function onContainerEvent(action, data) {
		containerEvent.action = action;
		containerEvent.data = data;
		container.dispatchEvent(containerEvent);
	}

	function clone(data) {
		return JSON.parse(JSON.stringify(data));
	}

	return {
		init: init,

		getSchema: getSchema,
		loadSchema: loadSchema,

		repaint: repaint,

		getData: getData,
		setData: setData,
		getComponentData: getComponentData,
		getComponentConfig: getComponentConfig,

		addBoard: addBoard,
		removeBoard: removeBoard,

		addComponent: addComponent,
		removeComponent: removeComponent,
		selectComponent: selectComponent,

		disconnectComponent: disconnectComponent,
		disconnectAllComponents: disconnectAllComponents,
		removeAllComponents: removeAllComponents,

		removeSelectedConnection: removeSelectedConnection,
		unselectAllConnections: unselectAllConnections,
	}
});
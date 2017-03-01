define(['vendor/jquery', 'vendor/perfect-scrollbar', 'app/util/emitor', 'app/util/util'], function($1, $2, emitor, util) {

	var monitorRegion;
	var newlines;
	var baudRates;
	var output;

	var lastPortId;
	var lastComName;
	var autoScroll;
	var buffer;

	function init() {
		monitorRegion = $('.monitor').on('click', '.close-btn', onCloseClick).on('click', '.send', onSendClick).on('click', '.switch', onSwitchClick).on('click', '.clear', onClearClick).on('click', '.open', onOpenClick);
		monitorRegion.find(".auto-scroll").on("change", onAutoScrollChange);
		monitorRegion.find('.command').on('keyup', onCommandEnter);
		output = monitorRegion.find(".output");

		newlines = monitorRegion.find(".newlines").on('click', '.placeholder', onShowNewlinesSelect).on('click', 'ul > li', onNewlinesSelectClick);
		baudRates = monitorRegion.find(".baud-rates").on('click', '.placeholder', onShowBaudRatesSelect).on('click', 'ul > li', onBaudRatesSelectClick);

		emitor.on('monitor', 'toggle', onToggle);
		kenrobot.on("app:onSerialPortData", onSerialPortData).on("app:onSerialPortError", onSerialPortError).on("app:onSerialPortClose", onSerialPortClose);

		newlines.find('> ul > li[data-value="raw"]').click();
		baudRates.find('> ul > li[data-value="9600"]').click();
	}

	function onCloseClick(e) {
		onToggle(false);
		emitor.trigger('monitor', 'close');
	}

	function onToggle(visible) {
		if (visible == false || monitorRegion.hasClass("active")) {
			monitorRegion.removeClass("x-fadeIn").addClass("x-fadeOut").delay(300, "fadeOut").queue("fadeOut", function() {
				monitorRegion.removeClass("active").removeClass("x-fadeOut");
			});
			monitorRegion.dequeue("fadeOut");

			lastPortId && kenrobot.postMessage("app:closeSerialPort", lastPortId)
		} else {
			monitorRegion.addClass("active").addClass("x-fadeIn").delay(300, "fadeIn").queue("fadeIn", function() {
				monitorRegion.addClass("x-in");
			});
			monitorRegion.dequeue("fadeIn");
		}
	}

	function onAutoScrollChange(e) {
		autoScroll = $(this).prop("checked")
	}

	function openSerialport(port) {
		var baudRate = parseInt(baudRates.data("value"))
		var newline = newlines.data("value")

		kenrobot.postMessage("app:openSerialPort", port.comName, {
			baudRate: baudRate,
			parser: newline,
		}).then(function(portId) {
			lastPortId = portId;
			lastComName = port.comName;

			monitorRegion.find(".titlebar .suffix").text(" - " + port.comName + (port.boardName ? "(" + port.boardName + ")" : ""));
			monitorRegion.find(".open").val("关闭串口");
			monitorRegion.find(".command").focus();

			util.message("串口打开成功");
		}, function(err) {
			util.message({
				text: "串口打开失败",
				type: "error"
			});
		});
	}

	function onSerialPortData(portId, data) {
		if (!lastPortId || portId != lastPortId) {
			return
		}

		if (data instanceof Buffer) {
			data = data.toString().replace(/\r\n/g, '\n');
		}

		if (data == "") {
			return
		}

		output.val(output.val() + data);
		if (autoScroll) {
			output.scrollTop(output[0].scrollHeight);
		}
	}

	function onSerialPortError(portId, err) {
		util.message({
			text: "串口错误",
			type: "error",
		});
	}

	function onSerialPortClose(portId) {
		lastPortId = null;
		monitorRegion.find(".titlebar .suffix").text("");
		monitorRegion.find(".open").val("打开串口");

		util.message("串口关闭成功");
	}

	function onClearClick(e) {
		output.val("");
	}

	function onOpenClick(e) {
		if (!lastPortId) {
			kenrobot.postMessage("app:getSerialPorts").then(function(ports) {
				if (ports.length == 1) {
					openSerialport(ports[0]);
				} else {
					emitor.trigger("port", "show", {
						ports: ports,
						selected: lastComName,
						callback: function(port) {
							openSerialport(port);
						}
					});
				}
			}, function(err) {
				util.message({
					text: "找不到串口",
					type: "warning"
				});
			});
		} else {
			kenrobot.postMessage("app:closeSerialPort", lastPortId);
		}
	}

	function onCommandEnter(e) {
		e.keyCode == 13 && onSendClick()
	}

	function onSendClick(e) {
		var command = monitorRegion.find(".command").val()
		if (!command) {
			return
		}

		if (!lastPortId) {
			util.message({
				text: "串口未连接",
				type: "warning",
			});
			return
		}

		kenrobot.postMessage("app:writeSerialPort", lastPortId, command).then(function(){
			console.log("send to " + lastPortId + ": " + command);
		}, function(err) {
			util.message({
				text: "发送失败",
				type: "warning",
			});
		});

		monitorRegion.find(".command").val("");
	}

	function onSwitchClick(e) {

	}

	function onShowNewlinesSelect(e) {
		newlines.toggleClass("active");
		return false;
	}

	function onNewlinesSelectClick(e) {
		var li = $(this);
		var newline = li.data("value");
		newlines.removeClass("active").find(".placeholder").html(li.html());
		newlines.data("value", newline);
		util.toggleActive(li);
	}

	function onShowBaudRatesSelect(e) {
		baudRates.toggleClass("active");
		return false;
	}

	function onBaudRatesSelectClick(e) {
		var li = $(this);
		var baudRate = li.data("value");
		baudRates.removeClass("active").find(".placeholder").html(li.html());
		baudRates.data("value", baudRate);
	}

	return {
		init: init,
	}
});
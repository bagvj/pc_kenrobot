define(['vendor/jquery', 'vendor/draggabilly', 'vendor/simbuino/simbuino', 'vendor/simbuino/module/UnoIO', 'vendor/simbuino/core/SPI', 'vendor/simbuino/module/Lcd', 'vendor/simbuino/module/Lcd12864', 'app/common/util/util', 'app/common/util/emitor'], function($1, Draggabilly, simbuino, UnoIO, SPI, Lcd, Lcd12864, util, emitor) {
	var dialogWin;
	var canvasWrap;

	function init() {
		dialogWin = $('.lcd').on("click", ".x-float-close", onClose);
		canvasWrap = dialogWin.find(".canvas-wrap");

		new Draggabilly(dialogWin[0], {
			containment: ".content-region",
		}).on("dragEnd", onDragEnd);

		simbuino.init();
		Lcd12864.init(canvasWrap.find(".ssd1306")[0]);
		Lcd.init(canvasWrap.find(".nokia5110")[0]);

		kenrobot.on('lcd', 'show', onShow, {canReset: false}).on("lcd", "upload", onUpload, {canReset: false});

	}

	function load(hex) {
		try {
			simbuino.loadHex(hex);
			simbuino.start();

			util.message("仿真成功");
		} catch(e) {
			reset();

			util.message({
				text: "仿真失败",
				type: "error"
			});
		}
	}

	function reset() {
		simbuino.stop();
		Lcd12864.reset();
		Lcd.reset();
	}

	function onShow() {
		dialogWin.addClass("active");
		reset();
	}

	function onClose() {
		dialogWin.removeClass("active").attr("style", null);
		reset();
	}

	function onUpload(hex, options) {
		onShow();

		if(options.type == "ssd1306") {
			util.toggleActive(canvasWrap.find(".ssd1306"));

			SPI.config({
				SCLK: UnoIO.getPort(options.SCK),
				SDIN: UnoIO.getPort(options.SDA),
			});
			Lcd12864.config({
				RESET: UnoIO.getPort(options.RES),
				DC: UnoIO.getPort(options.DC),
				CS: UnoIO.getPort(options.CS),
			});

			load(hex);
		} else if(options.type == "nokia5110") {
			util.toggleActive(canvasWrap.find(".nokia5110"));

			SPI.config({
				SCLK: UnoIO.getPort("13"),
				SDIN: UnoIO.getPort("11"),
			});
			Lcd.config({
				RESET: UnoIO.getPort(options.RST),
				DC: UnoIO.getPort(options.DC),
				CS: UnoIO.getPort(options.CE),
			});

			load(hex);
		} else {
			canvasWrap.find(".canvas").removeClass("active");

			util.message({
				text: "暂不支持",
				type: "warning"
			});
		}
	}

	function onDragEnd(e, pointer) {
		dialogWin.css("transform", "initial");
	}

	return {
		init: init,
	};
});

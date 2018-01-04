define(['vendor/jquery', 'vendor/draggabilly', 'vendor/simbuino/simbuino', 'vendor/simbuino/module/UnoIO', 'vendor/simbuino/core/SPI', 'vendor/simbuino/module/Lcd', 'vendor/simbuino/module/Lcd12864', 'app/common/util/util', 'app/common/util/emitor'], function($1, Draggabilly, simbuino, UnoIO, SPI, Lcd, Lcd12864, util, emitor) {
	var dialogWin;

	function init() {
		dialogWin = $('.lcd').on("click", ".x-float-close", onClose);
		var draggable = new Draggabilly(dialogWin[0], {
			containment: ".content-region",
		});

		simbuino.init();
		Lcd12864.init(dialogWin.find("canvas")[0]);

		kenrobot.on('lcd', 'show', onShow, {canReset: false}).on("lcd", "upload", onUpload, {canReset: false});
	}

	function onShow() {
		dialogWin.addClass("active");
	}

	function onClose() {
		dialogWin.removeClass("active").attr("style", null);

		simbuino.stop();
		Lcd12864.reset();
	}

	function onUpload(hex, options) {
		onShow();

		options = options || {
			SCK: "10",
			SDA: "9",
			RES: "13",
			DC: "11",
			CS: "12",
		};

		simbuino.stop();
		Lcd12864.reset();

		SPI.config({
			SCLK: UnoIO.getPort(options.SCK),
			SDIN: UnoIO.getPort(options.SDA),
		});
		Lcd12864.config({
			RESET: UnoIO.getPort(options.RES),
			DC: UnoIO.getPort(options.DC),
			CS: UnoIO.getPort(options.CS),
		});

		try {
			simbuino.loadHex(hex);
			simbuino.start();

			util.message("上传成功");
		} catch(e) {
			simbuino.stop();
			Lcd12864.reset();

			util.message({
				text: "上传失败",
				type: "error"
			});
		}
	}

	return {
		init: init,
	};
});

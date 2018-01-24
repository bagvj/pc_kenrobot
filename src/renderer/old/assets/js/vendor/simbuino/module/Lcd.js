define(['../core/AtmelContext', '../core/AtmelIO', '../core/SPI'], function(AtmelContext, AtmelIO, SPI) {
	var Lcd = {
		init: function(canvas, config) {
			var self = this;

			this.Width = canvas.width;
			this.Height = canvas.height;
			this.Context = canvas.getContext("2d");
			this.Context.imageSmoothingEnabled = false;
			this.Image = this.Context.getImageData(0, 0, this.Width, this.Height);

			this.Pixels = []
			this.ImageChanged = [];
			this.PropertyChanged = [];
			this.LastRefresh = 0;

			this.CurrentX = 0;
			this.CurrentY = 0;
			this.ExtendedMode = false;

			this.lcdOnResetChangedHandler = function(oldVal, newVal) {
				self.Lcd_OnResetChanged(oldVal, newVal);
			};

			this.spiOnReceivedByteHandler = function(val) {
				self.spi_OnReceivedByte(val);
			}

			this.reset();
		},

		reset: function() {
			this.Pixels = [];
			var num_pixels = this.Width * this.Height;
			for (var i = 0; i < num_pixels; i++)
				this.Pixels[i] = 0;
			this.LastRefresh = 0;
			this.LcdBackground = {
				R: 0x8f,
				G: 0xa7,
				B: 0x9a
			};
			this.LcdForeground = {
				R: 0x40,
				G: 0x40,
				B: 0x40
			};
			this.LcdBacklight = {
				R: 0xce,
				G: 0xdd,
				B: 0xe7
			};
			this.LcdCurrentBacklight = {
				R: 0,
				G: 0,
				B: 0
			};
			this.Refresh(true);
		},

		config: function(options) {
			var self = this;

			if(this.RESET_PORT) {
				var callbacks = this.RESET_PORT.WriteRegister.get().OnRegisterChanged;
				var index = callbacks.indexOf(this.lcdOnResetChangedHandler);
				if(index >= 0) {
					callbacks.splice(index, 1);
				}
			}

			this.DC_PORT = options.DC.port;
			this.DC_BIT = options.DC.bit;
			this.SCE_PORT = options.CS.port;
			this.SCE_BIT = options.CS.bit;
			this.RESET_PORT = options.RESET.port;
			this.RESET_BIT = options.RESET.bit;

			this.RESET_PORT.WriteRegister.get().OnRegisterChanged.push(this.lcdOnResetChangedHandler);

			SPI.OnReceivedByte.indexOf(this.spiOnReceivedByteHandler) < 0 && SPI.OnReceivedByte.push(this.spiOnReceivedByteHandler);
		},

		Lcd_OnResetChanged: function(oldVal, newVal) {
			var changed = oldVal ^ newVal;
			if ((changed & (1 << this.RESET_BIT)) == 0)
				return;
			if ((newVal & (1 << this.RESET_BIT)) == 0)
				return;
			this.CurrentX = 0;
			this.CurrentY = 0;
			this.ExtendedMode = false;
			for (var i = 0; i < this.Pixels.length; i++)
				this.Pixels[i] = 0;
		},

		SetPixel: function(x, y, color) {
			var offset = y * this.Width + x;
			if (color == 0)
				this.Pixels[offset] = 0;
			else
				this.Pixels[offset] = 255;
		},

		Refresh: function(force) {
			var elapsed = AtmelContext.Clock - this.LastRefresh;
			if (!force) {
				if (elapsed < AtmelProcessor.ClockSpeed / 30)
					return;
				if (elapsed == 0)
					return;
			}
			this.CalculateBacklight();
			this.LastRefresh = AtmelContext.Clock;
			this.CreateImage();
		},

		CalculateBacklight: function() {
			var level = 0;
			var TCCR0A = AtmelContext.RAM[AtmelIO.TCCR0A].get();
			if ((TCCR0A & (1 << AtmelIO.COM0B1)) != 0) {
				// pwm
				level = AtmelContext.RAM[AtmelIO.OCR0B].get();
			} else {
				// digital
				if ((AtmelContext.D.WriteRegister.get().get() & 0x20) != 0)
					level = 255;
				else
					level = 0;
			}

			this.LcdCurrentBacklight.R = Math.floor(this.LcdBackground.R + level * (this.LcdBacklight.R - this.LcdBackground.R) / 255);
			this.LcdCurrentBacklight.G = Math.floor(this.LcdBackground.G + level * (this.LcdBacklight.G - this.LcdBackground.G) / 255);
			this.LcdCurrentBacklight.B = Math.floor(this.LcdBackground.B + level * (this.LcdBacklight.B - this.LcdBackground.B) / 255);
		},

		spi_OnReceivedByte: function(data) {
			// make sure the Lcd is currently enabled
			if ((this.SCE_PORT.WriteRegister.get().get() & (1 << this.SCE_BIT)) != 0)
				return;

			// what did we just receive?
			if ((this.DC_PORT.WriteRegister.get().get() & (1 << this.DC_BIT)) != 0) {
				// D/C is set to data, store this byte in display memory and advance the ptr
				for (var i = 0; i < 8; i++)
					this.SetPixel(this.CurrentX, this.CurrentY * 8 + i, (data >> i) & 1);
				this.CurrentX++;
				if (this.CurrentX >= this.Width) {
					this.CurrentX = 0;
					this.CurrentY++;
					if (this.CurrentY >= this.Height / 8) {
						// sent the last byte to the screen, force an update
						this.CurrentY = 0;
						this.Refresh(true);
					}
				}
			} else if (data == 0x00) {
				// nop
			} else if ((data & 0xf8) == 0x20) {
				// function set
				this.ExtendedMode = (data & 1) != 0;
			} else if (!this.ExtendedMode) {
				// H == 0
				if ((data & 0xf8) == 0x40)
					this.CurrentY = Math.min(data & 7, this.Height - 1);
				else if ((data & 0x80) == 0x80)
					this.CurrentX = Math.min(data & 0x7f, this.Width - 1);
			} else {
				// H == 1
			}
		},

		CreateImage: function() {
			var backR = this.LcdCurrentBacklight.R;
			var backG = this.LcdCurrentBacklight.G;
			var backB = this.LcdCurrentBacklight.B;
			var foreR = this.LcdForeground.R;
			var foreG = this.LcdForeground.G;
			var foreB = this.LcdForeground.B;
			var pixels = this.Pixels;
			var num_pixels = this.Width * this.Height;
			var src = 0;
			var dst = 0;
			var data = this.Image.data;
			for (var i = 0; i < num_pixels; i++) {
				if (pixels[src++]) {
					data[dst++] = foreR;
					data[dst++] = foreG;
					data[dst++] = foreB;
				} else {
					data[dst++] = backR;
					data[dst++] = backG;
					data[dst++] = backB;
				}
				data[dst++] = 255;
			}
			this.Context.putImageData(this.Image, 0, 0);
		}
	}

	return Lcd;
});

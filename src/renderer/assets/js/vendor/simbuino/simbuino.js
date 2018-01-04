define(['./core/AtmelContext', './core/AtmelIO', './core/Bootloader', './core/Loader', './core/HexDecoder', './core/AtmelProcessor', './core/USART', './core/SPI', './core/ADC', './core/EEPROM', './core/AtmelFlagsRegister', './core/PortRegister', './core/IndirectAddressRegister', './core/MemoryMappedRegister', './core/ObservableRegister', './core/MemoryMappedWordRegister'], function(AtmelContext, AtmelIO, Bootloader, Loader, HexDecoder, AtmelProcessor, USART, SPI, ADC, EEPROM, AtmelFlagsRegister, PortRegister, IndirectAddressRegister, MemoryMappedRegister, ObservableRegister, MemoryMappedWordRegister) {
	function range(start, count) {
		if (arguments.length == 1) {
			count = start;
			start = 0;
		}
		var foo = [];
		for (var i = 0; i < count; i++) {
			foo.push(0);
		}
		return foo;
	}

	var simbuino = {
		doReset: function() {
			for (var i = 0; i < AtmelContext.RAM.length; i++)
				AtmelContext.RAM[i].Reset();
			AtmelContext.PC = 0;
			AtmelContext.Clock = 0;
			AtmelContext.Timer0 = 0;
			AtmelContext.Timer1 = 0;
			AtmelContext.InterruptPending = false;
			AtmelContext.Timer0OutputCompareFlag = false;
			AtmelContext.Timer1OutputCompareFlag = false;
			AtmelContext.Timer1OverflowFlag = false;
			AtmelContext.LastTimerUpdate = 0;
			AtmelContext.NextTimerEvent = 0;
			AtmelContext.UDRE_InterruptPending = false;
			AtmelContext.SPI_InterruptPending = false;

			this.loaded = false;
		},

		invalidateTimers: function(oldVal, newVal) {
			if (oldVal != newVal)
				AtmelContext.NextTimerEvent = AtmelContext.Clock;
		},

		UpdateInterruptFlags: function() {
			AtmelContext.InterruptPending = false;
			AtmelContext.UDRE_InterruptPending = false;
			AtmelContext.SPI_InterruptPending = false;

			// if the data transmit register is set and interrupts are enabled then trigger a USART interrupt
			if ((USART.UCSR0A.get_bit(AtmelIO.TXC0) != 0) && (USART.UCSR0B.get_bit(AtmelIO.UDRIE0) != 0) && (SREG.I.get() == 0))
				AtmelContext.UDRE_InterruptPending = true;

			// if transfer complete flag is set and interrupts are enabled then trigger an SPI interrupt
			if ((SPI.SPSR.get_bit(AtmelIO.SPIF) != 0) && (SPI.SPCR.get_bit(AtmelIO.SPIE) != 0) && (SREG.I.get() == 0))
				AtmelContext.SPI_InterruptPending = true;

			// coalesce all interrupt flags into one so that we don't have to check them all in the inner loop
			AtmelContext.InterruptPending |=
				AtmelContext.UDRE_InterruptPending |
				AtmelContext.SPI_InterruptPending |
				AtmelContext.Timer0OutputCompareFlag |
				AtmelContext.Timer1OutputCompareFlag |
				AtmelContext.Timer1OverflowFlag;
		},

		doUpdate: function() {
			if (!this.loaded || this.paused) {
				return;
			}

			var lastCycle = AtmelContext.Clock + this.CyclesPerFrame;
			AtmelProcessor.RunTo(lastCycle);
			// this.NumFrames++;
			// var currentTime = new Date().getTime();
			// var elapsed = (currentTime - this.StartTime) / 1000;
			// if (elapsed >= 1) {
			// 	this.StartTime = currentTime;
			// 	this.NumFrames = 0;
			// }
		},

		init: function() {
			var self = this;
			AtmelContext.Flash = range(0, AtmelProcessor.FlashSize);
			for (var i = 0; i < AtmelProcessor.EEPROMSize; i++)
				AtmelContext.EEPROM[i] = 255;
			AtmelContext.R = range(0, AtmelContext.NumRegs + AtmelContext.NumIO + AtmelContext.RAMSize);
			var mappedR = [];
			for (var addr = 0; addr < AtmelContext.NumRegs; addr++)
				mappedR[addr] = new MemoryMappedRegister(addr);
			AtmelContext.IO = [];
			for (var addr = 0; addr < AtmelContext.NumIO; addr++)
				AtmelContext.IO[addr] = new ObservableRegister(AtmelContext.FirstIO + addr);
			AtmelContext.SREG = AtmelFlagsRegister;
			AtmelContext.IO[(AtmelFlagsRegister.FlagsIndex - AtmelContext.FirstIO)] = AtmelContext.SREG;
			var sram = [];
			for (var addr = 0; addr < AtmelContext.RAMSize; addr++)
				sram[addr] = new MemoryMappedRegister(AtmelContext.FirstSRAM + addr);

			AtmelContext.RAM = [];
			for (var i = 0; i < mappedR.length; i++)
				AtmelContext.RAM.push(mappedR[i]);
			for (var i = 0; i < AtmelContext.IO.length; i++)
				AtmelContext.RAM.push(AtmelContext.IO[i]);
			for (var i = 0; i < sram.length; i++)
				AtmelContext.RAM.push(sram[i]);

			// general purpose registers
			AtmelContext.B = new PortRegister(0x23, 0x25, 0x24);
			AtmelContext.C = new PortRegister(0x26, 0x28, 0x27);
			AtmelContext.D = new PortRegister(0x29, 0x2b, 0x2a);
			AtmelContext.X = new IndirectAddressRegister(26);
			AtmelContext.Y = new IndirectAddressRegister(28);
			AtmelContext.Z = new IndirectAddressRegister(30);
			AtmelContext.SP = new MemoryMappedWordRegister(0x5d);
			EEPROM.Clear();

			// timer states have to be re-evaluated whenever any of their control variables are changed
			AtmelContext.RAM[AtmelIO.CLKPR].OnRegisterChanged.push(function(oldVal, newVal) {
				self.invalidateTimers(oldVal, newVal);
			});
			AtmelContext.RAM[AtmelIO.TCCR0A].OnRegisterChanged.push(function(oldVal, newVal) {
				self.invalidateTimers(oldVal, newVal);
			});
			AtmelContext.RAM[AtmelIO.TCCR0B].OnRegisterChanged.push(function(oldVal, newVal) {
				self.invalidateTimers(oldVal, newVal);
			});
			AtmelContext.RAM[AtmelIO.TCNT1H].OnRegisterChanged.push(function(oldVal, newVal) {
				self.invalidateTimers(oldVal, newVal);
			});
			AtmelContext.RAM[AtmelIO.TCNT1L].OnRegisterChanged.push(function(oldVal, newVal) {
				self.invalidateTimers(oldVal, newVal);
			});
			AtmelContext.RAM[AtmelIO.TCCR1A].OnRegisterChanged.push(function(oldVal, newVal) {
				self.invalidateTimers(oldVal, newVal);
			});
			AtmelContext.RAM[AtmelIO.TCCR1B].OnRegisterChanged.push(function(oldVal, newVal) {
				self.invalidateTimers(oldVal, newVal);
			});

			AtmelProcessor.Init(this.UpdateInterruptFlags);
			SPI.Init(this.UpdateInterruptFlags);
			USART.Init(this.UpdateInterruptFlags);
			ADC.Init();
			EEPROM.Init();
			HexDecoder.Decode(Bootloader);

			this.setFrameRate(60);

			return this;
		},

		start: function() {
			// this.NumFrames = 0;
			// this.StartTime = new Date().getTime();

			var self = this;
			this.isRunning = true;
			clearInterval(this.updateTimer);
			this.updateTimer = setInterval(function() {
				self.doUpdate();
			}, 1000 / AtmelContext.FrameRate);

			return this;
		},

		pause: function() {
			this.paused = true;
			clearInterval(this.updateTimer);

			return this;
		},

		resume: function() {
			this.paused = false;
			this.start();

			return this;
		},

		stop: function() {
			this.paused = false;
			this.isRunning = false;
			clearInterval(this.updateTimer);

			return this;
		},

		setFrameRate: function(frameRate) {
			AtmelContext.FrameRate = frameRate;
			this.CyclesPerFrame = Math.floor(AtmelProcessor.ClockSpeed / AtmelContext.FrameRate);

			return this;
		},

		loadHex: function(firmware) {
			var isRunning = this.isRunning;
			this.stop();
			this.doReset();

			firmware = firmware ? firmware.replace(/\r/g, '').split('\n') : this.firmware;
			if (firmware) {
				try {
					HexDecoder.Decode(Bootloader);
					this.loaded = HexDecoder.Decode(firmware);
					AtmelProcessor.InitInstrTable();
					this.firmware = firmware;
					isRunning && this.start();
				} catch (e) {
					console.dir(e);
				}
			}

			return this;
		},

		loadBootloader: function() {
			var isRunning = this.isRunning;
			this.stop();
			this.doReset();

			try {
				this.loaded = HexDecoder.Decode(Bootloader);
				AtmelProcessor.InitInstrTable();
				AtmelProcessor.PC = AtmelProcessor.BootloaderAddr;
				isRunning && this.start();
			} catch (e) {}

			return this;
		},

		loadLoader: function() {
			var isRunning = this.isRunning;
			this.stop();
			this.doReset();

			try {
				HexDecoder.Decode(Bootloader);
				this.loaded = HexDecoder.Decode(Loader);
				AtmelProcessor.InitInstrTable();
				isRunning && this.start();
			} catch (e) {}

			return this;
		},
	}

	return simbuino;
});

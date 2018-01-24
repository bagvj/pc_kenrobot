define(function() {
	// AtMega328P context (i.e. current state).
	var AtmelContext = {
		Flash: [],
		EEPROM: [],
		RAM: [],
		PC: 0,
		Clock: 0,
		Flags: 0,
		FrameRate: 60,

		InterruptPending: false,
		Timer0: 0,
		Timer0OutputCompareFlag: false,
		Timer1: 0,
		Timer1OutputCompareFlag: false,
		Timer1OverflowFlag: false,
		LastTimerUpdate: 0,
		NextTimerEvent: 0,
		UDRE_InterruptPending: false,
		SPI_InterruptPending: false,


		// general register file mapped from 0x00 to 0x1f
		FirstReg: 0x00,
		NumRegs: 32,

		// regular I/O from 0x20 to 0x5f and extended I/O from 0x60-0xff
		FirstIO: 0x20,
		NumIO: 224,

		// main SRAM
		FirstSRAM: 0x100,
		RAMSize: 2 * 1024,

		// some registers cause hardware changes when simply read e.g. reading SPDR clears the SPIF flag.
		// this flag is used to disable such changes so that code like the display update can access those
		// registers without inadvertently modifying the context state.
		Active: true,

		R: 0,
		IO: [],
		SREG: null,
		B: null,
		C: null,
		D: null,
		X: null,
		Y: null,
		Z: null,
		SP: null,
	};

	return AtmelContext;
});
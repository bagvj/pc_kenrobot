define(['vendor/class', './AtmelContext'], function(Class, AtmelContext) {
	var IndirectAddressRegister = Class({
		constructor: function(index) {
			this.Index = index;
		},

		type: "IndirectAddressRegister",

		Reset: function() {
			this.set(0);
		},

		get: function() {
			var lo = AtmelContext.RAM[this.Index].get();
			var hi = AtmelContext.RAM[(this.Index + 1)].get();
			return lo | (hi << 8);
		},

		set: function(value) {
			AtmelContext.RAM[this.Index].set(value & 0xff);
			AtmelContext.RAM[this.Index + 1].set(value >> 8);
		},

		get_bit: function(index) {
			return ((this.get() >> index) & 1);
		},

		set_bit: function(index, value) {
			if (value == 0)
				set((get() & ~(1 << index)));
			else
				set((get() | (1 << index)));
		}
	});

	return IndirectAddressRegister;
});
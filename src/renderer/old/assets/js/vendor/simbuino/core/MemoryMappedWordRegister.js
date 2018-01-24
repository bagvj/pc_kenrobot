define(['vendor/class', './AtmelContext'], function(Class, AtmelContext) {
	var MemoryMappedWordRegister = Class({
		constructor: function(index) {
			this.Index = index;
		},

		type: "MemoryMappedWordRegister",

		Reset: function() {
			this.set(0);
		},

		get: function() {
			var lo = AtmelContext.R[this.Index];
			var hi = AtmelContext.R[this.Index + 1];
			return (lo | (hi << 8));
		},

		set: function(value) {
			AtmelContext.R[this.Index] = value & 0xff;
			AtmelContext.R[this.Index + 1] = (value >> 8) & 0xff;
		},

		get_bit: function(index) {
			return ((this.get() >> index) & 1);
		},

		set_bit: function(index, value) {
			if (value == 0)
				this.set((this.get() & ~(1 << index)));
			else
				this.set((this.get() | (1 << index)));
		}
	});

	return MemoryMappedWordRegister;
});
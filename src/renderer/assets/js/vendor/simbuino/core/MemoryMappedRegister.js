define(['vendor/class', './AtmelContext'], function (Class, AtmelContext) {
	// this is a memory-mapped register class that is used mainly to provide change notification for when a register changes,
	// it's needed by devices (LCD etc) that need to know when a memory location has been written to so they can react accordingly.
	var MemoryMappedRegister = Class({
		constructor: function (index) {
			this.Index = index;
		},

		type: "MemoryMappedRegister",

		get: function()
		{
			return AtmelContext.R[this.Index];
		},

		set: function(value)
		{
			var oldVal = AtmelContext.R[this.Index];
			if (oldVal != value)
				AtmelContext.R[this.Index] = value & 0xff;
		},

		get_bit: function(index)
		{
			return ((AtmelContext.R[this.Index] >> index) & 1);
		},

		set_bit: function(index, value)
		{
			if (value == 0)
				this.set(this.get() & ~(1 << index));
			else
				this.set(this.get() | (1 << index));
		},

		Reset: function()
		{
			AtmelContext.R[this.Index] = 0;
		},
	});

	return MemoryMappedRegister;
});
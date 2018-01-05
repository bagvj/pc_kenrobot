define(['vendor/class', './AtmelContext'], function(Class, AtmelContext) {
	var ObservableRegister = Class({
		constructor: function(index) {
			this.Index = index;
			this.OnRegisterChanged = [];
			this.OnRegisterRead = [];
		},

		type: "ObservableRegister",

		get: function() {
			var val = AtmelContext.R[this.Index];
			if (this.OnRegisterRead != null)
				for (var i = 0; i < this.OnRegisterRead.length; i++)
					val = this.OnRegisterRead[i](val);
			return val;
		},

		set: function(value) {
			var oldVal = AtmelContext.R[this.Index];
			AtmelContext.R[this.Index] = value & 0xff;
			if (this.OnRegisterChanged != null)
				for (var i = 0; i < this.OnRegisterChanged.length; i++)
					this.OnRegisterChanged[i](oldVal, value);
		},

		get_bit: function(index) {
			return ((AtmelContext.R[this.Index] >> index) & 1);
		},

		set_bit: function(index, value) {
			if (value == 0)
				this.set(this.get() & ~(1 << index));
			else
				this.set(this.get() | (1 << index));
		},

		Reset: function() {
			AtmelContext.R[this.Index] = 0;
		}
	});

	return ObservableRegister;
});
define(['vendor/class', './AtmelContext'], function(Class, AtmelContext) {
	// these classes are accessors for specialty AVR registers i.e. those with different read/write values and/or addresses
	var PortRegister = Class({
		constructor: function(readIndex, writeIndex, dirIndex) {
			var self = this;
			this.ReadIndex = readIndex;
			this.WriteIndex = writeIndex;
			this.DirIndex = dirIndex;

			this.ReadRegister = {
				get: function() {
					return AtmelContext.RAM[self.ReadIndex];
				},
				set: function(value) {}
			}

			this.WriteRegister = {
				get: function() {
					return AtmelContext.RAM[self.WriteIndex];
				},
				set: function(value) {}
			}

			AtmelContext.RAM[readIndex].OnRegisterChanged.push(
				function(oldVal, newVal) {
					self.PortRegister_OnReadRegisterChanged(oldVal, newVal);
				}
			);

			AtmelContext.RAM[writeIndex].OnRegisterChanged.push(
				function(oldVal, newVal) {
					self.PortRegister_OnWriteRegisterChanged(oldVal, newVal);
				}
			);
		},

		type: "PortRegister",

		PortRegister_OnReadRegisterChanged: function(oldVal, newVal) {

		},

		PortRegister_OnWriteRegisterChanged: function(oldVal, newVal) {
			// if a pin is set as an output then writing to its write register sets the input value on it's read register as well
			var readVal = AtmelContext.RAM[this.ReadIndex].get();
			var direction = AtmelContext.RAM[this.DirIndex].get();
			readVal = readVal & ~direction;
			readVal = readVal | (direction & newVal);
			AtmelContext.RAM[this.ReadIndex].set(readVal);
		},

		get: function() {
			return AtmelContext.RAM[this.ReadIndex].get();
		},

		set: function(value) {
			AtmelContext.RAM[this.WriteIndex].set(value);
		},

		get_bit: function(index) {
			return ((AtmelContext.RAM[this.ReadIndex].get() >> index) & 1);
		},

		set_bit: function(index, value) {
			if (value == 0)
				AtmelContext.RAM[this.WriteIndex].set(AtmelContext.RAM[this.WriteIndex].get() & ~(1 << index));
			else
				AtmelContext.RAM[this.WriteIndex].set(AtmelContext.RAM[this.WriteIndex].get() | (1 << index));
		},

		Reset: function() {
			AtmelContext.RAM[this.WriteIndex].Reset();
			AtmelContext.RAM[this.ReadIndex].Reset();
		}
	});

	return PortRegister;
});
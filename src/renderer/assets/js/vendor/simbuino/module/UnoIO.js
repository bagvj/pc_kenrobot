define(['../core/AtmelContext', '../core/AtmelIO'], function(AtmelContext, AtmelIO) {

	var ioMap = {
		"0": {name: "0", port: 'D', index: 0},
		"1": {name: "1", port: 'D', index: 1},
		"2": {name: "2", port: 'D', index: 2},
		"3": {name: "3", port: 'D', index: 3},
		"4": {name: "4", port: 'D', index: 4},
		"5": {name: "5", port: 'D', index: 5},
		"6": {name: "6", port: 'D', index: 6},
		"7": {name: "7", port: 'D', index: 7},

		"8": {name: "8", port: 'B', index: 0},
		"9": {name: "9", port: 'B', index: 1},
		"10": {name: "10", port: 'B', index: 2},
		"11": {name: "11", port: 'B', index: 3},
		"12": {name: "12", port: 'B', index: 4},
		"13": {name: "13", port: 'B', index: 5},

		"A0": {name: "A0", port: 'C', index: 0},
		"A1": {name: "A1", port: 'C', index: 1},
		"A2": {name: "A2", port: 'C', index: 2},
		"A3": {name: "A3", port: 'C', index: 3},
		"A4": {name: "A4", port: 'C', index: 4},
		"A5": {name: "A5", port: 'C', index: 5},

		"UCSR0A": {name: "UCSR0A", port: 'RAM', index: AtmelIO.UCSR0A, serial: true},
		"UCSR0B": {name: "UCSR0B", port: 'RAM', index: AtmelIO.UCSR0B, serial: true},
		"UDR0": {name: "UDR0", port: 'RAM', index: AtmelIO.UDR0, serial: true},
	};

	var monitorCallbacks = {};
	var hasError;

	function get(name) {
		var io = ioMap[name];
		try {
			return io.serial ? AtmelContext[io.port][io.index].get() : AtmelContext[io.port].ReadRegister.get().get_bit(io.index);
		} catch(e) {
			hasError = true;
			!hasError && console.log(e);
		}
	}

	function set(name, value) {
		var io = ioMap[name];
		try {
			io.serial ? AtmelContext[io.port][io.index].set(value) : AtmelContext[io.port].WriteRegister.get().set_bit(io.index, value);
		} catch(e) {
			hasError = true;
			!hasError && console.log(e);
		}
	}

	function addMonitor(callback) {
		var DFunc = function(oldVal, newVal) { checkChange("D", oldVal, newVal, callback); };
		var BFunc = function(oldVal, newVal) { checkChange("B", oldVal, newVal, callback); };
		var CFunc = function(oldVal, newVal) { checkChange("C", oldVal, newVal, callback); };
		monitorCallbacks[callback] = [DFunc, BFunc, CFunc];

		AtmelContext.D.ReadRegister.get().OnRegisterChanged.push(DFunc);
		AtmelContext.B.ReadRegister.get().OnRegisterChanged.push(BFunc);
		AtmelContext.C.ReadRegister.get().OnRegisterChanged.push(CFunc);
	}

	function removeMoitor(callback) {
		var funcs = monitorCallbacks[callback];
		if(!funcs) {
			return;
		}

		monitorCallbacks[callback] = null;
		var target;
		target = AtmelContext.D.ReadRegister.get().OnRegisterChanged;
		target.splice(target.indexOf(callback), 1);
		target = AtmelContext.B.ReadRegister.get().OnRegisterChanged;
		target.splice(target.indexOf(callback), 1);
		target = AtmelContext.C.ReadRegister.get().OnRegisterChanged;
		target.splice(target.indexOf(callback), 1);
	}

	function getPort(name) {
		var io = ioMap[name];
		return {
			port: AtmelContext[io.port],
			bit: io.index
		};
	}

	function checkChange(port, oldVal, newVal, callback) {
		var result = (oldVal ^ newVal).toString(2);
		var n = result.length;
		var name;
		var index;
		for(var i = n - 1; i >= 0; i--) {
			if(result[i] == "1") {
				index = n - 1 - i;
				name = findName(port, index);
				name && callback(name, (oldVal >> index) & 1, (newVal >> index) & 1);
			}
		}
	}

	function findName(port, index) {
		var io;
		for(var name in ioMap) {
			io = ioMap[name];
			if(io.port == port && io.index == index) {
				return name;
			}
		}
	}

	return {
		get: get,
		set: set,
		addMonitor: addMonitor,
		removeMoitor: removeMoitor,
		getPort: getPort,
	};
});
define(function() {
	var boards = [{
		"label": "Arduino UNO",
		"name": "ArduinoUNO",
		"type": "uno",
		"build": {
			"fqbn": "arduino:avr:uno:cpu=atmega328p"
		},
		"upload": {
			"mcu": "atmega328p"
		}
	}, {
		"label": "Arduino Leonardo",
		"name": "ArduinoLeonardo",
		"type": "leonardo",
		"build": {
			"fqbn": "arduino:avr:leonardo:cpu=atmega32u4"
		},
		"upload": {
			"mcu": "atmega32u4"
		}
	}, {
		"label": "Arduino Nano",
		"name": "ArduinoNano",
		"type": "nano",
		"build": {
			"fqbn": "arduino:avr:nano:cpu=atmega328"
		},
		"upload": {
			"mcu": "atmega328"
		}
	}, {
		"label": "Arduino/Genuino Mega or Mega 2560",
		"name": "mega",
		"build": {
			"fqbn": "arduino:avr:mega:cpu=atmega2560"
		},
		"upload": {
			"mcu": "atmega2560"
		}
	}];

	return boards;
})
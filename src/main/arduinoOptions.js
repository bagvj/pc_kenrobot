module.exports = {
	"default": {
		build: {
			fqbn: "arduino:avr:uno:cpu=atmega328p",
			prefs: {
				"runtime.tools.avr-gcc.path": '"ARDUINO_PATH/hardware/tools/avr"',
				"runtime.tools.avrdude.path": '"ARDUINO_PATH/hardware/tools/avr"'
			},
			command: '"ARDUINO_PATH/arduino-builder" -compile -logger=machine -hardware="ARDUINO_PATH/hardware" -hardware="ARDUINO_PATH/packages" -tools="ARDUINO_PATH/tools-builder" -tools="ARDUINO_PATH/hardware/tools/avr" -tools="ARDUINO_PATH/packages" -built-in-libraries="ARDUINO_PATH/libraries" -ide-version=10612 -warnings=none -prefs=build.warn_data_percentage=75 BUILD_SPECS -build-path="PROJECT_BUILD_PATH" "PROJECT_ARDUINO_FILE"'
		},
		upload: {
			target_type: "hex",
			mcu: "atmega328p",
			baudrate: "115200",
			programer: "arduino",
			command: '"ARDUINO_PATH/hardware/tools/avr/bin/avrdude" -C "ARDUINO_PATH/hardware/tools/avr/etc/avrdude.conf" -v -p ARDUINO_MCU -c ARDUINO_PROGRAMMER -b ARDUINO_BURNRATE -P ARDUINO_COMPORT -D -U "flash:w:TARGET_PATH:i"'
		},
	},
	librariesPath: [],
}
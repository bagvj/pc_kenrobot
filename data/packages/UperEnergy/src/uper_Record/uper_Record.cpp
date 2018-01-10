#include "uper_Record.h"
#include "uper_Pin.h"

Record::Record(int pin) {
	_pin = CHECK_PD_PIN(pin);
	if(_pin == P_NC) {
		return;
	}

	_pinA = Uper2PDigitalPort[_pin].d1;
	_pinB = Uper2PDigitalPort[_pin].d2;

	pinMode(_pinA, OUTPUT);
	pinMode(_pinB, OUTPUT);
}

Record::~Record() {

}

void Record::play() {
	if(_pin == P_NC) {
		return;
	}

	digitalWrite(_pinA, LOW);
	digitalWrite(_pinB, HIGH);
}

void Record::loop() {
	if(_pin == P_NC) {
		return;
	}

	digitalWrite(_pinA, HIGH);
	digitalWrite(_pinB, LOW);
}

void Record::stop() {
	if(_pin == P_NC) {
		return;
	}

	digitalWrite(_pinA, LOW);
	digitalWrite(_pinB, LOW);
}

#include "uper_Fan.h"

const int FAN_PINS[8] = {
	2, 3,
	4, 5,
	8, 9,
	10, 11
};

Fan::Fan(int fa) {
	_fa = CHECK_FAN_PIN(fa);

	if(_fa != FAN_UN_USE) {
		_pin1 = FAN_PINS[2 * (_fa - 1)];
		_pin2 = FAN_PINS[2 * _fa - 1];
	}
}

Fan::~Fan() {

}

void Fan::begin() {
	if(_fa != FAN_UN_USE) {
		pinMode(_pin1, OUTPUT);
	}
}

void Fan::run(int speed, bool direction) {
	speed = speed < 0 ? 0 : (speed > 100 ? 255 : map(speed, 0, 100, 0, 255));

	if(_fa != FAN_UN_USE) {
		digitalWrite(_pin1, direction ? LOW : HIGH);
		analogWrite(_pin2, speed);
	}
}

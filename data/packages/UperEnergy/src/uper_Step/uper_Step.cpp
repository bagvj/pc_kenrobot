#include "uper_Step.h"

Step::Step(int pin, void (*callback)(void)) {
	_pin = pin;
	_callback = callback;
}

void Step::begin(int type) {
	_count = 0;
	pinMode(_pin, INPUT_PULLUP);
	attachInterrupt(digitalPinToInterrupt(_pin), _callback, type);
}

void Step::stop() {
	detachInterrupt(digitalPinToInterrupt(_pin));
}

int Step::getCount() {
	return _count;
}

void Step::doCount() {
	_count++;
}

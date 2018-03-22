#ifndef UPER__ULTRASONIC__H
#define UPER__ULTRASONIC__H

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif

class UPER_Ultrasonic
{
public:
	UPER_Ultrasonic(uint8_t pin);
	int distance(void);
private:
	uint8_t _Ultrasonic_pin;
};

#endif
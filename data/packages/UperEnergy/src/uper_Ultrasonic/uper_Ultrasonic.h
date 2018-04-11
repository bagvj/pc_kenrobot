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
	UPER_Ultrasonic(uint8_t pin_1,uint8_t pin_2);
	float distance(void);
	float distancenum(void);
private:
	uint8_t _Ultrasonic_pin;
	uint8_t _Ultrasonic_pin1;
	uint8_t _Ultrasonic_pin2;
};

#endif
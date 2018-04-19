#ifndef UPER__GRAY__H
#define UPER__GRAY__H

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif

class UPER_Button

class UPER_Gray
{
public:
	UPER_Gray(int pin);
    int read();
private:
	int _pin;
};
#endif/*UPER__GRAY__H*/
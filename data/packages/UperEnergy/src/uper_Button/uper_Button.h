#ifndef UPER__BUTTON__H
#define UPER__BUTTON__H

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif

class UPER_Button
{
public:
	UPER_Button(int pin);
    int read();
private:
	int _pin;
};
#endif/*UPER__BUTTON__H*/
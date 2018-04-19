#ifndef UPER__TOUCH__H
#define UPER__TOUCH__H

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif


class UPER_Touch
{
public:
	UPER_Touch(int pin);
    int read();
private:
	int _pin;
};
#endif/*UPER__TOUCH__H*/
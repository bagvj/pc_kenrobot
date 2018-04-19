#ifndef UPER__LIGHT__H
#define UPER__LIGHT__H

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif


class UPER_Light
{
public:
	UPER_Light(int pin);
    int read();
private:
	int _pin;
};
#endif/*UPER__LIGHT__H*/
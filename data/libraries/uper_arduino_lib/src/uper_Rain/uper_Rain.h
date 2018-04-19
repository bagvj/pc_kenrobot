#ifndef UPER__RAIN__H
#define UPER__RAIN__H

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif


class UPER_Rain
{
public:
	UPER_Rain(int pin);
    int read();
    int open();
    int close();
private:
	int _pin;
};
#endif/*UPER__RAIN__H*/
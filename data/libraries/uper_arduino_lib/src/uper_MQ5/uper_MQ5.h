#ifndef UPER__MQ5__H
#define UPER__MQ5__H

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif


class UPER_MQ5
{
public:
	UPER_MQ5(int pin);
    int read();
private:
	int _pin;
};
#endif/*UPER_MQ5*/
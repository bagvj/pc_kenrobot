#ifndef UPER__VOICE__H
#define UPER__VOICE__H

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif


class UPER_Voice
{
public:
	UPER_Voice(int pin);
    int read();
private:
	int _pin;
};
#endif/*UPER__VOICE__H*/
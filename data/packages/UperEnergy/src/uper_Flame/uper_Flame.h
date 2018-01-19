#ifndef UPER__FLAME__H
#define UPER__FLAME__H

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif

class UPER_Flame
{
public:
	UPER_Flame(int pin);
    int read();
private:
	int _pin;
};
#endif/*UPER__FLAME__H*/
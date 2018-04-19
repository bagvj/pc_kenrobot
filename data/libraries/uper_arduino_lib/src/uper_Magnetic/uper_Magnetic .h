#ifndef UPER__MAGNETIC__H
#define UPER__MAGNETIC__H

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif


class UPER_Magnetic
{
public:
	UPER_Magnetic(int pin);
    int read();
private:
	int _pin;
};
#endif/*UPER__MAGNETIC__H*/
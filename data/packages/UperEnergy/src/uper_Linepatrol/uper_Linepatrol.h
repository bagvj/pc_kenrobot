#ifndef UPER__LINE__H
#define UPER__LINE__H

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif


class UPER_Linepatrol
{
public:
	UPER_Linepatrol(int pin);
    int read();
private:
	int _pin;
};
#endif/*UPER__LINE__H*/
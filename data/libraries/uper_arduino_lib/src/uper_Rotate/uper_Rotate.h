#ifndef UPER__ROTATE__H
#define UPER__ROTATE__H

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif


class UPER_Rotate
{
public:
	UPER_Rotate(int pin);
    int read();
private:
	int _pin;
};
#endif/*UPER__ROTATE__H*/
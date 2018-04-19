#ifndef UPER__SOIL__H
#define UPER__SOIL__H

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif


class UPER_Soil
{
public:
	UPER_Soil(int pin);
    int read();
private:
	int _pin;
};
#endif/*UPER__SOIL__H*/
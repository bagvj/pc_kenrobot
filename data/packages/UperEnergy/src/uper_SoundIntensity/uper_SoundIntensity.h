#ifndef UPER__SOUND__H
#define UPER__SOUND__H

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif


class UPER_SoundIntensity
{
public:
	UPER_SoundIntensity(int pin);
    int read();
private:
	int _pin;
};
#endif/*UPER__SOUND__H*/
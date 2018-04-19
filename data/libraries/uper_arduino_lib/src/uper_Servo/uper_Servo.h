#ifndef UPER__SERVO__H
#define UPER__SERVO__H

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif

class uper_Servo {
public:
	void begin(int baudrate = 9600);
	void run(int index, int angle);
};

#endif /*UPER__SERVO__H*/

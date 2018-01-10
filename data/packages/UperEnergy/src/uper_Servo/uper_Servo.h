#ifndef UPER_SERVO_H
#define UPER_SERVO_H

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif

class Servo {
public:
	void begin(int baudrate = 9600);
	void run(int index, int angle);
};

#endif // UPER_SERVO_H

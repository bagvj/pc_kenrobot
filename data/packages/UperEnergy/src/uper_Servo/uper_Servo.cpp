#include "uper_Servo.h"

unsigned char command[11] = {
	0xa3, 0x3a, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00,
	0x00, 0x0d, 0x0a
};

void Servo::begin(int baudrate) {
	Serial.begin(baudrate);
}

void Servo::run(int index, int angle) {
	index = index > 5 ? 5 : (index < 1 ? 1 : index);
	angle = angle > 180 ? 180 : (angle < 0 ? 0 : angle);

	command[4] = index;
	command[6] = angle;

	Serial.write(command, 11);
}
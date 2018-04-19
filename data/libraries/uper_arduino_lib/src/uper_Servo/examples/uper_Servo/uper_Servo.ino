#include "uper_Servo.h"

uper_Servo uper_servo;
int i;

void setup() {
	uper_servo.begin();
}

void loop() {
	for(i = 1; i <= 5; i++) {
		uper_servo.run(i, 90);
	}
	delay(2000);

	for(i = 1; i <= 5; i++) {
		uper_servo.run(i, 180);
	}
	delay(2000);

	for(i = 1; i <= 5; i++) {
		uper_servo.run(i, 0);
	}
	delay(2000);
}
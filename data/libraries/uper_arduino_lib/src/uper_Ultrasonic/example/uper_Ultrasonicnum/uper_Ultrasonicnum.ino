#include <uper_Ultrasonic.h>

UPER_Ultrasonic uper_Ultrasonic = UPER_Ultrasonic(2,3);// 数字管脚

void setup() {
	Serial.begin(9600);
}

void loop() {
	Serial.println(uper_Ultrasonic.distancenum());//get distance
	delay(1000);
}

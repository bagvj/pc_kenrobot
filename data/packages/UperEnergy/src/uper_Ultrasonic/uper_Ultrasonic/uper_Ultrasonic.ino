#include <uper_Ultrasonic.h>

UPER_Ultrasonic uper_Ultrasonic = UPER_Ultrasonic(A0);// A0,A1,A2,A3

void setup() {
Serial.begin(9600);
}

void loop() {
Serial.println(uper_Ultrasonic.distance());//get distance
delay(1000);
}

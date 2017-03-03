/**
 * Copyright(C), 2016-2038, KenRobot.com
 * FileName: Calibration.ino
 * Author: 啃萝卜
 * Create: 2017/03/03
 * Modify: 2017/03/03
 */

int led_0 = 9;
int lightSensor_0 = A0;
float maxDim = 0;
float minDim = 1023;

void setup() {
    pinMode(led_0, OUTPUT);
    pinMode(lightSensor_0, INPUT);
}

void loop() {
    analogWrite(led_0, map(, , , , ));
}
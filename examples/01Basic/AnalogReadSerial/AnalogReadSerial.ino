/**
 * Copyright(C), 2016-2038, KenRobot.com
 * FileName: ReadAnalogVoltage.ino
 * Author: 啃萝卜
 * Create: 2017/03/03
 * Modify: 2017/03/03
 */

int pot_0 = A0;

void setup() {
    pinMode(pot_0, INPUT);
    Serial.begin(9600);
}

void loop() {
    Serial.println((analogRead(pot_0) * (5 / 1023)));
    delay(200);
}
/**
 * Copyright(C), 2016-2038, KenRobot.com
 * FileName: AnlogReadSerial.ino
 * Author: 啃萝卜
 * Create: 2017/11/16
 * Modify: 2017/11/16
 */
 
int pot_0 = A0;

void setup() {
    pinMode(pot_0, INPUT);
    Serial.begin(9600);
}

void loop() {
    Serial.println(map(analogRead(pot_0), 0, 1023, 0, 5));
    delay(200);
}
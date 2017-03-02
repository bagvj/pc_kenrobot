/**
 * Copyright(C), 2016-2038, KenRobot.com
 * FileName: 我的项目.ino
 * Author: 啃萝卜
 * Create: 2017/03/01
 * Modify: 2017/03/01
 */

int pot_0 = A0;

void setup() {
    pinMode(pot_0, INPUT);
    Serial.begin(9600);
}

void loop() {
    Serial.println(pot_0);
    delay(200);
}
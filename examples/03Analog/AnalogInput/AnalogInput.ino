/**
 * Copyright(C), 2016-2038, KenRobot.com
 * FileName: 我的项目.ino
 * Author: 啃萝卜
 * Create: 2017/03/01
 * Modify: 2017/03/01
 */

int led_0 = 13;
int pot_0 = A0;

void setup() {
    pinMode(led_0, OUTPUT);
    pinMode(pot_0, INPUT);
}

void loop() {
    digitalWrite(led_0, HIGH);
    delay(pot_0);
    digitalWrite(led_0, LOW);
    delay(pot_0);
}
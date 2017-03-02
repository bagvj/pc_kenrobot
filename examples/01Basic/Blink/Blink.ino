/**
 * Copyright(C), 2016-2038, KenRobot.com
 * FileName: 我的项目.ino
 * Author: 啃萝卜
 * Create: 2017/03/01
 * Modify: 2017/03/01
 */

int led_0 = 13;

void setup() {
    pinMode(led_0, OUTPUT);
}

void loop() {
    digitalWrite(led_0, HIGH);
    delay(1000);
    digitalWrite(led_0, LOW);
    delay(1000);
}
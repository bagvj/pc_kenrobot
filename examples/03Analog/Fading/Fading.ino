/**
 * Copyright(C), 2016-2038, KenRobot.com
 * FileName: 我的项目.ino
 * Author: 啃萝卜
 * Create: 2017/03/01
 * Modify: 2017/03/01
 */

int led_0 = 3;

void setup() {
    pinMode(led_0, OUTPUT);
}

void loop() {
    float Dim = 0;
    for (Dim = 0; Dim <= 255; Dim += 1) {
        analogWrite(led_0, Dim);
        delay(20);
    }
    for (Dim = 255; Dim >= 0; Dim -= 1) {
        analogWrite(led_0, Dim);
        delay(20);
    }
}
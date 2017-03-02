/**
 * Copyright(C), 2016-2038, KenRobot.com
 * FileName: 我的项目.ino
 * Author: 啃萝卜
 * Create: 2017/03/01
 * Modify: 2017/03/01
 */

int button_0 = 2;
int led_0 = 13;

void setup() {
    pinMode(button_0, INPUT);
    pinMode(led_0, OUTPUT);
}

void loop() {
    if (button_0 == true) {
        digitalWrite(led_0, HIGH);
    }
    if (button_0 == false) {
        digitalWrite(led_0, LOW);
    }
}
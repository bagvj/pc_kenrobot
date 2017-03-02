/**
 * Copyright(C), 2016-2038, KenRobot.com
 * FileName: 我的项目.ino
 * Author: 啃萝卜
 * Create: 2017/03/01
 * Modify: 2017/03/01
 */

int button_0 = 2;
int led_0 = 13;
bool buttonState = true;

void setup() {
    pinMode(button_0, INPUT);
    pinMode(led_0, OUTPUT);
}

void loop() {
    if (button_0 == 1) {
        delay(10);
        if (button_0 == 1) {
            buttonState = !buttonState;
        }
    }
    if (buttonState == true) {
        digitalWrite(led_0, HIGH);
    } else {
        digitalWrite(led_0, LOW);
    }
}
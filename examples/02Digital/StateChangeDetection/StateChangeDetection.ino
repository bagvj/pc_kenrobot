/**
 * Copyright(C), 2016-2038, KenRobot.com
 * FileName: StateChangeDetection.ino
 * Author: 啃萝卜
 * Create: 2017/03/03
 * Modify: 2017/03/03
 */

int button_0 = 2;
int led_0 = 13;
bool buttonState = true;

void setup() {
    pinMode(button_0, INPUT);
    pinMode(led_0, OUTPUT);
    Serial.begin(9600);
}

void loop() {
    if (digitalRead(button_0) == 1) {
        delay(10);
        if (digitalRead(button_0) == 1) {
            buttonState = !buttonState;
            if (buttonState == true) {
                digitalWrite(led_0, HIGH);
                Serial.println("on");
            } else {
                digitalWrite(led_0, LOW);
                Serial.println("off");
            }
        }
    }
}
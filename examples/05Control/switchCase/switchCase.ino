/**
 * Copyright(C), 2016-2038, KenRobot.com
 * FileName: 我的项目.ino
 * Author: 啃萝卜
 * Create: 2017/03/01
 * Modify: 2017/03/01
 */

#include <RGBLed.h>

RGBLed rgb_0(11, 10, 9);
float SerialRGB = 0;

void setup() {
    Serial.begin(9600);
}

void loop() {
    if (Serial.read() > 0) {
        SerialRGB = Serial.read();
    }
    switch (int(SerialRGB)) {
        case 1:
            {
                rgb_0.setRGBcolor(255, 0, 0);
                break;
            }
        case 2:
            {
                rgb_0.setRGBcolor(0, 60, 102);
                break;
            }
        case 3:
            {
                rgb_0.setRGBcolor(40, 40, 255);
                break;
            }
        case 4:
            {
                rgb_0.setRGBcolor(255, 0, 255);
                break;
            }
        default:
            {
                rgb_0.setRGBcolor(255, 255, 255);
                break;
            }
    }
}
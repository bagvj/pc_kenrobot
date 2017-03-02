/**
 * Copyright(C), 2016-2038, KenRobot.com
 * FileName: 我的项目.ino
 * Author: 啃萝卜
 * Create: 2017/03/01
 * Modify: 2017/03/01
 */

#include <SR04.h>

SR04 ultrasound_0(4, 5);

void setup() {
    Serial.begin(9600);
}

void loop() {
    Serial.println(ultrasound_0.Distance());
    delay(200);
}
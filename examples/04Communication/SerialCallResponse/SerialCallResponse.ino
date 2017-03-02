/**
 * Copyright(C), 2016-2038, KenRobot.com
 * FileName: SerialCallResponse.ino
 * Author: 啃萝卜
 * Create: 2017/03/01
 * Modify: 2017/03/01
 */

void setup() {
    Serial.begin(9600);
}

void loop() {
    Serial.print(Serial.read());
}
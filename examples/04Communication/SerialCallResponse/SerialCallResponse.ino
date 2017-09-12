/**
 * Copyright(C), 2016-2038, KenRobot.com
 * FileName: SerialCallResponse.ino
 * Author: 啃萝卜
 * Create: 2017/09/12
 * Modify: 2017/09/12
 */

void setup() {
    Serial.begin(9600);
}

void loop() {
    while (Serial.available() > 0) {
        Serial.write(Serial.read());
    }
}
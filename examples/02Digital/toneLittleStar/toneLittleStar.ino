/**
 * Copyright(C), 2016-2038, KenRobot.com
 * FileName: toneLittleStar.ino
 * Author: 啃萝卜
 * Create: 2017/03/01
 * Modify: 2017/03/01
 */

int buzzer_0 = 8;

void setup() {
    pinMode(buzzer_0, OUTPUT);
    tone(buzzer_0, 261, 200);
    delay(200);
    tone(buzzer_0, 261, 200);
    delay(200);
    tone(buzzer_0, 392, 200);
    delay(200);
    tone(buzzer_0, 392, 200);
    delay(200);
    tone(buzzer_0, 440, 200);
    delay(200);
    tone(buzzer_0, 440, 200);
    delay(200);
    tone(buzzer_0, 392, 200);
    delay(200);
    noTone(buzzer_0);
}

void loop() {

}
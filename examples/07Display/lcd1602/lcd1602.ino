/**
 * Copyright(C), 2016-2038, KenRobot.com
 * FileName: 我的项目.ino
 * Author: 啃萝卜
 * Create: 2017/03/01
 * Modify: 2017/03/01
 */

#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd_0(0x27, 16, 2);

void setup() {
    lcd_0.begin();
    lcd_0.clear();
}

void loop() {
    lcd_0.print("Hello,Kenrobot");
}
/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  LEDTest.ino
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  LED 模块测试示例。
 *
 * \说明
 * LED 模块测试示例。
 *
 * \函数列表
 *
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建程序。
 *  
 */
int led = 2;                             //LED模块接口

void setup()
{
	pinMode(led, OUTPUT);
}

void loop() 
{
	digitalWrite(led, HIGH);
	delay(200);
	digitalWrite(led, LOW); 
	delay(200);
}

/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  LEDTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/09/01
 * @描述：  LED 模块测试实例测试示例。
 *
 * \说明
 * LED 模块测试实例测试示例。
 *
 * \函数列表
 *
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/01      0.1.0              新建程序。
 *  
 */
int ledPin = 3;                             //LED模块接口

void setup()
{
	pinMode(ledPin, OUTPUT);
}

void loop() 
{
	digitalWrite(ledPin, HIGH);
	delay(500);
	digitalWrite(ledPin, LOW); 
	delay(500);
}

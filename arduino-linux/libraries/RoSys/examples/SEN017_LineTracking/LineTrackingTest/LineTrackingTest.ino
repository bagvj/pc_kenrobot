/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  LineTrackingTest.ino
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  巡线阵列模块测试示例。
 * 
 * \说明
 * 巡线阵列模块测试示例。传感器位于黑线上方时，输出高电平（HIGH）。
 * 
 * \函数列表
 * 1. uint8_t RoLineTracking::readSensors(void)
 * 
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建程序。
 * 
 */

#include "RoSys.h"

RoLineTracking lineTracking(PD5);

void setup()
{
	Serial.begin(9600);       //设置串口波特率为9600
}

void loop()
{
	int sensorState = lineTracking.readSensors();    	//设置变量，读取数据
	Serial.println(sensorState, BIN);               	//发送数据，二进制显示
	delay(100);
}


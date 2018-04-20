/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  LineTrackingTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/07/21
 * @描述：  巡线阵列模块测试示例。
 * 
 * \说明
 * 巡线阵列模块测试示例。传感器位于黑线上方时，输出高电平（HIGH）。
 * 
 * \函数列表
 * 1. uint8_t LineTracking::readSensors(void)
 * 
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/07/21      0.1.0              新建程序。
 * 
 */

#include "Kenblock.h"
#include "Kenblock_LineTracking.h"

LineTracking lineTracking(PD5);

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


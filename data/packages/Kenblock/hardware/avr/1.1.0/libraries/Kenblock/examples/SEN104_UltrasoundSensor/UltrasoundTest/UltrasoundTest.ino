/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  UltrasoundTest.ino
 * @作者：  Kenblcok
 * @版本：  V0.1.0
 * @时间：  2017/09/20
 * @描述：  超声波测距模块 测试程序。
 * 
 * \说明
 * 超声波测距模块 测试程序。读取超声波距离，通过串口进行显示。
 * 超声波测距模块测距模块IIC地址范围： 0xF0 - 0xFF，使用拨码开关设置IIC地址（若无拨码，则IIC地址为0xF0）。.
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  King           2017/09/20      0.1.0              新建程序。
 * 
 */

#include <Wire.h>

void setup() 
{
	Wire.begin();           // IIC总线初始化
	Serial.begin(9600);  	// 串口初始化
}

int getUltrDistance(uint8_t address)
{
    unsigned char dataH,dataL;
    int distance;
    
    Wire.requestFrom(address, 2);     // 从设备读取2个字节的数据
    while (Wire.available())          // 从设备发送请求
    {
		dataH = Wire.read();
		dataL = Wire.read();
    }
    return (dataH *256 + dataL);
}
  
void loop() 
{
	int distance = getUltrDistance(240);    // 从设备为 0xF0（240）的设备读超声波数据
	Serial.print("Distance = ");
	Serial.println(distance);             	// 串口打印距离

	delay(500);
}

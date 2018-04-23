/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  UltrasonicTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/11/13
 * @描述：  Kenblock DC 直流电机测试示例。
 *
 * \说明
 * 超声波测距模块 测试程序。读取超声波距离，通过串口进行显示。
 * 超声波测距模块测距模块IIC地址范围： 0xF0 - 0xFF，使用拨码开关设置IIC地址（若无拨码，则IIC地址为0xF0）。
 *
 * \函数列表
 * 		  Ultrasonic(uint8_t UltrasonicAddress);  // 初始化，设置IIC地址，默认地址为0xF0。
 * 		  boolean   begin();            // IIC初始化，验证通信是否正常 
 * 		  uint16_t  requstDistance();   // 读取超声波测距距离。实际距离小于30cm时，测得数据可能不准确。
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/11/13      0.1.0              新建程序。
 *  
 */
 
#include <Wire.h>
#include "Kenblock_Ultrasonic.h"

Ultrasonic ultr;              // 实例化，默认地址0xF0（240）
// Ultrasonic ultr(0xF1);     // 实例化，默认地址0xF1

void setup() 
{
  Serial.begin(9600);         // 串口初始化
  if (ultr.begin())           // 如果超声波初始化成功
  {                
    Serial.println("Ultrasonic is online"); // 串口打印信息
  }
  else                        // 如果超声波初始化不成功
  {                                       
    Serial.println("error");  // 串口打印信息
    while (1);                // 程序在此循环运行，即不再向下运行
  }
}

void loop() 
{
	uint16_t distance = ultr.requstDistance(); // 获取超声波测得的距离 
	Serial.print("Distance = ");
	Serial.println(distance);   // 串口打印距离

	delay(500);                 // 延时30ms
}
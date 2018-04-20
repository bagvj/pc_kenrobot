 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_ColorSensor.h
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/08/08
 * @描述：  颜色传感器库函数。Kenblock_ColorSensor.c 的头文件。
 *
 * \说明
 * 颜色传感器库函数，对应传感器为TCS3200。接口确定使用 PD5 。
 *
 * \方法列表
 * 
 * 		1. void ColorSensor::setpin(uint8_t port)
 * 		2. void ColorSensor::setpin(uint8_t pin1,uint8_t pin2,uint8_t pin3,uint8_t pin4)
 * 		3. void ColorSensor::OutputSetting(uint8_t temp)
 * 		4. void ColorSensor::FilterColor(uint8_t S2,uint8_t S3)
 *		5. void ColorSensor::WhiteBalance(uint8_t temp1,uint8_t temp2)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/08/08      0.1.0              新建库文件。
 *  
 * \示例
 *  
 * 		1.ColorSensorTest.ino
 */


#ifndef Kenblock_ColorSensor_H
#define Kenblock_ColorSensor_H

#include <Arduino.h>
#include <TimerOne.h>
#include "Kenblock_ColorSensor.h"
#include "KenblockConfig.h"


/**
 * Class: ColorSensor
 * \说明：Class ColorSensor 的声明
 */
class ColorSensor
{
	public:
		ColorSensor(void);
		ColorSensor(uint8_t port);
		ColorSensor(uint8_t pin1,uint8_t pin2,uint8_t pin3,uint8_t pin4);
		void setpin(uint8_t port);
		void setpin(uint8_t pin1,uint8_t pin2,uint8_t pin3,uint8_t pin4);
		void OutputSetting(uint8_t temp);
		void FilterColor(uint8_t s2,uint8_t s3);
		void WhiteBalance(uint8_t temp1,uint8_t temp2);
		float      g_SF[3];   	//从TCS3200输出信号的脉冲数转换为RGB标准值的RGB比例因子
		uint32_t   g_count = 0;	//计算与反射光强相对应TCS3200颜色传感器输出信号的脉冲数
		uint32_t   g_array[3];	//数组用于存储在1s内TCS3200输出信号的脉冲数，它乘以RGB比例因子就是RGB标准值
		uint8_t    g_flag = 0;	//滤波器模式选择顺序标志
	private:
		volatile uint8_t _Out;
		volatile uint8_t _S3;
		volatile uint8_t _S2;
		volatile uint8_t _S1;
};
#endif   // Kenblock_ColorSensor_H



 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_LineTracking.h
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/07/21
 * @描述：  巡线阵列模块驱动函数。LineTracking.cpp 的头文件。
 *
 * \说明
 * 巡线阵列模块驱动函数。传感器位于黑线上方时，输出高电平。
 *
 * \方法列表
 * 
 * 		1. void 	LineTracking::setPin(uint8_t sen1,uint8_t sen2,uint8_t sen3,uint8_t sen4)
 * 		2. void 	LineTracking::setPin(uint8_t port)
 * 		3. uint8_t 	LineTracking::readSensors(void)
 * 		4. uint8_t 	LineTracking::readSensors(uint8_t sen)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/07/21      0.1.0              新建库文件。
 *  
 * \示例
 *  
 * 		1.LineTrackingTest.ino
 */
 
#ifndef Kenblock_LineTracking_H
#define Kenblock_LineTracking_H

#include <stdint.h>
#include <stdbool.h>
#include <Arduino.h>
#include "KenblockConfig.h"

/**
 * Class: LineTracking
 * \说明：Class LineTracking 的声明
 */
class LineTracking
{
	public:
		/**
		 * \函数：LineTracking
		 * \说明：初始化，不做任何操作
		 * \输入参数：无
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		LineTracking(void);

	
		/**
		 * \函数：LineTracking
		 * \说明：替代构造函数，设置巡线阵列模块的引脚
		 * \输入参数：
		 *   port : Ex_Quadruple_Digital  四路数字接口（6P接口）
		 *   	d1 - 巡线阵列传感器1的引脚
		 *   	d2 - 巡线阵列传感器2的引脚
		 *   	d3 - 巡线阵列传感器3的引脚
		 *   	d4 - 巡线阵列传感器4的引脚	
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		LineTracking(uint8_t port);
	
		/**
		 * \函数：LineTracking
		 * \说明：替代构造函数，设置巡线阵列模块的引脚
		 * \输入参数：
		 *   sen1 - 巡线阵列传感器1的引脚
		 *   sen2 - 巡线阵列传感器2的引脚
		 *   sen3 - 巡线阵列传感器3的引脚
		 *   sen4 - 巡线阵列传感器4的引脚		 
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */	
		LineTracking(uint8_t sen1,uint8_t sen2,uint8_t sen3,uint8_t sen4);

		/**
		 * \函数：setpin
		 * \说明：设置巡线阵列模块的引脚
		 * \输入参数：
		 *   port : Ex_Quadruple_Digital  四路数字接口（6P接口）
		 *   	d1 - 巡线阵列传感器1的引脚
		 *   	d2 - 巡线阵列传感器2的引脚
		 *   	d3 - 巡线阵列传感器3的引脚
		 *   	d4 - 巡线阵列传感器4的引脚			
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void setPin(uint8_t port);
		
		/**
		 * \函数：setpin
		 * \说明：设置巡线阵列模块的引脚
		 * \输入参数：
		 *   sen1 - 巡线阵列传感器1的引脚
		 *   sen2 - 巡线阵列传感器2的引脚
		 *   sen3 - 巡线阵列传感器3的引脚
		 *   sen4 - 巡线阵列传感器4的引脚		
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void setPin(uint8_t sen1,uint8_t sen2,uint8_t sen3,uint8_t sen4);

		 /**
		 * \函数：readSensors
		 * \说明：读取传感器状态
		 * \输入参数：无
		 * \输出参数：无	
		 * \返回值：返回四个传感器的值，当在黑线上方时
		 * \其他：传感器位于黑线上方时，输出高电平。
		 */
		uint8_t readSensors(void);

  		/**
		 * \函数：readSensors
		 * \说明：读取某一个传感器的值
		 * \输入参数：
		 *   sen - 传感器序号
		 * \输出参数：无
		 * \返回值：传感器的状态
		 * \其他：传感器位于黑线上方时，输出高电平。
		 */
		uint8_t readSensors(uint8_t sen);
		
	private:
		volatile uint8_t _Sensor1;
		volatile uint8_t _Sensor2;
		volatile uint8_t _Sensor3;
		volatile uint8_t _Sensor4;
};
#endif // Kenblock_LineTracking_H


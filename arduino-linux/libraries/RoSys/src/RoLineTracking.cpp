 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  RoLineTracking.cpp
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  巡线阵列模块驱动函数。
 *
 * \说明
 * 巡线阵列模块驱动函数。传感器位于黑线上方时，输出高电平。
 *
 * \方法列表
 * 
 * 		1. void RoLineTracking::setPin(uint8_t sen1,uint8_t sen2,uint8_t sen3,uint8_t sen4)
 * 		2. void RoLineTracking::setPin(uint8_t port)
 * 		3. uint8_t RoLineTracking::readSensors(void)
 * 		4. uint8_t RoLineTracking::readSensors(uint8_t sen)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建库文件。
 *  
 * \示例
 *  
 * 		1.LineTrackingTest.ino
 */
 
#include "RoLineTracking.h"


/**
 * \RoLineTracking
 * \说明：初始化，不做任何操作
 * \输入参数：无
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
RoLineTracking::RoLineTracking(void)
{
	
}


/**
 * \函数：RoLineTracking
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
RoLineTracking::RoLineTracking(uint8_t port)
{
	_Sensor1 = Ex_Quadruple_Digital[port].d1;
	_Sensor2 = Ex_Quadruple_Digital[port].d2;
	_Sensor3 = Ex_Quadruple_Digital[port].d3;
	_Sensor4 = Ex_Quadruple_Digital[port].d4;
	
	pinMode(_Sensor1, INPUT_PULLUP);
	pinMode(_Sensor2, INPUT_PULLUP);
	pinMode(_Sensor3, INPUT_PULLUP);
	pinMode(_Sensor4, INPUT_PULLUP);
}


/**
 * \函数：RoLineTracking
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

RoLineTracking::RoLineTracking(uint8_t sen1,uint8_t sen2,uint8_t sen3,uint8_t sen4)
{
	_Sensor1 = sen1;
	_Sensor2 = sen2;
	_Sensor3 = sen3;
	_Sensor4 = sen4;
	
	pinMode(_Sensor1, INPUT_PULLUP);
	pinMode(_Sensor2, INPUT_PULLUP);
	pinMode(_Sensor3, INPUT_PULLUP);
	pinMode(_Sensor4, INPUT_PULLUP);
}


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
void RoLineTracking::setPin(uint8_t port)
{
	_Sensor1 = Ex_Quadruple_Digital[port].d1;
	_Sensor2 = Ex_Quadruple_Digital[port].d2;
	_Sensor3 = Ex_Quadruple_Digital[port].d3;
	_Sensor4 = Ex_Quadruple_Digital[port].d4;
	
	pinMode(_Sensor1, INPUT_PULLUP);
	pinMode(_Sensor2, INPUT_PULLUP);
	pinMode(_Sensor3, INPUT_PULLUP);
	pinMode(_Sensor4, INPUT_PULLUP);
}


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
void RoLineTracking::setPin(uint8_t sen1,uint8_t sen2,uint8_t sen3,uint8_t sen4)
{
	_Sensor1 = sen1;
	_Sensor2 = sen2;
	_Sensor3 = sen3;
	_Sensor4 = sen4;
	
	pinMode(_Sensor1, INPUT_PULLUP);
	pinMode(_Sensor2, INPUT_PULLUP);
	pinMode(_Sensor3, INPUT_PULLUP);
	pinMode(_Sensor4, INPUT_PULLUP);
}


/**
 * \函数：readSensors
 * \说明：读取传感器状态
 * \输入参数：无
 * \输出参数：无	
 * \返回值：返回四个传感器的值，当在黑线上方时
 * \其他：传感器位于黑线上方时，输出高电平。
 */
uint8_t RoLineTracking::readSensors(void)
{
	uint8_t State = 0;
	bool sen1State = digitalRead(_Sensor1);
	bool sen2State = digitalRead(_Sensor2);
	bool sen3State = digitalRead(_Sensor3);
	bool sen4State = digitalRead(_Sensor4);
	
	State = ( (1 & sen1State) << 3) | ( (1 & sen2State) << 2) | ( (1 & sen3State) << 1) | sen4State;
	return(State);
}


/**
 * \函数：readSensors
 * \说明：读取某一个传感器的值
 * \输入参数：
 *   sen - 传感器序号
 * \输出参数：无
 * \返回值：传感器的状态
 * \其他：传感器位于黑线上方时，输出高电平。
 */
uint8_t RoLineTracking::readSensors(uint8_t sen)
{
	uint8_t SensorNum = 0;
	SensorNum = sen;
	switch(SensorNum)
	{
		case 1 : return(digitalRead(_Sensor1));break;
		case 2 : return(digitalRead(_Sensor2));break;
		case 3 : return(digitalRead(_Sensor3));break;
		case 4 : return(digitalRead(_Sensor4));break;
		default: return 0;break;
	}
}


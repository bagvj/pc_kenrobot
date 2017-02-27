 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  RoDHT11.h
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  DHT11 温湿度传感模块的驱动函数。RoDHT11.cpp 的头文件。
 *
 * \说明
 * DHT11 温湿度传感模块的驱动函数。
 *
 * \方法列表
 * 
 * 		1. void RoDHT11::setPin(uint8_t pin)
 * 		2. int RoDHT11::readSensors(void)
 * 		3. int RoDHT11::readHumidity(void)
 * 		4. int RoDHT11::readTemperature(void)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建库文件。
 *  
 * \示例
 *  
 * 		1.DHT11Test1.ino
 * 		1.DHT11Test2.ino
 */
 
#ifndef RoDHT11_H
#define RoDHT11_H

#include <stdint.h>
#include <stdbool.h>
#include <Arduino.h>
#include "RoSysConfig.h"

#define DHTLIB_OK				0
#define DHTLIB_ERROR_CHECKSUM	-1
#define DHTLIB_ERROR_TIMEOUT	-2

/**
 * Class: RoDHT11
 * \说明：Class RoDHT11 的声明
 */
class RoDHT11
{
	public:
	
		int humidity;
        int temperature;
		
		/**
		 * \函数：RoDHT11
		 * \说明：初始化，不做任何操作
		 * \输入参数：无
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		RoDHT11(void);

		/**
		 * \函数：RoDHT11
		 * \说明：替代构造函数，设置DHT11温湿度传感器的接口
		 * \输入参数：
		 *   pin - DHT11温湿度传感器的接口
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		RoDHT11(uint8_t pin);
	
		/**
		 * \函数：setpin
		 * \说明：设置DHT11温湿度传感器的接口
		 * \输入参数：
		 *   pin - DHT11温湿度传感器的接口	
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void setPin(uint8_t pin);

 		/**
		 * \函数：readSensors
		 * \说明：读取DHT11的温度值、湿度值
		 * \输入参数：无
		 * \输出参数：传感器的温度值、湿度值
		 * \返回值：传感器状态
		 * \其他：无
		 */
		int readSensors(void);

  		/**
		 * \函数：readHumidity
		 * \说明：读取DHT11的湿度值
		 * \输入参数：无
		 * \输出参数：无
		 * \返回值：DHT11的湿度值
		 * \其他：无
		 */
		int readHumidity(void);
		
		/**
		 * \函数：readTemperature
		 * \说明：读取DHT11的温度值
		 * \输入参数：无
		 * \输出参数：无
		 * \返回值：DHT11的温度值
		 * \其他：无
		 */
		int readTemperature(void);
		
	private:
		volatile uint8_t _dht11_pin;
		volatile unsigned long _time;
		
};
#endif // RoDHT11_H


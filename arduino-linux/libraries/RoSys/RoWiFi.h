 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  RoWiFi.h
 * @作者：  RoSys
 * @版本：  V0.1.0
 * @时间：  2016/08/25
 * @描述：  WiFi转串口模块驱动。RoWiFi.c 的头文件。
 *
 * \说明
 * 直流电机的驱动函数。电机端口（控制引脚）配置，电机速度、方向、停止控制。
 *
 * \方法列表
 * 
 * 		1. void RoWiFi::setPin(uint8_t port)
 * 		2. void RoWiFi::setPin(uint8_t dir_pin,uint8_t pwm_pin)
 * 		3. void RoWiFi::run(int16_t speed)
 * 		4. void RoWiFi::stop(void)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/08/25      0.1.0              新建库文件。
 *  
 * \示例
 *  
 * 		1.DCMotorTest.ino
 */
 
#ifndef RoWiFi_H
#define RoWiFi_H

#include <stdint.h>
#include <stdbool.h>
#include <Arduino.h>
#include <string.h>
#include <SoftwareSerial.h>
#include "RoSysConfig.h"




/**
 * Class: RoWiFi
 * \说明：Class RoWiFi 的声明
 */
class RoWiFi : public SoftwareSerial
{
	public:
		/**
		 * \函数：RoWiFi
		 * \说明：初始化，不做任何操作
		 * \输入参数：无
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		RoWiFi(void);
	
		void init(void);


		void WiFiSendString(unsigned char *str,unsigned char len);
		
	private:
		volatile uint8_t _a;
		volatile uint8_t _b;
};
#endif // RoWiFi_H


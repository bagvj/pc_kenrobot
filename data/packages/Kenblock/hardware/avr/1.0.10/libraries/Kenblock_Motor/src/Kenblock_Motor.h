 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_Motor.h
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/07/20
 * @描述：  直流电机驱动函数。Motor.cpp 的头文件。
 *
 * \说明
 * 直流电机的驱动函数。电机端口（控制引脚）配置，电机速度、方向、停止控制。
 *
 * \方法列表
 * 
 * 		1. void Motor::setpin(uint8_t port)
 * 		2. void Motor::setpin(uint8_t dir_pin,uint8_t pwm_pin)
 * 		3. void Motor::run(int16_t speed)
 * 		4. void Motor::stop(void)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/07/20      0.1.0              新建库文件。
 *  
 * \示例
 *  
 * 		1.MotorTest.ino
 */
 
#ifndef Kenblock_Motor_H
#define Kenblock_Motor_H

#include <stdint.h>
#include <stdbool.h>
#include <Arduino.h>
#include "KenblockConfig.h"

/**
 * Class: Motor
 * \说明：Class Motor 的声明
 */
class Motor
{
	public:
		/**
		 * \函数：Motor
		 * \说明：初始化，不做任何操作
		 * \输入参数：无
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		Motor(void);
	
		/**
		 * \函数：Motor
		 * \说明：替代构造函数，映射直流电机引脚设置函数，分配输出引脚
		 * \输入参数：
		 *   port - 主板电机接口。
		 *   	MotorPort.dir - 方向控制引脚
		 *   	MotorPort.pwm - PWM输出引脚
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		Motor(uint8_t port);
	
		/**
		 * \函数：Motor
		 * \说明：替代构造函数，映射直流电机引脚设置函数，分配输出引脚
		 * \输入参数：
		 *   dir_pin - 方向控制引脚
		 *   pwm_pin - PWM输出引脚(模拟输出脚:3, 5, 6, 9, 10, 11)
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */	
		Motor(uint8_t dir_pin,uint8_t pwm_pin);
		
		/**
		 * \函数：setpin
		 * \说明：设置直流电机控制引脚
		 * \输入参数：
		 *   port - 主板电机接口。
		 *   	MotorPort.dir - 方向控制引脚
		 *   	MotorPort.pwm - PWM输出引脚
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void setpin(uint8_t port);
		
		/**
		 * \函数：setpin
		 * \说明：设置直流电机控制引脚
		 * \输入参数：
		 *   dir_pin - 方向控制引脚
		 *   pwm_pin - PWM输出引脚(模拟输出脚:3, 5, 6, 9, 10, 11)
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void setpin(uint8_t dir_pin,uint8_t pwm_pin);

 		/**
		 * \函数：run
		 * \说明：控制电机正转或反转，速度为speed
		 * \输入参数：
		 *   speed - 速度的值范围 -255~255，值小于零代表反转
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void run(int16_t speed);

  		/**
		 * \函数：stop
		 * \说明：电机停止转动
		 * \输入参数：无
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void stop(void);
		
	private:
		volatile uint8_t _dc_dir_pin;
		volatile uint8_t _dc_pwm_pin;
		int16_t  _last_speed;
};
#endif // Kenblock_Motor_H


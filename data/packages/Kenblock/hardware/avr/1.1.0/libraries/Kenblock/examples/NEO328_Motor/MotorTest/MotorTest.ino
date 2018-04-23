/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  MotorTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/07/20
 * @描述：  Kenblock DC 直流电机测试示例。
 *
 * \说明
 * Kenblock DC 直流电机测试示例。电机正反转、停止。
 *
 * \函数列表
 * 1. void Motor::run(int16_t speed)
 * 2. void Motor::stop(void)
 * 
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/07/20      0.1.0              新建程序。
 *  
 */
 
#include "Kenblock.h"
#include "Kenblock_Motor.h"

Motor motor1(MA);			//电机1
Motor motor2(MB);			//电机2

uint8_t motorSpeed = 100;	//设置电机的速度

void setup()
{
}

void loop()
{
	motor1.run(motorSpeed); 	//值: -255 - 255，负值代表反转 
	motor2.run(motorSpeed); 	//值: -255 - 255，负值代表反转 
	delay(2000);

	motor1.stop();				//电机停止
	motor2.stop();
	delay(1000);

	motor1.run(-motorSpeed);
	motor2.run(-motorSpeed);
	delay(2000);

	motor1.stop();
	motor2.stop();
	delay(1000);
}


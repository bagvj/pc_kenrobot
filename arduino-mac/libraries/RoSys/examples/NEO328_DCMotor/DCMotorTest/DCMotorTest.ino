/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  DCMotorTest.ino
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  RoSys DC 直流电机测试示例。
 *
 * \说明
 * RoSys DC 直流电机测试示例。电机正反转、停止。
 *
 * \函数列表
 * 1. void RoDCMotor::run(int16_t speed)
 * 2. void RoDCMotor::stop(void)
 * 
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/25      1.0.0              新建程序。
 *  
 */
 
#include "RoSys.h"

RoDCMotor motor1(MA);		//电机1
RoDCMotor motor2(MB);		//电机2

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


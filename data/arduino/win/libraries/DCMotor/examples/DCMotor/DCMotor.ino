#include "DCMotor.h"

DCMotor motor1(3,5);		//电机1
DCMotor motor2(6,9);		//电机2

uint8_t motorSpeed = 255;	//设置电机的速度

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

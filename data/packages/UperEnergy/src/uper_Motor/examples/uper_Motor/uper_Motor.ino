#include "uper_Motor.h"

// 电机驱动板接在(2,3)和(4,5)这两个耳机孔上
// 可用耳机孔：MOTOR_MA、MOTOR_MB、MOTOR_MC、MOTOR_MD
Motor uper_motor(MOTOR_MA, MOTOR_MB);

void setup() {
	//电机驱动板初始化
	uper_motor.begin();
}

void loop() {
	//1号电机正转，速度100
	uper_motor.run(1, 100, true);
	delay(1000);
	//1号电机停止
	uper_motor.run(1, 0, true);
	delay(1000);

	//1号电机反转，速度100
	uper_motor.run(1, 100, false);
	delay(1000);
	//1号电机停止
	uper_motor.run(1, 0, false);
	delay(1000);


	//2号电机正转，速度100
	uper_motor.run(2, 100, true);
	delay(1000);
	//2号电机停止
	uper_motor.run(2, 0, true);
	delay(1000);

	//2号电机反转，速度100
	uper_motor.run(2, 100, false);
	delay(1000);
	//2号电机停止
	uper_motor.run(2, 0, false);
	delay(1000);
}
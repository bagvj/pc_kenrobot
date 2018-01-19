#ifndef UPER__MOTOR__H
#define UPER__MOTOR__H

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif

// 电机未使用
#define MOTOR_UN_USE 0
// 电机接2,3号口
#define MOTOR_MA 1
// 电机接4,5号口
#define MOTOR_MB 2
// 电机接8,9号口
#define MOTOR_MC 3
// 电机接10,11号口
#define MOTOR_MD 4

// 检查电机引脚
#define CHECK_MOTOR_PIN(pin) ((pin) >= MOTOR_MA && (pin) <= MOTOR_MD ? (pin) : MOTOR_UN_USE)

class UPER_Motor {
public:
	UPER_Motor(int ma, int mb);
	~UPER_Motor();

	//电机驱动板初始化
	void begin();

	// 电机运行，index: 电机编号1或者2，speed: 速度0-100，direction: true(正转)或者false(反转)
	void run(int index, int speed, bool direction);

private:
	int _ma, _mb;
	int _maPin1, _maPin2;
	int _mbPin1, _mbPin2;
};

#endif /*UPER__MOTOR__H*/

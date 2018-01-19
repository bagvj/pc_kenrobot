#ifndef UPER__FAN__H
#define UPER__FAN__H

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif

// 风扇未使用
#define FAN_UN_USE 0
// 风扇接2,3号口
#define FAN_A 1
// 风扇接4,5号口
#define FAN_B 2
// 风扇接8,9号口
#define FAN_C 3
// 风扇接10,11号口
#define FAN_D 4

// 检查风扇引脚
#define CHECK_FAN_PIN(pin) ((pin) >= FAN_A && (pin) <= FAN_D ? (pin) : FAN_UN_USE)

class UPER_Fan {
public:
	UPER_Fan(int fa);
	~UPER_Fan();

	//风扇初始化
	void begin();

	// Fan运行，speed: 速度0-100，direction: true(正转)或者false(反转)
	void run(int speed, bool direction);

private:
	int _fa;
	int _pin1, _pin2;
};

#endif /*UPER__FAN__H*/

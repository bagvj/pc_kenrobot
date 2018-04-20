#ifndef UPER__TURN__H
#define UPER__TURN__H

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif

class Uper_Turn {
public:
	// pin: 中断引脚，
	Uper_Turn(int pin, int pin1, int pin2, void (*callback)(void));
	Uper_Turn(int pin1, int pin2);
	//计数开始，type：触发方式，默认上升沿触发
	void begin(int type = RISING);

	//停止计数
	void stop();

	//返回计数
	int getCount();

	//仅供中断调用
	void doCount();
	void turn_Forward();
	void turn_Reversal();
	void turn_Stop();
private:
	// 中断回调
	void (*_callback)(void);
	//中断引脚
	int _pin;
	//电机引脚
	int _pin1, _pin2;
	//计数
	int _count;
};

#endif /*UPER__TURN__H*/

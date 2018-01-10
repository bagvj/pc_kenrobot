#ifndef UPER_STEP_H
#define UPER_STEP_H

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif

class Step {
public:
	// pin: 中断引脚，
	Step(int pin, void (*callback)(void));

	//计数开始，type：触发方式，默认上升沿触发
	void begin(int type = RISING);

	//停止计数
	void stop();

	//返回计数
	int getCount();

	//仅供中断调用
	void doCount();
private:
	// 中断回调
	void (*_callback)(void);
	//中断引脚
	int _pin;
	//计数
	int _count;
};

#endif // UPER_STEP_H

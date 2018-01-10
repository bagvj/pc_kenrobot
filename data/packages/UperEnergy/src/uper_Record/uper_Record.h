#ifndef UPER_RECORD__H
#define UPER_RECORD__H

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif

/*
 * 前引脚    后引脚    效果
 * 高电平    NC        循环播放
 * NC        高电平    播放一次
 * 低电平    低电平    停止播放
 */
class Record {
public:
	// pin: PD0~PD6，参见：uper_Pin.h
	Record(int pin);
	~Record();

	// 播放一次
	void play();

	// 循环播放
	void loop();

	// 停止播放
	void stop();

private:
	int _pin;
	int _pinA, _pinB;
};

#endif

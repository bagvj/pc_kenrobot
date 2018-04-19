#ifndef UPER__RECORD__H
#define UPER__RECORD__H

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif


class UPER_Record {
public:
	// pin: PD0~PD6，参见：uper_Pin.h
	UPER_Record(int pin);

	// 播放一次
	void play();

	// 循环播放
	void loop();

	// 停止播放
	void stop();

private:
	int _pin;
};

#endif/*UPER__RECORD__H*/

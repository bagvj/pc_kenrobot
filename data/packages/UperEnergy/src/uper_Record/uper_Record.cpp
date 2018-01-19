/**
 * \著作权 
 * @名称：  uper_Record.cpp
 * @作者：  uper
 * @版本：  v171213
 * @URL: 	http://www.uper.cc
 * @维护：  uper
 * @时间：  2017/12/13
 *
 * \说明
 * 录音模块驱动函数
 *
 * \公有方法列表
 * 
 * 		1.void play()
 * 		2.void loop()
 * 		3.void stop()
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  
 * \示例
 *  
 * 		1.uper_Record.ino
 */
#include "uper_Record.h"

UPER_Record::UPER_Record(int pin) {
	_pin = pin;
	
}
// 单曲播放
void UPER_Record::play() {

	digitalWrite(_pin, HIGH);
	delay(50);
	digitalWrite(_pin, LOW);
}
// 循环播放
void UPER_Record::loop() {

	digitalWrite(_pin, HIGH);
}
// 停止播放
void UPER_Record::stop() {

	digitalWrite(_pin, LOW);
}

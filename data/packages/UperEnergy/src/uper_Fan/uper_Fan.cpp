 /**
 * \著作权 
 * @名称：  uper_Fan.cpp
 * @作者：  uper
 * @版本：  v171213
 * @URL: 	http://www.uper.cc
 * @维护：  uper
 * @时间：  2017/12/13
 *
 * \说明
 * uper_Fan 风扇驱动函数
 *
 * \公有方法列表
 * 
 * 		1.void UPER_Fan::begin()
 * 		2.void UPER_Fan::run(int speed, bool direction)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  
 * \示例
 *  
 * 		1.uper_Fan.ino
 */

#include "uper_Fan.h"

const int FAN_PINS[8] = {
	2, 3,
	4, 5,
	8, 9,
	10, 11
};

UPER_Fan::UPER_Fan(int fa) {
	_fa = CHECK_FAN_PIN(fa);

	if(_fa != FAN_UN_USE) {
		_pin1 = FAN_PINS[2 * (_fa - 1)];
		_pin2 = FAN_PINS[2 * _fa - 1];
	}
}

UPER_Fan::~UPER_Fan() {

}

void UPER_Fan::begin() {
	if(_fa != FAN_UN_USE) {
		pinMode(_pin1, OUTPUT);
	}
}

void UPER_Fan::run(int speed, bool direction) {
	speed = speed < 0 ? 0 : (speed > 100 ? 255 : map(speed, 0, 100, 0, 255));

	if(_fa != FAN_UN_USE) {
		digitalWrite(_pin1, direction ? LOW : HIGH);
		analogWrite(_pin2, speed);
	}
}

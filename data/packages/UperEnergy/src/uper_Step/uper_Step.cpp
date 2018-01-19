 /**
 * \著作权 
 * @名称：  uper_Step.cpp
 * @作者：  uper
 * @版本：  v171213
 * @URL: 	http://www.uper.cc
 * @维护：  uper
 * @时间：  2017/12/13
 *
 * \说明
 * 计步传感器驱动
 *
 * \公有方法列表
 * 
 * 		1.uper_Step(int pin, void (*callback)(void))
 * 		2.void begin(int type = RISING)
 * 		3.void stop()
 *		4.int getCount()
 *		5.void doCount()
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  
 * \示例
 *  
 * 		1.uper_Step.ino
 */
#include "uper_Step.h"

uper_Step::uper_Step(int pin, void (*callback)(void)) {
	_pin = pin;
	_callback = callback;
}

void uper_Step::begin(int type) {
	_count = 0;
	pinMode(_pin, INPUT_PULLUP);
	attachInterrupt(digitalPinToInterrupt(_pin), _callback, type);
}

void uper_Step::stop() {
	detachInterrupt(digitalPinToInterrupt(_pin));
}

int uper_Step::getCount() {
	return _count;
}

void uper_Step::doCount() {
	_count++;
}

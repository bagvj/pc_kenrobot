 /**
 * \著作权
 * @名称：  uper_Turn.cpp
 * @作者：  uper
 * @版本：  v180322
 * @URL: 	http://www.uper.cc
 * @维护：  uper
 * @时间：  2018/03/22
 *
 * \说明
 * 计步传感器驱动
 *
 * \公有方法列表
 *
 * 		1.Uper_Turn(int pin, int pin1, int pin2, void (*callback)(void))
 *      2.Uper_Turn(int pin1, int pin2)
 * 		3.void begin(int type = RISING)
 * 		4.void stop()
 *		5.int getCount()							//脉冲计数
 *		6.void doCount()							//中断计数
 *		7.void turn_Forward()           //正转
 *		8.void turn_Reversal()          //反转
 *		9.void turn_Stop()              //停止
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *
 * \示例
 *
 * 		1.uper_Turn.ino
 */
#include "uper_Turn.h"

Uper_Turn::Uper_Turn(int pin, int pin1, int pin2, void (*callback)(void)) {
	_pin = pin;
	_pin1 = pin1;
	_pin2 = pin2;
	_callback = callback;
}

Uper_Turn::Uper_Turn(int pin1, int pin2) {
	_pin = -1;
	_pin1 = pin1;
	_pin2 = pin2;
}

void Uper_Turn::begin(int type) {
	_count = 0;
	pinMode(_pin1, OUTPUT);
	pinMode(_pin2, OUTPUT);

	if(_pin != -1) {
		pinMode(_pin, INPUT);
		attachInterrupt(digitalPinToInterrupt(_pin), _callback, type);
	}
}

void Uper_Turn::stop() {
	if(_pin != -1) {
		detachInterrupt(digitalPinToInterrupt(_pin));
	}
}

int Uper_Turn::getCount() {
	return _count;
}

void Uper_Turn::doCount() {
	_count++;
}

void Uper_Turn::turn_Forward(){
	 digitalWrite(_pin1, HIGH);//正转
  	 digitalWrite(_pin2, LOW);
}

void Uper_Turn::turn_Reversal(){
	 digitalWrite(_pin2, HIGH);//反转
  	 digitalWrite(_pin1, LOW);
}

void Uper_Turn::turn_Stop(){
	 digitalWrite(_pin2, LOW);//停止
  	 digitalWrite(_pin1, LOW);
}

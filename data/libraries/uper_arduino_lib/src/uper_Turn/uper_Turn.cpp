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
 * 		1.uper_Turn(int pin, void (*callback)(void))
 * 		2.void begin(int type = RISING)
 * 		3.void stop()
 *		4.int getCount()
 *		5.void doCount()
 *		6.turn_Forward(int pin1,int pin2)
 *		7.turn_Reversal(int pin1,int pin2)
 *		8.turn_Stop(int pin1,int pin2)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  
 * \示例
 *  
 * 		1.uper_Turn.ino
 */
#include "uper_Turn.h"

Uper_Turn::Uper_Turn(int pin, void (*callback)(void)) {
	_pin = pin;
	_callback = callback;
}

void Uper_Turn::begin(int type) {
	_count = 0;
	pinMode(_pin, INPUT);
	attachInterrupt(digitalPinToInterrupt(_pin), _callback, type);
}

void Uper_Turn::stop() {
	detachInterrupt(digitalPinToInterrupt(_pin));
}

int Uper_Turn::getCount() {
	return _count;
}

void Uper_Turn::doCount() {
	_count++;
}
void Uper_Turn::turn_Forward(int pin1,int pin2){
	 digitalWrite(pin1, HIGH);//正转
  	digitalWrite(pin2, LOW);
}
void Uper_Turn::turn_Reversal(int pin1,int pin2){
	 digitalWrite(pin2, HIGH);//反转
  	digitalWrite(pin1, LOW);
}
void Uper_Turn::turn_Stop(int pin1,int pin2){
	 digitalWrite(pin2, LOW);//停止
  	digitalWrite(pin1, LOW);
}
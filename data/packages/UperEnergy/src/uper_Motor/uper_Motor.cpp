 /**
 * \著作权 
 * @名称：  uper_Motor.cpp
 * @作者：  uper
 * @版本：  v171213
 * @URL: 	http://www.uper.cc
 * @维护：  uper
 * @时间：  2017/12/13
 *
 * \说明
 * 步进电机传感器驱动函数
 *
 * \公有方法列表
 * 
 * 		1.UPER_Motor(int ma, int mb)
 * 		2.void begin()
 * 		3.void run(int index, int speed, bool direction)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  
 * \示例
 *  
 * 		1.uper_Motor.ino
 */
#include "uper_Motor.h"

const int MOTOR_PINS[8] = {
	2, 3,
	4, 5,
	8, 9,
	10, 11
};

UPER_Motor::UPER_Motor(int ma, int mb) {
	_ma = CHECK_MOTOR_PIN(ma);
	_mb = CHECK_MOTOR_PIN(mb);

	if(_ma != MOTOR_UN_USE) {
		_maPin1 = MOTOR_PINS[2 * (_ma - 1)];
		_maPin2 = MOTOR_PINS[2 * _ma - 1];
	}

	if(_mb != MOTOR_UN_USE) {
		_mbPin1 = MOTOR_PINS[2 * (_mb - 1)];
		_mbPin2 = MOTOR_PINS[2 * _mb - 1];
	}
}

UPER_Motor::~UPER_Motor() {

}

void UPER_Motor::begin() {
	if(_ma != MOTOR_UN_USE) {
		pinMode(_maPin1, OUTPUT);
	}

	if(_mb != MOTOR_UN_USE) {
		pinMode(_mbPin1, OUTPUT);
	}
}

void UPER_Motor::run(int index, int speed, bool direction) {
	if(index != 1 && index != 2) {
		return;
	}

	speed = speed < 0 ? 0 : (speed > 100 ? 255 : map(speed, 0, 100, 0, 255));
	speed = direction ? 255 - speed : speed;

	if(index == 1 && _ma != MOTOR_UN_USE) {
		digitalWrite(_maPin1, direction ? HIGH : LOW);
		analogWrite(_maPin2, speed);
	} else if(index == 2 && _mb != MOTOR_UN_USE) {
		digitalWrite(_mbPin1, direction ? HIGH : LOW);
		analogWrite(_mbPin2, speed);
	}
}

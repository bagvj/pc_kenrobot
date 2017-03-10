/**
 * date:   2017-03-06
 * author: zhouguang
 * email:  zhouguang-me@qq.com
 */

#ifndef MOTOR_H
#define MOTOR_H

#include "Arduino.h"

class Motor
{ 
public:
	Motor(int pwm1, int dir1);
	Motor(int pwm1, int dir1, int en1);
	Motor(int pwm1, int dir1, int pwm2, int dir2);
	Motor(int pwm1, int dir1, int en1, int pwm2, int dir2);
	Motor(int pwm1, int dir1, int en1, int pwm2, int dir2, int en2);

	void setSpeed(int index, int speed);
	void setDirection(int index, bool direction);
	void stop(int index);
	void run(int index, bool direction,int speed);
private:
	int _pwmPin1, _pwmPin2, _dirPin1, _dirPin2, _enPin1, _enPin2;
	bool _direction1, _direction2;
	int _index1, _index2;
};

#endif
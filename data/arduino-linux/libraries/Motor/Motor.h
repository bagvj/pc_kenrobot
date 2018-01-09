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
	Motor(int pwm1, int in1);

	Motor(int pwm1, int in1, int in2);
	Motor(int pwm1, int in1, const char* in2);

	Motor(int pwm1, int in1, int pwm2, int in3);

	Motor(int pwm1, int in1, int in2, int pwm2, int in3);
	Motor(int pwm1, int in1, const char* in2, int pwm2, int in3);

	Motor(int pwm1, int in1, int in2, int pwm2, int in3, int in4);
	Motor(int pwm1, int in1, const char* in2, int pwm2, int in3, const char* in4);

	void setSpeed(int index, int speed);
	void setDirection(int index, bool direction);
	void stop(int index);
	void run(int index, bool direction,int speed);
private:
	int _pwmPin1, _pwmPin2, _in1, _in3, _in2, _in4;
	bool _isEnPin1, _isEnPin2;
	bool _direction1, _direction2;
	int _index1, _index2;

};

#endif

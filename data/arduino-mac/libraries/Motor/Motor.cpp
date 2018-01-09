/**
 * date:   2017-03-06
 * author: zhouguang
 * email:  zhouguang-me@qq.com
 */

#include "Arduino.h"
#include "Motor.h"

Motor::Motor(int pwm1, int in1)
{
	_pwmPin1 = pwm1;
	_in1 = in1;
	_in2 = -1;
	pinMode(_in1, OUTPUT);
	_index1 = 1;
	_index2 = 0;
}

Motor::Motor(int pwm1, int in1, int in2)
{
	_pwmPin1 = pwm1;
	_in1 = in1;
	_in2 = in2;
	_isEnPin1 = true;
	pinMode(_in1, OUTPUT);
	_index1 = 1;
	_index2 = 0;
}

Motor::Motor(int pwm1, int in1, const char* in2)
{
	_pwmPin1 = pwm1;
	_in1 = in1;
	_in2 = strcmp(in2, "GND") == 0 ? 0 : 1;
	pinMode(_in1, OUTPUT);
	_index1 = 1;
	_index2 = 0;
}

Motor::Motor(int pwm1, int in1, int pwm2, int in3)
{
	_pwmPin1 = pwm1;
	_in1 = in1;
	_in2 = -1;
	pinMode(_in1, OUTPUT);
	_index1 = 1;

	_pwmPin2 = pwm2;
	_in3 = in3;
	_in4 = -1;
	pinMode(_in3, OUTPUT);
	_index2 = 2;
}

Motor::Motor(int pwm1, int in1, int in2, int pwm2, int in3)
{
	_pwmPin1 = pwm1;
	_in1 = in1;
	_in2 = in2;
	_isEnPin1 = true;
	pinMode(_in1, OUTPUT);
	_index1 = 1;

	_pwmPin2 = pwm2;
	_in3 = in3;
	_in4 = -1;
	pinMode(_in3, OUTPUT);
	_index2 = 2;
}

Motor::Motor(int pwm1, int in1, const char* in2, int pwm2, int in3)
{
	_pwmPin1 = pwm1;
	_in1 = in1;
	_in2 = strcmp(in2, "GND") == 0 ? 0 : 1;
	pinMode(_in1, OUTPUT);
	_index1 = 1;

	_pwmPin2 = pwm2;
	_in3 = in3;
	_in4 = -1;
	pinMode(_in3, OUTPUT);
	_index2 = 2;
}

Motor::Motor(int pwm1, int in1, int in2, int pwm2, int in3, int in4)
{
	_pwmPin1 = pwm1;
	_in1 = in1;
	_in2 = in2;
	_isEnPin1 = true;
	pinMode(_in1, OUTPUT);
	_index1 = 1;

	_pwmPin2 = pwm2;
	_in3 = in3;
	_in4 = in4;
	_isEnPin2 = true;
	pinMode(_in3, OUTPUT);
	_index2 = 2;
}

Motor::Motor(int pwm1, int in1, const char* in2, int pwm2, int in3, const char* in4)
{
	_pwmPin1 = pwm1;
	_in1 = in1;
	_in2 = strcmp(in2, "GND") == 0 ? 0 : 1;
	pinMode(_in1, OUTPUT);
	_index1 = 1;

	_pwmPin2 = pwm2;
	_in3 = in3;
	_in4 = strcmp(in4, "GND") == 0 ? 0 : 1;
	pinMode(_in3, OUTPUT);
	_index2 = 2;
}


void Motor::run(int index, bool direction, int speed)
{
	setDirection(index, direction);
	setSpeed(index, speed);
}

void Motor::setSpeed(int index, int speed)
{
	speed = speed > 100 ? 100 : (speed < 0 ? 0 : speed);
	speed = map(speed, 0, 100, 0, 255);
	if (index == 1 && _index1 == 1)
	{
		if((_isEnPin1 && digitalRead(_in2) == 0) || _in2 == 0)
		{
			analogWrite(_pwmPin1, speed);
		}
	}
	else if (index == 2 && _index2 == 2)
	{
		if((_isEnPin2 && digitalRead(_in4) == 0) || _in4 == 0)
		{
			analogWrite(_pwmPin2, speed);
		}
	}
}

void Motor::setDirection(int index, bool direction)
{
	if(index == 1 && _index1 == 1)
	{
		_direction1 = direction;
		digitalWrite(_in1, _direction1);
	}
	else if(index == 2 && _index2 == 2)
	{
		_direction2 = direction;
		digitalWrite(_in3, _direction2);
	}
}

void Motor::stop(int index)
{
	if(index == 1 && _index1 == 1)
	{
		setDirection(index, !_direction1);
		delay(100);
		setSpeed(index, 0);
	}
	else if(index == 2 && _index2 == 2)
	{
		setDirection(index, !_direction2);
		delay(100);
		setSpeed(index, 0);
	}
}

/**
 * date:   2017-03-06
 * author: zhouguang
 * email:  zhouguang-me@qq.com
 */

#include "Arduino.h"
#include "Motor.h"

Motor::Motor(int pwm1, int dir1)
{
	_pwmPin1 = pwm1;
	_dirPin1 = dir1;
	_en1 = -1;
	pinMode(_dirPin1, OUTPUT);
	_index1 = 1;
	_index2 = 0;
}

Motor::Motor(int pwm1, int dir1, int en1)
{
	_pwmPin1 = pwm1;
	_dirPin1 = dir1;
	_en1 = en1;
	_isEnPin1 = true;
	pinMode(_dirPin1, OUTPUT);
	_index1 = 1;
	_index2 = 0;
}

Motor::Motor(int pwm1, int dir1, const char* en1)
{
	_pwmPin1 = pwm1;
	_dirPin1 = dir1;
	_en1 = strcmp(en1, "GND") == 0 ? 0 : 1;
	pinMode(_dirPin1, OUTPUT);
	_index1 = 1;
	_index2 = 0;
}

Motor::Motor(int pwm1, int dir1, int pwm2, int dir2)
{
	_pwmPin1 = pwm1;
	_dirPin1 = dir1;
	_en1 = -1;
	pinMode(_dirPin1, OUTPUT);
	_index1 = 1;

	_pwmPin2 = pwm2;
	_dirPin2 = dir2;
	_en2 = -1;
	pinMode(_dirPin2, OUTPUT);
	_index2 = 2;
}

Motor::Motor(int pwm1, int dir1, int en1, int pwm2, int dir2)
{
	_pwmPin1 = pwm1;
	_dirPin1 = dir1;
	_en1 = en1;
	_isEnPin1 = true;
	pinMode(_dirPin1, OUTPUT);
	_index1 = 1;

	_pwmPin2 = pwm2;
	_dirPin2 = dir2;
	_en2 = -1;
	pinMode(_dirPin2, OUTPUT);
	_index2 = 2;
}

Motor::Motor(int pwm1, int dir1, const char* en1, int pwm2, int dir2)
{
	_pwmPin1 = pwm1;
	_dirPin1 = dir1;
	_en1 = strcmp(en1, "GND") == 0 ? 0 : 1;
	pinMode(_dirPin1, OUTPUT);
	_index1 = 1;

	_pwmPin2 = pwm2;
	_dirPin2 = dir2;
	_en2 = -1;
	pinMode(_dirPin2, OUTPUT);
	_index2 = 2;
}

Motor::Motor(int pwm1, int dir1, int en1, int pwm2, int dir2, int en2)
{
	_pwmPin1 = pwm1;
	_dirPin1 = dir1;
	_en1 = en1;
	_isEnPin1 = true;
	pinMode(_dirPin1, OUTPUT);
	_index1 = 1;

	_pwmPin2 = pwm2;
	_dirPin2 = dir2;
	_en2 = en2;
	_isEnPin2 = true;
	pinMode(_dirPin2, OUTPUT);
	_index2 = 2;
}

Motor::Motor(int pwm1, int dir1, const char* en1, int pwm2, int dir2, const char* en2)
{
	_pwmPin1 = pwm1;
	_dirPin1 = dir1;
	_en1 = strcmp(en1, "GND") == 0 ? 0 : 1;
	pinMode(_dirPin1, OUTPUT);
	_index1 = 1;

	_pwmPin2 = pwm2;
	_dirPin2 = dir2;
	_en2 = strcmp(en2, "GND") == 0 ? 0 : 1;
	pinMode(_dirPin2, OUTPUT);
	_index2 = 2;
}


void Motor::run(int index, bool direction, int speed)
{
	setDirection(index, direction);
	setSpeed(index, speed);
}

void Motor::setSpeed(int index, int speed)
{
	if (index == 1 && _index1 == 1)
	{
		if((_isEnPin1 && digitalRead(_en1) == 0) || _en1 == 0)
		{
			analogWrite(_pwmPin1, speed);
		}
	}
	else if (index == 2 && _index2 == 2)
	{
		if((_isEnPin2 && digitalRead(_en2) == 0) || _en2 == 0)
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
		digitalWrite(_dirPin1, _direction1);
	}
	else if(index == 2 && _index2 == 2)
	{
		_direction2 = direction;
		digitalWrite(_dirPin2, _direction2);
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
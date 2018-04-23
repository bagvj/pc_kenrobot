 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_AccelStepper.h
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2018/04/19
 * @描述：  步进电机驱动函数。Kenblock_AccelStepper.cpp 的头文件。
 *
 * \说明
 * thanks for mike McCauley code
 * 步进电机加减速运行至指定步数。
 *
 * \方法列表（仅列出常用函数）
 * 
 * 		1. void    moveTo(long absolute);                 //移动至绝对位置
 * 		2. void    move(long relative);                   //移动至绝对位置
 * 		3. boolean run();                                 //运行电机
 * 		4. void    setAcceleration(float acceleration);   //设置加速度
 *      5. void    setMaxSpeed(float speed);              //设置最大速度
 *      6. void    setSpeed(float speed);                 //设置匀速运动速度
 *      7. void    runSpeed();                            //以设定速度运行
 *      8. void    runSpeedToPosition();                  //以设定速度运行至设定位置
 *      9. long    distanceToGo();                        //获取当前剩余步数
 *
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  RJK            2018/04/19        0.1.0              新建库文件。
 *  
 * \示例
 *  
 * 		1.Stepper_Run_continuously.ino      //以恒定速度持续运行
 * 		2.Stepper_Runspeed.ino              //匀速运行至目标点
 * 		3.Steppers_Accel.ino                //步进电机加减速运行
 * 		4.Steppers_Overshoot.ino            //超调回零
 * 		5.Steppers_quickstop.ino            //快速停止
 */


#include "Kenblock_AccelStepper.h"
#include "Kenblock.h"
	/**
	 * \函数：KenAccelStepper
	 * \说明：替代构造函数，映射步进电机驱动引脚设置函数，分配输出引脚
	 * \输入参数：
	 *      port - 主板电机接口。
	 *   	motor - 驱动的电机 一个驱动模块可以驱动两个电机
	 *   	如（连接 PD5  接口，则还需要选择该驱动上连接的电机M1 和 M2）
	 * \输出参数：无
	 * \返回值：无
	 * \其他：无
	 */
KenAccelStepper::KenAccelStepper(uint8_t port,uint8_t motor)
{
	if(motor == 1)
	{	
	_dir = Ex_Quadruple_Digital[port].d1;
	_step = Ex_Quadruple_Digital[port].d2;
	}

	else if(motor == 2)
	{
	_dir =  Ex_Quadruple_Digital[port].d3;
	_step = Ex_Quadruple_Digital[port].d4;
	}
	
    _interface = 1;
    _currentPos = 0;
    _targetPos = 0;
    _speed = 0.0;
    _maxSpeed = 1.0;
    _acceleration = 0.0;
    _sqrt_twoa = 1.0;
    _stepInterval = 0;
    _minPulseWidth = 1;
    _enablePin = 0xff;
    _lastStepTime = 0;
	
    _pin[0] = _step;
    _pin[1] = _dir;
	
    _n = 0;
    _c0 = 0.0;
    _cn = 0.0;
    _cmin = 1.0;
    _direction = DIRECTION_CCW;

    int i;
    for (i = 0; i < 4; i++)
	_pinInverted[i] = 0;

	enableOutputs();
    setAcceleration(1);
}

	/**
	 * \函数：setAcceleration
	 * \说明：设置电机加速度
	 * \输入参数：acceleration
	 * \输出参数：无
	 * \返回值：无
	 * \其他：无
	 */
void KenAccelStepper::setAcceleration(float acceleration)
{
    if (acceleration == 0.0)
	return;
    if (acceleration < 0.0)
      acceleration = -acceleration;
    if (_acceleration != acceleration)
    {
	_n = _n * (_acceleration / acceleration);
	_c0 = 0.676 * sqrt(2.0 / acceleration) * 1000000.0; 
	_acceleration = acceleration;
	computeNewSpeed();
    }
}

	/**
	 * \函数：setMaxSpeed
	 * \说明：设置电机运行的最大速度
	 * \输入参数：speed
	 * \输出参数：无
	 * \返回值：无
	 * \其他：无
	 */	
void KenAccelStepper::setMaxSpeed(float speed)
{
    if (speed < 0.0)
       speed = -speed;
    if (_maxSpeed != speed)
    {
	_maxSpeed = speed;
	_cmin = 1000000.0 / speed;

	if (_n > 0)
	{
	    _n = (long)((_speed * _speed) / (2.0 * _acceleration)); // Equation 16
	    computeNewSpeed();
	}
    }
}
	/**
	 * \函数：moveTo
	 * \说明：移动至绝对位置步数，以0点作为参考
	 * \输入参数：
	 *      absolute - 绝对位置步数。
	 * \输出参数：无
	 * \返回值：无
	 * \其他：无
	 */
void KenAccelStepper::moveTo(long absolute)
{
    if (_targetPos != absolute)
    {
	_targetPos = absolute;
	computeNewSpeed();
	// compute new n?
    }
}
	/**
	 * \函数：move
	 * \说明：移动至相对位置步数，以之前运行过的步数作为参考
	 * \输入参数：
	 *      relative - 相对位置步数。
	 * \输出参数：无
	 * \返回值：无
	 * \其他：无
	 */
void KenAccelStepper::move(long relative)
{
    moveTo(_currentPos + relative);
}

	/**
	 * \函数：run
	 * \说明：使电机开始运行
	 * \输入参数：无
	 * \输出参数：无
	 * \返回值：boolean 正在运行返回：true 运行完毕返回：false
	 * \其他：无
	 */
boolean KenAccelStepper::run()
{
    if (runSpeed())
	computeNewSpeed();
    return _speed != 0.0 || distanceToGo() != 0;
}


	/**
	 * \函数：distanceToGo
	 * \说明：获取剩余的步数
	 * \输入参数：无
	 * \输出参数：无
	 * \返回值：long  剩余的步数
	 * \其他：无
	 */	
long KenAccelStepper::distanceToGo()
{
    return _targetPos - _currentPos;
}
	/**
	 * \函数：currentPosition
	 * \说明：获取当前的步进位置
	 * \输入参数：无
	 * \输出参数：无
	 * \返回值：long  当前的步进位置
	 * \其他：无
	 */	
long KenAccelStepper::currentPosition()
{
    return _currentPos;
}
	/**
	 * \函数：runToPosition
	 * \说明：等到设置的步数运行完毕
	 * \输入参数：无
	 * \输出参数：无
	 * \返回值：无
	 * \其他：无
	 */	
void KenAccelStepper::runToPosition()
{
    while (run())
	;
}
	/**
	 * \函数：stop
	 * \说明：停止任何正在运行的电机
	 * \输入参数：无
	 * \输出参数：无
	 * \返回值：无
	 * \其他：无
	 */	
void KenAccelStepper::stop()
{
    if (_speed != 0.0)
    {    
	long stepsToStop = (long)((_speed * _speed) / (2.0 * _acceleration)) + 1; 
	if (_speed > 0)
	    move(stepsToStop);
	else
	    move(-stepsToStop);
    }
}

boolean KenAccelStepper::runSpeed()
{
    if (!_stepInterval)
	return false;

    unsigned long time = micros();   
    if (time - _lastStepTime >= _stepInterval)
    {
	if (_direction == DIRECTION_CW)
	{
	    _currentPos += 1;
	}
	else
	{
	    _currentPos -= 1;
	}
	step(_currentPos);

	_lastStepTime = time; 

	return true;
    }
    else
    {
	return false;
    }
}


long KenAccelStepper::targetPosition()
{
    return _targetPos;
}

void KenAccelStepper::setCurrentPosition(long position)
{
    _targetPos = _currentPos = position;
    _n = 0;
    _stepInterval = 0;
    _speed = 0.0;
}

void KenAccelStepper::computeNewSpeed()
{
    long distanceTo = distanceToGo(); 

    long stepsToStop = (long)((_speed * _speed) / (2.0 * _acceleration)); 

    if (distanceTo == 0 && stepsToStop <= 1)
    {
	_stepInterval = 0;
	_speed = 0.0;
	_n = 0;
	return;
    }

    if (distanceTo > 0)
    {

	if (_n > 0)
	{
	    
	    if ((stepsToStop >= distanceTo) || _direction == DIRECTION_CCW)
		_n = -stepsToStop; 
	}
	else if (_n < 0)
	{
	    
	    if ((stepsToStop < distanceTo) && _direction == DIRECTION_CW)
		_n = -_n; 
	}
    }
    else if (distanceTo < 0)
    {
	if (_n > 0)
	{
	    if ((stepsToStop >= -distanceTo) || _direction == DIRECTION_CW)
		_n = -stepsToStop;
	}
	else if (_n < 0)
	{
	    if ((stepsToStop < -distanceTo) && _direction == DIRECTION_CCW)
		_n = -_n;
	}
    }

    if (_n == 0)
    {
	_cn = _c0;
	_direction = (distanceTo > 0) ? DIRECTION_CW : DIRECTION_CCW;
    }
    else
    {
	_cn = _cn - ((2.0 * _cn) / ((4.0 * _n) + 1)); 
	_cn = max(_cn, _cmin); 
    }
    _n++;
    _stepInterval = _cn;
    _speed = 1000000.0 / _cn;
    if (_direction == DIRECTION_CCW)
	_speed = -_speed;

}



float   KenAccelStepper::maxSpeed()
{
    return _maxSpeed;
}

void KenAccelStepper::setSpeed(float speed)
{
    if (speed == _speed)
        return;
    speed = constrain(speed, -_maxSpeed, _maxSpeed);
    if (speed == 0.0)
	_stepInterval = 0;
    else
    {
	_stepInterval = fabs(1000000.0 / speed);
	_direction = (speed > 0.0) ? DIRECTION_CW : DIRECTION_CCW;
    }
    _speed = speed;
}

float KenAccelStepper::speed()
{
    return _speed;
}

void KenAccelStepper::step(long step)
{
    switch (_interface)
    {

	case 1:
	    step1(step);
	    break; 
    }
}

void KenAccelStepper::setOutputPins(uint8_t mask)
{
    uint8_t numpins = 2;

    uint8_t i;
    for (i = 0; i < numpins; i++)
	digitalWrite(_pin[i], (mask & (1 << i)) ? (HIGH ^ _pinInverted[i]) : (LOW ^ _pinInverted[i]));
}


void KenAccelStepper::step1(long step)
{
    (void)(step); 

    setOutputPins(_direction ? 0b10 : 0b00);
    setOutputPins(_direction ? 0b11 : 0b01);

    delayMicroseconds(_minPulseWidth);
    setOutputPins(_direction ? 0b10 : 0b00);
}


void    KenAccelStepper::disableOutputs()
{   
    if (! _interface) return;

    setOutputPins(0);
    if (_enablePin != 0xff)
    {
        pinMode(_enablePin, OUTPUT);
        digitalWrite(_enablePin, LOW ^ _enableInverted);
    }
}

void    KenAccelStepper::enableOutputs()
{
    if (! _interface) 
	return;

    pinMode(_pin[0], OUTPUT);
    pinMode(_pin[1], OUTPUT);
    
    if (_enablePin != 0xff)
    {
        pinMode(_enablePin, OUTPUT);
        digitalWrite(_enablePin, HIGH ^ _enableInverted);
    }
}

void KenAccelStepper::setMinPulseWidth(unsigned int minWidth)
{
    _minPulseWidth = minWidth;
}

void KenAccelStepper::setEnablePin(uint8_t enablePin)
{
    _enablePin = enablePin;

    if (_enablePin != 0xff)
    {
        pinMode(_enablePin, OUTPUT);
        digitalWrite(_enablePin, HIGH ^ _enableInverted);
    }
}

void KenAccelStepper::setPinsInverted(bool directionInvert, bool stepInvert, bool enableInvert)
{
    _pinInverted[0] = stepInvert;
    _pinInverted[1] = directionInvert;
    _enableInverted = enableInvert;
}

void KenAccelStepper::setPinsInverted(bool pin1Invert, bool pin2Invert, bool pin3Invert, bool pin4Invert, bool enableInvert)
{    
    _pinInverted[0] = pin1Invert;
    _pinInverted[1] = pin2Invert;
    _pinInverted[2] = pin3Invert;
    _pinInverted[3] = pin4Invert;
    _enableInverted = enableInvert;
}


boolean KenAccelStepper::runSpeedToPosition()
{
    if (_targetPos == _currentPos)
	return false;
    if (_targetPos >_currentPos)
	_direction = DIRECTION_CW;
    else
	_direction = DIRECTION_CCW;
    return runSpeed();
}

void KenAccelStepper::runToNewPosition(long position)
{
    moveTo(position);
    runToPosition();
}


bool KenAccelStepper::isRunning()
{
    return !(_speed == 0.0 && _targetPos == _currentPos);
}

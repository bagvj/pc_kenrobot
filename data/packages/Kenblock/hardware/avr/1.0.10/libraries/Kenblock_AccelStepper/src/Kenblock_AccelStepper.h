 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_AccelStepper.h
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2018/04/19
 * @描述：  步进电机驱动函数。Kenblock_AccelStepper.h 
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


#ifndef Kenblock_AccelStepper_h
#define Kenblock_AccelStepper_h

#include <stdlib.h>
#if ARDUINO >= 100
#include <Arduino.h>
#else
#include <WProgram.h>
#include <wiring.h>
#endif

#undef round
#undef PD5
#undef PD6
#undef PA3

#undef M1
#undef M2

#define PD5 0X02
#define PD6 0X03 
#define PA3 0X01

#define M1 1
#define M2 2

class KenAccelStepper
{
public:
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
	KenAccelStepper( uint8_t port,uint8_t motor);
	/**
	 * \函数：setAcceleration
	 * \说明：设置电机加速度
	 * \输入参数：acceleration
	 * \输出参数：无
	 * \返回值：无
	 * \其他：无
	 */
	void    setAcceleration(float acceleration);
	
	/**
	 * \函数：setMaxSpeed
	 * \说明：设置电机运行的最大速度
	 * \输入参数：speed
	 * \输出参数：无
	 * \返回值：无
	 * \其他：无
	 */	
	void    setMaxSpeed(float speed);
	/**
	 * \函数：moveTo
	 * \说明：移动至绝对位置步数，以0点作为参考
	 * \输入参数：
	 *      absolute - 绝对位置步数。
	 * \输出参数：无
	 * \返回值：无
	 * \其他：无
	 */
    void    moveTo(long absolute); 
	/**
	 * \函数：move
	 * \说明：移动至相对位置步数，以之前运行过的步数作为参考
	 * \输入参数：
	 *      relative - 相对位置步数。
	 * \输出参数：无
	 * \返回值：无
	 * \其他：无
	 */
    void    move(long relative);
	/**
	 * \函数：run
	 * \说明：使电机开始运行
	 * \输入参数：无
	 * \输出参数：无
	 * \返回值：boolean 正在运行返回：true 运行完毕返回：false
	 * \其他：无
	 */
    boolean run();

	/**
	 * \函数：stop
	 * \说明：停止任何正在运行的电机
	 * \输入参数：无
	 * \输出参数：无
	 * \返回值：无
	 * \其他：无
	 */	
	void stop();
	/**
	 * \函数：distanceToGo
	 * \说明：获取剩余的步数
	 * \输入参数：无
	 * \输出参数：无
	 * \返回值：long  剩余的步数
	 * \其他：无
	 */	
	long    distanceToGo();
	/**
	 * \函数：currentPosition
	 * \说明：获取当前的步进位置
	 * \输入参数：无
	 * \输出参数：无
	 * \返回值：long  当前的步进位置
	 * \其他：无
	 */	
	long    currentPosition(); 
	/**
	 * \函数：runToPosition
	 * \说明：等到设置的步数运行完毕
	 * \输入参数：无
	 * \输出参数：无
	 * \返回值：无
	 * \其他：无
	 */	
	void    runToPosition();

	

    boolean runSpeed();

    float   maxSpeed();

    void    setSpeed(float speed);

    float   speed();

    

    long    targetPosition();

    

    void    setCurrentPosition(long position);  
    
    

    boolean runSpeedToPosition();

    void    runToNewPosition(long position);

    virtual void    disableOutputs();

    virtual void    enableOutputs();

    void    setMinPulseWidth(unsigned int minWidth);

    void    setEnablePin(uint8_t enablePin = 0xff);

    void    setPinsInverted(bool directionInvert = false, bool stepInvert = false, bool enableInvert = false);

    void    setPinsInverted(bool pin1Invert, bool pin2Invert, bool pin3Invert, bool pin4Invert, bool enableInvert);

    bool    isRunning();

protected:

	
    typedef enum
    {
	DIRECTION_CCW = 0,  ///< Counter-Clockwise
        DIRECTION_CW  = 1   ///< Clockwise
    } Direction;

    void           computeNewSpeed();

    virtual void   setOutputPins(uint8_t mask);

    virtual void   step(long step);

    virtual void   step1(long step);

    boolean _direction; // 1 == CW
    
private:
	
	volatile uint8_t _dir;   //方向引脚
	volatile uint8_t _step;  //脉冲引脚
	
    uint8_t        _interface;          

    uint8_t        _pin[2];

    uint8_t        _pinInverted[2];

    long           _currentPos;    // Steps

    long           _targetPos;     // Steps

    float          _speed;         // Steps per second

    float          _maxSpeed;

    float          _acceleration;
    float          _sqrt_twoa; // Precomputed sqrt(2*_acceleration)

    unsigned long  _stepInterval;

    unsigned long  _lastStepTime;

    unsigned int   _minPulseWidth;

    bool           _enableInverted;

    uint8_t        _enablePin;

    void (*_forward)();

    void (*_backward)();

    long _n;

    float _c0;

    float _cn;

    float _cmin; // at max speed

};



#endif 

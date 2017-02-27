 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  RoBuzzer.cpp
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  蜂鸣器驱动函数。
 *
 * \说明
 * 蜂鸣器驱动函数。发出不同音符。
 *
 * \方法列表
 * 
 * 		1. void RoBuzzer::setPin(uint8_t pin)
 * 		2. void RoBuzzer::tone(uint16_t frequency, uint32_t duration)
 * 		3. void RoBuzzer::tone(uint8_t pin, uint16_t frequency, uint32_t duration)
 * 		4. void RoBuzzer::didi(void)
 * 		5. void RoBuzzer::didi(uint8_t pin)
 * 		6. void RoBuzzer::noTone(void)
 * 		7. void RoBuzzer::noTone(uint8_t pin)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建库文件。
 *  
 * \示例
 *  
 * 		1.BuzzerTest1.ino
 * 		1.BuzzerTest2.ino
 */
 
#include "RoBuzzer.h"

/**
 * \函数：RoBuzzer
 * \说明：初始化，不做任何操作
 * \输入参数：无
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
RoBuzzer::RoBuzzer(void)
{
	
}


/**
 * \函数：RoBuzzer
 * \说明：替代构造函数，映射蜂鸣器模块引脚设置函数，设置输出引脚
 * \输入参数：
 *   pin - 蜂鸣器控制引脚
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */	
RoBuzzer::RoBuzzer(uint8_t pin)
{
	_buzzer_pin = pin;
	pinMode(_buzzer_pin, OUTPUT);
}


/**
 * \函数：setpin
 * \说明：设置蜂鸣器的控制引脚
 * \输入参数：
 *   pin - 蜂鸣器控制引脚
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void RoBuzzer::setPin(uint8_t pin)
{
	_buzzer_pin = pin;
	pinMode(_buzzer_pin, OUTPUT);
}

/**
 * \函数：tone
 * \说明：播放音调
 * \输入参数：
 *   frequency - 蜂鸣器音调的频率 （Hz）
 *   duration - 蜂鸣器音调持续时间（ms）	 
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void RoBuzzer::tone(uint16_t frequency, uint32_t duration)
{
	int period = 1000000L / frequency;
	int pulse = period / 2;
	pinMode(_buzzer_pin, OUTPUT);
	for (long i = 0; i < duration * 1000L; i += period) 
	{
		digitalWrite(_buzzer_pin, HIGH);
		delayMicroseconds(pulse);
		digitalWrite(_buzzer_pin, LOW);
		delayMicroseconds(pulse);
	}
}

/**
 * \函数：tone
 * \说明：播放音调
 * \输入参数：
 *   pin - 蜂鸣器控制引脚
 *   frequency - 蜂鸣器音调的频率 （Hz）
 *   duration - 蜂鸣器音调持续时间（ms）	 
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void RoBuzzer::tone(uint8_t pin, uint16_t frequency, uint32_t duration)
{
	_buzzer_pin = pin;	
	int period = 1000000L / frequency;
	int pulse = period / 2;
	pinMode(_buzzer_pin, OUTPUT);
	for (long i = 0; i < duration * 1000L; i += period) 
	{
		digitalWrite(_buzzer_pin, HIGH);
		delayMicroseconds(pulse);
		digitalWrite(_buzzer_pin, LOW);
		delayMicroseconds(pulse);
	}
	//延长适当时间，似乎时间延长30%效果更好
	//int duration_delay = duration * 1.30;
    //delay(duration_delay);
}

/**
 * \函数：didi
 * \说明：蜂鸣器发出“滴滴”的声音
 * \输入参数：无
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void RoBuzzer::didi(void)
{
	RoBuzzer::tone(_buzzer_pin, 2300, 300);	//发出300ms声响
	delay(50);               		//延时50ms
	RoBuzzer::tone(_buzzer_pin, 2300, 300);	//发出300ms声响	
	delay(50); 
	
	RoBuzzer::noTone(_buzzer_pin);	
}

/**
 * \函数：didi
 * \说明：蜂鸣器发出“滴滴”的声音
 * \输入参数：无
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void RoBuzzer::didi(uint8_t pin)
{
	_buzzer_pin = pin;
	
	RoBuzzer::tone(_buzzer_pin, 2300, 200);	//发出200ms声响
	delay(50);               				//延时50ms
	RoBuzzer::tone(_buzzer_pin, 2300, 200);	//发出200ms声响	
	delay(50); 
	
	RoBuzzer::noTone(_buzzer_pin);	
}

/**
 * \函数：noTone
 * \说明：停止产生方波，即关闭蜂鸣器
 * \输入参数：无
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void RoBuzzer::noTone(void)
{
	pinMode(_buzzer_pin, OUTPUT);
	digitalWrite(_buzzer_pin, LOW);
}


/**
 * \函数：noTone
 * \说明：停止产生方波，即关闭蜂鸣器
 * \输入参数：
 *   pin - 蜂鸣器控制引脚
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void RoBuzzer::noTone(uint8_t pin)
{
	_buzzer_pin = pin;
	pinMode(_buzzer_pin, OUTPUT);
	digitalWrite(_buzzer_pin, LOW);
}























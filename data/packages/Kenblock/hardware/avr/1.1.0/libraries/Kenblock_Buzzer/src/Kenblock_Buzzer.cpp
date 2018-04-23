 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_Buzzer.cpp
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/07/21
 * @描述：  蜂鸣器驱动函数。
 *
 * \说明
 * 蜂鸣器驱动函数。发出不同音符。
 *
 * \方法列表
 * 
 * 		1. void Buzzer::setPin(uint8_t pin)
 * 		2. void Buzzer::tone(uint16_t frequency, uint32_t duration)
 * 		3. void Buzzer::tone(uint8_t pin, uint16_t frequency, uint32_t duration)
 * 		4. void Buzzer::didi(void)
 * 		5. void Buzzer::didi(uint8_t pin)
 * 		6. void Buzzer::noTone(void)
 * 		7. void Buzzer::noTone(uint8_t pin)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/07/21      0.1.0              新建库文件。
 *  
 * \示例
 *  
 * 		1.BuzzerTest1.ino
 * 		1.BuzzerTest2.ino
 */
 
#include "Kenblock_Buzzer.h"

/**
 * \函数：Buzzer
 * \说明：初始化，不做任何操作
 * \输入参数：无
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
Buzzer::Buzzer(void)
{
	
}


/**
 * \函数：Buzzer
 * \说明：替代构造函数，映射蜂鸣器模块引脚设置函数，设置输出引脚
 * \输入参数：
 *   pin - 蜂鸣器控制引脚
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */	
Buzzer::Buzzer(uint8_t pin)
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
void Buzzer::setPin(uint8_t pin)
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
void Buzzer::tone(uint16_t frequency, uint32_t duration)
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
void Buzzer::tone(uint8_t pin, uint16_t frequency, uint32_t duration)
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
void Buzzer::didi(void)
{
	Buzzer::tone(_buzzer_pin, 2300, 300);	//发出300ms声响
	delay(50);               		//延时50ms
	Buzzer::tone(_buzzer_pin, 2300, 300);	//发出300ms声响	
	delay(50); 
	
	Buzzer::noTone(_buzzer_pin);	
}

/**
 * \函数：didi
 * \说明：蜂鸣器发出“滴滴”的声音
 * \输入参数：无
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void Buzzer::didi(uint8_t pin)
{
	_buzzer_pin = pin;
	
	Buzzer::tone(_buzzer_pin, 2300, 200);	//发出200ms声响
	delay(50);               				//延时50ms
	Buzzer::tone(_buzzer_pin, 2300, 200);	//发出200ms声响	
	delay(50); 
	
	Buzzer::noTone(_buzzer_pin);	
}

/**
 * \函数：noTone
 * \说明：停止产生方波，即关闭蜂鸣器
 * \输入参数：无
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void Buzzer::noTone(void)
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
void Buzzer::noTone(uint8_t pin)
{
	_buzzer_pin = pin;
	pinMode(_buzzer_pin, OUTPUT);
	digitalWrite(_buzzer_pin, LOW);
}























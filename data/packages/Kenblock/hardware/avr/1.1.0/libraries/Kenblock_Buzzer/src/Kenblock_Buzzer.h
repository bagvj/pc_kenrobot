 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_Buzzer.h
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/07/21
 * @描述：  蜂鸣器驱动函数。Kenblock_Buzzer.c 的头文件。
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
 
#ifndef Kenblock_Buzzer_H
#define Kenblock_Buzzer_H

#include <stdint.h>
#include <stdbool.h>
#include <Arduino.h>
#include "KenblockConfig.h"


//对应于钢琴谱 88 键
#define NOTE_B0  31
#define NOTE_C1  33
#define NOTE_CS1 35
#define NOTE_D1  37
#define NOTE_DS1 39
#define NOTE_E1  41
#define NOTE_F1  44
#define NOTE_FS1 46
#define NOTE_G1  49
#define NOTE_GS1 52
#define NOTE_A1  55
#define NOTE_AS1 58
#define NOTE_B1  62
#define NOTE_C2  65
#define NOTE_CS2 69
#define NOTE_D2  73
#define NOTE_DS2 78
#define NOTE_E2  82
#define NOTE_F2  87
#define NOTE_FS2 93
#define NOTE_G2  98
#define NOTE_GS2 104
#define NOTE_A2  110
#define NOTE_AS2 117
#define NOTE_B2  123
#define NOTE_C3  131
#define NOTE_CS3 139
#define NOTE_D3  147
#define NOTE_DS3 156
#define NOTE_E3  165
#define NOTE_F3  175
#define NOTE_FS3 185
#define NOTE_G3  196
#define NOTE_GS3 208
#define NOTE_A3  220
#define NOTE_AS3 233
#define NOTE_B3  247
#define NOTE_C4  262
#define NOTE_CS4 277
#define NOTE_D4  294
#define NOTE_DS4 311
#define NOTE_E4  330
#define NOTE_F4  349
#define NOTE_FS4 370
#define NOTE_G4  392
#define NOTE_GS4 415
#define NOTE_A4  440
#define NOTE_AS4 466
#define NOTE_B4  494
#define NOTE_C5  523
#define NOTE_CS5 554
#define NOTE_D5  587
#define NOTE_DS5 622
#define NOTE_E5  659
#define NOTE_F5  698
#define NOTE_FS5 740
#define NOTE_G5  784
#define NOTE_GS5 831
#define NOTE_A5  880
#define NOTE_AS5 932
#define NOTE_B5  988
#define NOTE_C6  1047
#define NOTE_CS6 1109
#define NOTE_D6  1175
#define NOTE_DS6 1245
#define NOTE_E6  1319
#define NOTE_F6  1397
#define NOTE_FS6 1480
#define NOTE_G6  1568
#define NOTE_GS6 1661
#define NOTE_A6  1760
#define NOTE_AS6 1865
#define NOTE_B6  1976
#define NOTE_C7  2093
#define NOTE_CS7 2217
#define NOTE_D7  2349
#define NOTE_DS7 2489
#define NOTE_E7  2637
#define NOTE_F7  2794
#define NOTE_FS7 2960
#define NOTE_G7  3136
#define NOTE_GS7 3322
#define NOTE_A7  3520
#define NOTE_AS7 3729
#define NOTE_B7  3951
#define NOTE_C8  4186
#define NOTE_CS8 4435
#define NOTE_D8  4699
#define NOTE_DS8 4978

//七音符
#define Do 262
#define Re 294
#define Mi 330
#define Fa 349
#define Sol 392
#define La 440
#define Si 494
// #define C# 277
// #define D# 311
// #define F# 370
// #define G# 415
// #define A# 466


/**
 * Class: Buzzer
 * \说明：Class Buzzer 的声明
 */
class Buzzer
{
	public:
		/**
		 * \函数：Buzzer
		 * \说明：初始化，不做任何操作
		 * \输入参数：无
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		Buzzer(void);
	
		/**
		 * \函数：Buzzer
		 * \说明：替代构造函数，映射蜂鸣器模块引脚设置函数，设置输出引脚
		 * \输入参数：
		 *   pin - 蜂鸣器控制引脚
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */	
		Buzzer(uint8_t pin);
		
		/**
		 * \函数：setpin
		 * \说明：设置蜂鸣器的控制引脚
		 * \输入参数：
		 *   pin - 蜂鸣器控制引脚
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void setPin(uint8_t pin);

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
		void tone(uint16_t frequency, uint32_t duration);
		
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
		void tone(uint8_t pin, uint16_t frequency, uint32_t duration);

  		/**
		 * \函数：didi
		 * \说明：蜂鸣器发出“滴滴”的声音
		 * \输入参数：无
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void didi(void);
		
		/**
		 * \函数：didi
		 * \说明：蜂鸣器发出“滴滴”的声音
		 * \输入参数：无
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void didi(uint8_t pin);
		
		/**
		 * \函数：noTone
		 * \说明：停止产生方波，即关闭蜂鸣器
		 * \输入参数：无
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void noTone(void);
		
		/**
		 * \函数：noTone
		 * \说明：停止产生方波，即关闭蜂鸣器
		 * \输入参数：
		 *   pin - 蜂鸣器控制引脚
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void noTone(uint8_t pin);
		
	private:
		volatile uint8_t _buzzer_pin;

};
#endif // Kenblock_Buzzer_H

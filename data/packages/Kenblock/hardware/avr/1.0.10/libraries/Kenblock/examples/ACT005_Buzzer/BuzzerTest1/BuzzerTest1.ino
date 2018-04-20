/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  BuzzerTest1.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/07/21
 * @描述：  Buzzer 蜂鸣器模块测试示例。
 * 
 * \说明
 *  Buzzer 蜂鸣器模块测试示例。发出“滴滴”声。
 * 
 * \函数列表
 *  1. void Buzzer::didi(uint8_t pin)
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/07/21      0.1.0              新建程序。
 * 
 */

#include "Kenblock.h"
#include "Kenblock_Buzzer.h"

Buzzer buzzer(2);         	//蜂鸣器模块接口

void setup()
{
  
}

void loop()
{
  buzzer.didi();
  delay(2000);              //延时2000ms
}

/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  BuzzerTest1.ino
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  Buzzer 蜂鸣器模块测试示例。
 * 
 * \说明
 *  Buzzer 蜂鸣器模块测试示例。发出“滴滴”声。
 * 
 * \函数列表
 *  1. void RoBuzzer::didi(uint8_t pin)
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建程序。
 * 
 */

#include "RoSys.h"

RoBuzzer buzzer(2);         //蜂鸣器模块接口

void setup()
{
  
}

void loop()
{
  buzzer.didi();
  delay(2000);              //延时2000ms
}

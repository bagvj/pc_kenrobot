/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  BuzzerTest2.ino
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  Buzzer 蜂鸣器模块测试示例。
 * 
 * \说明
 *  Buzzer 蜂鸣器模块测试示例。播放一曲 “祝你生日快乐”。
 * 
 * \函数列表
 *  1. void RoBuzzer::tone(uint16_t frequency, uint32_t duration)
 *  2. void RoBuzzer::noTone(void)
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建程序。
 * 
 */
#include "RoSys.h"

// 曲谱：祝你生日快乐 
// 音调定义请参考 RoBuzzer.h
int melody[] = 
{
  NOTE_G4,//5  
  NOTE_G4,//5
  NOTE_A4,//6
  NOTE_G4,//5
  NOTE_C5,//1.
  NOTE_B4,//7
  0,
  NOTE_G4,//5
  NOTE_G4,//5
  NOTE_A4,//6
  NOTE_G4,//5
  NOTE_D5,//2.
  NOTE_C5,//1.
  0,
  NOTE_G4,//5
  NOTE_G4,//5
  NOTE_G5,//5.
  NOTE_E5,//3.
  NOTE_C5,//1.
  NOTE_B4,//7
  NOTE_A4,//6
  0,
  NOTE_F5,//4.
  NOTE_F5,//4.
  NOTE_E5,//3.
  NOTE_C5,//1.
  NOTE_D5,//2.
  NOTE_C5,//1.
  0,
};

//
int noteDurations[] = 
{
  4,4,2,2,2,2,
  2,
  4,4,2,2,2,2,
  2,
  4,4,2,2,2,2,1,
  4,
  4,4,2,2,2,1,
  2,
};


RoBuzzer buzzer(2);       //蜂鸣器模块接口

void setup()
{
  
}

void loop()
{
  for (int thisNote = 0; thisNote < 29; thisNote++) 
  {
    // 注意持续时间, 用1秒除以节拍时间
    // 例如： 1/4拍  noteDuration = 1000/4 ; 1/8 拍，noteDuration = 1000/8 等。
    int noteDuration = 1000/noteDurations[thisNote];
    buzzer.tone(melody[thisNote],noteDuration);
    
    // 每个音节播放完之后，有一个短暂停止的时间
    // 这个短暂停止的时间设置为 noteDuration * 0.3 似乎效果不错
    int pauseBetweenNotes = noteDuration * 0.30;
    delay(pauseBetweenNotes);
    
    buzzer.noTone();      //关闭蜂鸣器
  }

  delay(2000);            //延时2000ms
}

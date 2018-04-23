 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  DisplayTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/07/21
 * @描述：  4位数码管示例。
 * 
 * \说明
 * 4位数码管示例，循环显示1111~9999.
 * 
 * \函数列表
 * 1. void    FourDigitalDisplay::display(int16_t value)
 * 
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/07/21      0.1.0              新建程序。
 * 
 */
#include "Kenblock.h"
#include "Kenblock_4DigitalDisplay.h"

FourDigitalDisplay disp(PD1);			//数码管模块接口（拓展板）

int i = 0;
void setup()
{
}

void loop()
{
  if(i > 10000)
  {
    i = 1111;
  }
  disp.display(i);
  i += 1111;
  delay(300);
}


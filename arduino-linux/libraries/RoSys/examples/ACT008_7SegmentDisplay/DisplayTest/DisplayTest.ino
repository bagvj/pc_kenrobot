 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  DisplayTest.ino
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  4位7段数码管示例。
 * 
 * \说明
 * 4位7段数码管示例，循环显示1111~9999.
 * 
 * \函数列表
 * 1. void    Ro7SegmentDisplay::display(int16_t value)
 * 
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建程序。
 * 
 */
#include "RoSys.h"

Ro7SegmentDisplay disp(PD1);		//数码管模块接口（拓展板）

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


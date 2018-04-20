/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  RGBledTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/07/20
 * @描述：  RGBled 测试示例。
 *
 * \说明
 * RGBled 测试示例。颜色随机生成。
 *
 * \函数列表
 * 1. bool RGBled::setColor(uint8_t index, uint8_t red, uint8_t green, uint8_t blue)
 * 2. void RGBled::show(void)
 * 
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/07/20      0.1.0              新建程序。
 *  
 */
 
#include "Kenblock.h"
#include "Kenblock_RGBled.h"

RGBled led(2);			//RGBled模块接口

float j, f, k;

void setup()
{

}

void loop()
{
  color_loop();
}

void color_loop()
{
  for(uint8_t t = 1; t < 15; t++)
  {
    uint8_t red  = 64 * (1 + sin(t / 2.0 + j / 4.0) );
    uint8_t green = 64 * (1 + sin(t / 1.0 + f / 9.0 + 2.1) );
    uint8_t blue = 64 * (1 + sin(t / 3.0 + k / 14.0 + 4.2) );
    led.setColor(t, red, green, blue);
  }
  led.show();
  j += random(1, 6) / 6.0;
  f += random(1, 6) / 6.0;
  k += random(1, 6) / 6.0;
}

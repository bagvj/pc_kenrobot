#include <MsTimer2.h>               //定时器库的 头文件
#include "uper_Turn.h"

static boolean output = true;
Uper_Turn uper_turn(6, 7);
void flash()
{
  output ? uper_turn.turn_Stop() : uper_turn.turn_Forward();
  output = !output
}

void setup()
{
  // 通过修改500这个参数控制角度
  MsTimer2::set(500, flash);
  MsTimer2::start();                //开始计时
  uper_turn.turn_Forward(); //开始正转
}

void loop()
{

}

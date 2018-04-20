#include <uper_Wire.h>
#include "uper_Digital.h"

UPER_Digital digital;
void setup()
{
  Wire.begin();
  digital.init();
}
void loop()
{
  digital.clear();		     		//设置清屏、开 displayOn、关displayOff
  digital.displayString("abcd"); 	//设置显示字符串
  digital.setDot(0,true);			//设置第几个点灯亮
}
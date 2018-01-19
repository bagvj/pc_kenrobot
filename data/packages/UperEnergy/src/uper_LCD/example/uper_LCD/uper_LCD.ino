#include <uper_SoftI2CMaster.h>
#include <uper_lcd_SoftI2C.h>
//初始化屏幕软I2C 
uper_lcd_SoftI2C uper_mylcd(0x20,16,2,2,3);//定义地址 行 列  管脚1 管脚2
//屏幕初始化和背光设置
void setup()
{
  uper_mylcd.init();//屏幕初始化
  uper_mylcd.backlight();
}

void loop()
{
  uper_mylcd.setCursor(0, 0);  //指定位置
  uper_mylcd.print("0");  //输出字符
  uper_mylcd.setCursor(0, 1);
  uper_mylcd.print("1");

}

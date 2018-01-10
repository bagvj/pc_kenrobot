#include <uper_SoftI2CMaster.h>
#include <uper_LiquidCrystal_SoftI2C.h>
//初始化屏幕软I2C
uper_LiquidCrystal_SoftI2C mylcd(0x20,16,2,A1,A2);//定义地址 行 列  管脚1 管脚2
//屏幕初始化和背光设置
void setup()
{
  mylcd.init();//屏幕初始化
  mylcd.backlight();
}

void loop()
{
  mylcd.setCursor(0, 0);  //指定位置
  mylcd.print("0");  //输出字符
  mylcd.setCursor(0, 1);
  mylcd.print("1");

}

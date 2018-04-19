#include "uper_Rain.h"

UPER_Rain uper_rain(3);  //初始化为数字管脚

void setup()
{
  Serial.begin(9600);
}

void loop()
{
	uper_rain.open();					//打开雨水传感器
	uper_rain.close();				//关闭雨水传感器
  	Serial.println(uper_rain.read());	//读取雨水传感器的状态
}

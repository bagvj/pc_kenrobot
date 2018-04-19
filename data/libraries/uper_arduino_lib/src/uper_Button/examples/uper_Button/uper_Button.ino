#include "uper_Button.h"

UPER_Button uper_button(2);  //初始化为数字管脚

void setup()
{
  Serial.begin(9600);
}

void loop()
{	
	uper_button.open();					//打开按钮
	uper_button.close();				//关闭按钮
  	Serial.println(uper_button.read());	//读取按钮的状态
}

#include "uper_Button.h"

UPER_Button uper_button(3);  //初始化为数字管脚

void setup()
{
  Serial.begin(9600);
}

void loop()
{
  Serial.println(uper_button.read());
}

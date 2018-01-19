#include "uper_Linepatrol.h"

UPER_Linepatrol uper_Linepatrol(3);  //初始化为数字管脚

void setup()
{
  Serial.begin(9600);
}

void loop()
{
  Serial.println(uper_Linepatrol.read());
}

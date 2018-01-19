#include "uper_Flame.h"

UPER_Flame uper_flame(A0);  //初始化管脚

void setup()
{
  Serial.begin(9600);
}

void loop()
{
  Serial.println(uper_flame.read());
}

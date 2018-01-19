#include "uper_Voice.h"

UPER_Voice uper_Voice(3);  //初始化为数字管脚

void setup()
{
  Serial.begin(9600);
}

void loop()
{
  Serial.println(uper_Voice.read());
}

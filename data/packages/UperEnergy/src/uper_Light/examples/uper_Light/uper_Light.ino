#include "uper_Light.h"

UPER_Light uper_light(A0);  //初始化模拟管脚

void setup()
{
  Serial.begin(9600);
}

void loop()
{
  Serial.println(uper_light.read());
}

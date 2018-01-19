#include "uper_Gray.h"

UPER_Gray uper_gray(A0);  //初始化模拟管脚

void setup()
{
  Serial.begin(9600);
}

void loop()
{
  Serial.println(uper_gray.read());
}

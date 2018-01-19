#include "uper_Soil.h"

UPER_Soil uper_soli(A3);  //初始化为模拟管脚

void setup()
{
  Serial.begin(9600);
}

void loop()
{
  Serial.println(uper_soli.read());
}

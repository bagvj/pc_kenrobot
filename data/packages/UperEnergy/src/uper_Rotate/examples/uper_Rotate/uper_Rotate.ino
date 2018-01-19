#include "uper_Rotate.h"

UPER_Rotate uper_rotate(A0);  //初始化管脚

void setup()
{
  Serial.begin(9600);
}

void loop()
{
  Serial.println(uper_rotate.read());
}

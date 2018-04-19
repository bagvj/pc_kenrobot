#include "uper_Magnetic.h"

UPER_Magnetic uper_mag(3);  //初始化为数字管脚

void setup()
{
  Serial.begin(9600);
}

void loop()
{
  Serial.println(uper_mag.read());
}

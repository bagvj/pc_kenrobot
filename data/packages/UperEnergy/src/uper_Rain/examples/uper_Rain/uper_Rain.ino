#include "uper_Rain.h"

UPER_Rain uper_rain(3);  //初始化为数字管脚

void setup()
{
  Serial.begin(9600);
}

void loop()
{
  Serial.println(uper_rain.read());
}

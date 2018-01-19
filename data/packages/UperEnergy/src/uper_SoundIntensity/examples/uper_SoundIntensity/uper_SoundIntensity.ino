#include "uper_SoundIntensity.h"

UPER_SoundIntensity uper_sound(A0);  //初始化管脚

void setup()
{
  Serial.begin(9600);
}

void loop()
{
  Serial.println(uper_sound.read());
}

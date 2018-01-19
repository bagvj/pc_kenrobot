#include "uper_MQ5.h"

UPER_MQ5 uper_MQ5(A0); 

void setup()
{
  Serial.begin(9600);
}

void loop()
{
  Serial.println(uper_MQ5.read());
}

#include "uper_DHT11.h"

DHT11 myDHT(6);

void setup()
{
  Serial.begin(9600);
}

void loop()
{
  Serial.println(myDHT.getTemperature(true));
}

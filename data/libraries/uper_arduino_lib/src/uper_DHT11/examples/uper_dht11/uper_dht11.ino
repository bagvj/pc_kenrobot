#include "uper_DHT11.h"

UPER_DHT11 uper_dht(6);  //初始化管脚

void setup()
{
  Serial.begin(9600);
}

void loop()
{
  Serial.println(uper_dht.getTemperature(true));
  Serial.println(uper_dht.getHumidity(true));
}

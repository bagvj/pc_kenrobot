#include <OneWire.h>
#include <uper_DS18B20.h>
// 定义管脚
#define ONE_WIRE_BUS 2

OneWire oneWire(ONE_WIRE_BUS);

UPER_DS18B20 ds18b20(&oneWire);

void setup(void)
{

  Serial.begin(9600);
  ds18b20.begin();
}


void loop(void)
{ 

  Serial.print("Requesting temperatures...");
  ds18b20.requestTemperatures(); // Send the command to get temperatures
  Serial.print("Temperature  is: ");
  Serial.println(ds18b20.getTempCByIndex(0));  
}

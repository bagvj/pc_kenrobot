#include "uper_Coloursensor.h"

uper_Coloursensor uper_tcs = uper_Coloursensor(TCS34725_INTEGRATIONTIME_50MS, TCS34725_GAIN_4X);

void setup()
{
   Serial.println("Color View Test!");

   if (uper_tcs.begin()) {

   Serial.println("Found sensor");

    } else {

  Serial.println("No TCS34725 found ... check your connections");

    while (1);}

  Serial.begin(9600);
}

void loop()
{
  uint16_t red, green, blue;
  uper_tcs.getRGB(&red, &green, &blue);//得到RGB的值
  Serial.print("R:");
  Serial.print(red);
  Serial.print("G:");
  Serial.print(green);
  Serial.print("B:");
  Serial.println(blue);

}

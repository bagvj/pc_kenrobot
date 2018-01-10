#include "uper_TCS34725.h"

DFRobot_TCS34725 tcs = DFRobot_TCS34725(TCS34725_INTEGRATIONTIME_50MS, TCS34725_GAIN_4X);

void setup()
{
   Serial.println("Color View Test!");

   if (tcs.begin()) {

   Serial.println("Found sensor");

    } else {

  Serial.println("No TCS34725 found ... check your connections");

    while (1);}

  Serial.begin(9600);
}

void loop()
{
  uint16_t clear, red, green, blue;
  tcs.getRGBC(&red, &green, &blue, &clear);//得到RGB的值
  Serial.println(red);
  Serial.println(green);
  Serial.println(blue);

}

#include "uper_HX711.h"

unsigned int weight = 0;

HX711 hx711(2, 3);

void setup()
{
  hx711.getMaopi();

  Serial.begin(9600);
  Serial.print("Welcome to use!\n");   
}

void loop()
{
  weight = hx711.getWeight();
  Serial.print(weight);
  Serial.print(" g\n");
  Serial.print("\n");
  delay(1000);
}

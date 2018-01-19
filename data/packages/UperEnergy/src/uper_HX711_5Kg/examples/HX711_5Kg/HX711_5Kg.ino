#include "uper_HX711.h"

unsigned int weight = 0;

UPER_HX711 uper_hx711(3, 2);

void setup()
{
  uper_hx711.getMaopi(); 

  Serial.begin(9600);
  Serial.print("Welcome to use!\n");   
}

void loop()
{
  weight = uper_hx711.getWeight();
  Serial.print(weight);
  Serial.print(" g\n");
  Serial.print("\n");
  delay(1000);
}

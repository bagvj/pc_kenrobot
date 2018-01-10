#include <Wire.h>
#include <uper_Adafruit_NeoPixel.h>

int i;
Adafruit_NeoPixel  rgb_display_0(100);

void setup()
{
  rgb_display_0.begin();
  rgb_display_0.setPin(0);
}

void loop()
{
  rgb_display_0.setPixelColor(i, 0,0,0);
  rgb_display_0.show();

}

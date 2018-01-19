#include <uper_Wire.h>
#include <uper_RGB.h>

int i;
uper_RGB  uper_rgb(100);

void setup()
{
  uper_rgb.begin();
  uper_rgb.setPin(2);
}

void loop()
{
//  从第几个到第几个灯亮 设置RGB的亮度
  for(i=0;i<5;i++){
    uper_rgb.setPixelColor(i, 25,30,32);
    uper_rgb.show();
  }

}
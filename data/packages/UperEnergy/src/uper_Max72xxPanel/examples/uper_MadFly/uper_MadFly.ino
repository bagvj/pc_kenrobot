#include <SPI.h>
#include <uper_Adafruit_GFX.h>
#include <uper_Max72xxPanel.h>

int pinCS = 10; 
int numberOfHorizontalDisplays = 1;
int numberOfVerticalDisplays = 1;

UPER_Max72xxPanel uper_matrix = UPER_Max72xxPanel(pinCS, numberOfHorizontalDisplays, numberOfVerticalDisplays);

int pinRandom = A0;

int wait = 20; 

void setup() {
  uper_matrix.setIntensity(4); 

  randomSeed(analogRead(pinRandom));
}

int x = numberOfHorizontalDisplays * 8 / 2;
int y = numberOfVerticalDisplays * 8 / 2;
int xNext, yNext;

void loop() {

  uper_matrix.drawPixel(x, y, HIGH);
  uper_matrix.write(); 

  delay(wait);

  uper_matrix.drawPixel(x, y, LOW);

  do {
    switch ( random(4) ) {
      case 0: xNext = constrain(x + 1, 0, uper_matrix.width() - 1); yNext = y; break;
      case 1: xNext = constrain(x - 1, 0, uper_matrix.width() - 1); yNext = y; break;
      case 2: yNext = constrain(y + 1, 0, uper_matrix.height() - 1); xNext = x; break;
      case 3: yNext = constrain(y - 1, 0, uper_matrix.height() - 1); xNext = x; break;
    }
  }
  while ( x == xNext && y == yNext ); 

  x = xNext;
  y = yNext;
}

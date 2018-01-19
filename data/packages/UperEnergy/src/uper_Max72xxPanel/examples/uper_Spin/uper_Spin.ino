#include <SPI.h>
#include <uper_Adafruit_GFX.h>
#include <uper_Max72xxPanel.h>

int pinCS = 10; 
int numberOfHorizontalDisplays = 1;
int numberOfVerticalDisplays = 1;

UPER_Max72xxPanel matrix = UPER_Max72xxPanel(pinCS, numberOfHorizontalDisplays, numberOfVerticalDisplays);

void setup() {
  matrix.setIntensity(0);
}

int wait = 50;
int inc = -2;

void loop() {
  display_spin();

}
void display_spin(){
    for ( int x = 0; x < matrix.width() - 1; x++ ) {
    matrix.fillScreen(LOW);
    matrix.drawLine(x, 0, matrix.width() - 1 - x, matrix.height() - 1, HIGH);
    matrix.write(); // Send bitmap to display
    delay(wait);
  }

  for ( int y = 0; y < matrix.height() - 1; y++ ) {
    matrix.fillScreen(LOW);
    matrix.drawLine(matrix.width() - 1, y, 0, matrix.height() - 1 - y, HIGH);
    matrix.write(); // Send bitmap to display
    delay(wait);
  }

  wait = wait + inc;
  if ( wait == 0 ) inc = 2;
  if ( wait == 50 ) inc = -2;
}
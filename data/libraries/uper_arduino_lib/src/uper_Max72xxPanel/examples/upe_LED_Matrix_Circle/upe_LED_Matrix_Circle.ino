#include <SPI.h>
#include <uper_Adafruit_GFX.h>
#include <uper_Max72xxPanel.h>

uint8_t pinCS = 10; 
uint8_t numberOfHorizontalDisplays=1;
uint8_t numberOfVerticalDisplays = 4;

UPER_Max72xxPanel uper_matrix = UPER_Max72xxPanel(pinCS, numberOfHorizontalDisplays, numberOfVerticalDisplays);

void setup() {

  uper_matrix.setIntensity(1); 
  uper_matrix.setPosition(0, 0, 3); // The first display is at <0, 3>
  uper_matrix.setPosition(1, 0, 2); // The second display is at <0, 2>
  uper_matrix.setPosition(2, 0, 1); // The third display is at <0, 1>
  uper_matrix.setPosition(3, 0, 0); // And the last display is at <0, 0>
//  ...
  uper_matrix.setRotation(3);    // The same hold for the last display
  uper_matrix.fillScreen(LOW);
 uper_matrix.write();
 delay(400);
 uper_matrix.print("OPEN");
 uper_matrix.write();
 delay(2000);
}

void loop() {
  dispaly_matrix("YAPU"); //显示字符串
}

void dispaly_matrix(String tape){
  uint8_t wait = 120; // In milliseconds
  uint8_t spacer = 1;
  uint8_t width = 5 + spacer; // The font width is 5 pixels
  
  for ( int i = 0 ; i < width * tape.length() + uper_matrix.width() - 1 - spacer; i++ ) {

    uper_matrix.fillScreen(LOW);

    int letter = i / width;
    int x = (uper_matrix.width() - 1) - i % width;
    int y = (uper_matrix.height() - 8) / 2; // center the text vertically

    while ( x + width - spacer >= 0 && letter >= 0 ) {
      if ( letter < tape.length() ) {
        uper_matrix.drawChar(x, y, tape[letter], HIGH, LOW, 1);
      }

      letter--;
      x -= width;
    }

    uper_matrix.write(); // Send bitmap to display

    delay(wait);
  }
}
#define heartratePin A1
#include "uper_Heartrate.h"

UPER_Heartrate uper_heartrate(DIGITAL_MODE); 

void setup() {
  Serial.begin(115200);
}

void loop() {
  uint8_t rateValue;
  uper_heartrate.getValue(heartratePin); 
  rateValue = uper_heartrate.getRate(); 
  if(rateValue)  {
    Serial.println(rateValue);
  }
  delay(20);
}

#include <uper_IRSendRev.h>
 
UPER_IRSendRev uper_ir_0;

void setup() {
    Serial.begin(9600);
    uper_ir_0.begin(A0);
}

void loop() {
    if (uper_ir_0.available()) {
        Serial.println(uper_ir_0.recv());
    }
}
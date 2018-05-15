#include "uper_ESP8266.h"

#define SSID        "uper-energy"
#define PASSWORD    "best6666"
#define HOST_NAME   "192.168.0.190"  //本机IP地址
#define HOST_PORT   (2323)

ESP8266 wifi(Serial1);

void setup(void)
{
    Serial.begin(115200);
    while (!Serial); // wait for Leonardo enumeration, others continue immediately
    Serial.print("setup begin\r\n");
    
    Serial.print("FW Version:");
    Serial.println(wifi.getVersion().c_str());
      
    if (wifi.setOprToStationSoftAP()) {
        Serial.print("to station + softap ok\r\n");
    } else {
        Serial.print("to station + softap err\r\n");
    }
 
    if (wifi.joinAP(SSID, PASSWORD)) {
        Serial.print("Join AP success\r\n");
        Serial.print("IP:");
        Serial.println( wifi.getLocalIP().c_str());       
    } else {
        Serial.print("Join AP failure\r\n");
    }
    
    if (wifi.disableMUX()) {
        Serial.print("single ok\r\n");
    } else {
        Serial.print("single err\r\n");
    }
    
    Serial.print("setup end\r\n");
}
 
void loop(void)
{
    uint8_t buffer[128] = {0};
    
    if (wifi.createTCP(HOST_NAME, HOST_PORT)) {
        Serial.print("create tcp ok\r\n");
    } else {
        Serial.print("create tcp err\r\n");
    }
    
    char *hello = "Hello, this is client!";
    wifi.send((const uint8_t*)hello, strlen(hello));
    
    uint32_t len = wifi.recv(buffer, sizeof(buffer), 10000);
    if (len > 0) {
        Serial.print("Received:[");
        for(uint32_t i = 0; i < len; i++) {
            Serial.print((char)buffer[i]);
            if((char)buffer[i]=='a'){
              digitalWrite(13,HIGH);//灯亮
            }
            if((char)buffer[i]=='b'){
              digitalWrite(13,LOW);//灯灭
            }
        }
        Serial.print("]\r\n");
    }
    delay(5000);
}
     
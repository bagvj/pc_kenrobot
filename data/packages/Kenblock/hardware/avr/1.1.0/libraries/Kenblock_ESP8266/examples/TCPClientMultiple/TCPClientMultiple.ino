/**
 * \著作权 
 * @名称：  TCPClientMultiple.ino
 * @作者：  ITEAD
 * @版本：  V1.0.0
 * @维护：  Kenblock
 * @时间：  2017/10/17
 * @描述：  ESP8266 TCPClientMultiple示例。
 *
 * \说明
 * ESP8266 TCPClientMultiple示例。（非Kenblock NEO328主板示例）。
 * 
 * 注重说明：
 * 		1、Kenblock ESP8266 WiFi转串口模块默认通信速率为115200,此示例使用硬件串口。
 *
 * 如果想要使用软件串口与WiFi模块通信:参考示例 TCPServerUNO.ino 。
 *	
 * \函数列表
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/10/17      1.0.0              做汉化修订注释。
 *  
 */
#include <SoftwareSerial.h>
#include "ESP8266.h"

#define SSID        "Kenblock"
#define PASSWORD    "12345678"
#define HOST_NAME   "172.16.5.12"
#define HOST_PORT   (8090)

ESP8266 wifi(Serial1);

void setup(void)
{
    Serial.begin(9600);
    Serial.print("setup begin\r\n");

    Serial.print("FW Version: ");
    Serial.println(wifi.getVersion().c_str());
    
    
    if (wifi.setOprToStationSoftAP()) {
        Serial.print("to station + softap ok\r\n");
    } else {
        Serial.print("to station + softap err\r\n");
    }

    if (wifi.joinAP(SSID, PASSWORD)) {
        Serial.print("Join AP success\r\n");
        Serial.print("IP: ");       
        Serial.println(wifi.getLocalIP().c_str());
    } else {
        Serial.print("Join AP failure\r\n");
    }
    
    if (wifi.enableMUX()) {
        Serial.print("multiple ok\r\n");
    } else {
        Serial.print("multiple err\r\n");
    }
    
    Serial.print("setup end\r\n");
}

void loop(void)
{
    uint8_t buffer[128] = {0};
    static uint8_t mux_id = 0;
    
    if (wifi.createTCP(mux_id, HOST_NAME, HOST_PORT)) {
        Serial.print("create tcp ");
        Serial.print(mux_id);
        Serial.println(" ok");
    } else {
        Serial.print("create tcp ");
        Serial.print(mux_id);
        Serial.println(" err");
    }

    
    char *hello = "Hello, this is client!";
    if (wifi.send(mux_id, (const uint8_t*)hello, strlen(hello))) {
        Serial.println("send ok");
    } else {
        Serial.println("send err");
    }
    
    uint32_t len = wifi.recv(mux_id, buffer, sizeof(buffer), 10000);
    if (len > 0) {
        Serial.print("Received:[");
        for(uint32_t i = 0; i < len; i++) {
            Serial.print((char)buffer[i]);
        }
        Serial.print("]\r\n");
    }
 
    if (wifi.releaseTCP(mux_id)) {
        Serial.print("release tcp ");
        Serial.print(mux_id);
        Serial.println(" ok");
    } else {
        Serial.print("release tcp ");
        Serial.print(mux_id);
        Serial.println(" err");
    }
  
    delay(3000);
    mux_id++;
    if (mux_id >= 5) {
        mux_id = 0;
    }
}


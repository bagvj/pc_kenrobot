/**
 * \著作权 
 * @名称：  HTTPGET.ino
 * @作者：  ITEAD
 * @版本：  V1.0.0
 * @维护：  Kenblock
 * @时间：  2017/10/17
 * @描述：  ESP8266 HTTPGET示例。
 *
 * \说明
 * ESP8266 HTTPGET示例。
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
#define SERIAL_RX_BUFFER_SIZE 256		//设置硬件串口RX数据缓存区大小。
#include <SoftwareSerial.h>
#include "ESP8266.h"

#define SSID "Kenblock"					//WiFi的名称（用户更加连接的WiFi进行修改）。
#define PASSWORD "Kenblock666"			//WiFi密码。
#define HOST_NAME   "www.baidu.com"
#define HOST_PORT   (80)

SoftwareSerial mySerial(A5, A4);		// RX:A5, TX:A4。
ESP8266 wifi(Serial);

void setup(void)
{
    // 初始化软件串口，波特率为19200，用作调试。
    mySerial.begin(19200);		
    mySerial.print("setup begin\r\n");
	
	// WiFi通信初始化。
    wifi.begin(115200);	

	// 查询AT版本信息。
    mySerial.print("FW Version:");
    mySerial.println(wifi.getVersion().c_str());
    
	// 设置为AP + Station模式。 
    if (wifi.setOprToStationSoftAP()) {
        mySerial.print("to station + softap ok\r\n");
    } else {
        mySerial.print("to station + softap err\r\n");
    }

	// 加入AP（连接到WiFi）。 
    if (wifi.joinAP(SSID, PASSWORD)) {
        mySerial.print("Join AP success\r\n");
        mySerial.print("IP:");
        mySerial.println( wifi.getLocalIP().c_str());       
    } else {
        mySerial.print("Join AP failure\r\n");
    }
    
	//禁用多链接（即设为单链接）。
    if (wifi.disableMUX()) {
        mySerial.print("single ok\r\n");
    } else {
        mySerial.print("single err\r\n");
    }
    
    mySerial.print("setup end\r\n");
}
 
void loop(void)
{
    uint8_t buffer[1024] = {0};
	
	// 在单链接模式下 创建TCP连接。
    if (wifi.createTCP(HOST_NAME, HOST_PORT)) {
        mySerial.print("create tcp ok\r\n");
    } else {
        mySerial.print("create tcp err\r\n");
    }
	
	// WiFi发送数据。
    char *hello = "GET / HTTP/1.1\r\nHost: www.baidu.com\r\nConnection: close\r\n\r\n";
    wifi.send((const uint8_t*)hello, strlen(hello));

	// WiFi接收数据。
    uint32_t len = wifi.recv(buffer, sizeof(buffer), 10000);
    if (len > 0) {
        mySerial.print("Received:[");
        for(uint32_t i = 0; i < len; i++) {
            mySerial.print((char)buffer[i]);
        }
        mySerial.print("]\r\n");
    }

	// 在单链接模式下 关闭TCP连接。
    if (wifi.releaseTCP()) {
        mySerial.print("release tcp ok\r\n");
    } else {
        mySerial.print("release tcp err\r\n");
    }
    
    while(1);
}

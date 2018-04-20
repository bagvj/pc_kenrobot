/**
 * \著作权 
 * @名称：  PassthroughTransmission.ino
 * @作者：  ITEAD
 * @版本：  V1.0.0
 * @维护：  Kenblock
 * @时间：  2017/10/17
 * @描述：  WIFI 透明传输示例。
 *
 * \说明
 * WIFI 透明传输示例。设置为Station模式 或者 AP兼Station模式，作为 TCP客户端 链接到服务端。
 * 
 * 注重说明：
 * 		1、Kenblock ESP8266 WiFi转串口模块默认通信速率为115200,此示例使用硬件串口。
 * 		2、必须和TCP服务端连接到同一个AP（同一个WiFi），正确设置WiFi名称、密码。
 * 		3、TCP服务端开启后，正确设置程序中的IP、端口（HOST_NAME、HOST_PORT）。
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
#define HOST_NAME   "192.168.88.120"	//根据TCP Server地址来修改
#define HOST_PORT   (8090)

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
    
	// 在单链接模式下 创建TCP连接。
    if (wifi.createTCP(HOST_NAME, HOST_PORT)) {
        mySerial.print("create tcp ok\r\n");
    } else {
        mySerial.print("create tcp err\r\n");
    }
	
	// 设置传输模式，1位透传模式。
	if (wifi.setCIPMODE(1)) {
        mySerial.print("passthrough mode ok\r\n");
    } else {
        mySerial.print("passthrough mode err\r\n");
    }
	
	// 开始传输。 开启透传后，可当做普通无线串口使用！
	if (wifi.startSend()) {
        mySerial.print("startSend ok\r\n");
    } else {
        mySerial.print("startSend err\r\n");
    }
	
	mySerial.print("setup end\r\n");
}
 
void loop(void)
{
	if (Serial.available()) {
		Serial.write(Serial.read());
	}

	// delay(5000);
}

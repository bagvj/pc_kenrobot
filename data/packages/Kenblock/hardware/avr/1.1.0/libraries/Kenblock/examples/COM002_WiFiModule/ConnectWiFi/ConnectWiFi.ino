/**
 * \著作权 
 * @名称：  ConnectWiFi.ino
 * @作者：  ITEAD
 * @版本：  V1.0.0
 * @维护：  Kenblock
 * @时间：  2017/10/17
 * @描述：  Station模式 连接WiFi。
 *
 * \说明
 * Station模式 连接WiFi。连接成功后打印IP地址。软件串口作为调试使用。
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
    
    // 设置为Station模式。 
    if (wifi.setOprToStation()) {
        mySerial.print("to station ok\r\n");
    } else {
        mySerial.print("to station err\r\n");
    }

	// 加入AP（连接到WiFi）。 
    if (wifi.joinAP(SSID, PASSWORD)) {
        mySerial.print("Join AP success\r\n");
        mySerial.print("IP:");
        mySerial.println( wifi.getLocalIP().c_str());       
    } else {
        mySerial.print("Join AP failure\r\n");
    }
    
    mySerial.print("setup end\r\n");
}

void loop(void)
{
}


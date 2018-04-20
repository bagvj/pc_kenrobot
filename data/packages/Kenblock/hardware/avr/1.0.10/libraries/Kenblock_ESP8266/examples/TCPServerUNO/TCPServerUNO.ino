/**
 * \著作权 
 * @名称：  TCPServerUNO.ino
 * @作者：  ITEAD
 * @版本：  V1.0.0
 * @维护：  Kenblock
 * @时间：  2017/10/17
 * @描述：  AP模式 或者 AP兼Station模式 设置为TCP服务器示例。
 *
 * \说明
 * AP模式 或者 AP兼Station模式 设置为TCP服务器示例。
 * 
 * 注重说明：Kenblock ESP8266 WiFi转串口模块默认通信速率为115200,此示例使用硬件串口。
 *
 * 如果想要使用软件串口与WiFi模块通信，需要做如下修改：
 *     1、#define _SS_MAX_RX_BUFF 256			//设置软件串口RX数据缓存区大小
 *     2、#include "ESP8266_SoftSer.h"			//包含软串口头文件
 *     3、SoftwareSerial mySerial(A5, A4);		//软件串口定义
 *     4、ESP8266 wifi(mySerial);				//WiFi定义
 *     5、wifi.begin(19200);					//与WiFi模块通信的串口波特率设置（需要和WiFi模块一致）
 *     6、最重要的一点：因为软件串口通信速率不能太高，所以必须修改WiFi模块的通信速率为19200或者更低（使用工具修改）。
 *     7、修改主函数中使用到Serial的地方。
 *	
 * \函数列表
 * 		void 	begin(uint32_t baud);	//WiFi初始化，设置串口波特率。
 * 		String  getVersion (void); 		//查询AT版本信息"AT+GMR"。
 * 		bool    setOprToStationSoftAP (void); 					//设置为AP + Station模式 "AT+CWMODE=3"。
 * 		bool    setSoftAPParam (String ssid, String pwd, uint8_t chl=7, uint8_t ecn=4); //设置AP模式下的参数（WiFi名称及密码）。
 * 		bool    enableMUX (void); 		//启用多链接。
 * 		bool    startTCPServer (uint32_t port=333);				//设置为TCP服务器模式，并开启（仅多链接模式下）。 
 * 		bool    setTCPServerTimeout (uint32_t timeout=180); 	//设置TCP服务超时时间（s）。
 * 		uint32_t    recv (uint8_t *coming_mux_id, uint8_t *buffer, uint32_t buffer_size, uint32_t timeout=1000); //接收数据，多链接模式下 接收已建立的所有TCP或UDP连接的 数据。 
 * 		bool    send (uint8_t mux_id, const uint8_t *buffer, uint32_t len); //发送数据，多链接模式下基于已建立的某一TCP 或 UDP连接发送数据，mux_id：0-4。 
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/10/17      1.0.0              做汉化修订注释。
 *  
 */
#define SERIAL_RX_BUFFER_SIZE 256		//设置硬件串口RX数据缓存区大小。
#include <SoftwareSerial.h>
#include "ESP8266.h"

#define SSID "Kenblock-Link_0001"		//设置WiFi模块的名称（AP模式SSID）。
#define PASSWORD "12345678"				//设置WiFi密码。

SoftwareSerial mySerial(A5, A4);		// RX:A5, TX:A4。
ESP8266 wifi(Serial);					// WiFi定义。

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

	// 设置AP模式下的参数（WiFi名称及密码）。
	if (wifi.setSoftAPParam(SSID, PASSWORD, 11, WAP_WAP2_PSK)) {
		mySerial.print("SoftAPParam success\r\n");
		mySerial.print("IP:");
        mySerial.println( wifi.getLocalIP().c_str()); 
	} else {
		mySerial.print("SoftAPParam failure\r\n");
	} 
	
	// 启用多链接。
    if (wifi.enableMUX()) {
        mySerial.print("multiple ok\r\n");
    } else {
        mySerial.print("multiple err\r\n");
    }
	
	// 设置为TCP服务器模式，并开启（仅多链接模式下），端口：8090 。
    if (wifi.startTCPServer(8090)) {
        mySerial.print("start tcp server ok\r\n");
    } else {
        mySerial.print("start tcp server err\r\n");
    }
    
	// 设置TCP服务超时时间（s），会踢掉一直不通信直至超时了的 TCP client。此处设置为20分钟。
    if (wifi.setTCPServerTimeout(1200)) { 
        mySerial.print("set tcp server timout 20 minutes\r\n");
    } else {
        mySerial.print("set tcp server timout err\r\n");
    }
	
	mySerial.print("setup end\r\n");
}
 
void loop(void)
{
    uint8_t buffer[128] = {0};
    uint8_t mux_id;
	
	// 接收数据:
	// 如果接收到数据，len > 0 ， 数据存储在buffer中;
	// 需要更加需要合理设置超时时间，指令越长，需要设置的值越大。此处设置为100。
    uint32_t len = wifi.recv(&mux_id, buffer, sizeof(buffer), 100);
	
    if (len > 0) {
        // 接收到数据，串口打印显示。
        mySerial.print("Received from :");
        mySerial.print(mux_id);
        mySerial.print("[");
        for(uint32_t i = 0; i < len; i++) {
            mySerial.print((char)buffer[i]);
        }
        mySerial.print("]\r\n");
        
		// 将数据通过WiFi发回去。
        if(wifi.send(mux_id, buffer, len)) {
            mySerial.print("send back ok\r\n");
        } else {
            mySerial.print("send back err\r\n");
        }  
    }
}

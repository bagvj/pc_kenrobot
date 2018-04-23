/**
 * \著作权 
 * @名称：  TCPClientSingleUNO.ino
 * @作者：  ITEAD
 * @版本：  V1.0.0
 * @维护：  Kenblock
 * @时间：  2017/10/17
 * @描述：  Station模式 或者 AP兼Station模式 作为 TCP客户端 使用的示例。
 *
 * \说明
 * Station模式 或者 AP兼Station模式 作为 TCP客户端 使用示例。
 * 
 * 注重说明：
 * 		1、Kenblock ESP8266 WiFi转串口模块默认通信速率为115200,此示例使用硬件串口。
 * 		2、必须和TCP服务端连接到同一个AP（同一个WiFi），正确设置WiFi名称、密码。
 * 		3、TCP服务端开启后，正确设置程序中的IP、端口（HOST_NAME、HOST_PORT）。
 *
 * 如果想要使用软件串口与WiFi模块通信:参考示例 TCPServerUNO.ino 。
 *	
 * \函数列表
 * 		void 	begin(uint32_t baud);	//WiFi初始化，设置串口波特率。
 * 		String  getVersion (void); 		//查询AT版本信息"AT+GMR"。
 * 		bool    setOprToStationSoftAP (void); 		//设置为AP + Station模式 "AT+CWMODE=3"。
 * 		bool    joinAP (String ssid, String pwd); 	//加入AP（连接到WiFi）
 * 		String  getLocalIP (void); 					//查询ESP8266自身IP地址。 
 * 		bool    disableMUX (void);					//禁用多链接（即设为单链接）。
 * 		bool    createTCP (String addr, uint32_t port); 		//在单链接模式下 创建TCP连接。
 * 		bool    setTCPServerTimeout (uint32_t timeout=180); 	//设置TCP服务超时时间（s）。
 * 		uint32_t    recv (uint8_t *buffer, uint32_t buffer_size, uint32_t timeout=1000); 					//接收数据，单链接模式下 接收已建立的TCP或UDP连接 的数据。 
 * 		bool    send (const uint8_t *buffer, uint32_t len); 				//发送数据，单链接模式下基于已建立的TCP 或 UDP连接发送数据。
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
    
    mySerial.print("setup end\r\n");
	
	// 在单链接模式下 创建TCP连接。
    if (wifi.createTCP(HOST_NAME, HOST_PORT)) {
        mySerial.print("create tcp ok\r\n");
    } else {
        mySerial.print("create tcp err\r\n");
    }
}
 
void loop(void)
{
    uint8_t buffer[128] = {0};
    
	// WiFi发送数据。
    char *hello = "Hello, this is client!";
    wifi.send((const uint8_t*)hello, strlen(hello));
	
	// WiFi接收数据。
	// 需要更加需要合理设置超时时间，指令越长，需要设置的值越大。此处设置为1000。
    uint32_t len = wifi.recv(buffer, sizeof(buffer), 1000);
    if (len > 0) {
        mySerial.print("Received:[");
        for(uint32_t i = 0; i < len; i++) {
            mySerial.print((char)buffer[i]);
        }
        mySerial.print("]\r\n");
    }

	// delay(5000);
}

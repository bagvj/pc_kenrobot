 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  RoWiFi.cpp
 * @作者：  RoSys
 * @版本：  V0.1.0
 * @时间：  2016/08/25
 * @描述：  WiFi转串口模块驱动。
 *
 * \说明
 * WiFi转串口模块驱动。
 *
 * \方法列表
 * 
 * 		1. void RoWiFi::setPin(uint8_t port)
 * 		2. void RoWiFi::setPin(uint8_t dir_pin,uint8_t pwm_pin)
 * 		3. void RoWiFi::run(int16_t speed)
 * 		4. void RoWiFi::stop(void)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/08/25      0.1.0              新建库文件。
 *  
 * \示例
 *  
 * 		1.DCMotorTest.ino
 */
 
#include "RoWiFi.h"
String ATE0		="ATE0\r\n";      				//关闭回显，避免影响其他通信
String CIOBAUD 	="AT+CIOBAUD=115200\r\n";      	//设置串口波特率为115200
String CWMODE 	="AT+CWMODE=3\r\n";             //设为AP模式
String CWSAP 	="AT+CWSAP=\"RoSys-Link_0002\",\"12345678\",11,3\r\n";//默认名称RoSys-Link_0001 密码：12345678
String CIPAP 	="AT+CIPAP=\"192.168.0.1\"\r\n"; //设置AP模式IP地址
String RST 		="AT+RST\r\n";                 	//重启
String CIPMUX0	="AT+CIPMUX=0\r\n";            	//设置为单链接
String CIPMUX1 	="AT+CIPMUX=1\r\n";            	//设置为多链接  
String CIPMODE0 ="AT+CIPMODE=0\r\n";          	//透传模式
String CIPMODE1 ="AT+CIPMODE=1\r\n";          	//非透传模式
String CIPSERVER ="AT+CIPSERVER=1,8899\r\n";  	//设置为服务器模式，服务器端口号为8899
String CIPSEND 	="AT+CIPSEND=0,";              	//AT+CIPSEND= 发送数据,完整格式为"AT+CIPSEND=0,len\r\n"   



/**
 * \函数：RoWiFi
 * \说明：初始化，不做任何操作
 * \输入参数：无
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
RoWiFi::RoWiFi(void)
{

		
}

/**
 * \函数：init
 * \说明：初始化
 * \输入参数：无
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void RoWiFi::init(void)
{
	delay(500);
	Serial.begin(115200);
	sei();

	Serial.print(ATE0);
	delay(200);
	Serial.print(CIOBAUD);
	delay(200);
	Serial.print(CWSAP);
	delay(200);
	Serial.print(CIPAP);
	delay(200);
	Serial.print(RST);
	delay(1000);
	Serial.print(CIPMUX1);
	delay(200);
	Serial.print(CIPSERVER);
	delay(200);
	
	
}

///////////////////////////////////////
//函数名称：WiFiSendString
//函数类型：void*
//函数作用：通过WiFi发送数据，发送字符串
//参数：
//unsigned char len：字符串长度
//unsigned char *str：发送的字符
void RoWiFi::WiFiSendString(unsigned char *str,unsigned char len)
{
	Serial.print(CIPSEND);
	Serial.println(len);
	delay(100);
	Serial.write(str,len);
}


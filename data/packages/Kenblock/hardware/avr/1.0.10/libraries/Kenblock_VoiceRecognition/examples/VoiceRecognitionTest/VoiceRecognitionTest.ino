/**
 * \著作权  Copyright (C), 2017-2020, LZRobot
 * @名称：  VoiceRecognitionTest.ino
 * @作者：  Kenblcok
 * @版本：  V0.1.1
 * @时间：  2017/10/31
 * @描述：  语音识别模块串口控制驱动程序
 *
 * \说明
 *       擦除语音识别模块所有关键字，新添加10个关键字。接收语音识别返回值实现开灯关灯。
 *       语音模块接到 拓展版PD4端口（13、12）。
 *
 * 默认使用软件串口通信，如需使用硬件串口，做如下修改：
 *     1、注释掉 Kenblock_VoiceRecognition.h 中的 #define VR_USE_SOFTWARE_SERIAL
 *     2、定义修改为 VoiceRecognition myVR(Serial);	// 语音识别模块定义，使用硬件串口通信
 *
 * \方法列表
 * 
 *    1.    int getReturnValue(void);   // 获取语音识别模块返回值，以十进制数返回
 *    2.    void addKeyword(int line,String str,int sendValue);// 给语音识别模块添加关键字、关键字对应的返回值
 *    3.    void erase(void);	          // 擦除语音识别模块所有关键字
 *      
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  jimmy           2017/10/27      0.1.0              新建库文件。 
 *  KING            2017/10/31      0.1.1              修改实现函数。
 */
#include <SoftwareSerial.h>
#include "Kenblock.h"
#include "Kenblock_VoiceRecognition.h"

SoftwareSerial mySerial(13,12);		// PD4端口（拓展版） // RX:13, TX:12。
VoiceRecognition myVR(mySerial); 	// 语音识别模块定义，使用软件串口通信

int LED = 3;						          // LED模块接口
int recognitionValue = 0;        	// 语音识别后返回值
void setup()
{
  Serial.begin(9600);      		    // 初始化串口，波特率为9600
  myVR.begin(9600);            	  // 语音识别模块通信初始化，波特率9600
  pinMode(LED, OUTPUT);           // LED

  // 擦所语音识别模块所有关键字,会擦除默认的39个关键字 
  if (myVR.erase()) {
    Serial.print("erase ok\r\n");
  } else {
    Serial.print("erase err\r\n");
  }   

  // 在语音识别模块第“1”行存  “开灯”   返回值“1” 
  if (myVR.addKeyword(1,"kai deng",1)) {
    Serial.print("add keyword 1 ok\r\n");
  } else {
    Serial.print("add keyword 1 err\r\n");
  } 	

  // 用户给语音模块添加关键字拼音长度不超过19，同时设置返回值（范围1-254）。
  // myVR.addKeyword(1,"kai deng",1);             // 在语音识别模块第“1”行存  “开灯”   返回值“1”
  myVR.addKeyword(2,"guan deng",2);            // 在语音识别模块第“2”行存  “关灯”   返回值“2”
  myVR.addKeyword(3,"ken luo bo",5);           // 在语音识别模块第“3”行存  “啃萝卜” 返回值“5”
  myVR.addKeyword(10,"zhong guo",12);          // 在语音识别模块第“10”行存 “中国”   返回值“12”
  myVR.addKeyword(18,"bei jing",102);          // 在语音识别模块第“18”行存 “北京”   返回值“102”
  myVR.addKeyword(6,"qian jin",3);             // 在语音识别模块第“6”行存  “前进”   返回值“3”
  myVR.addKeyword(7,"hou tui",4);              // 在语音识别模块第“7”行存  “后退”   返回值“4”
  myVR.addKeyword(8,"ni hao",128);             // 在语音识别模块第“8”行存  “你好”   返回值“128”
  myVR.addKeyword(9,"shen zhen",111);          // 在语音识别模块第“9”行存  “深圳”   返回值“111”
  myVR.addKeyword(11,"yu yin shi bie",225);    // 在语音识别模块第“11”行存 “语音识别” 返回值“225” 
}
  
void loop()
{
	// 语音识别 最多识别39个关键字 
	// myVR.getReturnValue() 返回值默认范围1-39
	recognitionValue = myVR.getReturnValue();  
	if(recognitionValue>0)
	{
		Serial.print("recognitionValue = ");
		Serial.println(recognitionValue);        // 模拟串口打印返回值
	}
	switch(recognitionValue)     
	{
		case 1:
			digitalWrite(LED,HIGH);   // LED亮
			Serial.println("light ON"); 
			break; 
		case 2:
			digitalWrite(LED,LOW);    // LED灭
			Serial.println("light OFF"); 
			break;
		default: break;  
	}
}

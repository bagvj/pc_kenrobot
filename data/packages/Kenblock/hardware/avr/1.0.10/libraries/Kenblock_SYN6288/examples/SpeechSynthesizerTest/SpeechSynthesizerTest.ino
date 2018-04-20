/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  SpeechSynthesizerTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/10/19
 * @描述：  SYN6288语音合成模块的使用示例。
 *
 * \说明
 * SYN6288语音合成模块的使用示例，可合成汉字、数字等。
 * 
 * 重点说明：由于Arduino IDE汉字编码问题。需要将此示例文件，复制到新建的ino文件中编译，直接在库文件夹下编译汉字编码是不对的。
 * 
 * 默认使用软件串口通信，如需使用硬件串口，做如下修改：
 *     1、注释掉 Kenblock_SYN6288.h 中的 #define SYN6288_USE_SOFTWARE_SERIAL
 *     2、定义修改为 SYN6288 tts(Serial);	// 语音合成模块定义，使用硬件串口通信
 * 
 * \函数列表
 * 		void	begin(uint32_t baud); 	//初始化，设置串口波特率。
 *		bool	speech(unsigned char *textData, unsigned char music = 0); //文本合成播放命令。可选择背景音乐。
 * 		bool 	stop(void); 	  //停止合成命令。
 * 		bool 	suspend(void); 	//暂停合成命令。
 * 		bool 	recover(void); 	//恢复合成命令，暂停后使用。
 * 		bool 	check(void); 	  //状态查询。如果SYN6288为空闲状态，空闲状态返回true。
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/10/19      0.1.0              新建程序。
 *  
 */
#include <SoftwareSerial.h>
#include "Kenblock_SYN6288.h"

SoftwareSerial mySerial(12, 13);	// 软件串口：PD4端口（拓展版） // RX:12, TX:13。
SYN6288 tts(mySerial);				    // 语音合成模块定义，使用软件串口通信

void setup()
{
  Serial.begin(115200);	
	// 音合成模块通信初始化。
  tts.begin(9600);	
}

void loop() { 
	if (tts.speech(u8"乐智机器人欢迎您",0)) {
		Serial.print("speech ok\r\n");
	} else {
		Serial.print("speech err\r\n");
	}
	delay(5000);
	
	// 下面测试暂停、恢复等指令。
	if (tts.speech(u8"测试暂停、恢复、停止指令")) {
		Serial.print("speech ok\r\n");
	} else {
		Serial.print("speech err\r\n");
	}
	delay(1000);
	
	// 暂停合成命令。
	if (tts.suspend()) {
		Serial.print("suspend ok\r\n");
	} else {
		Serial.print("suspend err\r\n");
	}
	delay(1000);
	
	// 恢复合成命令。
	if (tts.recover()) {
		Serial.print("recover ok\r\n");
	} else {
		Serial.print("recover err\r\n");
	}	
	delay(1000);
	
	// 停止合成命令。
	if (tts.stop()) {
		Serial.print("stop ok\r\n");
	} else {
		Serial.print("stop err\r\n");
	}
	
	delay(2000);
	// 状态查询。如果SYN6288为空闲状态，空闲状态返回true。
	if (tts.check()) {
		Serial.print("check ok\r\n");
	} else {
		Serial.print("check err\r\n");
	}	
} 
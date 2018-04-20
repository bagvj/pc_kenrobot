 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_SYN6288.h
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/10/19
 * @描述：  SYN6288 语音合成模块 驱动库。
 *
 * \说明
 * SYN6288 语音合成模块 驱动库。合成输出中文，可直接输入中文，省去Arduino IDE中提前中文转码。
 *
 * 默认为 软件串口通信，如需使用硬件串口，请注释掉 .h文件中的 //#define SYN6288_USE_SOFTWARE_SERIAL
 *
 * 原理：由于Arduino IDE 的编辑器默认编码为UTF-8，而语音合成模块支持的编码为GB2312、GBK、BIG5、Unicode，
 *       所以在此我们需要将UTF-8转换为Unicode。使其能够正确语音合成。
 *
 * \方法列表
 * 
 * 		void	begin(uint32_t baud); 	//初始化，设置串口波特率。
 *		bool	speech(unsigned char *textData, unsigned char music = 0); //文本合成播放命令。可选择背景音乐。
 * 		bool	sound(unsigned char *soundData) ; //播放声音提示音、和弦提示音、和弦声。
 * 		bool 	stop(void); 	//停止合成命令。
 * 		bool 	suspend(void); 	//暂停合成命令。
 * 		bool 	recover(void); 	//恢复合成命令，暂停后使用。
 * 		bool 	powerDown(void); //进入POWER DOWN 模式命令。
 * 		bool 	check(void); 	//状态查询。如果SYN6288为空闲状态，空闲状态返回true。
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/10/19      0.1.0              新建库文件。
 *  
 * \示例
 *  
 * 		1.SpeechSynthesizerTest.ino
 */
 
#ifndef Kenblock_SYN6288_H
#define Kenblock_SYN6288_H

#include <Arduino.h>

// 使用软件串口
// 如果要使用硬件串口，需要注释掉此条
#define SYN6288_USE_SOFTWARE_SERIAL

#ifdef SYN6288_USE_SOFTWARE_SERIAL
#include "SoftwareSerial.h"
#endif

// 使能UTF8转换为Unicode
#define SYN6288_UTF8_TO_UNICODE

/**
 * Class: SYN6288
 * \说明：Class SYN6288 的声明
 */
class SYN6288
{
  public:
  
#ifdef SYN6288_USE_SOFTWARE_SERIAL
    SYN6288(SoftwareSerial &uart);
#else 
    SYN6288(HardwareSerial &uart);
#endif
	
	void begin(uint32_t baud = 9600);
	bool speech(unsigned char *textData, unsigned char music = 0);
	bool sound(unsigned char *textData);
	bool stop(void);
	bool suspend(void);
	bool recover(void);
	bool powerDown(void);
	bool check(void);
	
	void SYN6288::synFrameInfo(unsigned char *textData, unsigned int length = 0, unsigned char music = 0);
	void SYN6288::synSet(uint8_t *set_data);
		
  private:
	void rx_empty(void);
	bool receiveAck(void);
	
	
#ifdef SYN6288_UTF8_TO_UNICODE
	int SYN6288::unicode_to_utf8(unsigned char *in, int insize, uint8_t **out);
	int utf8_to_unicode(uint8_t *in, uint8_t **out, int *outsize);  
#endif	
	
	uint8_t *_utf8 = NULL;  
	uint8_t *_uni = NULL;  
	unsigned int _uniSize = 0; 
		
#ifdef SYN6288_USE_SOFTWARE_SERIAL
    SoftwareSerial *m_puart; /* SYN6288 软件串口通信*/
#else
    HardwareSerial *m_puart; /* SYN6288 硬件串口通信*/
#endif
};

#endif // Kenblock_SYN6288_H


 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_Gamepad_Hardware.h
 * @作者：  Kenblock
 * @版本：  V0.4.5
 * @时间：  2018/1/30
 * @描述：  2.4G遥控手柄 Kenblock_Gamepad_Hardware.c 的头文件。
 *
 * \说明
 * 2.4G 遥控手柄。
 *
 * \方法列表
 * 
 * 		1. void Gamepad_Hardware::begin(uint32_t baud = 9600)
 * 		2. void Gamepad_Hardware::dataRead(uint8_t id)
 *		3. void Gamepad_Hardware::dataRead()
 * 		4. bool Gamepad_Hardware::NewButtonState()
 * 		5. bool Gamepad_Hardware::NewButtonState(unsigned int)
 * 		6. bool Gamepad_Hardware::ButtonPressed(unsigned int button)
 * 		7. bool Gamepad_Hardware::ButtonReleased(unsigned int button)
 * 		8. bool Gamepad_Hardware::Button(uint16_t button)
 *		9. bool uint8_t Joystick(uint8_t joystick);
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`           `<Descr>`
 *  RJK            2017/1/30         0.4.5              新建库文件。
 *  
 * \示例
 *  
 * 		1.SoftwareSerialTest.ino
 * 		1.HardwareSerialTest.ino
 */

#ifndef Kenblock_Gamepad_Hardware_H
#define Kenblock_Gamepad_Hardware_H
#include <Arduino.h>

#include "string.h"

#define GP_UP      		0X0400
#define GP_DOWN   		0X1000
#define GP_LEFT    		0X0800
#define GP_RIGHT  		0X2000

#define GP_TRIANGLE    	0X0008
#define GP_CROSS      	0X0002
#define GP_SQUARE      	0X0001
#define GP_CIRCLE      	0X0004

#define GP_L1          	0x0200
#define GP_L2          	0x0100
#define GP_R1          	0x0010
#define GP_R2          	0x0020
#define GP_L3         	0x0080
#define GP_R3          	0x0040

#define GP_SELECT      	0x4000
#define GP_START       	0x8000

#define GP_LX           5
#define GP_LY           4
#define GP_RX           7
#define GP_RY           6

class Gamepad_Hardware 
{
	public:
	
	Gamepad_Hardware(HardwareSerial &uart);

	/**
	* \函数：begin
	* \说明：初始化接收器波特率
	* \输入参数：
    *	baud -- 波特率
	* \输出参数：无
	* \返回值：无
	* \其他：无
	*/
	 void begin(uint32_t baud = 9600);		
	 /**
	* \函数：dataRead
	* \说明：按键键值读取、转换函数
	* \输入参数：
    *	id -- 接收器主板的ID
	* \输出参数：无
	* \返回值：无
	* \其他：无
	*/
	 void dataRead(uint8_t id);	
	 void dataRead();	
	/**
	* \函数：NewButtonState
	* \说明：获取按键是否被改变
	* \输入参数：无
	* \输出参数：无
	* \返回值：
	* \bool -- 按键状态与上次相同返回：false ** 不同：true
	* \其他：无
	*/
	 bool NewButtonState();	 
	 /**
	* \函数：NewButtonState
	* \说明：获取某个按键是否被改变
	* \输入参数：无
	* \输出参数：无
	* \返回值：
	* \bool -- 按键状态与上次相同返回：false ** 不同：true
	* \其他：无
	*/
     bool NewButtonState(unsigned int button);
	 /**
	* \函数：ButtonPressed
	* \说明：检测某个按键是否被按下
	* \输入参数：无
	* \输出参数：无
	* \返回值：
	* \bool -- 按下瞬间：true ** 否则：false
	* \其他：无
	*/
	 bool ButtonPressed(unsigned int button);
	 /**
	* \函数：Button
	* \说明：检测某个按键是否被按下
	* \输入参数：无
	* \输出参数：无
	* \返回值：
	* \bool -- 按下：true ** 否则：false
	* \其他：无
	*/
	 bool Button(uint16_t button);
	 /**
	* \函数：ButtonReleased
	* \说明：检测某个按键是否松开
	* \输入参数：无
	* \输出参数：无
	* \返回值：
	* \bool -- 松开瞬间：true ** 否则：false
	* \其他：无
	*/
	 bool ButtonReleased(unsigned int button);
	 /**
	* \函数：Joystick
	* \说明：获取某个摇杆的数值
	* \输入参数：无
	* \输出参数：无
	* \返回值：
	* \uint8_t -- 摇杆的位置信息
	* \其他：无
	*/
	uint8_t Joystick(uint8_t joystick);	
	
	static uint16_t last_buttons ;
    static uint16_t buttons;
	static unsigned long overtime ;
	
	private:
	
	uint8_t cmdbuffer[10];

	boolean dataError = false;
	boolean RXFlag = false; 
	unsigned char Rxdata = 0;  
	unsigned char RE_COUNT = 0; 
	uint32_t checksum;
	
    HardwareSerial *m_puart;

	
	void rx_empty(void);		
};

    
  
#endif


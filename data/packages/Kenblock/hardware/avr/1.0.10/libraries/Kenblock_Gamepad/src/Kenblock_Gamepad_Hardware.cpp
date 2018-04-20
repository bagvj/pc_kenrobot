/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_GamePad_Hardware.cpp
 * @作者：  Kenblock
 * @版本：  V0.4.5
 * @时间：  2018/1/30
 * @描述：  2.4G遥控手柄 Kenblock_GamePad_Hardware.cpp。
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
 *  RJK            2018/1/30         0.4.5               新建库文件。
 *  
 * \示例
 *  
 * 		1.SoftwareSerialTest.ino
 * 		1.HardwareSerialTest.ino
 */  
#include "Kenblock_Gamepad_Hardware.h"


 Gamepad_Hardware::Gamepad_Hardware(HardwareSerial &uart): m_puart(&uart)
 {
	 
 }


uint16_t Gamepad_Hardware::last_buttons = 0xffff;
uint16_t Gamepad_Hardware::buttons = 0xffff;
unsigned long Gamepad_Hardware::overtime = 0;

	/**
	* \函数：begin
	* \说明：初始化接收器波特率
	* \输入参数：
    *	baud -- 波特率
	* \输出参数：无
	* \返回值：无
	* \其他：无
	*/
void Gamepad_Hardware::begin(uint32_t baud)
{
    m_puart->begin(baud);
	//mySerial.begin(9600);
    rx_empty();
}

/**
 * \函数： rx_empty
 * \说明： 清除串口接收缓存器中的值
 */
void Gamepad_Hardware::rx_empty(void) 
{
    while(m_puart->available() > 0) {
        m_puart->read();
    }
}

	 /**
	* \函数：dataRead
	* \说明：按键键值读取、转换函数
	* \输入参数：
    *	id -- 接收器主板的ID
	* \输出参数：无
	* \返回值：无
	* \其他：无
	*/
void Gamepad_Hardware::dataRead(uint8_t id)
{	 
	//checksum = id + cmdbuffer[2] + cmdbuffer[3] + cmdbuffer[4] + cmdbuffer[5] + cmdbuffer[6] + cmdbuffer[7];
	last_buttons = buttons; 
	while (m_puart->available() > 0)
	{	
		Rxdata = m_puart->read();
		if(!RXFlag)
		{
			if(Rxdata == 0xaa)
			{
				RXFlag = true;
				RE_COUNT = 0;
				*cmdbuffer = 0;
			}
		}
		if(RXFlag)
		{
			cmdbuffer[RE_COUNT++] = Rxdata;
			
		 if(RE_COUNT>10)
			{

				RXFlag = false;
				dataError = true;
				RE_COUNT = 0;
				buttons = 0XFFFF;
				return 0;
			}
		 else if (Rxdata == 0xbb)
			{
				
				checksum = 0;
				checksum = id + cmdbuffer[2] + cmdbuffer[3] + cmdbuffer[4] + cmdbuffer[5] + cmdbuffer[6] + cmdbuffer[7];
		        checksum = (uint8_t)(checksum & 0x000000ff);

				if((checksum != cmdbuffer[8]) || (RE_COUNT < 10))
					{
						RXFlag = false;
						dataError = true;
						RE_COUNT = 0;
						buttons = 0XFFFF;
						return 0 ;
					}
				else
					{
						RXFlag = false;
						dataError = false;
						last_buttons = buttons;
						buttons = cmdbuffer[3];
						buttons = (buttons<<8) | (uint16_t)cmdbuffer[2];
					}
			}
		}
	}
}

void Gamepad_Hardware::dataRead()
{	   
	//if(m_puart->available() == 0) last_buttons = buttons; //如果串口未收到 新数据，则状态认为是未改变 避免主程序循环过快导致多次判断
	//last_buttons = buttons; 
	last_buttons = buttons; 
	while (m_puart->available() > 0)
	{	
		Rxdata = m_puart->read();
		if(!RXFlag)
		{
			if(Rxdata == 0xaa)
			{
				RXFlag = true;
				RE_COUNT = 0;
				*cmdbuffer = 0;
			}
		}
		if(RXFlag)
		{
			cmdbuffer[RE_COUNT++] = Rxdata;
			
		 if(RE_COUNT>10)
			{
				RXFlag = false;
				RE_COUNT = 0;
				buttons = 0XFFFF;//防止误码时失控
				dataError = true;
				return 0;
			}
		 else if (Rxdata == 0xbb)
			{
				
				checksum = 0;
				checksum = cmdbuffer[1] + cmdbuffer[2] + cmdbuffer[3] + cmdbuffer[4] + cmdbuffer[5] + cmdbuffer[6] + cmdbuffer[7];
		        checksum = (uint8_t)(checksum & 0x000000ff);

				if((checksum != cmdbuffer[8]) || (RE_COUNT < 10))
					{
						RXFlag = false;
						RE_COUNT = 0;
						buttons = 0XFFFF;//防止误码时失控
						dataError = true;
						return 0 ;
					}
				else
					{
						RXFlag = false;
						dataError = false;
						last_buttons = buttons;
						buttons = cmdbuffer[3];
						buttons = (buttons<<8) | (uint16_t)cmdbuffer[2];
					}
			}
		}
	}
}

	/**
	* \函数：NewButtonState
	* \说明：获取按键是否被改变
	* \输入参数：无
	* \输出参数：无
	* \返回值：
	* \bool -- 按键状态与上次相同返回：false ** 不同：true
	* \其他：无
	*/
 bool Gamepad_Hardware::NewButtonState()
{	
	return ((last_buttons ^ buttons) > 0);
}
	 /**
	* \函数：NewButtonState
	* \说明：获取某个按键是否被改变
	* \输入参数：无
	* \输出参数：无
	* \返回值：
	* \bool -- 按键状态与上次相同返回：false ** 不同：true
	* \其他：无
	*/
bool Gamepad_Hardware::NewButtonState(unsigned int button)
{
	//Serial.println(buttons);
	return (((last_buttons ^ buttons) & button) > 0);
}
	 /**
	* \函数：ButtonPressed
	* \说明：检测某个按键是否被按下
	* \输入参数：无
	* \输出参数：无
	* \返回值：
	* \bool -- 按下瞬间：true ** 否则：false
	* \其他：无
	*/
bool Gamepad_Hardware::ButtonPressed(unsigned int button)
{
	return(NewButtonState(button) & Button(button));
}
	 /**
	* \函数：ButtonReleased
	* \说明：检测某个按键是否松开
	* \输入参数：无
	* \输出参数：无
	* \返回值：
	* \bool -- 松开瞬间：true ** 否则：false
	* \其他：无
	*/
bool Gamepad_Hardware::ButtonReleased(unsigned int button)
{
	
	return((NewButtonState(button)) & ((~last_buttons & button) > 0));
}
	 /**
	* \函数：Button
	* \说明：检测某个按键是否被按下
	* \输入参数：无
	* \输出参数：无
	* \返回值：
	* \bool -- 按下：true ** 否则：false
	* \其他：无
	*/
bool Gamepad_Hardware::Button(uint16_t button)
{	
	return ((~buttons & button) > 0);
}
	 /**
	* \函数：Joystick
	* \说明：获取某个摇杆的数值
	* \输入参数：无
	* \输出参数：无
	* \返回值：
	* \uint8_t -- 摇杆的位置信息
	* \其他：无
	*/
 uint8_t Gamepad_Hardware::Joystick(uint8_t joystick)
{	if(dataError)
	return 125;
	else
	return cmdbuffer[joystick];
} 



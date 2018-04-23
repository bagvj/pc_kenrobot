 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_Gamepad.h
 * @作者：  Kenblock
 * @版本：  V0.4.5
 * @时间：  2018/1/30
 * @描述：  2.4G遥控手柄 使用软串口连接接收器
 *（将Kenblock_Gamepad.h 中 #define GamePad_USE_SOFTWARE_SERIAL 取消注释）
 *
 * \说明
 * 2.4G 遥控手柄，按键功能测试程序。
 * *按键选择：
 * GP_UP	GP_DOWN		GP_LEFT		GP_RIGHT	GP_TRIANGLE		GP_CROSS	GP_SQUARE	GP_CIRCLE	
 * GP_L1 	GP_L2 		GP_R1		GP_R2 		GP_L3 			GP_R3 		GP_SELECT 	GP_START
 * * 摇杆选择：
 * GP_LX	GP_LY		GP_RX 		GP_RY
 * \方法列表
 * 
 * 		1. void Gamepad_Software	::begin(uint32_t baud = 9600)
 * 		2. void Gamepad_Software	::dataRead(uint8_t id)
 *		3. void Gamepad_Software	::dataRead()
 * 		4. bool Gamepad_Software	::NewButtonState()
 * 		5. bool Gamepad_Software	::NewButtonState(unsigned int)
 * 		6. bool Gamepad_Software	::ButtonPressed(unsigned int button)
 * 		7. bool Gamepad_Software	::ButtonReleased(unsigned int button)
 * 		8. bool Gamepad_Software	::Button(uint16_t button)
 *		9. uint8_t Gamepad_Software	::Joystick(uint8_t joystick)
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`           `<Descr>`
 *  RJK            2018/1/30         0.4.5              新建库文件。
 */

#include "Kenblock.h"
#include "Kenblock_Gamepad_Software.h"

SoftwareSerial mySerial(3,2);	// RX,TX 连接的引脚 注意接收与发送的关系
Gamepad_Software	mypad(mySerial);
void setup() {
  mypad.begin(9600);
  Serial.begin(9600);
}
void loop() {
	mypad.dataRead();
	/*检测按键按下，仅按下瞬间检测一次*/
	if(mypad.ButtonPressed(GP_UP))
	{
		Serial.println("UP Botton Pressed");
	}
	if(mypad.ButtonPressed(GP_DOWN))
	{
		Serial.println("down Botton Pressed");
	}	
 	 if(mypad.ButtonPressed(GP_LEFT))
	{
		Serial.println("left Botton Pressed");
	}
	if(mypad.ButtonPressed(GP_RIGHT))
	{
		Serial.println("right Botton Pressed");
	}

	if(mypad.ButtonPressed(GP_L1))
	{
		Serial.println("L1 Botton Pressed");
	}
	if(mypad.ButtonPressed(GP_L2))
	{
		Serial.println("l2 Botton Pressed");
	} 

	if(mypad.ButtonPressed(GP_R1))
	{
		Serial.println("r1 Botton Pressed");
	} 
	if(mypad.ButtonPressed(GP_R2))
	{
		Serial.println("r2 Botton Pressed");
	} 

	if(mypad.ButtonPressed(GP_L3))
	{
		Serial.println("l3 Botton Pressed");
	} 
	if(mypad.ButtonPressed(GP_R3))
	{
		Serial.println("r3 Botton Pressed");
	}

	/*检测按键释放，仅释放瞬间检测一次*/
	
	if(mypad.ButtonReleased(GP_UP))
	{
		Serial.println("UP Button Released");
	}
	
	if(mypad.ButtonReleased(GP_DOWN))
	{
		Serial.println("down Button Released");
	}
 	if(mypad.ButtonReleased(GP_LEFT))
	{
		Serial.println("left Button Released");
	}
	if(mypad.ButtonReleased(GP_RIGHT))
	{
		Serial.println("right Button Released");
	}
	if(mypad.ButtonReleased(GP_L1))
	{
		Serial.println("L1 Button Released");
	} 
	if(mypad.ButtonReleased(GP_L2))
	{
		Serial.println("l2 Button Released");
	} 
	if(mypad.ButtonReleased(GP_R1))
	{
		Serial.println("r1 Button Released");
	} 
	if(mypad.ButtonReleased(GP_R2))
	{
		Serial.println("r2 Button Released");
	} 
	if(mypad.ButtonReleased(GP_L3))
	{
		Serial.println("l3 Button Released");
	} 
	if(mypad.ButtonReleased(GP_R3))
	{
		Serial.println("r3 Button Released");
	} 
	/*检测被按住的按键，持续检测*/
	if(mypad.Button(GP_SQUARE))
	{
		Serial.println("square Button");
	}
	if(mypad.Button(GP_TRIANGLE))
	{
		Serial.println("triangle Button");
	}	
	if(mypad.Button(GP_CIRCLE))
	{
		Serial.println("circle Button");
	}
	if(mypad.Button(GP_CROSS))
	{
		//Serial.println("cross Button");
	  Serial.print("LX:");
	  Serial.print(mypad.Joystick(GP_LX));
	  Serial.print("  LY:");
	  Serial.print(mypad.Joystick(GP_LY));
	  Serial.print("  RX:");
	  Serial.print(mypad.Joystick(GP_RX));
	  Serial.print("  RY:");
	  Serial.println(mypad.Joystick(GP_RY));
	}
}


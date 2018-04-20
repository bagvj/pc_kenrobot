 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_Gamepad.h
 * @作者：  Kenblock
 * @版本：  V0.4.5
 * @时间：  2018/1/30
 * @描述：  2.4G遥控手柄 使用硬件串口连接接收器
 *（将Kenblock_Gamepad.h 中 #define GamePad_USE_SOFTWARE_SERIAL 注释掉）
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
 * 		1. void Gamepad_Hardware::begin(uint32_t baud = 9600)
 * 		2. void Gamepad_Hardware::dataRead(uint8_t id)
 *		3. void Gamepad_Hardware::dataRead()
 * 		4. bool Gamepad_Hardware::NewButtonState()
 * 		5. bool Gamepad_Hardware::NewButtonState(unsigned int)
 * 		6. bool Gamepad_Hardware::ButtonPressed(unsigned int button)
 * 		7. bool Gamepad_Hardware::ButtonReleased(unsigned int button)
 * 		8. bool Gamepad_Hardware::Button(uint16_t button)
 *		9. uint8_t Gamepad_Hardware::Joystick(uint8_t joystick)
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`           `<Descr>`
 *  RJK            2018/1/30         0.4.5              新建库文件。
 */

#include <SoftwareSerial.h>
#include "Kenblock_Gamepad_Hardware.h"


SoftwareSerial mySerial(3, 2);	//软串口 RX,TX 连接的引脚 注意接收与发送的关系
Gamepad_Hardware mypad(Serial);			//使用硬件串口
			
void setup() {
	mypad.begin(9600);
	mySerial.begin(9600);
}
void loop() {
	mypad.dataRead();
	/*检测按键按下，仅按下瞬间检测一次*/
	if(mypad.ButtonPressed(GP_UP))
	{
		mySerial.println("UP Botton Pressed");
	}
	if(mypad.ButtonPressed(GP_DOWN))
	{
		mySerial.println("down Botton Pressed");
	}	
 	 if(mypad.ButtonPressed(GP_LEFT))
	{
		mySerial.println("left Botton Pressed");
	}
	if(mypad.ButtonPressed(GP_RIGHT))
	{
		mySerial.println("right Botton Pressed");
	}

	if(mypad.ButtonPressed(GP_L1))
	{
		mySerial.println("L1 Botton Pressed");
	}
	if(mypad.ButtonPressed(GP_L2))
	{
		mySerial.println("l2 Botton Pressed");
	} 

	if(mypad.ButtonPressed(GP_R1))
	{
		mySerial.println("r1 Botton Pressed");
	} 
	if(mypad.ButtonPressed(GP_R2))
	{
		mySerial.println("r2 Botton Pressed");
	} 

	if(mypad.ButtonPressed(GP_L3))
	{
		mySerial.println("l3 Botton Pressed");
	} 
	if(mypad.ButtonPressed(GP_R3))
	{
		mySerial.println("r3 Botton Pressed");
	}

	/*检测按键释放，仅释放瞬间检测一次*/
	
	if(mypad.ButtonReleased(GP_UP))
	{
		mySerial.println("UP Button Released");
	}
	
	if(mypad.ButtonReleased(GP_DOWN))
	{
		mySerial.println("down Button Released");
	}
 	if(mypad.ButtonReleased(GP_LEFT))
	{
		mySerial.println("left Button Released");
	}
	if(mypad.ButtonReleased(GP_RIGHT))
	{
		mySerial.println("right Button Released");
	}
	if(mypad.ButtonReleased(GP_L1))
	{
		mySerial.println("L1 Button Released");
	} 
	if(mypad.ButtonReleased(GP_L2))
	{
		mySerial.println("l2 Button Released");
	} 
	if(mypad.ButtonReleased(GP_R1))
	{
		mySerial.println("r1 Button Released");
	} 
	if(mypad.ButtonReleased(GP_R2))
	{
		mySerial.println("r2 Button Released");
	} 
	if(mypad.ButtonReleased(GP_L3))
	{
		mySerial.println("l3 Button Released");
	} 
	if(mypad.ButtonReleased(GP_R3))
	{
		mySerial.println("r3 Button Released");
	} 
	/*检测被按住的按键，持续检测*/
	if(mypad.Button(GP_SQUARE))
	{
		mySerial.println("square Button");
	}
	if(mypad.Button(GP_TRIANGLE))
	{
		mySerial.println("triangle Button");
	}	
	if(mypad.Button(GP_CIRCLE))
	{
		mySerial.println("circle Button");
	}
	if(mypad.Button(GP_CROSS))
	{
		mySerial.println("cross Button");
	 // mySerial.print("LX:");
	 // mySerial.print(mypad.Joystick(GP_LX));
	 // mySerial.print("  LY:");
	 // mySerial.print(mypad.Joystick(GP_LY));
	 // mySerial.print("  RX:");
	 // mySerial.print(mypad.Joystick(GP_RX));
	 // mySerial.print("  RY:");
	 // mySerial.println(mypad.Joystick(GP_RY));
	}
}

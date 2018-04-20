 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_Gamepad.h
 * @作者：  Kenblock
 * @版本：  V0.4.4
 * @时间：  2017/12/15
 * @描述：  2.4G遥控手柄 使用硬件串口连接接收器
 *（将Kenblock_Gamepad.h 中 #define GamePad_USE_SOFTWARE_SERIAL 注释掉）
 *
 * \说明
 * 2.4G 遥控手柄，按键功能测试程序。
 * *按键选择：
 * up	down	left	right	square	triangle	circle	cross	l1 l2 l3	r1 r2 r3 	select 	start
 * * 摇杆选择：
 * * lx		ly		rx 		ry
 * \方法列表
 * 
 * 		1. void GamePad::begin(uint32_t baud = 9600)
 * 		2. void GamePad::dataRead(uint8_t id)
 *		3. void GamePad::dataRead()
 * 		4. bool GamePad::NewButtonState()
 * 		5. bool GamePad::NewButtonState(unsigned int)
 * 		6. bool GamePad::ButtonPressed(unsigned int button)
 * 		7. bool GamePad::ButtonReleased(unsigned int button)
 * 		8. bool GamePad::Button(uint16_t button)
 *		9. uint8_t GamePad::Joystick(uint8_t joystick)
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`           `<Descr>`
 *  RJK            2017/12/15         0.4.4              新建库文件。
 */

#include <SoftwareSerial.h>
#include "Kenblock_Gamepad.h"


SoftwareSerial mySerial(3, 2);	//软串口 RX,TX 连接的引脚 注意接收与发送的关系
GamePad mypad(Serial);			//使用硬件串口
			
void setup() {
	mypad.begin(9600);
	mySerial.begin(9600);
}
void loop() {
	mypad.dataRead();
	/*Pressed*/
	if(mypad.ButtonPressed(up))
	{
		mySerial.println("UP BottonPressed");
	}
	if(mypad.ButtonPressed(down))
	{
		mySerial.println("down BottonPressed");
	}	
 	 if(mypad.ButtonPressed(left))
	{
		mySerial.println("left BottonPressed");
	}
	if(mypad.ButtonPressed(right))
	{
		mySerial.println("right BottonPressed");
	}

	if(mypad.ButtonPressed(l1))
	{
		mySerial.println("L1 BottonPressed");
	}
	if(mypad.ButtonPressed(l2))
	{
		mySerial.println("l2 BottonPressed");
	} 

	if(mypad.ButtonPressed(r1))
	{
		mySerial.println("r1 BottonPressed");
	} 
	if(mypad.ButtonPressed(r2))
	{
		mySerial.println("r2 BottonPressed");
	} 

	if(mypad.ButtonPressed(l3))
	{
		mySerial.println("l3 BottonPressed");
	} 
	if(mypad.ButtonPressed(r3))
	{
		mySerial.println("r3 BottonPressed");
	}

	// /*Released*/
	
	if(mypad.ButtonReleased(up))
	{
		mySerial.println("UP ButtonReleased");
	}
	
	if(mypad.ButtonReleased(down))
	{
		mySerial.println("down ButtonReleased");
	}
 	if(mypad.ButtonReleased(left))
	{
		mySerial.println("left ButtonReleased");
	}
	if(mypad.ButtonReleased(right))
	{
		mySerial.println("right ButtonReleased");
	}
	if(mypad.ButtonReleased(l1))
	{
		mySerial.println("L1 ButtonReleased");
	} 
	if(mypad.ButtonReleased(l2))
	{
		mySerial.println("l2 ButtonReleased");
	} 
	if(mypad.ButtonReleased(r1))
	{
		mySerial.println("r1 ButtonReleased");
	} 
	if(mypad.ButtonReleased(r2))
	{
		mySerial.println("r2 ButtonReleased");
	} 
	if(mypad.ButtonReleased(l3))
	{
		mySerial.println("l3 ButtonReleased");
	} 
	if(mypad.ButtonReleased(r3))
	{
		mySerial.println("r3 ButtonReleased");
	} 
	/*Button*/
	if(mypad.Button(square))
	{
		mySerial.println("square Button");
	}
	if(mypad.Button(triangle))
	{
		mySerial.println("triangle Button");
	}	
	if(mypad.Button(circle))
	{
		mySerial.println("circle Button");
	}
	if(mypad.Button(cross))
	{
		mySerial.println("cross Button");
	 // mySerial.print("LX:");
	 // mySerial.print(mypad.Joystick(lx));
	 // mySerial.print("  LY:");
	 // mySerial.print(mypad.Joystick(ly));
	 // mySerial.print("  RX:");
	 // mySerial.print(mypad.Joystick(rx));
	 // mySerial.print("  RY:");
	 // mySerial.println(mypad.Joystick(ry));
	}
}

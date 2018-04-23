/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  ExMotorTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.1
 * @时间：  2017/11/03
 * @描述：  Kenblock 电机舵机驱动模块 驱动舵机测试示例。不能与MOTOC同时使用！
 *
 * \说明
 * Kenblock 电机舵机驱动模块 驱动舵机测试示例。控制舵机转动角度。
 * 注意：使用舵机时，MOTOC不能使用！
 * 两种通信方式，仅定义函数不一样，其他使用完全一样。若需要使用IIC通信，只需要修改为 MotorServo_IIC exMS; 定义即可。
 * 
 * 默认使用软件串口通信，如需使用硬件串口，做如下修改：
 *     1、注释掉 Kenblock_MotorServo.h 中的 #define MOTORSERVO_USE_SOFTWARE_SERIAL
 *     2、定义修改为 MotorServo_USART exMS(Serial);	// 电机舵机驱动模块定义，使用硬件串口通信
 *
 * \函数列表
 * 		void 	begin(); 	// 通信初始化
 * 		void	servoWrite(uint8_t index1,uint8_t value1,uint8_t index2 = 0,uint8_t value2 = 0,uint8_t index3 = 0,uint8_t value3 = 0,uint8_t index4 = 0,uint8_t value4 = 0);		// 舵机控制函数。同时控制 1个、2个、3个或者4个舵机转动。舵机序号只能是1~4，否则不执行。不能与MOTOC同时运行。
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/11/03      0.1.1              新建程序。
 *  
 */
#include <SoftwareSerial.h>
#include "Kenblock_MotorServo.h"

SoftwareSerial mySerial(13, 12);	// 软件串口：PD4端口（拓展版） // RX:13, TX:12。

MotorServo_USART exMS(mySerial);	// 电机舵机驱动模块定义，使用软件串口通信
//MotorServo_IIC exMS;						// 电机舵机驱动模块定义，使用IIC通信
 
void setup()
{
	exMS.begin();             // 初始化通信。初始化IIC通信 或 初始化软件串口（默认波特率为19200）。
	Serial.begin(115200);     // 初始化串口，波特率为115200
}

void loop()
{ 
	// 控制 4个舵机。
	exMS.servoWrite(1,90,2,180,3,45,4,135);			// S0转动角度90°，S1转动角度180°，S2转动角度45°，S3转动角度135°。
	delay(1000);  
	exMS.servoWrite(1,180,2,90,3,90,4,90);			// S0转动角度180°，S1转动角度90°，S2转动角度90°，S3转动角度90°。
	delay(1000); 
	// 控制 1个舵机（控制2、3个舵机，详见库注释）。
	// exMS.servoWrite(1,90); 			// S0转动角度90°。  
}


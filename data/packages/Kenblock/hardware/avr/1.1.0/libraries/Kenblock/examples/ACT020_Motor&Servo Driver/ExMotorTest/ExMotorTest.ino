/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  ExMotorTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.1
 * @时间：  2017/11/03
 * @描述：  Kenblock 电机舵机驱动模块 驱动直流电机测试示例。
 *
 * \说明
 * Kenblock 电机舵机驱动模块 驱动直流电机测试示例。控制电机正反转、停止、测速。
 *
 * 两种通信方式，仅定义函数不一样，其他使用完全一样。若需要使用IIC通信，只需要修改为 MotorServo_IIC exMS; 定义即可。
 *
 * 默认使用软件串口通信，如需使用硬件串口，做如下修改：
 *     1、注释掉 Kenblock_MotorServo.h 中的 #define MOTORSERVO_USE_SOFTWARE_SERIAL
 *     2、定义修改为 MotorServo_USART exMS(Serial);	// 电机舵机驱动模块定义，使用硬件串口通信
 *
 * \函数列表
 * 		void 	begin(); 	// 通信初始化
 * 		void	motorRun(uint8_t index1,int16_t speed1,uint8_t index2 = 0,int16_t speed2 = 0,uint8_t index3 = 0,int16_t speed3 = 0);
				// 电机控制函数。同时控制 1个、2个或者3个电机转速。电机序号只能是1~3，否则不执行。
 * 		void 	motorStop(uint8_t index);				// 控制电机停止。电机序号只能是1~3，否则不执行。
 * 		int		getMotorVelocity(uint8_t index); 		// 获取电机的转速，返回电机速度值。
 * 		void	getMotorVelocity(int *IIC_Velocity);	// 获取电机的转速，返回电机速度值。
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
// MotorServo_IIC exMS;				// 电机舵机驱动模块定义，使用IIC通信


// 存储3个电机速度的数组:
// 		motorVelocity[0]-电机 MOTOA 的速度
// 		motorVelocity[1]-电机 MOTOB 的速度
//		motorVelocity[2]-电机 MOTOC 的速度
int motorVelocity[3];    

void setup()
{
	exMS.begin(); 					// 初始化通信。初始化IIC通信 或 初始化软件串口（默认波特率为19200）。
	Serial.begin(115200);			// 初始化串口，波特率为115200
	
	exMS.motorRun(1, 230, 2, 100, 3, 90);		// 控制 3个电机转速。
}

void loop()
{ 
	// 控制 3个电机转速。也可以使用 motorRun(MOTOA, 128, MOTOB, -128, MOTOC, 100)。
	exMS.motorRun(1,128,2,-128,3,100); 	// MOTOA电机速度为128，MOTOA电机反转，速度为128，MOTOC电机速度为100。

	// 控制 1个电机转速（控制2个电机，详见库注释）。
	// exMS.motorRun(1,128); 				// MOTOA电机速度为128。

	// 获取3电机速度示例。（也可以使用 int getMotorVelocity(uint8_t index); // 获取电机的转速，返回电机速度值。）	
	exMS.getMotorVelocity(motorVelocity);
	Serial.print("MOTOA= ");
    Serial.println(motorVelocity[0]);
    Serial.print("MOTOB= ");
    Serial.println(motorVelocity[1]);
    Serial.print("MOTOC= ");
    Serial.println(motorVelocity[2]);
	
	delay(100);    
}

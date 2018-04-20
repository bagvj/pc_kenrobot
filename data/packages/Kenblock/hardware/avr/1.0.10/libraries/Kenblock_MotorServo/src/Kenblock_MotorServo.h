/**
 * \著作权  Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_MotorServo.h
 * @作者：  Kenblcok
 * @版本：  V0.1.1
 * @时间：  2017/11/03
 * @描述：  电机舵机控制模块驱动程序库。有IIC和USART两种通信方式。
 *
 * \说明
 * 电机舵机控制模块驱动程序库。有IIC和USART两种通信方式。使用方式详见 motor、servo 函数注释 和 示例程序。
 *
 * \方法列表
 * 		void 	begin(); 	// 通信初始化
 * 		void	motorRun(uint8_t index1,int16_t speed1,uint8_t index2 = 0,int16_t speed2 = 0,uint8_t index3 = 0,int16_t speed3 = 0);
				//电机控制函数。同时控制 1个、2个或者3个电机转速。电机序号只能是1~3，否则不执行。
 * 		void 	motorStop(uint8_t index);				// 控制电机停止。电机序号只能是1~3，否则不执行。
 * 		void	servoWrite(uint8_t index1,uint8_t value1,uint8_t index2 = 0,uint8_t value2 = 0,uint8_t index3 = 0,uint8_t value3 = 0,uint8_t index4 = 0,uint8_t value4 = 0);
				//舵机控制函数。同时控制 1个、2个、3个或者4个舵机转动。舵机序号只能是1~4，否则不执行。不能与MOTOC同时运行。
 * 		int		getMotorVelocity(uint8_t index); 		// 获取电机的转速，返回电机速度值。
 * 		void	getMotorVelocity(int *IIC_Velocity);	// 获取电机的转速，返回电机速度值。
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  King           2017/08/22      0.1.0              新建库文件。
 *  King           2017/11/03      0.1.1              完全改写。
 *  
 * \示例
 *  
 * 		1.ExMotorTest.ino 	// 电机舵机控制模块：电机使用示例。
 * 		2.ExServoTest.ino 	// 电机舵机控制模块：舵机使用示例。
 */
#ifndef Kenblock_MotorServo_h
#define Kenblock_MotorServo_h

#include <Arduino.h>
#include <stdio.h>
#include <Wire.h>

// 使用软件串口
// 如果要使用硬件串口，需要注释掉此条
#define MOTORSERVO_USE_SOFTWARE_SERIAL

#ifdef MOTORSERVO_USE_SOFTWARE_SERIAL
#include "SoftwareSerial.h"
#endif

// 电机舵机驱动模块 IIC地址 （STM32 地址为0x08）
#define MOTORSERVO_ADDRESS   0x04 

// 电机舵机驱动模块 电机接口定义
#define MOTOA  (1)
#define MOTOB  (2)
#define MOTOC  (3)


/**
 * Class: MotorServo
 * \说明：Class MotorServo 的声明
 */
class MotorServo
{
  public:
	
	MotorServo(void);
	void motorRun(uint8_t index1,int16_t speed1,uint8_t index2 = 0,int16_t speed2 = 0,uint8_t index3 = 0,int16_t speed3 = 0);
	void motorStop(uint8_t index);
	void servoWrite(uint8_t index1,uint8_t value1,uint8_t index2 = 0,uint8_t value2 = 0,uint8_t index3 = 0,uint8_t value3 = 0,uint8_t index4 = 0,uint8_t value4 = 0);
	
	int  getMotorVelocity(uint8_t index); 
	void getMotorVelocity(int *IIC_Velocity);   
	
	virtual void datasend(uint8_t *data, uint8_t length); //virtual关键字：虚拟函数,可在派生类中改写
	virtual void datareceive(uint8_t *velocity);

  private:
	int uint8Toint16(uint8_t data_H,uint8_t data_L) ;	
  	
};


/**
 * Class: MotorServo_USART
 * \说明：Class MotorServo_USART 的声明
 */
class MotorServo_USART : public MotorServo 
{
  public: 
  
#ifdef MOTORSERVO_USE_SOFTWARE_SERIAL
	MotorServo_USART(SoftwareSerial &uart, uint32_t baud = 19200);
#else 
	MotorServo_USART(HardwareSerial &uart, uint32_t baud = 19200);
#endif

	void begin(uint32_t baud = 19200);

	void datasend(uint8_t *data, uint8_t length);
	void datareceive(uint8_t *velocity);
	void rx_empty(void);
	
#ifdef MOTORSERVO_USE_SOFTWARE_SERIAL
    SoftwareSerial *m_puart; /* 软件串口通信 */
#else
    HardwareSerial *m_puart; /* 硬件串口通信 */
#endif
};


/**
 * Class: MotorServo_IIC
 * \说明：Class MotorServo_IIC 的声明
 */
class MotorServo_IIC : public MotorServo 
{
  public: 
	MotorServo_IIC(void);
	
	void begin(void);

	void datasend(uint8_t *data, uint8_t length);
	void datareceive(uint8_t *velocity);
};

#endif // Kenblock_MotorServo_h

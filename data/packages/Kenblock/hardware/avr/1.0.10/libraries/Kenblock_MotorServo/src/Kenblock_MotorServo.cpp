/**
 * \著作权  Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_MotorServo.cpp
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
#include "Kenblock_MotorServo.h"


/**
 * \函数： MotorServo
 * \说明： 初始化，不做任何操作
 */
MotorServo::MotorServo(void)
{

}

/**
 * \函数： motorRun
 * \说明： 电机控制函数。同时控制 1个、2个或者3个电机转速。电机序号只能是1~3，否则不执行。
 * \输入参数：
 *   index1  - 电机编号，范围：1 ~ 3。
 *   speed1  - 电机速度，范围： -255~255，值小于零代表反转。
 *   index2  - 电机编号2（可缺省），范围：1 ~ 3。
 *   speed2  - 电机速度2，范围： -255~255，值小于零代表反转。
 *   index3  - 电机编号3（可缺省），范围：1 ~ 3。
 *   speed3  - 电机速度3，范围： -255~255，值小于零代表反转。
 *   
 * <pre>
 *          电机编号对应关系
 * ----------------+-------------------
 *     电机编号    |     对应电机      
 * ----------------+-------------------
 *        1        |       MOTOA       
 *        2        |       MOTOB       
 *        3        |       MOTOC       
 * </pre>
 *   
 * \注意： index1 不是代表电机1 或者 MOTOA 。而是代表控制的第一个电机的编号。index2、index3同理。
 *
 * \使用示例：(其中序号是可以打乱的)
 *   motorRun(1,128); 		//控制 1个电机，MOTOA电机速度为128。
 *   motorRun(2,-128); 		//控制 1个电机，MOTOB电机反转，速度为128。
 *   motorRun(1,128,2,-128); 		//控制 2个电机，MOTOA电机速度为128，MOTOB电机反转，速度为128。
 *   motorRun(1,128,3,100,2,-128); 	//控制 3个电机，MOTOA电机速度为128，MOTOB电机反转，速度为128，MOTOC电机速度为100。
 */
void MotorServo::motorRun(uint8_t index1,int16_t speed1,uint8_t index2,int16_t speed2,uint8_t index3,int16_t speed3)
{
	uint8_t buffer[11] = {0};
	uint8_t length = 0;
	
	if((index1 == 0) || (index1 > 3)) return 0; // 电机编号1 为 1~3 才执行以下程序

	buffer[2] = index1;							// 电机编号
	buffer[3] = speed1 >= 0 ? 0x00 : 0x11;		// 转动方向
	buffer[4] = abs(speed1) >253 ? 0xFD : abs(speed1);	// 速度值 0~ 0xFD，因为0xFF、0xFE 为数据包关键字
	length = 5;
	
	if((index2 != 0) && (index2 < 4))	// 电机编号 1~3 才执行
	{
		buffer[5] = index2;
		buffer[6] = speed2 >= 0 ? 0x00 : 0x11;
		buffer[7] = abs(speed2) >253 ? 0xFD : abs(speed2);
		length = length + 3;
	}
	
	if((index3 != 0) && (index3 < 4))	// 电机编号 1~3 才执行
	{
		buffer[8] = index3;
		buffer[9] = speed3 >= 0 ? 0x00 : 0x11;
		buffer[10] = abs(speed3) > 253 ? 0xFD : abs(speed3);
		length = length + 3;
	}

	datasend(buffer , length);			// 发送电机控制代码
	
	delay(20); 		//必须延时，否则会发生错误
}

/**
 * \函数： motorStop
 * \说明： 控制电机停止。电机序号只能是1~3，否则不执行。
 * \输入参数：
 *   index  - 电机编号，范围：1 ~ 3。
 *   
 * <pre>
 *          电机编号对应关系
 * ----------------+-------------------
 *     电机编号    |     对应电机      
 * ----------------+-------------------
 *        1        |       MOTOA       
 *        2        |       MOTOB       
 *        3        |       MOTOC       
 * </pre>
 *
 * \使用示例：
 *   motorStop(1); 		//控制电机MOTOA停止。
 */
void MotorServo::motorStop(uint8_t index)
{
	motorRun(index,0); // 电机编号1 为 1~3 才执行以下程序
}

/**
 * \函数： servoWrite
 * \说明： 舵机控制函数。同时控制 1个、2个、3个或者4个舵机转动。舵机序号只能是1~4，否则不执行。不能与MOTOC同时使用。
 * \输入参数：
 *   index1  - 舵机编号，范围：1 ~ 4。
 *   value1  - 舵机转动角度，范围：0~180。
 *   index2  - 舵机编号2（可缺省），范围：1 ~ 4。
 *   value2  - 舵机2转动角度，范围：0~180。
 *   index3  - 舵机编号3（可缺省），范围：1 ~ 4。
 *   value3  - 舵机3转动角度，范围：0~180。
 *   index4  - 舵机编号4（可缺省），范围：1 ~ 4。
 *   value4  - 舵机3转动角度，范围：0~180。
 *   
 * <pre>
 *          舵机编号对应关系
 * ----------------+-------------------
 *     舵机编号    | 板上对应的接口编号      
 * ----------------+-------------------
 *        1        |         S0       
 *        2        |         S1        
 *        3        |         S2        
 *        4        |         S3   
 * </pre>
 *   
 * \注意： index1 不是代表舵机S0。而是代表控制的第一个舵机的编号。index2、index3、index4同理。
 *
 * \使用示例：(其中序号是可以打乱的)
 *   servoWrite(1,90); 			//控制 1个舵机，S0转动角度90°。
 *   servoWrite(1,90,3,45); 	//控制 2个舵机，S0转动角度90°，S2转动角度45°。
 *   servoWrite(1,90,3,45,4,135);; 			//控制 3个舵机，S0转动角度90°，S2转动角度45°，S3转动角度135°。
 *   servoWrite(1,90,3,45,4,135,2,180);; 	//控制 4个舵机，S0转动角度90°，S1转动角度180°，S2转动角度45°，S3转动角度135°。
 */
void MotorServo::servoWrite(uint8_t index1,uint8_t value1,uint8_t index2,uint8_t value2,uint8_t index3,uint8_t value3,uint8_t index4,uint8_t value4)
{
	uint8_t buffer[9] = {0};
	uint8_t length = 0;
	
	if((index1 == 0) || (index1 > 4)) return 0;  //舵机编号1 为 1~4 才执行以下程序
	
	buffer[0] = 0x11;							
	buffer[1] = index1;							// 舵机编号
	buffer[2] = value1 > 180 ? 0xB4 : value1;	// 舵机角度值
	length = 3;
	
	if((index2 != 0) && (index2 < 5))	// 舵机编号 1~4 才执行
	{
		buffer[3] = index2;
		buffer[4] = value2 > 180 ? 0xB4 : value2;
		length = length + 2;
	}
	
	if((index3 != 0) && (index3 < 5))	// 舵机编号 1~4 才执行
	{
		buffer[5] = index3;
		buffer[6] = value3 > 180 ? 0xB4 : value3;
		length = length + 2;
	}
	
	if((index4 != 0) && (index4 < 5))	// 舵机编号 1~4 才执行
	{
		buffer[7] = index4;
		buffer[8] = value4 > 180 ? 0xB4 : value4;
		length = length + 2;
	}

	datasend(buffer , length);			// 发送舵机控制代码
	
	delay(20); 		//必须延时，否则会发生错误
}

/**
 * \函数： getMotorVelocity
 * \说明： 获取电机的转速，返回电机速度值。
 * \输入参数：
 *   index  - 电机编号，范围：1 ~ 3。
 * \返回值：
 *    - 电机速度。
 * \其他：
 */ 
int MotorServo::getMotorVelocity(uint8_t index)
{
	uint8_t receiveData[6] = {0};
	
	datareceive(receiveData);
	
	switch(index)
	{
		case 1 : return uint8Toint16(receiveData[0],receiveData[1]); break;
		case 2 : return uint8Toint16(receiveData[2],receiveData[3]); break;
		case 3 : return uint8Toint16(receiveData[4],receiveData[5]); break;
		default: return -1;break;
	}
}

/**
 * \函数： getMotorVelocity
 * \说明： 获取电机的转速。
 * \输入参数：
 *   *velocity  - 电机速度指针。
 * \返回值：
 *    - 电机速度。
 * \其他：
 */ 
void MotorServo::getMotorVelocity(int *velocity)
{
	uint8_t receiveData[6] = {0};
	
	datareceive(receiveData);
	
	velocity[0] = uint8Toint16(receiveData[0],receiveData[1]); 
	velocity[1] = uint8Toint16(receiveData[2],receiveData[3]); 
	velocity[2] = uint8Toint16(receiveData[4],receiveData[5]); 
}

/**
 * \函数： uint8Toint16
 * \说明： 8位转16位
 * \输入参数：
 *   data_H  - 高字节
 *   data_L  - 低字节
 * \返回值：
 *    - 16位数据
 */ 
int MotorServo::uint8Toint16(uint8_t data_H,uint8_t data_L) 
{ 
	int dec =(int)data_H*256 + data_L;
	return dec; 
}


/**************  MotorServo_USART  **************/

/**
 * \函数： MotorServo_USART
 * \说明： 初始化，默认波特率 19200
 */
#ifdef MOTORSERVO_USE_SOFTWARE_SERIAL
MotorServo_USART::MotorServo_USART(SoftwareSerial &uart, uint32_t baud): m_puart(&uart)
{
	m_puart->begin(baud); 	//初始化串口
}
#else 
MotorServo_USART::MotorServo_USART(HardwareSerial &uart, uint32_t baud): m_puart(&uart)
{
	m_puart->begin(baud); 	//初始化串口
}
#endif

/**
 * \函数： begin
 * \说明： 初始化，设置通信波特率。
 * \输入参数：
 *   baud - 串口通信波特率值
 */
void MotorServo_USART::begin(uint32_t baud)
{
    m_puart->begin(baud);
    rx_empty();
}

/**
 * \函数： datasend
 * \说明： USART通信方式：发送电机控制代码。加上包头 0xFF、包尾 0xFE 后发送。
 * \输入参数：
 *   *data  - 需要发送的数据指针
 *   length - 数据长度
 */
void MotorServo_USART::datasend(uint8_t *data, uint8_t length)
{
	uint8_t buffer[13] = {0};

	buffer[0] = 0xFF ;					// 加上包头 0xFF
	memcpy(buffer + 1, data, length);
	buffer[length + 1] = 0xFE ;			// 加上包尾 0xFE
	
	m_puart->write(buffer, length + 2);	// 发送数据
}

/**
 * \函数： datareceive
 * \说明： USART通信方式：读取电机速度，先发送读取指令。然后接收6 字节 的电机速度数据。
 * \输入参数：
 *   *receiveData  - 读取的电机速度数据指针。
 */
void MotorServo_USART::datareceive(uint8_t *receiveData)
{
	uint8_t buffer[7]={0xFF,0x00,0x11,0x01,0x02,0x03,0xFE};
	uint8_t count = 0;

	rx_empty();					// 清除串口接收缓存器中的值
	
#ifdef MOTORSERVO_USE_SOFTWARE_SERIAL
	m_puart->listen();  		// 假设使用多个软件串口时，需要切换监听串口
#endif

	m_puart->write(buffer, 7);				// 发送数据

	unsigned long start = millis();
    while (millis() - start < 1000) 		// 默认等待1000ms，接收到 6 字节数据后返回
	{
		while(m_puart->available() >= 6)	// 接收串口数据
		{	
			m_puart->readBytes(receiveData,6);		// 从串口接收缓存器中读取数据
			return 0;
		}
	} 
}

/**
 * \函数： rx_empty
 * \说明： 清除串口接收缓存器中的值
 */
void MotorServo_USART::rx_empty(void) 
{
    while(m_puart->available() > 0) {
        m_puart->read();
    }
}


/**************   MotorServo_IIC   **************/

MotorServo_IIC::MotorServo_IIC(void)
{
	Wire.begin();       //初始化IIC总线，设置为主机
}

/**
 * \函数： begin
 * \说明： IIC初始化
 */
void MotorServo_IIC::begin(void)
{
    Wire.begin();       //初始化IIC总线，设置为主机
}

/**
 * \函数： datasend
 * \说明： IIC通信方式：发送电机控制代码。
 * \输入参数：
 *   *data  - 需要发送的数据指针
 *   length - 数据长度
 */
void MotorServo_IIC::datasend(uint8_t *data, uint8_t length)
{
	Wire.beginTransmission(MOTORSERVO_ADDRESS); // 开始传输，发送数据到从机
	Wire.write(data, length);	// 发送数据
	Wire.endTransmission();     // 停止发送
}

/**
 * \函数： datareceive
 * \说明： IIC通信方式：读取电机速度，先发送读取指令。然后接收6 字节 的电机速度数据。
 * \输入参数：
 *   *receiveData  - 读取的电机速度数据指针
 */
void MotorServo_IIC::datareceive(uint8_t *receiveData)
{
	uint8_t count = 0; 
	
	Wire.beginTransmission(MOTORSERVO_ADDRESS);	// 开始传输，发送数据到从机
	Wire.write(0x00); 	// 操作电机
	Wire.write(0x11); 	// 读取电机速度
	Wire.write(0x01); 	// 电机1
	Wire.write(0x02); 	// 电机2
	Wire.write(0x03); 	// 电机3
	Wire.endTransmission();    // 停止发送
	Wire.requestFrom(MOTORSERVO_ADDRESS,6);		// 通知从机上传6字节数据
	delay(1);
	while(Wire.available())    // 循环接收
	{ 	
		receiveData[count++] = Wire.read(); 	// 从 Wire 读取数据
	}
}

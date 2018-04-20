/**
 * \����Ȩ  Copyright (C), 2016-2020, LZRobot
 * @���ƣ�  Kenblock_MotorServo.cpp
 * @���ߣ�  Kenblcok
 * @�汾��  V0.1.1
 * @ʱ�䣺  2017/11/03
 * @������  ����������ģ����������⡣��IIC��USART����ͨ�ŷ�ʽ��
 *
 * \˵��
 * ����������ģ����������⡣��IIC��USART����ͨ�ŷ�ʽ��ʹ�÷�ʽ��� motor��servo ����ע�� �� ʾ������
 *
 * \�����б�
 * 		void 	begin(); 	// ͨ�ų�ʼ��
 * 		void	motorRun(uint8_t index1,int16_t speed1,uint8_t index2 = 0,int16_t speed2 = 0,uint8_t index3 = 0,int16_t speed3 = 0);
				//������ƺ�����ͬʱ���� 1����2������3�����ת�١�������ֻ����1~3������ִ�С�
 * 		void 	motorStop(uint8_t index);				// ���Ƶ��ֹͣ��������ֻ����1~3������ִ�С�
 * 		void	servoWrite(uint8_t index1,uint8_t value1,uint8_t index2 = 0,uint8_t value2 = 0,uint8_t index3 = 0,uint8_t value3 = 0,uint8_t index4 = 0,uint8_t value4 = 0);
				//������ƺ�����ͬʱ���� 1����2����3������4�����ת����������ֻ����1~4������ִ�С�������MOTOCͬʱ���С�
 * 		int		getMotorVelocity(uint8_t index); 		// ��ȡ�����ת�٣����ص���ٶ�ֵ��
 * 		void	getMotorVelocity(int *IIC_Velocity);	// ��ȡ�����ת�٣����ص���ٶ�ֵ��
 *
 * \�޶���ʷ
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  King           2017/08/22      0.1.0              �½����ļ���
 *  King           2017/11/03      0.1.1              ��ȫ��д��
 *  
 * \ʾ��
 *  
 * 		1.ExMotorTest.ino 	// ����������ģ�飺���ʹ��ʾ����
 * 		2.ExServoTest.ino 	// ����������ģ�飺���ʹ��ʾ����
 */
#include "Kenblock_MotorServo.h"


/**
 * \������ MotorServo
 * \˵���� ��ʼ���������κβ���
 */
MotorServo::MotorServo(void)
{

}

/**
 * \������ motorRun
 * \˵���� ������ƺ�����ͬʱ���� 1����2������3�����ת�١�������ֻ����1~3������ִ�С�
 * \���������
 *   index1  - �����ţ���Χ��1 ~ 3��
 *   speed1  - ����ٶȣ���Χ�� -255~255��ֵС�������ת��
 *   index2  - ������2����ȱʡ������Χ��1 ~ 3��
 *   speed2  - ����ٶ�2����Χ�� -255~255��ֵС�������ת��
 *   index3  - ������3����ȱʡ������Χ��1 ~ 3��
 *   speed3  - ����ٶ�3����Χ�� -255~255��ֵС�������ת��
 *   
 * <pre>
 *          �����Ŷ�Ӧ��ϵ
 * ----------------+-------------------
 *     ������    |     ��Ӧ���      
 * ----------------+-------------------
 *        1        |       MOTOA       
 *        2        |       MOTOB       
 *        3        |       MOTOC       
 * </pre>
 *   
 * \ע�⣺ index1 ���Ǵ�����1 ���� MOTOA �����Ǵ�����Ƶĵ�һ������ı�š�index2��index3ͬ��
 *
 * \ʹ��ʾ����(��������ǿ��Դ��ҵ�)
 *   motorRun(1,128); 		//���� 1�������MOTOA����ٶ�Ϊ128��
 *   motorRun(2,-128); 		//���� 1�������MOTOB�����ת���ٶ�Ϊ128��
 *   motorRun(1,128,2,-128); 		//���� 2�������MOTOA����ٶ�Ϊ128��MOTOB�����ת���ٶ�Ϊ128��
 *   motorRun(1,128,3,100,2,-128); 	//���� 3�������MOTOA����ٶ�Ϊ128��MOTOB�����ת���ٶ�Ϊ128��MOTOC����ٶ�Ϊ100��
 */
void MotorServo::motorRun(uint8_t index1,int16_t speed1,uint8_t index2,int16_t speed2,uint8_t index3,int16_t speed3)
{
	uint8_t buffer[11] = {0};
	uint8_t length = 0;
	
	if((index1 == 0) || (index1 > 3)) return 0; // ������1 Ϊ 1~3 ��ִ�����³���

	buffer[2] = index1;							// ������
	buffer[3] = speed1 >= 0 ? 0x00 : 0x11;		// ת������
	buffer[4] = abs(speed1) >253 ? 0xFD : abs(speed1);	// �ٶ�ֵ 0~ 0xFD����Ϊ0xFF��0xFE Ϊ���ݰ��ؼ���
	length = 5;
	
	if((index2 != 0) && (index2 < 4))	// ������ 1~3 ��ִ��
	{
		buffer[5] = index2;
		buffer[6] = speed2 >= 0 ? 0x00 : 0x11;
		buffer[7] = abs(speed2) >253 ? 0xFD : abs(speed2);
		length = length + 3;
	}
	
	if((index3 != 0) && (index3 < 4))	// ������ 1~3 ��ִ��
	{
		buffer[8] = index3;
		buffer[9] = speed3 >= 0 ? 0x00 : 0x11;
		buffer[10] = abs(speed3) > 253 ? 0xFD : abs(speed3);
		length = length + 3;
	}

	datasend(buffer , length);			// ���͵�����ƴ���
	
	delay(20); 		//������ʱ������ᷢ������
}

/**
 * \������ motorStop
 * \˵���� ���Ƶ��ֹͣ��������ֻ����1~3������ִ�С�
 * \���������
 *   index  - �����ţ���Χ��1 ~ 3��
 *   
 * <pre>
 *          �����Ŷ�Ӧ��ϵ
 * ----------------+-------------------
 *     ������    |     ��Ӧ���      
 * ----------------+-------------------
 *        1        |       MOTOA       
 *        2        |       MOTOB       
 *        3        |       MOTOC       
 * </pre>
 *
 * \ʹ��ʾ����
 *   motorStop(1); 		//���Ƶ��MOTOAֹͣ��
 */
void MotorServo::motorStop(uint8_t index)
{
	motorRun(index,0); // ������1 Ϊ 1~3 ��ִ�����³���
}

/**
 * \������ servoWrite
 * \˵���� ������ƺ�����ͬʱ���� 1����2����3������4�����ת����������ֻ����1~4������ִ�С�������MOTOCͬʱʹ�á�
 * \���������
 *   index1  - �����ţ���Χ��1 ~ 4��
 *   value1  - ���ת���Ƕȣ���Χ��0~180��
 *   index2  - ������2����ȱʡ������Χ��1 ~ 4��
 *   value2  - ���2ת���Ƕȣ���Χ��0~180��
 *   index3  - ������3����ȱʡ������Χ��1 ~ 4��
 *   value3  - ���3ת���Ƕȣ���Χ��0~180��
 *   index4  - ������4����ȱʡ������Χ��1 ~ 4��
 *   value4  - ���3ת���Ƕȣ���Χ��0~180��
 *   
 * <pre>
 *          �����Ŷ�Ӧ��ϵ
 * ----------------+-------------------
 *     ������    | ���϶�Ӧ�Ľӿڱ��      
 * ----------------+-------------------
 *        1        |         S0       
 *        2        |         S1        
 *        3        |         S2        
 *        4        |         S3   
 * </pre>
 *   
 * \ע�⣺ index1 ���Ǵ�����S0�����Ǵ�����Ƶĵ�һ������ı�š�index2��index3��index4ͬ��
 *
 * \ʹ��ʾ����(��������ǿ��Դ��ҵ�)
 *   servoWrite(1,90); 			//���� 1�������S0ת���Ƕ�90�㡣
 *   servoWrite(1,90,3,45); 	//���� 2�������S0ת���Ƕ�90�㣬S2ת���Ƕ�45�㡣
 *   servoWrite(1,90,3,45,4,135);; 			//���� 3�������S0ת���Ƕ�90�㣬S2ת���Ƕ�45�㣬S3ת���Ƕ�135�㡣
 *   servoWrite(1,90,3,45,4,135,2,180);; 	//���� 4�������S0ת���Ƕ�90�㣬S1ת���Ƕ�180�㣬S2ת���Ƕ�45�㣬S3ת���Ƕ�135�㡣
 */
void MotorServo::servoWrite(uint8_t index1,uint8_t value1,uint8_t index2,uint8_t value2,uint8_t index3,uint8_t value3,uint8_t index4,uint8_t value4)
{
	uint8_t buffer[9] = {0};
	uint8_t length = 0;
	
	if((index1 == 0) || (index1 > 4)) return 0;  //������1 Ϊ 1~4 ��ִ�����³���
	
	buffer[0] = 0x11;							
	buffer[1] = index1;							// ������
	buffer[2] = value1 > 180 ? 0xB4 : value1;	// ����Ƕ�ֵ
	length = 3;
	
	if((index2 != 0) && (index2 < 5))	// ������ 1~4 ��ִ��
	{
		buffer[3] = index2;
		buffer[4] = value2 > 180 ? 0xB4 : value2;
		length = length + 2;
	}
	
	if((index3 != 0) && (index3 < 5))	// ������ 1~4 ��ִ��
	{
		buffer[5] = index3;
		buffer[6] = value3 > 180 ? 0xB4 : value3;
		length = length + 2;
	}
	
	if((index4 != 0) && (index4 < 5))	// ������ 1~4 ��ִ��
	{
		buffer[7] = index4;
		buffer[8] = value4 > 180 ? 0xB4 : value4;
		length = length + 2;
	}

	datasend(buffer , length);			// ���Ͷ�����ƴ���
	
	delay(20); 		//������ʱ������ᷢ������
}

/**
 * \������ getMotorVelocity
 * \˵���� ��ȡ�����ת�٣����ص���ٶ�ֵ��
 * \���������
 *   index  - �����ţ���Χ��1 ~ 3��
 * \����ֵ��
 *    - ����ٶȡ�
 * \������
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
 * \������ getMotorVelocity
 * \˵���� ��ȡ�����ת�١�
 * \���������
 *   *velocity  - ����ٶ�ָ�롣
 * \����ֵ��
 *    - ����ٶȡ�
 * \������
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
 * \������ uint8Toint16
 * \˵���� 8λת16λ
 * \���������
 *   data_H  - ���ֽ�
 *   data_L  - ���ֽ�
 * \����ֵ��
 *    - 16λ����
 */ 
int MotorServo::uint8Toint16(uint8_t data_H,uint8_t data_L) 
{ 
	int dec =(int)data_H*256 + data_L;
	return dec; 
}


/**************  MotorServo_USART  **************/

/**
 * \������ MotorServo_USART
 * \˵���� ��ʼ����Ĭ�ϲ����� 19200
 */
#ifdef MOTORSERVO_USE_SOFTWARE_SERIAL
MotorServo_USART::MotorServo_USART(SoftwareSerial &uart, uint32_t baud): m_puart(&uart)
{
	m_puart->begin(baud); 	//��ʼ������
}
#else 
MotorServo_USART::MotorServo_USART(HardwareSerial &uart, uint32_t baud): m_puart(&uart)
{
	m_puart->begin(baud); 	//��ʼ������
}
#endif

/**
 * \������ begin
 * \˵���� ��ʼ��������ͨ�Ų����ʡ�
 * \���������
 *   baud - ����ͨ�Ų�����ֵ
 */
void MotorServo_USART::begin(uint32_t baud)
{
    m_puart->begin(baud);
    rx_empty();
}

/**
 * \������ datasend
 * \˵���� USARTͨ�ŷ�ʽ�����͵�����ƴ��롣���ϰ�ͷ 0xFF����β 0xFE ���͡�
 * \���������
 *   *data  - ��Ҫ���͵�����ָ��
 *   length - ���ݳ���
 */
void MotorServo_USART::datasend(uint8_t *data, uint8_t length)
{
	uint8_t buffer[13] = {0};

	buffer[0] = 0xFF ;					// ���ϰ�ͷ 0xFF
	memcpy(buffer + 1, data, length);
	buffer[length + 1] = 0xFE ;			// ���ϰ�β 0xFE
	
	m_puart->write(buffer, length + 2);	// ��������
}

/**
 * \������ datareceive
 * \˵���� USARTͨ�ŷ�ʽ����ȡ����ٶȣ��ȷ��Ͷ�ȡָ�Ȼ�����6 �ֽ� �ĵ���ٶ����ݡ�
 * \���������
 *   *receiveData  - ��ȡ�ĵ���ٶ�����ָ�롣
 */
void MotorServo_USART::datareceive(uint8_t *receiveData)
{
	uint8_t buffer[7]={0xFF,0x00,0x11,0x01,0x02,0x03,0xFE};
	uint8_t count = 0;

	rx_empty();					// ������ڽ��ջ������е�ֵ
	
#ifdef MOTORSERVO_USE_SOFTWARE_SERIAL
	m_puart->listen();  		// ����ʹ�ö���������ʱ����Ҫ�л���������
#endif

	m_puart->write(buffer, 7);				// ��������

	unsigned long start = millis();
    while (millis() - start < 1000) 		// Ĭ�ϵȴ�1000ms�����յ� 6 �ֽ����ݺ󷵻�
	{
		while(m_puart->available() >= 6)	// ���մ�������
		{	
			m_puart->readBytes(receiveData,6);		// �Ӵ��ڽ��ջ������ж�ȡ����
			return 0;
		}
	} 
}

/**
 * \������ rx_empty
 * \˵���� ������ڽ��ջ������е�ֵ
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
	Wire.begin();       //��ʼ��IIC���ߣ�����Ϊ����
}

/**
 * \������ begin
 * \˵���� IIC��ʼ��
 */
void MotorServo_IIC::begin(void)
{
    Wire.begin();       //��ʼ��IIC���ߣ�����Ϊ����
}

/**
 * \������ datasend
 * \˵���� IICͨ�ŷ�ʽ�����͵�����ƴ��롣
 * \���������
 *   *data  - ��Ҫ���͵�����ָ��
 *   length - ���ݳ���
 */
void MotorServo_IIC::datasend(uint8_t *data, uint8_t length)
{
	Wire.beginTransmission(MOTORSERVO_ADDRESS); // ��ʼ���䣬�������ݵ��ӻ�
	Wire.write(data, length);	// ��������
	Wire.endTransmission();     // ֹͣ����
}

/**
 * \������ datareceive
 * \˵���� IICͨ�ŷ�ʽ����ȡ����ٶȣ��ȷ��Ͷ�ȡָ�Ȼ�����6 �ֽ� �ĵ���ٶ����ݡ�
 * \���������
 *   *receiveData  - ��ȡ�ĵ���ٶ�����ָ��
 */
void MotorServo_IIC::datareceive(uint8_t *receiveData)
{
	uint8_t count = 0; 
	
	Wire.beginTransmission(MOTORSERVO_ADDRESS);	// ��ʼ���䣬�������ݵ��ӻ�
	Wire.write(0x00); 	// �������
	Wire.write(0x11); 	// ��ȡ����ٶ�
	Wire.write(0x01); 	// ���1
	Wire.write(0x02); 	// ���2
	Wire.write(0x03); 	// ���3
	Wire.endTransmission();    // ֹͣ����
	Wire.requestFrom(MOTORSERVO_ADDRESS,6);		// ֪ͨ�ӻ��ϴ�6�ֽ�����
	delay(1);
	while(Wire.available())    // ѭ������
	{ 	
		receiveData[count++] = Wire.read(); 	// �� Wire ��ȡ����
	}
}

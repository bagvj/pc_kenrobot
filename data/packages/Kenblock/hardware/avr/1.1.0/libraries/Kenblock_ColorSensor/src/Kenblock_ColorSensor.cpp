  /**
 * \����Ȩ Copyright (C), 2016-2020, LZRobot
 * @���ƣ�  Kenblock_ColorSensor.h
 * @���ߣ�  Kenblock
 * @�汾��  V0.1.0
 * @ʱ�䣺  2017/08/08
 * @������  ��ɫ�������⺯����
 *
 * \˵��
 * ��ɫ�������⺯������Ӧ������ΪTCS3200���ӿ�ȷ��ʹ�� PD5 ��
 *
 * \�����б�
 * 
 * 		1. void ColorSensor::setpin(uint8_t port)
 * 		2. void ColorSensor::setpin(uint8_t pin1,uint8_t pin2,uint8_t pin3,uint8_t pin4)
 * 		3. void ColorSensor::OutputSetting(uint8_t temp)
 * 		4. void ColorSensor::FilterColor(uint8_t S2,uint8_t S3)
 *		5. void ColorSensor::WhiteBalance(uint8_t temp1,uint8_t temp2)
 *
 * \�޶���ʷ
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/08/08      0.1.0              �½����ļ���
 *  
 * \ʾ��
 *  
 * 		1.ColorSensorTest.ino
 */
 
 
 
 #include "Kenblock_ColorSensor.h"


/**
 * �������ƣ�ColorSensor
 * \˵������ʼ���������κβ���
 * \�����������
 * \�����������
 * \����ֵ����
 * \��������
 */
ColorSensor::ColorSensor(void)
{
	
}


/**
 * \������ColorSensor
 * \˵����������캯����������ɫ����ģ�������
 * \���������
 *   port : Ex_Quadruple_Digital  ��·���ֽӿڣ�6P�ӿڣ�
 *   	d1 - ��ɫ����ģ��Out������
 *   	d2 - ��ɫ����ģ���S3����
 *   	d3 - ��ɫ����ģ���S2����
 *   	d4 - ��ɫ����ģ���S1����	
 * \�����������
 * \����ֵ����
 * \��������
 */
ColorSensor::ColorSensor(uint8_t port)
{
	_Out = Ex_Quadruple_Digital[port].d1;
	_S3 = Ex_Quadruple_Digital[port].d2;
	_S2 = Ex_Quadruple_Digital[port].d3;
	_S1 = Ex_Quadruple_Digital[port].d4;
	
	pinMode(_Out, INPUT_PULLUP);
	pinMode(_S3, OUTPUT);
	pinMode(_S2, OUTPUT);
	pinMode(_S1, OUTPUT);
}


/**
 * \������ColorSensor
 * \˵����������캯����������ɫ����ģ�������
 * \���������
 *   pin1 - ��ɫ����ģ��Out������
 *   pin2 - ��ɫ����ģ���S3����
 *   pin3 - ��ɫ����ģ���S2����
 *   pin4 - ��ɫ����ģ���S1����		 
 * \�����������
 * \����ֵ����
 * \��������
 */	
ColorSensor::ColorSensor(uint8_t pin1,uint8_t pin2,uint8_t pin3,uint8_t pin4)
{
	_Out = pin1;
	_S3 = pin2;
	_S2 = pin3;
	_S1 = pin4;
	
	pinMode(_Out, INPUT_PULLUP);
	pinMode(_S3, OUTPUT);
	pinMode(_S2, OUTPUT);
	pinMode(_S1, OUTPUT);
}


/**
 * \������setpin
 * \˵����������ɫ����ģ�������
 * \���������
 *   port : Ex_Quadruple_Digital  ��·���ֽӿڣ�6P�ӿڣ�
 *   	d1 - ��ɫ����ģ��Out������
 *   	d2 - ��ɫ����ģ���S3����
 *   	d3 - ��ɫ����ģ���S2����
 *   	d4 - ��ɫ����ģ���S1����	
 * \�����������
 * \����ֵ����
 * \��������
 */
void ColorSensor::setpin(uint8_t port)
{
	_Out = Ex_Quadruple_Digital[port].d1;
	_S3 = Ex_Quadruple_Digital[port].d2;
	_S2 = Ex_Quadruple_Digital[port].d3;
	_S1 = Ex_Quadruple_Digital[port].d4;
	
	pinMode(_Out, INPUT_PULLUP);
	pinMode(_S3, OUTPUT);
	pinMode(_S2, OUTPUT);
	pinMode(_S1, OUTPUT);
}

/**
 * \������setpin
 * \˵����������ɫ����ģ�������
 * \���������
 *   pin1 - ��ɫ����ģ��Out������
 *   pin2 - ��ɫ����ģ���S3����
 *   pin3 - ��ɫ����ģ���S2����
 *   pin4 - ��ɫ����ģ���S1����		 
 * \�����������
 * \����ֵ����
 * \��������
 */	
void ColorSensor::setpin(uint8_t pin1,uint8_t pin2,uint8_t pin3,uint8_t pin4)
{
	_Out = pin1;
	_S3 = pin2;
	_S2 = pin3;
	_S1 = pin4;
	
	pinMode(_Out, INPUT_PULLUP);
	pinMode(_S3, OUTPUT);
	pinMode(_S2, OUTPUT);
	pinMode(_S1, OUTPUT);
}


/**
 * \������OutputSetting
 * \˵�������ñ����������,������ò�׼ȷ��Ĭ�ϱ�������Ϊ100%
 * \���������
 *		temp - 100:��������Ϊ100%��20����������Ϊ20%
 * \�����������
 * \����ֵ����
 * \��������
 */
void ColorSensor::OutputSetting(uint8_t temp)
{
	switch(temp)
	{
		case 100:digitalWrite(_S1, HIGH); break;
		case 20:digitalWrite(_S1, LOW); break;
		default:digitalWrite(_S1, HIGH); break;
	}
}

/**
 * \������FilterColor
 * \˵���������˲�ģʽ��ѡ������ʲô��ɫ�Ĺ����
 * \���������
 *		s2		s3
 *		LOW 	LOW		��ɫ
 *		LOW 	HIGH	��ɫ
 *		HIGH 	LOW		���˲�
 *		HIGH 	HIGH	��ɫ 
 * \�����������
 * \����ֵ����
 * \��������
 */
void ColorSensor::FilterColor(uint8_t s2,uint8_t s3)
{
	if(s2 != 0)s2 = HIGH;  
	if(s3 != 0)s3 = HIGH;
	digitalWrite(_S2, s2); 
	digitalWrite(_S3, s3); 
}

/**
 * \������WhiteBalance
 * \˵�������÷�����к졢�̡�����ɫ��ֱ�ͨ���˲���ʱ��δ������ݵı�־����������ʱ��
 * \���������
 *		s2		s3
 *		LOW 	LOW		��ɫ
 *		LOW 	HIGH	��ɫ
 *		HIGH 	LOW		���˲�
 *		HIGH 	HIGH	��ɫ 
 * \���������
		g_count - �������
 * \����ֵ����
 * \��������
 */
void ColorSensor::WhiteBalance(uint8_t temp1,uint8_t temp2) 
 {
   g_count = 0;					//����ֵ����
   g_flag ++;					//����źż�����־
   FilterColor(temp1, temp2);	//�˲���ģʽ
   Timer1.setPeriod(1000000);	//��������ź��������ʱ��1s
 }





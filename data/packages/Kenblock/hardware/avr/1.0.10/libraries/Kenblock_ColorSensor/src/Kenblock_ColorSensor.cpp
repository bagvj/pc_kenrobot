  /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_ColorSensor.h
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/08/08
 * @描述：  颜色传感器库函数。
 *
 * \说明
 * 颜色传感器库函数，对应传感器为TCS3200。接口确定使用 PD5 。
 *
 * \方法列表
 * 
 * 		1. void ColorSensor::setpin(uint8_t port)
 * 		2. void ColorSensor::setpin(uint8_t pin1,uint8_t pin2,uint8_t pin3,uint8_t pin4)
 * 		3. void ColorSensor::OutputSetting(uint8_t temp)
 * 		4. void ColorSensor::FilterColor(uint8_t S2,uint8_t S3)
 *		5. void ColorSensor::WhiteBalance(uint8_t temp1,uint8_t temp2)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/08/08      0.1.0              新建库文件。
 *  
 * \示例
 *  
 * 		1.ColorSensorTest.ino
 */
 
 
 
 #include "Kenblock_ColorSensor.h"


/**
 * 函数名称：ColorSensor
 * \说明：初始化，不做任何操作
 * \输入参数：无
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
ColorSensor::ColorSensor(void)
{
	
}


/**
 * \函数：ColorSensor
 * \说明：替代构造函数，设置颜色传感模块的引脚
 * \输入参数：
 *   port : Ex_Quadruple_Digital  四路数字接口（6P接口）
 *   	d1 - 颜色传感模块Out的引脚
 *   	d2 - 颜色传感模块的S3引脚
 *   	d3 - 颜色传感模块的S2引脚
 *   	d4 - 颜色传感模块的S1引脚	
 * \输出参数：无
 * \返回值：无
 * \其他：无
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
 * \函数：ColorSensor
 * \说明：替代构造函数，设置颜色传感模块的引脚
 * \输入参数：
 *   pin1 - 颜色传感模块Out的引脚
 *   pin2 - 颜色传感模块的S3引脚
 *   pin3 - 颜色传感模块的S2引脚
 *   pin4 - 颜色传感模块的S1引脚		 
 * \输出参数：无
 * \返回值：无
 * \其他：无
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
 * \函数：setpin
 * \说明：设置颜色传感模块的引脚
 * \输入参数：
 *   port : Ex_Quadruple_Digital  四路数字接口（6P接口）
 *   	d1 - 颜色传感模块Out的引脚
 *   	d2 - 颜色传感模块的S3引脚
 *   	d3 - 颜色传感模块的S2引脚
 *   	d4 - 颜色传感模块的S1引脚	
 * \输出参数：无
 * \返回值：无
 * \其他：无
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
 * \函数：setpin
 * \说明：设置颜色传感模块的引脚
 * \输入参数：
 *   pin1 - 颜色传感模块Out的引脚
 *   pin2 - 颜色传感模块的S3引脚
 *   pin3 - 颜色传感模块的S2引脚
 *   pin4 - 颜色传感模块的S1引脚		 
 * \输出参数：无
 * \返回值：无
 * \其他：无
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
 * \函数：OutputSetting
 * \说明：设置比例输出因子,如果设置不准确，默认比例因子为100%
 * \输入参数：
 *		temp - 100:比例因子为100%，20：比例因子为20%
 * \输出参数：无
 * \返回值：无
 * \其他：无
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
 * \函数：FilterColor
 * \说明：设置滤波模式，选择允许什么颜色的光进入
 * \输入参数：
 *		s2		s3
 *		LOW 	LOW		红色
 *		LOW 	HIGH	蓝色
 *		HIGH 	LOW		无滤波
 *		HIGH 	HIGH	绿色 
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void ColorSensor::FilterColor(uint8_t s2,uint8_t s3)
{
	if(s2 != 0)s2 = HIGH;  
	if(s3 != 0)s3 = HIGH;
	digitalWrite(_S2, s2); 
	digitalWrite(_S3, s3); 
}

/**
 * \函数：WhiteBalance
 * \说明：设置反射光中红、绿、蓝三色光分别通过滤波器时如何处理数据的标志，并开启定时器
 * \输入参数：
 *		s2		s3
 *		LOW 	LOW		红色
 *		LOW 	HIGH	蓝色
 *		HIGH 	LOW		无滤波
 *		HIGH 	HIGH	绿色 
 * \输出参数：
		g_count - 脉冲个数
 * \返回值：无
 * \其他：无
 */
void ColorSensor::WhiteBalance(uint8_t temp1,uint8_t temp2) 
 {
   g_count = 0;					//计数值清零
   g_flag ++;					//输出信号计数标志
   FilterColor(temp1, temp2);	//滤波器模式
   Timer1.setPeriod(1000000);	//设置输出信号脉冲计数时长1s
 }





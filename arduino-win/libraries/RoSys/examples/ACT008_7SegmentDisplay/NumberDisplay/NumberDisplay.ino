 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  NumberDisplay.ino
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  数码管显示数字。
 * 
 * \说明
 * 数码管显示多种类型的数字，显示整数、负数、小数等。
 * 
 * \函数列表
 * 	  1. 	  void    Ro7SegmentDisplay::display(int16_t value)
 *    2.    void    Ro7SegmentDisplay::display(float value);
 *    3.   	void    Ro7SegmentDisplay::display(double value, uint8_t digits);
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建程序。
 * 
 */
#include "RoSys.h"

Ro7SegmentDisplay disp(PD1);		//数码管模块接口（拓展板）

void setup()
{
	
}

void loop()
{
	disp.display(1234);				  //显示整数
	delay(1000);
	disp.display(-123);				  //显示负数
	delay(1000);
	disp.display(0.236);		  	//显示小数，默认只显示小数点后一位
	delay(1000);
	disp.display(0.236,3);			//显示小数，显示小数点后三位
	delay(1000);
	disp.display(-0.236,3);			//显示负数，总长度超过数码管位数（4位），所以显示为 -0.24
	delay(1000);
}


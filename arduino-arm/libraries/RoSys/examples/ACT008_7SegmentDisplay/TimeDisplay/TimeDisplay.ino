 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  TimeDisplay.ino
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  数码管显示时间。
 * 
 * \说明
 * 数码管显示时间。
 * 
 * \函数列表
 *    1. void Me7SegmentDisplay::display(uint8_t DispData[]);
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建程序。
 * 
 */
 
#include "RoSys.h"

uint8_t		TimeDisp[] = { 0x00, 0x00, 0x00, 0x00 };
unsigned char	second		= 0;
unsigned char	minute		= 0;
unsigned char	hour		  = 12;
long	TimeDate = 0,lastTimeDate	= 0;

Ro7SegmentDisplay disp(PD1);
 
void setup()
{
}

void loop()
{
	TimeDate = millis();
	if( TimeDate - lastTimeDate >= 1000)
	{
		Time();						//时间计数和显示值处理

		disp.display(TimeDisp);		//数码管显示时间

		lastTimeDate = TimeDate;
	}
}

//函数：Time 说明：计算时间（时、分、秒），并将second、minute 拆分十位、个位存入数组 TimeDisp[]。
void Time()
{
	second++;						      //秒
	if(second == 60)
	{
		minute++;					      //分
		if(minute == 60)
		{
			hour++;					      //时
			if(hour == 24)
			{
				hour = 0;
			}
			minute = 0;
		}
		second = 0;
	}
	
	TimeDisp[0] = minute / 10;		//处理 分 十位值
	TimeDisp[1] = minute % 10;		//处理 分 个位值
	TimeDisp[2] = second / 10;		//处理 秒 十位值
	TimeDisp[3] = second % 10;		//处理 秒 个位值
}


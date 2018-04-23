/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  LedMatrixTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/07/21
 * @描述：  16*16点阵模块级联显示。
 * 
 * \说明
 * 16*16点阵模块级联显示。级联显示字符、字符串、汉字等。
 * 
 * \函数列表
 *
 *    1.    int16_t LedMatrix::getDeviceCount();
 *    2.    void 	LedMatrix::shutDown(int16_t addr, bool status);
 *    3.    void 	LedMatrix::setIntensity(int16_t addr, int16_t intensity);
 *    4.    void 	LedMatrix::setDisplayType(int8_t angleValue,int8_t sizeValue);
 *
 *    5.    void 	LedMatrix::clearDisplay(int16_t addr);
 *    6.   	void  	LedMatrix::display(uint8_t addr,uint8_t ch) ;
 *    7.   	void  	LedMatrix::display(uint8_t addr,uint8_t ch[]) ;
 *    8.   	void  	LedMatrix::display(uint8_t addr,uint8_t (*FData)[8]);
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/07/21      0.1.0              新建程序。
 * 
 */
#include "Kenblock.h"
#include "Kenblock_LedMatrix.h"

LedMatrix ledMatrix(PD6,2);  //16*16点阵模块接口（拓展板），模块数量设置为2

//延时时间
unsigned long delaytime=2000;

//取摸设置，参考图片
unsigned char Data[][8]=
{
  {0x00,0x00,0x1F,0x10,0x11,0x21,0x21,0x3F},
  {0x01,0x09,0x09,0x11,0x21,0x41,0x05,0x02},
  {0x20,0xF0,0x00,0x00,0x00,0x00,0x00,0xFC},
  {0x00,0x20,0x10,0x08,0x04,0x04,0x00,0x00},/*"乐",0*/
  {0x20,0x3E,0x48,0x08,0xFF,0x14,0x22,0x40},
  {0x1F,0x10,0x10,0x1F,0x10,0x10,0x1F,0x10},
  {0x00,0x7C,0x44,0x44,0x44,0x44,0x7C,0x00},
  {0xF0,0x10,0x10,0xF0,0x10,0x10,0xF0,0x10},/*"智",1*/
};

unsigned char Str[]="idea";
unsigned char Num[]="2016";

//每一个8*8点阵单元都必须进行单独的初始化 
void setup() 
{
	int devices=ledMatrix.getDeviceCount();	//获取连接的 LED点阵 8*8单元的数量
	for(int addr=0;addr<devices;addr++) 
	{
		ledMatrix.shutDown(addr,false);		//设置为 false 则为掉电模式，掉电模式可以节省电源
		ledMatrix.setIntensity(addr,8);		//设置亮度为8
		ledMatrix.clearDisplay(addr);			//清除显示
	}
}

//显示函数中，90°显示因为数据处理量变多，所以数据更新速度会变慢。
void loop() 
{
	int devices=ledMatrix.getDeviceCount();  	//获取连接的 LED点阵 8*8单元的数量
	for(int addr=0;addr<devices;addr++) 
	{
		ledMatrix.clearDisplay(addr);        	//清除显示
	}

	ledMatrix.setDisplayType(1,0); 			//0°显示8*8 字符
	ledMatrix.display(1,'G');      			//显示字符
	ledMatrix.display(3,'o');      			//显示字符
	ledMatrix.display(5,'o');      			//显示字符
	ledMatrix.display(7,'d');      			//显示字符
	delay(delaytime);

	ledMatrix.setDisplayType(1,1); 			//90°显示8*16 字符
	ledMatrix.display(0,'G');      			//显示字符
	ledMatrix.display(1,'o');      			//显示字符
	ledMatrix.display(2,'o');      			//显示字符
	ledMatrix.display(3,'d');      			//显示字符
	delay(delaytime);

	ledMatrix.setDisplayType(1,1); 			//90°显示8*16 字符
	ledMatrix.display(0,Str);      			//显示字符串
	delay(delaytime);

	ledMatrix.setDisplayType(1,1); 			//90°显示8*16 字符
	ledMatrix.display(0,Num);      			//显示字符串数字
	delay(delaytime);

	ledMatrix.setDisplayType(1,2); 			//90°显示16*16 字符、图形
	ledMatrix.display(0,Data);     			//显示汉字“乐智”
	ledMatrix.display(1,Data+4);
	delay(delaytime);

	ledMatrix.setDisplayType(0,2);  		//0°显示16*16 字符、图形
	ledMatrix.display(0,Data);      		//显示汉字“乐智”
	ledMatrix.display(1,Data+4);           
	delay(delaytime);
}
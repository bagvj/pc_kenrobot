/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  LedMatrixTest.ino
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  16*16点阵模块显示表情。
 * 
 * \说明
 * 16*16点阵模块显示表情。
 * 
 * \函数列表
 *
 *    1.    int16_t RoLedMatrix::getDeviceCount();
 *    2.    void 	RoLedMatrix::shutDown(int16_t addr, bool status);
 *    3.    void 	RoLedMatrix::setIntensity(int16_t addr, int16_t intensity);
 *    4.    void 	RoLedMatrix::setDisplayType(int8_t angleValue,int8_t sizeValue);
 *
 *    5.    void 	RoLedMatrix::clearDisplay(int16_t addr);
 *    6.    void  	RoLedMatrix::display(uint8_t addr,uint8_t (*FData)[8]);
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建程序。
 * 
 */
#include "RoSys.h"

RoLedMatrix ledMatrix(PD6,1);  //16*16点阵模块接口（拓展板），模块数量设置为1

//延时时间
unsigned long delaytime=2000;

//取摸设置，参考图片
unsigned char Data[][8]=
{
  {0x3C,0x42,0xA5,0x81,0xA5,0x99,0x42,0x3C},//开心
  {0x3C,0x42,0xA5,0x81,0x99,0xA5,0x42,0x3C},//难过
  {0x3C,0x42,0xA5,0x81,0xAD,0x99,0x42,0x3C},//调皮
  {0x3C,0x42,0xA5,0x81,0xBD,0x81,0x42,0x3C},//闭嘴
  
  {0x00,0x00,0x00,0x1E,0x3F,0x7F,0x7F,0x7F},
  {0x3F,0x1F,0x0F,0x07,0x03,0x01,0x00,0x00},
  {0x00,0x00,0x00,0x78,0xFC,0xFE,0xFE,0xFE},
  {0xFC,0xF8,0xF0,0xE0,0xC0,0x80,0x00,0x00},//心形
};

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

void loop() 
{
	int devices=ledMatrix.getDeviceCount();	//获取连接的 LED点阵 8*8单元的数量
	for(int addr=0;addr<devices;addr++) 
	{
		ledMatrix.clearDisplay(addr);		//清除显示
	}
	
	
	ledMatrix.setDisplayType(0,0);         //0°显示8*8 字符、图形
	ledMatrix.display(0,Data);             //显示表情
	delay(delaytime);

	ledMatrix.setDisplayType(0,2);         //0°显示16*16 字符、图形
	ledMatrix.display(0,Data);             //显示表情          
	delay(delaytime);

	ledMatrix.setDisplayType(1,2);         //90°显示16*16 字符、图形
	ledMatrix.display(0,Data+4);           //显示心形          
	delay(delaytime);
}
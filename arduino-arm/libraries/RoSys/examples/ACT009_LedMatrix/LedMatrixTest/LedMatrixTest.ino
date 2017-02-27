/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  LedMatrixTest.ino
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  16*16点阵模块点显示示例。
 * 
 * \说明
 * 16*16点阵模块点显示示例。模块数量为1，点阵所有的点依次点亮。
 * 
 * \函数列表
 *
 *    1.    int16_t RoLedMatrix::getDeviceCount();
 *    2.    void 	RoLedMatrix::shutDown(int16_t addr, bool status);
 *    3.    void 	RoLedMatrix::setIntensity(int16_t addr, int16_t intensity);
 *    4.    void 	RoLedMatrix::setDisplayType(int8_t angleValue,int8_t sizeValue);
 *
 *    5.    void 	RoLedMatrix::clearDisplay(int16_t addr);
 * 	  6. 	void  	RoLedMatrix::RoLedMatrix::setLed(int16_t addr, int16_t row, int16_t col, bool state);
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建程序。
 * 
 */
#include "RoSys.h"

RoLedMatrix ledMatrix(PD6,1);  //16*16点阵模块接口（拓展板），模块数量设置为1

//延时时间
unsigned long delaytime=10;

//每一个8*8点阵单元都必须进行单独的初始化 
void setup() 
{
	int devices=ledMatrix.getDeviceCount();	//获取连接的 LED点阵 8*8单元的数量
	for(int addr=0;addr<devices;addr++) 
	{
		ledMatrix.shutDown(addr,false);		//设置为 false 则为掉电模式，掉电模式可以节省电源
		ledMatrix.setIntensity(addr,8);		//设置亮度为8
		ledMatrix.clearDisplay(addr);		//清除显示
	}
}

void loop() 
{
  int devices=ledMatrix.getDeviceCount();//获取连接的 LED点阵 8*8单元的数量
  for(int addr=0;addr<devices;addr++) 
  {
    ledMatrix.clearDisplay(addr);        //清除显示
  }
  
  //让所有点依次点亮
  for(int addr=0;addr<devices;addr++) 
  {
    for(int row=0;row<8;row++) 
    {
      for(int col=0;col<8;col++) 
      {
        ledMatrix.setLed(addr,row,col,true);
        delay(delaytime);
      }
    }
  }
}

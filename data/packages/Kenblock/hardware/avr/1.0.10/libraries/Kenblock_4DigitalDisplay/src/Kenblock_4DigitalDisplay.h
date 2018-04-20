/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_4DigitalDisplay.h
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/07/21
 * @描述：  四位数码管的驱动。Kenblock_4DigitalDisplay.cpp 的头文件。
 *
 * \说明
 * 四位数码管的驱动。四位数码管为共阳数码管，使用TM1637作为数码管驱动芯片。
 *
 * \方法列表
 * 
 *    1.    void    FourDigitalDisplay::init(void);
 *    2.    void    FourDigitalDisplay::set(uint8_t brightness, uint8_t SetData, uint8_t SetAddr);
 *    3.    void    FourDigitalDisplay::setPin(uint8_t port);
 *    4.    void    FourDigitalDisplay::setPin(uint8_t dataPin, uint8_t clkPin);
 *    5.    void    FourDigitalDisplay::display(uint16_t value);
 *    6.    void    FourDigitalDisplay::display(int16_t value);
 *    7.    void    FourDigitalDisplay::display(float value);
 *    8.   	void    FourDigitalDisplay::display(double value, uint8_t digits);
 *    9.   	void    FourDigitalDisplay::display(uint8_t DispData[]);
 *    10.   void    FourDigitalDisplay::displayBit(uint8_t BitAddr, uint8_t DispData);
 *    11.   void    FourDigitalDisplay::displayBit(uint8_t BitAddr, uint8_t DispData, uint8_t point_on);
 *    12.   void    FourDigitalDisplay::clearDisplay(void);
 *    13.   void    FourDigitalDisplay::setBrightness(uint8_t brightness);
 *
 *    14.   int16_t FourDigitalDisplay::checkNum(float v,int16_t b);
 *    15.   void    FourDigitalDisplay::write(uint8_t SegData[]);
 *    16.   void    FourDigitalDisplay::write(uint8_t BitAddr, uint8_t SegData);
 *    17.   void    FourDigitalDisplay::coding(uint8_t DispData[]);
 *    18.   uint8_t FourDigitalDisplay::coding(uint8_t DispData);
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/07/21      0.1.0              新建库文件。
 *  
 * \示例
 *  
 *    1.   DisplayTest.ino
 *    2.   NumberDisplay.ino
 *    3.   TimeDisplay.ino
 */

#ifndef Kenblock_4DigitalDisplay_H
#define Kenblock_4DigitalDisplay_H

#include <stdint.h>
#include <stdbool.h>
#include <Arduino.h>
#include "KenblockConfig.h"

#ifndef TM1637
#define TM1637
/* 常数定义 --------------------------------------------*/
/******************TM1637 的定义*************************/
const uint8_t   ADDR_AUTO = 0x40;    //自动地址增量模式
const uint8_t   ADDR_FIXED = 0x44;   //固定地址模式
const uint8_t   STARTADDR = 0xc0;    //显示寄存器的开始地址
const uint8_t   SEGDIS_ON = 0x88;    //开启显示
const uint8_t   SEGDIS_OFF = 0x80;   //关闭显示
/********** 定义带时钟点":"数码管的显示 *****************/
const uint8_t 	POINT_ON = 1;
const uint8_t 	POINT_OFF = 0;
/**************数码管亮度定义****************************/
const uint8_t 	BRIGHTNESS_0 = 0;
const uint8_t 	BRIGHTNESS_1 = 1;
const uint8_t 	BRIGHTNESS_2 = 2;
const uint8_t 	BRIGHTNESS_3 = 3;
const uint8_t 	BRIGHTNESS_4 = 4;
const uint8_t 	BRIGHTNESS_5 = 5;
const uint8_t 	BRIGHTNESS_6 = 6;
const uint8_t 	BRIGHTNESS_7 = 7;
#endif  // TM1637

 /**
 * Class: FourDigitalDisplay
 * \说明：Class FourDigitalDisplay 的声明
 */

class FourDigitalDisplay
{
	public:
		/**
		 *\函数：FourDigitalDisplay
		 * \说明：创建新的控制量，不做任何操作
		 * \输入参数：无
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		FourDigitalDisplay(void);
 
		/**
		 * \函数：FourDigitalDisplay
		 * \说明：替代构造函数，映射数码管模块引脚设置函数，设置控制引脚
		 * \输入参数：
		 *   port : Ex_Double_Digital  双路数字接口（4P接口：PD1、PD2、PD3、PD4）
		 *   	d1 - 数码管模块clk 引脚
		 *   	d2 - 数码管模块data 引脚
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		FourDigitalDisplay(uint8_t port);
		
 		/**
		 * \函数：FourDigitalDisplay
		 * \说明：替代构造函数，映射数码管模块引脚设置函数，设置控制引脚
		 * \输入参数：
		 *   	clkPin - 数码管模块clk 引脚
		 *   	dataPin - 数码管模块data 引脚
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		FourDigitalDisplay(uint8_t dataPin, uint8_t clkPin);

 		/**
		 * \函数：init
		 * \说明：初始化数码管模块，此处实际上只是调用了 clearDisplay 。
		 * \输入参数：无
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void init(void); 
 
  		/**
		 * \函数：set
		 * \说明：设置亮度、数据、地址
		 * \输入参数：
		 *   	brightness - 数码管亮度，定义为 BRIGHTNESS_0 ~ BRIGHTNESS_7
		 *   	SetData - 开始地址数据
		 *   	SetAddr - 显示开始地址
		 * \输出参数：
		 *   	Cmd_SetData - 赋值Cmd_SetData
		 *   	Cmd_SetAddr - 赋值Cmd_SetAddr		 
		 *   	Cmd_DispCtrl - 亮度控制指令的值		 
		 * \返回值：无
		 * \其他：无
		 */
		void set(uint8_t = BRIGHTNESS_2, uint8_t = ADDR_AUTO, uint8_t = STARTADDR);// 下一个周期生效
 
		/**
		 * \函数：setpin
		 * \说明：设置控制引脚
		 * \输入参数：
		 *   port : Ex_Double_Digital  双路数字接口（4P接口：PD1、PD2、PD3、PD4）
		 *   	d1 - 数码管模块clk 引脚
		 *   	d2 - 数码管模块data 引脚
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void setPin(uint8_t port); 
		
  		/**
		 * \函数：setpin
		 * \说明：设置控制引脚
		 * \输入参数：
		 *   	clkPin - 数码管模块clk 引脚
		 *   	dataPin - 数码管模块data 引脚
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void setPin(uint8_t dataPin, uint8_t clkPin);

   		/**
		 * \函数：write
		 * \说明：把数组写入特定的地址
		 * \输入参数：
		 *   	SegData[] - 需要写入显示模块的数组
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void write(uint8_t SegData[]);
  
    	/**
		 * \函数：write
		 * \说明：把一字节的数据写入指定地址
		 * \输入参数：
		 *   	BitAddr - 指定位地址（0~3）
		 *   	SegData - 显示的数据
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void write(uint8_t BitAddr, uint8_t SegData);
  
     	/**
		 * \函数：display
		 * \说明：显示特定的值，此处显示 uint16_t 类型的数
		 * \输入参数：
		 *   	value - 显示的值
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void display(uint16_t value);
  
     	/**
		 * \函数：display
		 * \说明：显示特定的值，此处显示 int16_t 的数
		 * \输入参数：
		 *   	value - 显示的值
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void display(int16_t value);

     	/**
		 * \函数：display
		 * \说明：显示特定的值，此处显示 float 的数
		 * \输入参数：
		 *   	value - 显示的值
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void display(float value);
		
      	/**
		 * \函数：checkNum
		 * \说明：提取 float 数据 显示的值
		 * \输入参数：
		 *   	v - 显示的值
		 *   	b - 显示的值
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		int16_t checkNum(float v,int16_t b);

      	/**
		 * \函数：display
		 * \说明：显示特定的值，此处显示 double 的数
		 * \输入参数：
		 *   	value - 显示的值
		 *   	digits - 小数点位数
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无	
		 */
		void display(double value, uint8_t = 1);

       	/**
		 * \函数：display
		 * \说明：显示数组（4个字节）
		 * \输入参数：
		 *   	DispData[] - 显示的数组存储在此数组中
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void display(uint8_t DispData[]);

       	/**
		 * \函数：displayBit
		 * \说明：指定位显示数字
		 * \输入参数：
		 *   	BitAddr - 显示的位（0-3）
		 *   	DispData - 需要现实的数据		 
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void displayBit(uint8_t BitAddr, uint8_t DispData);

        /**
		 * \函数：displayBit
		 * \说明：指定位显示数字，带小数点
		 * \输入参数：
		 *   	BitAddr - 显示的位（0-3）
		 *   	DispData - 需要现实的数据
		 *   	point_on - 显示时钟点":"		 
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void displayBit(uint8_t BitAddr, uint8_t DispData, uint8_t point_on);

        /**
		 * \函数：clearDisplay
		 * \说明：清除显示
		 * \输入参数：无		 
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void clearDisplay(void);
  
        /**
		 * \函数：setBrightness
		 * \说明：设置数码管显示亮度
		 * \输入参数：
		 *   	brightness - 数码管亮度，定义为 BRIGHTNESS_0 ~ BRIGHTNESS_7		 
		 * \输出参数：
		 *   	Cmd_DispCtrl - 亮度控制指令的值
		 * \返回值：无
		 * \其他：无
		 */
		void setBrightness(uint8_t brightness);
  
        /**
		 * \函数：coding
		 * \说明：将要现实的值，转换为数码管段码，并替换DispData[] 的值。
		 * \输入参数：
		 *   	DispData[] - 显示的原始数组		 
		 * \输出参数：
		 *   	DispData[] - 转换后的数码管段码数组
		 * \返回值：无
		 * \其他：无
		 */
		void coding(uint8_t DispData[]);

        /**
		 * \函数：coding
		 * \说明：将要现实的值，转换为数码管段码，并替换DispData[] 的值。
		 * \输入参数：
		 *   	DispData - 显示的原始数据		 
		 * \输出参数：
		 *   	DispData - 转换后的数码管段码数据
		 * \返回值：无
		 * \其他：无
		 */
		uint8_t coding(uint8_t DispData);
		
private:
  uint8_t Cmd_SetData;
  uint8_t Cmd_SetAddr;
  uint8_t Cmd_DispCtrl;
  bool _PointFlag; //_PointFlag=1:小数点显示开启

        /**
		 * \函数：writeByte
		 * \说明：向 TM1637 写一个字节的数据（8 bits）
		 * \输入参数：
		 *   	wr_data - 写入的数据		 
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void writeByte(uint8_t wr_data);
  
        /**
		 * \函数：start
		 * \说明：TM1637开始信号，开始传输数据
		 * \输入参数：无	 
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void start(void);// 发送开始位
         

		void point(bool PointFlag);// 是否显示时钟点":"，下一个周期生效
		
		/**
		 * \函数：start
		 * \说明：TM1637停止信号，传输数据结束
		 * \输入参数：无	 
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */  
		void stop(void); // 发送停止位
		
	uint8_t _clkPin;     // clk引脚
	uint8_t _dataPin;    // data引脚
};
#endif  // Kenblock_4DigitalDisplay_H

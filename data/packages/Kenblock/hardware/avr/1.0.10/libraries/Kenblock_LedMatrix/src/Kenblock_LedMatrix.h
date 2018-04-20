/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_LedMatrix.h
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/07/21
 * @描述：  16*16 LED点阵模块的驱动。Kenblock_LedMatrix.cpp 的头文件。
 *
 * \说明
 * 		16*16 LED点阵模块的驱动。点阵模块为共阴点阵，控制芯片为MAX7219。
 * 		（90°显示时数据更新会变慢。）
 * \方法列表
 * 
 *    1.    void 	LedMatrix::setPin(int16_t dataPin, int16_t clkPin, int16_t csPin, int16_t Num);
 *    2.    void 	LedMatrix::setPin(uint8_t port, int16_t Num); 
 *    3.    int16_t LedMatrix::getDeviceCount();
 *    4.    void 	LedMatrix::shutDown(int16_t addr, bool _status);
 *    5.    void 	LedMatrix::setScanLimit(int16_t addr, int16_t limit);
 *    6.    void 	LedMatrix::setIntensity(int16_t addr, int16_t intensity);
 *    7.    void 	LedMatrix::setDisplayType(int8_t angleValue,int8_t sizeValue);
 *
 *    8.    void 	LedMatrix::clearDisplay(int16_t addr);
 *    9.    void 	LedMatrix::setLed(int16_t addr, int16_t row, int16_t col, boolean state);
 *    10.   void 	LedMatrix::setRow(int16_t addr, int16_t row, uint8_t value);
 *    11.   void 	LedMatrix::setColumn(int16_t addr, int16_t col, uint8_t value);
 *    12.   void 	LedMatrix::display(uint8_t addr,uint8_t ch) ;
 *    13.   void 	LedMatrix::display(uint8_t addr,uint8_t ch[]) ;
 *    14.   void 	LedMatrix::display(uint8_t addr,uint8_t (*FData)[8]);
 *
 *    15.   void 	LedMatrix::spiTransfer(int16_t addr, uint8_t opcode, uint8_t data);
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/07/21      0.1.0              新建库文件。
 *  
 * \示例
 *  
 *    1.   DisplayTest.ino
 *    2.   CascadedDisplay.ino
 *    3.   EmoticonDisplay.ino
 */

#ifndef Kenblock_LedMatrix_H
#define Kenblock_LedMatrix_H

#include <avr/pgmspace.h>
#include <Arduino.h>
#include "KenblockConfig.h"

#define MatrixMaxNum 4 //16*16点阵模块的最大数量

/**
 * Class: LedMatrix
 * \说明：Class LedMatrix 的声明
 */
class LedMatrix 
{
    public:
		/**
		* \函数：LedMatrix
		* \说明：创建新的控制量，不做任何操作
		* \输入参数：无
		* \输出参数：无
		* \返回值：无
		* \其他：无
		*/
		LedMatrix(void) ;
	
		/**
		 * \函数：LedMatrix
		 * \说明：创建新的控制量，替代构造函数，映射点阵模块引脚设置函数，设置控制引脚、点阵数量
		 * \输入参数：
		 * 		dataPin - 点阵模块 DIN 引脚
		 *   	clockPin - 点阵模块 CLK 引脚
		 *   	csPin - 点阵模块 CS 引脚
		 *   	Num - 16*16点阵模块模块的数量
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */	
        LedMatrix(int16_t dataPin, int16_t clkPin, int16_t csPin, int16_t Num=1);
		
		/**
		 * \函数：LedMatrix
		 * \说明：创建新的控制量，替代构造函数，映射点阵模块引脚设置函数，设置控制端口、点阵数量
		 * \输入参数：
		 * 	 port - Ex_Quadruple_Digital  四路数字接口（6P接口：PD5、PD6）
		 *   	d1 - 点阵模块 DIN 引脚 （10、2）
		 *   	d2 - 点阵模块 CS 引脚 （11、3）
		 *   	d3 - 点阵模块 CLK 引脚 （12、8）
		 *   	d4 - NC 空
		 *   	Num - 16*16点阵模块模块的数量
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */	
		LedMatrix(uint8_t port, int16_t Num=1);
		
		/**
		 * \函数：setpin
		 * \说明：点阵模块引脚设置函数，设置控制引脚、点阵数量
		 * \输入参数：
		 * 		dataPin - 点阵模块 DIN 引脚
		 *   	clockPin - 点阵模块 CLK 引脚
		 *   	csPin - 点阵模块 CS 引脚
		 *   	Num - 16*16点阵模块模块的数量
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */	
        void setPin(int16_t dataPin, int16_t clkPin, int16_t csPin, int16_t Num=1);
		
		/**
		 * \函数：setpin
		 * \说明：点阵模块引脚设置函数，设置控制端口、点阵数量
		 * \输入参数：
		 * 	 port - Ex_Quadruple_Digital  四路数字接口（6P接口：PD5、PD6）
		 *   	d1 - 点阵模块 DIN 引脚 （10、2）
		 *   	d2 - 点阵模块 CS 引脚 （11、3）
		 *   	d3 - 点阵模块 CLK 引脚 （12、8）
		 *   	d4 - NC 空
		 *   	Num - 16*16点阵模块模块的数量
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */	
		void setPin(uint8_t port, int16_t Num=1); 
		
		/**
		 * \函数：getDeviceCount
		 * \说明：获取连接的 LED点阵 8*8单元的数量
		 * \输入参数：无
		 * \输出参数：点阵模块的最大数量
		 * \返回值：无
		 * \其他：无
		 */
        int16_t getDeviceCount();

		/**
		 * \函数：shutDown
		 * \说明：设置点阵模块关断模式 
		 * \输入参数：
		 * 		addr - 点阵模块的地址
		 *   	_status - 如果值为 true ，为正常工作状态模式；设置为 false 则为掉电模式，掉电模式可以节省电源。		 
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
        void shutDown(int16_t addr, bool _status);

		/**
		 * \函数：setScanLimit
		 * \说明：设置点阵模块行（或者 列）的扫描界限
		 * \输入参数：
		 * 		addr - 点阵模块的地址
		 *   	limit - 显示的点的数量（0~7）
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
        void setScanLimit(int16_t addr, int16_t limit);
        
		/**
		 * \函数：setIntensity
		 * \说明：设置点阵模块的亮度
		 * \输入参数：
		 * 		addr - 点阵模块的地址
		 *   	intensity - 显示的亮度值（0~15）		 
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
        void setIntensity(int16_t addr, int16_t intensity);

		/**
		 * \函数：setDisplayType
		 * \说明：显示模式设置。大小：8*8显示（主要显示字符、数字）; 8*16显示 （显示字符）; 16*16 显示汉字、图像。
		 * 						角度：0°、90°
		 * \输入参数：
		 * 		angleValue - 0:0°显示; 		1:90°显示; 	
		 * 		sizeValue  - 0:8*8显示;  	1:8*16显示 ;  	2:16*16 显示汉字、图像。 
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */	
		void setDisplayType(int8_t angleValue,int8_t sizeValue);
		
		/**
		 * \函数：clearDisplay
		 * \说明：清除显示
		 * \输入参数：
		 * 		addr - 点阵模块的地址		 
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
        void clearDisplay(int16_t addr);
 
		/**
		 * \函数：setLed
		 * \说明：点阵显示，指定点（行、列）的点亮或灭。
		 * \输入参数：
		 * 		addr - 点阵模块的地址	
		 * 		row - 行的数值 （0~7）
		 * 		col - 列的数值 （0~7）
		 * 		state - 如果只为 true LED亮，如果为 false LED灭		 
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
        void setLed(int16_t addr, int16_t row, int16_t col, bool state);

		/**
		 * \函数：setRow
		 * \说明：点阵显示，设置一行点阵的显示
		 * \输入参数：
		 * 		addr - 点阵模块的地址	
		 * 		row - 行的数值 （0~7）
		 * 		value - 8bit对应于8个LED灯，对应的位为1 LED亮		 
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
        void setRow(int16_t addr, int16_t row, uint8_t value);

		/**
		 * \函数：setColumn
		 * \说明：点阵显示，设置一列点阵的显示
		 * \输入参数：
		 * 		addr - 点阵模块的地址	
		 * 		col - 列的数值 （0~7）
		 * 		value - 8bit对应于8个LED灯，对应的位为1 LED亮		 
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
        void setColumn(int16_t addr, int16_t col, uint8_t value);
		
		/**
		 * \函数：display
		 * \说明：点阵显示，显示8*8、16*16 字符、图形、汉字等，输入字模数组。
		 * 		  _displayAngle - 0:0°显示; 	1:90°显示; 	
		 * 		  _displaySize  - 0:8*8显示;  	1:8*16显示 ;  	2:16*16 显示汉字、图像。 
		 *		  
		 * \输入参数：
		 * 		  addr - 点阵模块的地址：_displaySize=0时addr表示8*8单元的地址，_displaySize=2时表示16*16单元的地址（4个8*8单元为一组）。
		 * 		  (*FData)[8] - 字模二维数组指针
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void display(uint8_t addr,uint8_t (*FData)[8]);
		
		/**
		 * \函数：display
		 * \说明：点阵显示，显示8*8、8*16 字符
		 * 		  _displayAngle - 0:0°显示; 	1:90°显示; 	
		 * 		  _displaySize  - 0:8*8显示;  	1:8*16显示 ;  	2:16*16 显示汉字、图像。 	  
		 * \输入参数：
		 * 		  addr - 点阵模块的地址：_displaySize=0时addr表示8*8单元的地址，_displaySize=1时表示8*16单元的地址（2个8*8单元为一组）。
		 * 		  ch   - 显示的字符	 
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void display(uint8_t addr,uint8_t ch) ;
		
		/**
		 * \函数：display
		 * \说明：点阵显示，显示8*8、8*16 字符串
		 * \输入参数：
		 * 		addr - 点阵模块的地址
		 * 		ch - 显示的字符
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void display(uint8_t addr,uint8_t ch[]) ;

			
		
	private :
		int16_t SPI_MOSI;			//SPI_MOSI
        int16_t SPI_CLK;			//SPI_CLK
        int16_t SPI_CS; 			//SPI_CS
		int16_t _maxDevices;		//使用LED点阵的最大数量
		
		uint8_t _displayAngle = 0;	//显示角度。0:0°显示; 1:90°显示; 
		uint8_t _displaySize = 0;	//显示模式。0:8*8显示（主要显示字符、数字）; 1:8*16显示 （显示字符）; 2: 16*16 显示汉字、图像。
		
        uint8_t _spiData[16]; 		//SPI 发送数据寄存数组 
        uint8_t _status[ MatrixMaxNum * 32]; 		//点阵状态数组，存储每一个点阵状态，数组大小 为点阵模块数量 *32 （16*16点阵模块的数量 *32）

		void spiTransfer(int16_t addr, uint8_t opcode, uint8_t data);	//SPI发送数据
};

#endif	//Kenblock_LedMatrix_H




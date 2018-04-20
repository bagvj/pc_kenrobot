 /**
 * \著作权 
 * @名称：  U8glib.cpp
 * @作者：  oliver <olikraus@gmail.com>
 * @版本：  V1.19.1
 * @URL: 	https://github.com/olikraus/u8glib
 * @维护：  Kenblock
 * @时间：  2017/09/13
 * @描述：  这是一个用于驱动单色TFT屏和OLED屏的库。
 *
 * \说明
 * Kenblock OLED 12864显示模块 使用SSD1306控制器，时使用时需要设置如下：
 * 		U8GLIB_SSD1306_128X64 u8g(U8G_I2C_OPT_DEV_0|U8G_I2C_OPT_NO_ACK|U8G_I2C_OPT_FAST);	// Fast I2C / TWI 
 * 
 * 此外支持的控制器有: SSD1306, SSD1309, SSD1322, SSD1325, SSD1327, SH1106, 
 * UC1601, UC1610, UC1611, UC1701, ST7565, ST7920, KS0108, LC7981, PCD8544, PCF8812, SBN1661, TLS8204, T6963.
 *
 * \常用公有方法列表：（仅列出常用的）
 * 
 *	1.	void firstPage(void)	//开始显示图像
 *	2.	uint8_t nextPage(void)	//图像显示结束
 *	3.	void drawLine(u8g_uint_t x1, u8g_uint_t y1, u8g_uint_t x2, u8g_uint_t y2)	//画直线
 *	4.	void drawTriangle(uint16_t x0, uint16_t y0, uint16_t x1, uint16_t y1, uint16_t x2, uint16_t y2)			//画实心三角形
 *	5.	void drawFrame(u8g_uint_t x, u8g_uint_t y, u8g_uint_t w, u8g_uint_t h)	//画空心矩形
 *	6.	void drawRFrame(u8g_uint_t x, u8g_uint_t y, u8g_uint_t w, u8g_uint_t h, u8g_uint_t r) 	//画空心圆角矩形
 *	7.	void drawBox(u8g_uint_t x, u8g_uint_t y, u8g_uint_t w, u8g_uint_t h)	//画实心矩形
 *	8.	void drawRBox(u8g_uint_t x, u8g_uint_t y, u8g_uint_t w, u8g_uint_t h, u8g_uint_t r)		//画实心圆角矩形
 *	9.	void drawCircle(u8g_uint_t x0, u8g_uint_t y0, u8g_uint_t rad, uint8_t opt = U8G_DRAW_ALL)					//画空心圆
 *	10.	void drawDisc(u8g_uint_t x0, u8g_uint_t y0, u8g_uint_t rad, uint8_t opt = U8G_DRAW_ALL)	//画实心圆
 *	11.	void setFont(const u8g_fntpgm_uint8_t *font)				//设置字体
 *	12.	void undoRotation(void) 或 void setRot90(void)	或	void setRot180(void) void setRot270(void) //设置显示方向0/09/180/270
 *	13.	u8g_uint_t drawStr(u8g_uint_t x, u8g_uint_t y, const char *s)		//显示字符串
 *	14.	void setPrintPos(u8g_uint_t x, u8g_uint_t y) 				//设置下文 print()函数的显示位置
 *	15.	size_t print()	//打印内容，使用方式和 串口Serial 使用方式一样了。
 *	16.	void drawXBMP(u8g_uint_t x, u8g_uint_t y, u8g_uint_t w, u8g_uint_t h, const u8g_pgm_uint8_t *bitmap) //显示图片，数据为BMP图片数据
 *	17.	更多函数和示例参见示例。
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/13      1.19.1              做汉化修订注释。
 *  
 * \示例
 *  
 * 		1.HelloWorld.ino			//HelloWorld 显示
 * 		2.//其他示例 
 */

/*

  U8glib.cpp

  C++ Interface

  Universal 8bit Graphics Library
  
  Copyright (c) 2011, olikraus@gmail.com
  All rights reserved.

  Redistribution and use in source and binary forms, with or without modification, 
  are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this list 
    of conditions and the following disclaimer.
    
  * Redistributions in binary form must reproduce the above copyright notice, this 
    list of conditions and the following disclaimer in the documentation and/or other 
    materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND 
  CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, 
  INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF 
  MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR 
  CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
  SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT 
  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER 
  CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, 
  STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF 
  ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.  

*/

#include "Kenblock_OLED_U8glib.h"


#if defined(U8G_WITH_PINLIST)
uint8_t U8GLIB::initSPI(u8g_dev_t *dev, uint8_t sck, uint8_t mosi, uint8_t cs, uint8_t a0, uint8_t reset)
{
  prepare();
  return u8g_InitSPI(&u8g, dev, sck, mosi, cs, a0, reset);
}

uint8_t U8GLIB::initHWSPI(u8g_dev_t *dev, uint8_t cs, uint8_t a0, uint8_t reset)
{
  prepare();
  return u8g_InitHWSPI(&u8g, dev, cs, a0, reset);
}

uint8_t U8GLIB::initI2C(u8g_dev_t *dev, uint8_t options)
{
  prepare();
  return u8g_InitI2C(&u8g, dev, options);
}

uint8_t U8GLIB::init8Bit(u8g_dev_t *dev, uint8_t d0, uint8_t d1, uint8_t d2, uint8_t d3, uint8_t d4, uint8_t d5, uint8_t d6, uint8_t d7, 
    uint8_t en, uint8_t cs1, uint8_t cs2, uint8_t di, uint8_t rw, uint8_t reset)
{
  prepare();
  return u8g_Init8Bit(&u8g, dev, d0, d1, d2, d3, d4, d5, d6, d7, en, cs1, cs2, di, rw, reset); 
}

uint8_t U8GLIB::init8BitFixedPort(u8g_dev_t *dev, uint8_t en, uint8_t cs, uint8_t di, uint8_t rw, uint8_t reset)
{
  prepare();
  return u8g_Init8BitFixedPort(&u8g, dev, en, cs, di, rw, reset);
}

uint8_t U8GLIB::initRW8Bit(u8g_dev_t *dev, uint8_t d0, uint8_t d1, uint8_t d2, uint8_t d3, uint8_t d4, uint8_t d5, uint8_t d6, uint8_t d7, 
    uint8_t cs, uint8_t a0, uint8_t wr, uint8_t rd, uint8_t reset)
{
  prepare();
  return u8g_InitRW8Bit(&u8g, dev, d0, d1, d2, d3, d4, d5, d6, d7, cs, a0, wr, rd, reset); 
}
#endif


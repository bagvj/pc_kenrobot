 /**
 * \著作权 
 * @名称：  uper_U8lib.cpp
 * @作者：  uper
 * @版本：  v171213
 * @URL:    http://www.uper.cc
 * @维护：  uper
 * @时间：  2017/12/13
 *
 * \说明
 * OLED屏幕驱动
 *
 * \公有方法列表
 * 
 *  1.  void firstPage(void)  //开始显示图像
 *  2.  uint8_t nextPage(void)  //图像显示结束
 *  3.  void drawLine(u8g_uint_t x1, u8g_uint_t y1, u8g_uint_t x2, u8g_uint_t y2) //画直线
 *  4.  void drawTriangle(uint16_t x0, uint16_t y0, uint16_t x1, uint16_t y1, uint16_t x2, uint16_t y2)     //画实心三角形
 *  5.  void drawFrame(u8g_uint_t x, u8g_uint_t y, u8g_uint_t w, u8g_uint_t h)  //画空心矩形
 *  6.  void drawRFrame(u8g_uint_t x, u8g_uint_t y, u8g_uint_t w, u8g_uint_t h, u8g_uint_t r)   //画空心圆角矩形
 *  7.  void drawBox(u8g_uint_t x, u8g_uint_t y, u8g_uint_t w, u8g_uint_t h)  //画实心矩形
 *  8.  void drawRBox(u8g_uint_t x, u8g_uint_t y, u8g_uint_t w, u8g_uint_t h, u8g_uint_t r)   //画实心圆角矩形
 *  9.  void drawCircle(u8g_uint_t x0, u8g_uint_t y0, u8g_uint_t rad, uint8_t opt = U8G_DRAW_ALL)         //画空心圆
 *  10. void drawDisc(u8g_uint_t x0, u8g_uint_t y0, u8g_uint_t rad, uint8_t opt = U8G_DRAW_ALL) //画实心圆
 *  11. void setFont(const u8g_fntpgm_uint8_t *font)        //设置字体
 *  12. void undoRotation(void) 或 void setRot90(void) 或 void setRot180(void) void setRot270(void) //设置显示方向0/09/180/270
 *  13. u8g_uint_t drawStr(u8g_uint_t x, u8g_uint_t y, const char *s)   //显示字符串
 *  14. void setPrintPos(u8g_uint_t x, u8g_uint_t y)        //设置下文 print()函数的显示位置
 *  15. size_t print()  //打印内容，使用方式和 串口Serial 使用方式一样了。
 *  16. void drawXBMP(u8g_uint_t x, u8g_uint_t y, u8g_uint_t w, u8g_uint_t h, const u8g_pgm_uint8_t *bitmap) //显示图片，数据为BMP图片数据
 *  17. 更多函数和示例参见示例。
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  
 * \示例
 *  
 *    1.uper_OLED_display.ino
 */
#include "uper_U8glib.h"



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



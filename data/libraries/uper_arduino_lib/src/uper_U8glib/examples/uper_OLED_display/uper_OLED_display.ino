#include "uper_U8glib.h"
U8GLIB_SSD1306_128X64 u8g(U8G_I2C_OPT_NONE);

//将数字转换成字符串的函数
char* items="0";  //实例一个0
char* itostr(char *str, int i)
     {
        sprintf(str, "%d", i);
         return str;
 }

void setup()
{
  static unsigned char u8g_logo_bits[] U8G_PROGMEM = {};
}

void loop()
{
  u8g.firstPage(); //开始显示图像
  do{
  //设置字体大小
  //可设置字体大小，暂时不需要加  9号到30号  可以加到下拉列表中  变量分别是 u8g_font_gdr9r ——  u8g_font_gdr30r
  u8g.setFont(u8g_font_gdr25r);
  itostr(items,9);        //示例数字转换成字符串
  //drawStr可以直接显示字符，但是不能直接显示数字  需要转换一下
  //三个参数：  x值  y值    字符串
  //x  y定位字符显示的位置
    u8g.drawStr(10,10,items);   
  }
  while( u8g.nextPage() );
  delay(500);

}

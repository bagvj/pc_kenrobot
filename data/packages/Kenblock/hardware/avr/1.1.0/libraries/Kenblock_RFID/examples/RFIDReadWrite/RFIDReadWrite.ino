/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  MotorTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/08/21
 * @描述：  RFID射频模块 读取数据和写入数据 测试。
 * 
 * \说明
 *  RFID 读取卡片ID，测试读取数据和写入数据功能是否正常。
 * 
 * \函数列表
 *  	1. void RFID::init(int16_t speed);
 *  	2. unsigned char RFID::findCard(unsigned char reqMode, unsigned char *TagType);
 *  	3. unsigned char RFID::anticoll(unsigned char *serNum);
 *  	4. unsigned char RFID::selectTag(unsigned char *serNum);
 *  	5. void RFID::halt(void);
 *  	6. bool RFID::writeCard(int blockAddr, unsigned char *writeDate);
 *  	7. bool RFID::readCard(int blockAddr, unsigned char *readDate);
 *  	8. unsigned char RFID::str[MAX_LEN]; 
 *  
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/08/21      0.1.0              新建程序。
 *  
 */
#include <SPI.h>
#include "Kenblock_RFID.h"

//射频模块引脚功能设置10：SDA引脚、3：RST复位引脚
RFID rfid(10,3);   

unsigned char writeDate[16]={           //写入数据为：RFID W/R Test
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 0};
  
unsigned char readDate[16]={0} ;        //读取的数据

void setup()
{
  Serial.begin(9600); //初始化串口，波特率为9600
  SPI.begin();        //SPI初始化，
  rfid.init();        //射频模块初始化
}

void loop()
{
  rfid.findCard(PICC_REQIDL,rfid.str);  //找卡
  //防冲突检测,读取卡序列号
  if (rfid.anticoll(rfid.str) == MI_OK)
  {
    Serial.print("The card's number is  : ");
    for(int i = 0; i < 4; i++)          //显示卡序列号
    {
      Serial.print(0x0F & (rfid.str[i] >> 4),HEX);
      Serial.print(0x0F & rfid.str[i],HEX);
    }
    Serial.println("");
    memcpy(rfid.serNum,rfid.str,5);
  }
  //选卡，返回卡容量（锁定卡片，防止多次读写）
  rfid.selectTag(rfid.serNum);	
  if( rfid.writeCard(4,writeDate))	//向卡数据块4中写数据（16字节内）
  {
    Serial.println("Write card OK!");
  }
  if(rfid.readCard(4,readDate))		  //读数据块4中的数据 
  {
    Serial.println("Read card OK!");
    Serial.print("The data is : ");
    Serial.println((char *)readDate);
  }	
  rfid.halt();
} 
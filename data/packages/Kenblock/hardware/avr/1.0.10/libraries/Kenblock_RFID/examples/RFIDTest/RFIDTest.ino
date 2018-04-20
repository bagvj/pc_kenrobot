/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  MotorTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/08/21
 * @描述：  RFID射频模块测试示例。
 *
 * \说明
 * RFID射频模块测试示例。读取卡片的类型和ID。
 * 使用RC522芯片，工作频率为 13.56MHZ。
 *
 * \函数列表
 * 1. void RFID::init(int16_t speed);
 * 2. unsigned char RFID::findCard(unsigned char reqMode, unsigned char *TagType);
 * 3. unsigned char RFID::anticoll(unsigned char *serNum);
 * 4. unsigned char RFID::selectTag(unsigned char *serNum);
 * 5. void RFID::halt(void);
 * 6. unsigned char RFID::str[MAX_LEN]; 
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
  
void setup()
{
    Serial.begin(9600); //初始化串口，波特率为9600
    SPI.begin();        //SPI初始化，
    rfid.init();        //射频模块初始化
}

void loop()
{
    //寻找卡片，若找到返回卡片类型
    if (rfid.findCard(PICC_REQIDL, rfid.str) == MI_OK) 
    {
        Serial.println("Find the card!");
        ShowCardType(rfid.str);
        //防冲突检测,读取卡序列号
        if (rfid.anticoll(rfid.str) == MI_OK) 
        {
            Serial.print("The card's number is  : ");
            //显示卡序列号
            for(int i = 0; i < 4; i++)
            {
                Serial.print(0x0F & (rfid.str[i] >> 4),HEX);
                Serial.print(0x0F & rfid.str[i],HEX);
            }
            Serial.println("");
        }
        //选卡（锁定卡片，防止多数读取，去掉本行将连续读卡）
        rfid.selectTag(rfid.str);
    }
    rfid.halt();  //命令卡片进入休眠状态
}

void ShowCardType(unsigned char * type) //串口显示卡片类型
{
    Serial.print("Card type: ");
    if(type[0]==0x04&&type[1]==0x00)      Serial.println("MFOne-S50");
    else if(type[0]==0x02&&type[1]==0x00) Serial.println("MFOne-S70");
    else if(type[0]==0x44&&type[1]==0x00) Serial.println("MF-UltraLight");
    else if(type[0]==0x08&&type[1]==0x00) Serial.println("MF-Pro");
    else if(type[0]==0x44&&type[1]==0x03) Serial.println("MF Desire");
    else                                  Serial.println("Unknown");
}

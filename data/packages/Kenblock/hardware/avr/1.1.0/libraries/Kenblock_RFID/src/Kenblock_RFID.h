 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_RFID.cpp
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/08/21
 * @描述：  RFID射频模块驱动函数，Kenblock_RFID.c 的头文件。
 *
 * \说明
 * RFID射频模块的驱动函数。使用RC522芯片，工作频率为 13.56MHZ。
 *
 * \方法列表
 *  	1.RFID(void);
 *  	2.RFID(int chipSelectPin, int Reset);
 *		3.unsigned char serNum[5];       // 4字节卡序列号，第5字节为校验字节
 *		4.void init();
 *		5.void reset();
 *		6.void setBitMask(unsigned char reg, unsigned char mask);
 *		7.void clearBitMask(unsigned char reg, unsigned char mask);
 *		8.void antennaOn(void);
 *		9.void antennaOff(void);
 *		10.void calculateCRC(unsigned char *pIndata, unsigned char len, unsigned char *pOutData);
 *		11.void writeMFRC522(unsigned char addr, unsigned char val);
 *		12.unsigned char readMFRC522(unsigned char addr);
 *		13.unsigned char findCard(unsigned char reqMode, unsigned char *TagType);
 *		14.unsigned char MFRC522ToCard(unsigned char command, unsigned char *sendData, unsigned char sendLen, unsigned char *backData, unsigned int *backLen);
 *		15.unsigned char anticoll(unsigned char *serNum);
 *		16.unsigned char auth(unsigned char authMode, unsigned char BlockAddr, unsigned char *Sectorkey, unsigned char *serNum);
 *		17.unsigned char read(unsigned char blockAddr, unsigned char *recvData);
 *		18.unsigned char write(unsigned char blockAddr, unsigned char *writeData);
 *		19.unsigned char selectTag(unsigned char *serNum);
 *		20.void halt(void);
 *		21.bool writeCard(int blockAddr, unsigned char *writeDate);
 *		22.bool writeCard(int blockAddr, unsigned char *writeDate);
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  King           2017/08/21      0.1.0              新建库文件。
 *  
 * \实例
 *  
 */

#ifndef Kenblock_RFID_h
#define Kenblock_RFID_h

#include <Arduino.h>
#include <SPI.h>

#define MAX_LEN 16   // 数组最大长度

//RC522命令字
#define PCD_IDLE              0x00               //无动作，取消当前命令
#define PCD_AUTHENT           0x0E               //验证密钥
#define PCD_RECEIVE           0x08               //接收数据
#define PCD_TRANSMIT          0x04               //发送数据
#define PCD_TRANSCEIVE        0x0C               //发送并接收数据
#define PCD_RESETPHASE        0x0F               //复位
#define PCD_CALCCRC           0x03               //CRC计算

//Mifare_One卡片命令字
#define PICC_REQIDL           0x26               //寻天线区内未进入休眠状态
#define PICC_REQALL           0x52               //寻天线区内全部卡
#define PICC_ANTICOLL         0x93               //防冲撞
#define PICC_SElECTTAG        0x93               //选卡
#define PICC_AUTHENT1A        0x60               //验证A密钥
#define PICC_AUTHENT1B        0x61               //验证B密钥
#define PICC_READ             0x30               //读块
#define PICC_WRITE            0xA0               //写块
#define PICC_DECREMENT        0xC0               
#define PICC_INCREMENT        0xC1               
#define PICC_RESTORE          0xC2               //调块数据到缓冲区
#define PICC_TRANSFER         0xB0               //保存缓冲区中数据
#define PICC_HALT             0x50               //休眠
 
//和RC522通讯时返回的错误代码
#define MI_OK                 0
#define MI_NOTAGERR           1
#define MI_ERR                2


//------------------RC522寄存器---------------
//命令和状态
#define     Reserved00            0x00    
#define     CommandReg            0x01    
#define     CommIEnReg            0x02    
#define     DivlEnReg             0x03    
#define     CommIrqReg            0x04    
#define     DivIrqReg             0x05
#define     ErrorReg              0x06    
#define     Status1Reg            0x07    
#define     Status2Reg            0x08    
#define     FIFODataReg           0x09
#define     FIFOLevelReg          0x0A
#define     WaterLevelReg         0x0B
#define     ControlReg            0x0C
#define     BitFramingReg         0x0D
#define     CollReg               0x0E
#define     Reserved01            0x0F
//命令
#define     Reserved10            0x10
#define     ModeReg               0x11
#define     TxModeReg             0x12
#define     RxModeReg             0x13
#define     TxControlReg          0x14
#define     TxAutoReg             0x15
#define     TxSelReg              0x16
#define     RxSelReg              0x17
#define     RxThresholdReg        0x18
#define     DemodReg              0x19
#define     Reserved11            0x1A
#define     Reserved12            0x1B
#define     MifareReg             0x1C
#define     Reserved13            0x1D
#define     Reserved14            0x1E
#define     SerialSpeedReg        0x1F
//CFG    
#define     Reserved20            0x20  
#define     CRCResultRegM         0x21
#define     CRCResultRegL         0x22
#define     Reserved21            0x23
#define     ModWidthReg           0x24
#define     Reserved22            0x25
#define     RFCfgReg              0x26
#define     GsNReg                0x27
#define     CWGsPReg              0x28
#define     ModGsPReg             0x29
#define     TModeReg              0x2A
#define     TPrescalerReg         0x2B
#define     TReloadRegH           0x2C
#define     TReloadRegL           0x2D
#define     TCounterValueRegH     0x2E
#define     TCounterValueRegL     0x2F
//测试寄存器
#define     Reserved30            0x30
#define     TestSel1Reg           0x31
#define     TestSel2Reg           0x32
#define     TestPinEnReg          0x33
#define     TestPinValueReg       0x34
#define     TestBusReg            0x35
#define     AutoTestReg           0x36
#define     VersionReg            0x37
#define     AnalogTestReg         0x38
#define     TestDAC1Reg           0x39  
#define     TestDAC2Reg           0x3A   
#define     TestADCReg            0x3B   
#define     Reserved31            0x3C   
#define     Reserved32            0x3D   
#define     Reserved33            0x3E   
#define     Reserved34            0x3F
//-----------------------------------------------

class RFID
{
  public:
  	unsigned char str[MAX_LEN]; 
    unsigned char serNum[5];       // 4字节卡序列号，第5字节为校验字节
	//unsigned char writeDate[16];
  
	//原扇区A密码，16个扇区，每个扇区密码6Byte
	unsigned char sectorKeyA[16][16] = {
	{  0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF  } ,
	{  0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF  } ,
	{  0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF  } ,
	{  0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF  } ,
	{  0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF  } ,
	{  0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF  } ,
    {  0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF  } ,
	{  0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF  } ,
	{  0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF  } ,
	{  0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF  } ,
	{  0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF  } ,
	{  0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF  } ,
	{  0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF  } ,
	{  0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF  } ,
	{  0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF  } ,
	{  0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF  } ,};

    
	/**
	 * \函数：RFID
	 * \说明：初始化，不做任何操作
	 * \输入参数：无
	 * \输出参数：无
	 * \返回值：无
	 * \其他：无
	 */
    RFID(void);
	
	/**
	 * \函数：RFID
	 * \说明：替代构造函数，映射RC522引脚设置函数
	 * \输入参数：
	 *   	ChipSelectPin - 从设备片选信号，由主设备控制。
	 *		Reset - 复位引脚
	 * \输出参数：无
	 * \返回值：无
	 * \其他：无
	 */ 
	RFID(int chipSelectPin, int Reset);
	
	/**
	 * \函数：init
	 * \说明：初始化RC522
	 * \输入参数：无
	 * \输出参数：无
	 * \返回值：无
	 * \其他：无
	 */ 	
	void init();
	
	/**
	 * \函数：reset
	 * \说明：复位RC522
	 * \输入参数：无
	 * \输出参数：无
	 * \返回值：无
	 * \其他：无
	 */  	
	void reset();
	
	/**
	 * \函数：setBitMask
	 * \说明：置RC522寄存器位
	 * \输入参数：
	 *		reg - 寄存器地址
	 *		mask - 置位值
	 * \输出参数：无
	 * \返回值：无
	 * \其他：无
	 */ 	
	void setBitMask(unsigned char reg, unsigned char mask);
	
	/**
	 * \函数：clearBitMask
	 * \说明：清RC522寄存器位
	 * \输入参数：
	 *		reg - 寄存器地址
	 *		mask - 清位值
	 * \输出参数：无
	 * \返回值：无
	 * \其他：无
	 */
	void clearBitMask(unsigned char reg, unsigned char mask);

	/**
	 * \函数：antennaOn
	 * \说明：开启天线,每次启动或关闭天线发射之间应至少有1ms的间隔
	 * \输入参数：无
	 * \输出参数：无
	 * \返回值：无
	 * \其他：无
	 */ 
	void antennaOn(void);
	
	/**
	 * \函数：antennaOff
	 * \说明：关闭天线,每次启动或关闭天险发射之间应至少有1ms的间隔
	 * \输入参数：无
	 * \输出参数：无
	 * \返回值：无
	 * \其他：无
	 */ 	
	void antennaOff(void);
	
	/**
	 * \函数：calculateCRC
	 * \说明：用522计算CRC
	 * \输入参数：
	 *		pIndata - 要读数CRC的数据
	 *		len - 数据长度
	 *		pOutData - 计算的CRC结果
	 * \输出参数：无
	 * \返回值：无
	 * \其他：无
	 */  	
	void calculateCRC(unsigned char *pIndata, unsigned char len, unsigned char *pOutData);

	/**
	 * \函数：writeRC522
	 * \说明：向RC522的某一寄存器写一个字节数据
	 * \输入参数：
	 *		addr - 寄存器地址
	 *		val - 要写入的值
	 * \输出参数：无
	 * \返回值：无
	 * \其他：无
	 */  	
	void writeRC522(unsigned char addr, unsigned char val);
	
	/**
	 * \函数：readRC522
	 * \说明：从RC522的某一寄存器读一个字节数据
	 * \输入参数：
	 *		addr - 寄存器地址
	 * \输出参数：无
	 * \返回值：
	 *		val - 读取到的一个字节数据
	 * \其他：无
	 */  	
	unsigned char readRC522(unsigned char addr);
	
	/**
	 * \函数：findCard
	 * \说明：寻卡，读取卡类型号
	 * \输入参数：
	 *		reqMode--寻卡方式，
	 *      TagType--返回卡片类型
	 *			0x4400 = Mifare_UltraLight
	 *          0x0400 = Mifare_One(S50)
	 *          0x0200 = Mifare_One(S70)
	 *          0x0800 = Mifare_Pro(X)
	 *          0x4403 = Mifare_DESFire
	 * \输出参数：
	 * \返回值：
	 *		status - MI_OK：正确；其他值均为错误
	 * \其他：无
	 */ 
	unsigned char findCard(unsigned char reqMode, unsigned char *TagType);

	/**
	 * \函数：RC522ToCard
	 * \说明：RC522和ISO14443卡通讯 （非接触式IC卡）
	 * \输入参数：
	 *		command - 	522命令字，
	 *      sendData - 	通过RC522发送到卡片的数据,
	 *      sendLen - 	发送的数据长度
	 *      backData - 	接收到的卡片返回数据，
	 *      backLen - 	返回数据的位长度	
	 * \输出参数：
	 * \返回值：
	 *		status - MI_OK：正确；其他值均为错误
	 * \其他：无
	 */
	unsigned char RC522ToCard(unsigned char command, unsigned char *sendData, unsigned char sendLen, unsigned char *backData, unsigned int *backLen);
	
	/**
	 * \函数：anticoll
	 * \说明：防冲突检测，读取选中卡片的卡序列号
	 * \输入参数：
	 *		serNum - 返回4字节卡序列号,第5字节为校验字节
	 * \输出参数：
	 * \返回值：
	 *		status - MI_OK：正确；其他值均为错误
	 * \其他：无
	 */  
	unsigned char anticoll(unsigned char *serNum);
	
	/**
	 * \函数：auth
	 * \说明：验证卡片密码
	 * \输入参数：
	 *		authMode - 密码验证模式，0x60：验证A密钥；0x61：验证B密钥
	 *		BlockAddr - 块地址
	 *      Sectorkey - 扇区密码
	 *      serNum - 卡片序列号，4字节
	 * \输出参数：
	 * \返回值：
	 *		status - MI_OK：正确；其他值均为错误
	 * \其他：无
	 */  
	unsigned char auth(unsigned char authMode, unsigned char BlockAddr, unsigned char *Sectorkey, unsigned char *serNum);
	
	/**
	 * \函数：read
	 * \说明：读块数据
	 * \输入参数：
	 *		BlockAddr - 块地址
	 *      recvData - 读出的块数据
	 * \输出参数：
	 * \返回值：
	 *		status - MI_OK：设置成功；其他值均为错误
	 * \其他：无
	 */  
	unsigned char read(unsigned char blockAddr, unsigned char *recvData);
	
	/**
	 * \函数：write
	 * \说明：写块数据
	 * \输入参数：
	 *		BlockAddr - 块地址
	 *      writeData - 向块内写16字节数据
	 * \输出参数：
	 * \返回值：
	 *		status - MI_OK：设置成功；其他值均为错误
	 * \其他：无
	 */
	unsigned char write(unsigned char blockAddr, unsigned char *writeData);
	
	/**
	 * \函数：selectTag
	 * \说明：选卡，读取卡存储器容量
	 * \输入参数：
	 *		serNum - 卡序列号
	 * \输出参数：
	 * \返回值：
	 *		size - 卡容量大小
	 * \其他：无
	 */ 
	unsigned char selectTag(unsigned char *serNum);
	
	/**
	 * \函数：halt
	 * \说明：命令卡片进入休眠状态
	 * \输入参数：无
	 * \输出参数：无
	 * \返回值：
	 * \其他：无
	 */  
	void halt();
	
	/**
	 * \函数：writeCard
	 * \说明：往指定块地址内写入数据，写入成功串口发送成功指令。
	 * \输入参数：
	 *		blockAddr - 块地址
	 *		writeDate - 写入的数据
	 * \输出参数：无
	 * \返回值：无
	 * \其他：写入成功串口发送 Write card OK!
	 */ 	
	bool writeCard(int blockAddr, unsigned char *writeDate);
	
	/**
	 * \函数：readCard
	 * \说明：读出指定块地址内的数据，串口发送读取到的数据
	 * \输入参数：
	 *		blockAddr - 块地址
	 *		readDate  - 读出的数据
	 * \输出参数：无
	 * \返回值：
	 * \其他：无
	*/ 
	bool readCard(int blockAddr, unsigned char *readDate);
	
  private:
	int _ChipSelectPin;
	int _Reset;
};

#endif //Kenblock_RFID_h
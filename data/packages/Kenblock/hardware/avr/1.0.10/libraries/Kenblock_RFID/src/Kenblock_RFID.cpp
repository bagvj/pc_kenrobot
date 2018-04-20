 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_RFID.cpp
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/08/21
 * @描述：  RFID射频模块驱动函数。
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

#include <Arduino.h>
#include <Kenblock_RFID.h>


/**
 * \函数：RFID
 * \说明：初始化，不做任何操作
 * \输入参数：无
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
RFID::RFID(void)
{
	
}
 
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
RFID::RFID(int ChipSelectPin, int Reset)
{
  _ChipSelectPin = ChipSelectPin;
  _Reset = Reset;

  pinMode(_ChipSelectPin,OUTPUT);     // 设置管脚ChipSelectPin为输出并连接到模块使能口
  digitalWrite(_ChipSelectPin, LOW);

  pinMode(_Reset,OUTPUT);            // 设置管脚Reset为输出，非重置或掉电
  digitalWrite(_Reset, HIGH);
}

/**
 * \函数：init
 * \说明：初始化RC522
 * \输入参数：无
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */ 
void RFID::init()
{
  digitalWrite(_Reset,HIGH);

  reset();

  //Timer: TPrescaler*TreloadVal/6.78MHz = 24ms
  writeRC522(TModeReg, 0x8D);   //Tauto=1; f(Timer) = 6.78MHz/TPreScaler
  writeRC522(TPrescalerReg, 0x3E);  //TModeReg[3..0] + TPrescalerReg
  writeRC522(TReloadRegL, 30);
  writeRC522(TReloadRegH, 0);
  writeRC522(TxAutoReg, 0x40);    //100%ASK
  writeRC522(ModeReg, 0x3D);    // CRC valor inicial de 0x6363

  antennaOn();    //打开天线
}
 
/**
 * \函数：reset
 * \说明：复位RC522
 * \输入参数：无
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */  
void RFID::reset()
{
  writeRC522(CommandReg, PCD_RESETPHASE);
}

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
void RFID::writeRC522(unsigned char addr, unsigned char val)
{
  digitalWrite(_ChipSelectPin, LOW);

  //地址格式：0XXXXXX0
  SPI.transfer((addr<<1)&0x7E);
  SPI.transfer(val);

  digitalWrite(_ChipSelectPin, HIGH);
}

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
unsigned char RFID::readRC522(unsigned char addr)
{
  unsigned char val;
  digitalWrite(_ChipSelectPin, LOW);
  SPI.transfer(((addr<<1)&0x7E) | 0x80);
  val =SPI.transfer(0x00);
  digitalWrite(_ChipSelectPin, HIGH);
  return val;
}

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
void RFID::setBitMask(unsigned char reg, unsigned char mask)
{
  unsigned char tmp;
  tmp = readRC522(reg);
  writeRC522(reg, tmp | mask);  // set bit mask
}

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
void RFID::clearBitMask(unsigned char reg, unsigned char mask)
{
  unsigned char tmp;
  tmp = readRC522(reg);
  writeRC522(reg, tmp & (~mask));  // clear bit mask
}

/**
 * \函数：antennaOn
 * \说明：开启天线,每次启动或关闭天险发射之间应至少有1ms的间隔
 * \输入参数：无
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */ 
void RFID::antennaOn(void)
{
  unsigned char temp;
  temp = readRC522(TxControlReg);
  if (!(temp & 0x03))
  {
    setBitMask(TxControlReg, 0x03);
  }
}

/**
 * \函数：antennaOff
 * \说明：关闭天线,每次启动或关闭天险发射之间应至少有1ms的间隔
 * \输入参数：无
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */ 
void RFID::antennaOff(void)
{
  unsigned char temp;
  temp = readRC522(TxControlReg);
  if (!(temp & 0x03))
  {
    clearBitMask(TxControlReg, 0x03);
  }
}
 
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
void RFID::calculateCRC(unsigned char *pIndata, unsigned char len, unsigned char *pOutData)
{
  unsigned char i, n;

  clearBitMask(DivIrqReg, 0x04);      //CRCIrq = 0
  setBitMask(FIFOLevelReg, 0x80);     //清FIFO指针

  //向FIFO中写入数据
  for (i=0; i<len; i++)
    writeRC522(FIFODataReg, *(pIndata+i));
  writeRC522(CommandReg, PCD_CALCCRC);

  //等待CRC计算完成
  i = 0xFF;
  do
  {
    n = readRC522(DivIrqReg);
    i--;
  }
  while ((i!=0) && !(n&0x04));      //CRCIrq = 1

  //读取CRC计算结果
  pOutData[0] = readRC522(CRCResultRegL);
  pOutData[1] = readRC522(CRCResultRegM);
}

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
unsigned char RFID::RC522ToCard(unsigned char command, unsigned char *sendData, unsigned char sendLen, unsigned char *backData, unsigned int *backLen)
{
  unsigned char status = MI_ERR;
  unsigned char irqEn = 0x00;
  unsigned char waitIRq = 0x00;
  unsigned char lastBits;
  unsigned char n;
  unsigned int i;

  switch (command)
  {
    case PCD_AUTHENT:   //认证卡密
    {
      irqEn = 0x12;
      waitIRq = 0x10;
      break;
    }
    case PCD_TRANSCEIVE:  //发送FIFO中数据
    {
      irqEn = 0x77;
      waitIRq = 0x30;
      break;
    }
    default:
      break;
  }

  writeRC522(CommIEnReg, irqEn|0x80); //允许中断请求
  clearBitMask(CommIrqReg, 0x80);       //清除所有中断请求位
  setBitMask(FIFOLevelReg, 0x80);       //FlushBuffer=1, FIFO初始化

  writeRC522(CommandReg, PCD_IDLE);   //无动作，取消当前命令

  //向FIFO中写入数据
  for (i=0; i<sendLen; i++)
    writeRC522(FIFODataReg, sendData[i]);

  //执行命令
  writeRC522(CommandReg, command);
  if (command == PCD_TRANSCEIVE)
    setBitMask(BitFramingReg, 0x80);    //StartSend=1,transmission of data starts

  //等待接收数据完成
  i = 2000; //i根据时钟频率调整，操作M1卡最大等待时间25ms
  do
  {
    //CommIrqReg[7..0]
    n = readRC522(CommIrqReg);
    i--;
  }
  while ((i!=0) && !(n&0x01) && !(n&waitIRq));

  clearBitMask(BitFramingReg, 0x80);      //StartSend=0

  if (i != 0)
  {
    if(!(readRC522(ErrorReg) & 0x1B)) //BufferOvfl Collerr CRCErr ProtecolErr
    {
      status = MI_OK;
      if (n & irqEn & 0x01)
        status = MI_NOTAGERR;     

      if (command == PCD_TRANSCEIVE)
      {
        n = readRC522(FIFOLevelReg);
        lastBits = readRC522(ControlReg) & 0x07;
        if (lastBits)
          *backLen = (n-1)*8 + lastBits;
        else
          *backLen = n*8;

        if (n == 0)n = 1;
        if (n > MAX_LEN)n = MAX_LEN;

        //读取FIFO中接收到的数据
        for (i=0; i<n; i++)
          backData[i] = readRC522(FIFODataReg);
      }
    }
    else
      status = MI_ERR;
  }
  return status;
}
 
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
unsigned char RFID::findCard(unsigned char reqMode, unsigned char *TagType)
{
  unsigned char status;
  unsigned int backBits;      //接收到的数据位数

  writeRC522(BitFramingReg, 0x07);    //TxLastBists = BitFramingReg[2..0] ???

  TagType[0] = reqMode;
  status = RC522ToCard(PCD_TRANSCEIVE, TagType, 1, TagType, &backBits);

  if ((status != MI_OK) || (backBits != 0x10))
    status = MI_ERR;

  return status;
}

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
unsigned char RFID::anticoll(unsigned char *serNum)
{
  unsigned char status;
  unsigned char i;
  unsigned char serNumCheck=0;
  unsigned int unLen;

  clearBitMask(Status2Reg, 0x08);   //TempSensclear
  clearBitMask(CollReg,0x80);     //ValuesAfterColl
  writeRC522(BitFramingReg, 0x00);    //TxLastBists = BitFramingReg[2..0]

  serNum[0] = PICC_ANTICOLL;
  serNum[1] = 0x20;

  status = RC522ToCard(PCD_TRANSCEIVE, serNum, 2, serNum, &unLen);

  if (status == MI_OK)
  {
    //校验卡序列号
	for (i=0; i<4; i++){
	  *(serNum+i)  = serNum[i];
      serNumCheck ^= serNum[i];
	}
    if (serNumCheck != serNum[i]){
      status = MI_ERR;
	}
  }

  setBitMask(CollReg, 0x80);    //ValuesAfterColl=1
  return status;
}
 
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
unsigned char RFID::auth(unsigned char authMode, unsigned char BlockAddr, unsigned char *Sectorkey, unsigned char *serNum)
{
  unsigned char status;
  unsigned int recvBits;
  unsigned char i;
  unsigned char buff[12];

  //验证指令+块地址＋扇区密码＋卡序列号
  buff[0] = authMode;
  buff[1] = BlockAddr;
  for (i=0; i<6; i++)
    buff[i+2] = *(Sectorkey+i);
  for (i=0; i<4; i++)
    buff[i+8] = *(serNum+i);
    
  status = RC522ToCard(PCD_AUTHENT, buff, 12, buff, &recvBits);
  if ((status != MI_OK) || (!(readRC522(Status2Reg) & 0x08)))
    status = MI_ERR;

  return status;
}
 
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
unsigned char RFID::read(unsigned char blockAddr, unsigned char *recvData)
{
  unsigned char status;
  unsigned int unLen;

  recvData[0] = PICC_READ;
  recvData[1] = blockAddr;
  calculateCRC(recvData,2, &recvData[2]);
  status = RC522ToCard(PCD_TRANSCEIVE, recvData, 4, recvData, &unLen);

  if ((status != MI_OK) || (unLen != 0x90))
    status = MI_ERR;

  return status;
}
 
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
unsigned char RFID::write(unsigned char blockAddr, unsigned char *writeData)
{
  unsigned char status;
  unsigned int recvBits;
  unsigned char i;
  unsigned char buff[18];

  buff[0] = PICC_WRITE;
  buff[1] = blockAddr;
  calculateCRC(buff, 2, &buff[2]);
  status = RC522ToCard(PCD_TRANSCEIVE, buff, 4, buff, &recvBits);

  if ((status != MI_OK) || (recvBits != 4) || ((buff[0] & 0x0F) != 0x0A))
    status = MI_ERR;

  if (status == MI_OK)
  {
    for (i=0; i<16; i++)    //?FIFO?16Byte?? Datos a la FIFO 16Byte escribir
      buff[i] = *(writeData+i);
      
    calculateCRC(buff, 16, &buff[16]);
    status = RC522ToCard(PCD_TRANSCEIVE, buff, 18, buff, &recvBits);

    if ((status != MI_OK) || (recvBits != 4) || ((buff[0] & 0x0F) != 0x0A))
      status = MI_ERR;
  }
  return status;
}
 
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
unsigned char RFID::selectTag(unsigned char *serNum)
{
  unsigned char i;
  unsigned char status;
  unsigned char size;
  unsigned int recvBits;
  unsigned char buffer[9];

  buffer[0] = PICC_SElECTTAG;
  buffer[1] = 0x70;

  for (i=0; i<5; i++)
    buffer[i+2] = *(serNum+i);

  calculateCRC(buffer, 7, &buffer[7]);
  
  status = RC522ToCard(PCD_TRANSCEIVE, buffer, 9, buffer, &recvBits);
  if ((status == MI_OK) && (recvBits == 0x18))
    size = buffer[i];
  else
    size = 0;
  return size;
}
 
/**
 * \函数：halt
 * \说明：命令卡片进入休眠状态
 * \输入参数：无
 * \输出参数：无
 * \返回值：
 * \其他：无
 */  
void RFID::halt()
{
  unsigned char status;
  unsigned int unLen;
  unsigned char buff[4];

  buff[0] = PICC_HALT;
  buff[1] = 0;
  calculateCRC(buff, 2, &buff[2]);

  status = RC522ToCard(PCD_TRANSCEIVE, buff, 4, buff,&unLen);
}

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
bool RFID::writeCard(int blockAddr, unsigned char *writeDate)
{
    if (auth(PICC_AUTHENT1A, blockAddr, sectorKeyA[blockAddr/4],serNum) == MI_OK)  //认证
    {
        //选择扇区中的块写数据并判断写数据是否完成
        if(write(blockAddr, writeDate) == MI_OK)
        {
			return true;
        }
    }
	return false;
}

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
bool RFID::readCard(int blockAddr, unsigned char *readDate)
{
    if (auth(PICC_AUTHENT1A, blockAddr, sectorKeyA[blockAddr/4],serNum) == MI_OK)  //认证
    {
        //选择扇区中的块读数据
        // Serial.print("Read from the blockAddr of the card : ");
        // Serial.println(blockAddr,DEC);
        if(read(blockAddr, readDate) == MI_OK)
        {
            return true;
        }
    }
	return false;
}
 /**
 * \����Ȩ Copyright (C), 2016-2020, LZRobot
 * @���ƣ�  Kenblock_RFID.cpp
 * @���ߣ�  Kenblock
 * @�汾��  V0.1.0
 * @ʱ�䣺  2017/08/21
 * @������  RFID��Ƶģ������������
 *
 * \˵��
 * RFID��Ƶģ�������������ʹ��RC522оƬ������Ƶ��Ϊ 13.56MHZ��
 *
 * \�����б�
 *  	1.RFID(void);
 *  	2.RFID(int chipSelectPin, int Reset);
 *		3.unsigned char serNum[5];       // 4�ֽڿ����кţ���5�ֽ�ΪУ���ֽ�
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
 * \�޶���ʷ
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  King           2017/08/21      0.1.0              �½����ļ���
 *  
 * \ʵ��
 *  
 */

#include <Arduino.h>
#include <Kenblock_RFID.h>


/**
 * \������RFID
 * \˵������ʼ���������κβ���
 * \�����������
 * \�����������
 * \����ֵ����
 * \��������
 */
RFID::RFID(void)
{
	
}
 
/**
 * \������RFID
 * \˵����������캯����ӳ��RC522�������ú���
 * \���������
 *   	ChipSelectPin - ���豸Ƭѡ�źţ������豸���ơ�
 *		Reset - ��λ����
 * \�����������
 * \����ֵ����
 * \��������
 */ 
RFID::RFID(int ChipSelectPin, int Reset)
{
  _ChipSelectPin = ChipSelectPin;
  _Reset = Reset;

  pinMode(_ChipSelectPin,OUTPUT);     // ���ùܽ�ChipSelectPinΪ��������ӵ�ģ��ʹ�ܿ�
  digitalWrite(_ChipSelectPin, LOW);

  pinMode(_Reset,OUTPUT);            // ���ùܽ�ResetΪ����������û����
  digitalWrite(_Reset, HIGH);
}

/**
 * \������init
 * \˵������ʼ��RC522
 * \�����������
 * \�����������
 * \����ֵ����
 * \��������
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

  antennaOn();    //������
}
 
/**
 * \������reset
 * \˵������λRC522
 * \�����������
 * \�����������
 * \����ֵ����
 * \��������
 */  
void RFID::reset()
{
  writeRC522(CommandReg, PCD_RESETPHASE);
}

/**
 * \������writeRC522
 * \˵������RC522��ĳһ�Ĵ���дһ���ֽ�����
 * \���������
 *		addr - �Ĵ�����ַ
 *		val - Ҫд���ֵ
 * \�����������
 * \����ֵ����
 * \��������
 */  
void RFID::writeRC522(unsigned char addr, unsigned char val)
{
  digitalWrite(_ChipSelectPin, LOW);

  //��ַ��ʽ��0XXXXXX0
  SPI.transfer((addr<<1)&0x7E);
  SPI.transfer(val);

  digitalWrite(_ChipSelectPin, HIGH);
}

/**
 * \������readRC522
 * \˵������RC522��ĳһ�Ĵ�����һ���ֽ�����
 * \���������
 *		addr - �Ĵ�����ַ
 * \�����������
 * \����ֵ��
 *		val - ��ȡ����һ���ֽ�����
 * \��������
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
 * \������setBitMask
 * \˵������RC522�Ĵ���λ
 * \���������
 *		reg - �Ĵ�����ַ
 *		mask - ��λֵ
 * \�����������
 * \����ֵ����
 * \��������
 */    
void RFID::setBitMask(unsigned char reg, unsigned char mask)
{
  unsigned char tmp;
  tmp = readRC522(reg);
  writeRC522(reg, tmp | mask);  // set bit mask
}

/**
 * \������clearBitMask
 * \˵������RC522�Ĵ���λ
 * \���������
 *		reg - �Ĵ�����ַ
 *		mask - ��λֵ
 * \�����������
 * \����ֵ����
 * \��������
 */
void RFID::clearBitMask(unsigned char reg, unsigned char mask)
{
  unsigned char tmp;
  tmp = readRC522(reg);
  writeRC522(reg, tmp & (~mask));  // clear bit mask
}

/**
 * \������antennaOn
 * \˵������������,ÿ��������ر����շ���֮��Ӧ������1ms�ļ��
 * \�����������
 * \�����������
 * \����ֵ����
 * \��������
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
 * \������antennaOff
 * \˵�����ر�����,ÿ��������ر����շ���֮��Ӧ������1ms�ļ��
 * \�����������
 * \�����������
 * \����ֵ����
 * \��������
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
 * \������calculateCRC
 * \˵������522����CRC
 * \���������
 *		pIndata - Ҫ����CRC������
 *		len - ���ݳ���
 *		pOutData - �����CRC���
 * \�����������
 * \����ֵ����
 * \��������
 */  
void RFID::calculateCRC(unsigned char *pIndata, unsigned char len, unsigned char *pOutData)
{
  unsigned char i, n;

  clearBitMask(DivIrqReg, 0x04);      //CRCIrq = 0
  setBitMask(FIFOLevelReg, 0x80);     //��FIFOָ��

  //��FIFO��д������
  for (i=0; i<len; i++)
    writeRC522(FIFODataReg, *(pIndata+i));
  writeRC522(CommandReg, PCD_CALCCRC);

  //�ȴ�CRC�������
  i = 0xFF;
  do
  {
    n = readRC522(DivIrqReg);
    i--;
  }
  while ((i!=0) && !(n&0x04));      //CRCIrq = 1

  //��ȡCRC������
  pOutData[0] = readRC522(CRCResultRegL);
  pOutData[1] = readRC522(CRCResultRegM);
}

/**
 * \������RC522ToCard
 * \˵����RC522��ISO14443��ͨѶ ���ǽӴ�ʽIC����
 * \���������
 *		command - 	522�����֣�
 *      sendData - 	ͨ��RC522���͵���Ƭ������,
 *      sendLen - 	���͵����ݳ���
 *      backData - 	���յ��Ŀ�Ƭ�������ݣ�
 *      backLen - 	�������ݵ�λ����	
 * \���������
 * \����ֵ��
 *		status - MI_OK����ȷ������ֵ��Ϊ����
 * \��������
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
    case PCD_AUTHENT:   //��֤����
    {
      irqEn = 0x12;
      waitIRq = 0x10;
      break;
    }
    case PCD_TRANSCEIVE:  //����FIFO������
    {
      irqEn = 0x77;
      waitIRq = 0x30;
      break;
    }
    default:
      break;
  }

  writeRC522(CommIEnReg, irqEn|0x80); //�����ж�����
  clearBitMask(CommIrqReg, 0x80);       //��������ж�����λ
  setBitMask(FIFOLevelReg, 0x80);       //FlushBuffer=1, FIFO��ʼ��

  writeRC522(CommandReg, PCD_IDLE);   //�޶�����ȡ����ǰ����

  //��FIFO��д������
  for (i=0; i<sendLen; i++)
    writeRC522(FIFODataReg, sendData[i]);

  //ִ������
  writeRC522(CommandReg, command);
  if (command == PCD_TRANSCEIVE)
    setBitMask(BitFramingReg, 0x80);    //StartSend=1,transmission of data starts

  //�ȴ������������
  i = 2000; //i����ʱ��Ƶ�ʵ���������M1�����ȴ�ʱ��25ms
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

        //��ȡFIFO�н��յ�������
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
 * \������findCard
 * \˵����Ѱ������ȡ�����ͺ�
 * \���������
 *		reqMode--Ѱ����ʽ��
 *      TagType--���ؿ�Ƭ����
 *			0x4400 = Mifare_UltraLight
 *          0x0400 = Mifare_One(S50)
 *          0x0200 = Mifare_One(S70)
 *          0x0800 = Mifare_Pro(X)
 *          0x4403 = Mifare_DESFire
 * \���������
 * \����ֵ��
 *		status - MI_OK����ȷ������ֵ��Ϊ����
 * \��������
 */ 
unsigned char RFID::findCard(unsigned char reqMode, unsigned char *TagType)
{
  unsigned char status;
  unsigned int backBits;      //���յ�������λ��

  writeRC522(BitFramingReg, 0x07);    //TxLastBists = BitFramingReg[2..0] ???

  TagType[0] = reqMode;
  status = RC522ToCard(PCD_TRANSCEIVE, TagType, 1, TagType, &backBits);

  if ((status != MI_OK) || (backBits != 0x10))
    status = MI_ERR;

  return status;
}

/**
 * \������anticoll
 * \˵��������ͻ��⣬��ȡѡ�п�Ƭ�Ŀ����к�
 * \���������
 *		serNum - ����4�ֽڿ����к�,��5�ֽ�ΪУ���ֽ�
 * \���������
 * \����ֵ��
 *		status - MI_OK����ȷ������ֵ��Ϊ����
 * \��������
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
    //У�鿨���к�
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
 * \������auth
 * \˵������֤��Ƭ����
 * \���������
 *		authMode - ������֤ģʽ��0x60����֤A��Կ��0x61����֤B��Կ
 *		BlockAddr - ���ַ
 *      Sectorkey - ��������
 *      serNum - ��Ƭ���кţ�4�ֽ�
 * \���������
 * \����ֵ��
 *		status - MI_OK����ȷ������ֵ��Ϊ����
 * \��������
 */  
unsigned char RFID::auth(unsigned char authMode, unsigned char BlockAddr, unsigned char *Sectorkey, unsigned char *serNum)
{
  unsigned char status;
  unsigned int recvBits;
  unsigned char i;
  unsigned char buff[12];

  //��ָ֤��+���ַ���������룫�����к�
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
 * \������read
 * \˵������������
 * \���������
 *		BlockAddr - ���ַ
 *      recvData - �����Ŀ�����
 * \���������
 * \����ֵ��
 *		status - MI_OK�����óɹ�������ֵ��Ϊ����
 * \��������
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
 * \������write
 * \˵����д������
 * \���������
 *		BlockAddr - ���ַ
 *      writeData - �����д16�ֽ�����
 * \���������
 * \����ֵ��
 *		status - MI_OK�����óɹ�������ֵ��Ϊ����
 * \��������
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
 * \������selectTag
 * \˵����ѡ������ȡ���洢������
 * \���������
 *		serNum - �����к�
 * \���������
 * \����ֵ��
 *		size - ��������С
 * \��������
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
 * \������halt
 * \˵�������Ƭ��������״̬
 * \�����������
 * \�����������
 * \����ֵ��
 * \��������
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
 * \������writeCard
 * \˵������ָ�����ַ��д�����ݣ�д��ɹ����ڷ��ͳɹ�ָ�
 * \���������
 *		blockAddr - ���ַ
 *		writeDate - д�������
 * \�����������
 * \����ֵ����
 * \������д��ɹ����ڷ��� Write card OK!
 */ 
bool RFID::writeCard(int blockAddr, unsigned char *writeDate)
{
    if (auth(PICC_AUTHENT1A, blockAddr, sectorKeyA[blockAddr/4],serNum) == MI_OK)  //��֤
    {
        //ѡ�������еĿ�д���ݲ��ж�д�����Ƿ����
        if(write(blockAddr, writeDate) == MI_OK)
        {
			return true;
        }
    }
	return false;
}

/**
 * \������readCard
 * \˵��������ָ�����ַ�ڵ����ݣ����ڷ��Ͷ�ȡ��������
 * \���������
 *		blockAddr - ���ַ
 *		readDate  - ����������
 * \�����������
 * \����ֵ��
 * \��������
 */ 
bool RFID::readCard(int blockAddr, unsigned char *readDate)
{
    if (auth(PICC_AUTHENT1A, blockAddr, sectorKeyA[blockAddr/4],serNum) == MI_OK)  //��֤
    {
        //ѡ�������еĿ������
        // Serial.print("Read from the blockAddr of the card : ");
        // Serial.println(blockAddr,DEC);
        if(read(blockAddr, readDate) == MI_OK)
        {
            return true;
        }
    }
	return false;
}
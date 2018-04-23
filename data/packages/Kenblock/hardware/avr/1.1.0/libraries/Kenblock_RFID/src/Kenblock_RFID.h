 /**
 * \����Ȩ Copyright (C), 2016-2020, LZRobot
 * @���ƣ�  Kenblock_RFID.cpp
 * @���ߣ�  Kenblock
 * @�汾��  V0.1.0
 * @ʱ�䣺  2017/08/21
 * @������  RFID��Ƶģ������������Kenblock_RFID.c ��ͷ�ļ���
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

#ifndef Kenblock_RFID_h
#define Kenblock_RFID_h

#include <Arduino.h>
#include <SPI.h>

#define MAX_LEN 16   // ������󳤶�

//RC522������
#define PCD_IDLE              0x00               //�޶�����ȡ����ǰ����
#define PCD_AUTHENT           0x0E               //��֤��Կ
#define PCD_RECEIVE           0x08               //��������
#define PCD_TRANSMIT          0x04               //��������
#define PCD_TRANSCEIVE        0x0C               //���Ͳ���������
#define PCD_RESETPHASE        0x0F               //��λ
#define PCD_CALCCRC           0x03               //CRC����

//Mifare_One��Ƭ������
#define PICC_REQIDL           0x26               //Ѱ��������δ��������״̬
#define PICC_REQALL           0x52               //Ѱ��������ȫ����
#define PICC_ANTICOLL         0x93               //����ײ
#define PICC_SElECTTAG        0x93               //ѡ��
#define PICC_AUTHENT1A        0x60               //��֤A��Կ
#define PICC_AUTHENT1B        0x61               //��֤B��Կ
#define PICC_READ             0x30               //����
#define PICC_WRITE            0xA0               //д��
#define PICC_DECREMENT        0xC0               
#define PICC_INCREMENT        0xC1               
#define PICC_RESTORE          0xC2               //�������ݵ�������
#define PICC_TRANSFER         0xB0               //���滺����������
#define PICC_HALT             0x50               //����
 
//��RC522ͨѶʱ���صĴ������
#define MI_OK                 0
#define MI_NOTAGERR           1
#define MI_ERR                2


//------------------RC522�Ĵ���---------------
//�����״̬
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
//����
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
//���ԼĴ���
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
    unsigned char serNum[5];       // 4�ֽڿ����кţ���5�ֽ�ΪУ���ֽ�
	//unsigned char writeDate[16];
  
	//ԭ����A���룬16��������ÿ����������6Byte
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
	 * \������RFID
	 * \˵������ʼ���������κβ���
	 * \�����������
	 * \�����������
	 * \����ֵ����
	 * \��������
	 */
    RFID(void);
	
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
	RFID(int chipSelectPin, int Reset);
	
	/**
	 * \������init
	 * \˵������ʼ��RC522
	 * \�����������
	 * \�����������
	 * \����ֵ����
	 * \��������
	 */ 	
	void init();
	
	/**
	 * \������reset
	 * \˵������λRC522
	 * \�����������
	 * \�����������
	 * \����ֵ����
	 * \��������
	 */  	
	void reset();
	
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
	void setBitMask(unsigned char reg, unsigned char mask);
	
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
	void clearBitMask(unsigned char reg, unsigned char mask);

	/**
	 * \������antennaOn
	 * \˵������������,ÿ��������ر����߷���֮��Ӧ������1ms�ļ��
	 * \�����������
	 * \�����������
	 * \����ֵ����
	 * \��������
	 */ 
	void antennaOn(void);
	
	/**
	 * \������antennaOff
	 * \˵�����ر�����,ÿ��������ر����շ���֮��Ӧ������1ms�ļ��
	 * \�����������
	 * \�����������
	 * \����ֵ����
	 * \��������
	 */ 	
	void antennaOff(void);
	
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
	void calculateCRC(unsigned char *pIndata, unsigned char len, unsigned char *pOutData);

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
	void writeRC522(unsigned char addr, unsigned char val);
	
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
	unsigned char readRC522(unsigned char addr);
	
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
	unsigned char findCard(unsigned char reqMode, unsigned char *TagType);

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
	unsigned char RC522ToCard(unsigned char command, unsigned char *sendData, unsigned char sendLen, unsigned char *backData, unsigned int *backLen);
	
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
	unsigned char anticoll(unsigned char *serNum);
	
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
	unsigned char auth(unsigned char authMode, unsigned char BlockAddr, unsigned char *Sectorkey, unsigned char *serNum);
	
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
	unsigned char read(unsigned char blockAddr, unsigned char *recvData);
	
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
	unsigned char write(unsigned char blockAddr, unsigned char *writeData);
	
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
	unsigned char selectTag(unsigned char *serNum);
	
	/**
	 * \������halt
	 * \˵�������Ƭ��������״̬
	 * \�����������
	 * \�����������
	 * \����ֵ��
	 * \��������
	 */  
	void halt();
	
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
	bool writeCard(int blockAddr, unsigned char *writeDate);
	
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
	bool readCard(int blockAddr, unsigned char *readDate);
	
  private:
	int _ChipSelectPin;
	int _Reset;
};

#endif //Kenblock_RFID_h
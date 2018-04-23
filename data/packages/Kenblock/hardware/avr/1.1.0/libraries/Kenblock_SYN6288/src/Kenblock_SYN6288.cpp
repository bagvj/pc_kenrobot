 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_SYN6288.cpp
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/10/19
 * @描述：  SYN6288 语音合成模块 驱动库。
 *
* \说明
 * SYN6288 语音合成模块 驱动库。合成输出中文，可直接输入中文，省去Arduino IDE中提前中文转码。
 *
 * 默认为 软件串口通信，如需使用硬件串口，请注释掉 .h文件中的 //#define SYN6288_USE_SOFTWARE_SERIAL
 *
 * 原理：由于Arduino IDE 的编辑器默认编码为UTF-8，而语音合成模块支持的编码为GB2312、GBK、BIG5、Unicode，
 *       所以在此我们需要将UTF-8转换为Unicode。使其能够正确语音合成。
 *
 * \方法列表
 * 
 * 		void	begin(uint32_t baud); 	//初始化，设置串口波特率。
 *		bool	speech(unsigned char *textData, unsigned char music = 0); //文本合成播放命令。可选择背景音乐。
 * 		bool	sound(unsigned char *soundData) ; //播放声音提示音、和弦提示音、和弦声。
 * 		bool 	stop(void); 	//停止合成命令。
 * 		bool 	suspend(void); 	//暂停合成命令。
 * 		bool 	recover(void); 	//恢复合成命令，暂停后使用。
 * 		bool 	powerDown(void); //进入POWER DOWN 模式命令。
 * 		bool 	check(void); 	//状态查询。如果SYN6288为空闲状态，空闲状态返回true。
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/10/19      0.1.0              新建库文件。
 *  
 * \示例
 *  
 * 		1.SpeechSynthesizerTest.ino
 */
 
#include "Kenblock_SYN6288.h"

 /*芯片设置命令*/  
uint8_t SYN_StopCom[]=    {0xFD,0X00,0X02,0X02,0xFD};//停止合成  
uint8_t SYN_SuspendCom[]= {0XFD,0X00,0X02,0X03,0xFC};//暂停合成  
uint8_t SYN_RecoverCom[]= {0XFD,0X00,0X02,0X04,0xFB};//恢复合成  
uint8_t SYN_CheckCom[]=   {0XFD,0X00,0X02,0X21,0xDE};//状态查询  
uint8_t SYN_PowerDownCom[]={0XFD,0X00,0X02,0X88,0x77};//进入POWER DOWN 状态命令  


#ifdef SYN6288_USE_SOFTWARE_SERIAL
SYN6288::SYN6288(SoftwareSerial &uart): m_puart(&uart)
{

}
#else
SYN6288::SYN6288(HardwareSerial &uart): m_puart(&uart)
{

}
#endif

/**
 * \函数： begin
 * \说明： 初始化，设置通信波特率。
 * \输入参数：
 *   baud - 串口通信波特率值
 */
void SYN6288::begin(uint32_t baud)
{
    m_puart->begin(baud);
    rx_empty();
}

/**
 * \函数： speech
 * \说明： 文本合成播放命令。可选择背景音乐。
 * \输入参数：
 *   *textData - 合成的文本指针变量。
 *   music     - 背景音乐编号：0-15。
 * \返回值：
 *   - true：设置成功；false：设置失败。
 */
bool SYN6288::speech(unsigned char *textData, unsigned char music = 0)  
{ 
	rx_empty(); 
#ifdef SYN6288_UTF8_TO_UNICODE
    utf8_to_unicode(textData, &_uni, &_uniSize); 
    synFrameInfo((uint8_t*)_uni, _uniSize, music); 	
    free(_utf8);  
    free(_uni); 
#else
	_uniSize = strlen((const char*)textData);
	synFrameInfo((uint8_t*)textData, _uniSize, music); 
#endif
	return receiveAck();
}

/**
 * \函数： sound
 * \说明： 播放声音提示音、和弦提示音、和弦声。
 * \输入参数：
 *   *soundData - 合成的提示音指针变量。
 * \返回值：
 *   - true：设置成功；false：设置失败。
 * \其他： 
 *   输入提示音如下：(使用示例：sound("sounda") ,播放 出错声)
 * <pre>
 *                                      声音提示音
 * -----+----------+------------+----------+--+------+----------+------------+----------
 * 序号 |   名称   |  声音类型  | 播放时间 |  | 序号 |   名称   |  声音类型  | 播放时间 
 * -----+----------+------------+----------+--+------+----------+------------+----------
 *   1  |  sounda  |   出错声   |    1s    |  |  14  |  soundn  |    报警    |    2s    
 *   2  |  soundb  |  刷卡成功  |    1s    |  |  15  |  soundo  |    报警    |    1s    
 *   3  |  soundc  |  刷卡成功  |    1s    |  |  16  |  soundp  |    报警    |    3s   
 *   4  |  soundd  |  刷卡成功  |    1s    |  |  17  |  soundq  |  紧急报警  |    1s   
 *   5  |  sounde  |  刷卡成功  |    1s    |  |  18  |  soundr  |  紧急报警  |    4s    
 *   6  |  soundf  |   激光声   |    1s    |  |  19  |  sounds  |   布谷声   |    1s    
 *   7  |  soundg  |   门铃声   |    1s    |  |  20  |  soundt  |   提示音   |    1s   
 *   8  |  soundh  |   门铃声   |    1s    |  |  21  |  soundu  |   提示音   |    1s 
 *   9  |  soundi  |  电话铃声  |    2s    |  |  22  |  soundv  |   提示音   |    1s    
 *  10  |  soundj  |  电话铃声  |    1s    |  |  23  |  soundw  |   提示音   |    1s    
 *  11  |  soundk  | 广播提示音 |    2s    |  |  24  |  soundx  |   提示音   |    1s   
 *  12  |  soundl  |   提示音   |    1s    |  |  25  |  soundy  |   提示音   |    1s   
 *  13  |  soundm  |   提示音   |    1s    |  |      |          |            |           
 * </pre>
 * <pre>
 *                         和弦提示音
 * -----+----------+----------+--+------+----------+----------
 * 序号 |   名称   | 播放时间 |  | 序号 |   名称   |  播放时间 
 * -----+----------+----------+--+------+----------+----------
 *   1  |   msga   |    1s    |  |   5  |   msge   |    2s    
 *   2  |   msgb   |    1s    |  |   6  |   msgf   |    3s    
 *   3  |   msgc   |    1s    |  |   7  |   msgg   |    4s    
 *   4  |   msgd   |    1s    |  |   8  |   msgh   |    5s    
 * </pre>
 * <pre>
 *                         和弦铃声
 * -----+----------+----------+--+------+----------+----------
 * 序号 |   名称   | 播放时间 |  | 序号 |   名称   |  播放时间 
 * -----+----------+----------+--+------+----------+----------
 *   1  |  ringa   |    60s   |  |   9  |   ringi  |   35s    
 *   2  |  ringb   |    70s   |  |  10  |   ringj  |   25s    
 *   3  |  ringc   |    27s   |  |  11  |   ringk  |   18s    
 *   4  |  ringd   |    65s   |  |  12  |   ringl  |   38s    
 *   5  |  ringe   |    60s   |  |  13  |   ringm  |   60s    
 *   6  |  ringf   |    57s   |  |  14  |   ringn  |   23s    
 *   7  |  ringg   |    60s   |  |  15  |   ringo  |    5s    
 *   8  |  ringh   |    53s   |  |      |          |          
 * </pre>
 */
bool SYN6288::sound(unsigned char *soundData)  
{ 
	return speech(soundData, 0);
} 

/**
 * \函数： stop
 * \说明： 停止合成命令。
 * \返回值：
 *    - true：设置成功；false：设置失败。
 */
bool SYN6288::stop(void)
{
	rx_empty();
	synSet(SYN_StopCom);
	return receiveAck();
}

/**
 * \函数： suspend
 * \说明： 暂停合成命令。
 * \返回值：
 *    - true：设置成功；false：设置失败。
 */ 
bool SYN6288::suspend(void)
{
	rx_empty();
	synSet(SYN_SuspendCom);
	return receiveAck();
}

/**
 * \函数： recover
 * \说明： 恢复合成命令，暂停后使用。。
 * \返回值：
 *    - true：设置成功；false：设置失败。
 */ 
bool SYN6288::recover(void)
{
	rx_empty();
	synSet(SYN_RecoverCom);
	return receiveAck();
}

/**
 * \函数： powerDown
 * \说明： 进入POWER DOWN 模式命令。
 * \返回值：
 *    - true：设置成功；false：设置失败。
 */ 
bool SYN6288::powerDown(void)
{
	rx_empty();
	synSet(SYN_PowerDownCom);
	return receiveAck();
}

/**
 * \函数： check
 * \说明： 状态查询。如果SYN6288为空闲状态，空闲状态返回true。如果SYN6288为空闲状态，回传 0x4F ；如果正在播音状态，回传 0x4E。
 * \返回值：
 *    - true：空闲状态；false：正在播音状态。
 */
bool SYN6288::check(void)
{
	char a[2] = {0};
	
	rx_empty();
	delay(2);
	synSet(SYN_CheckCom);
	
	unsigned long start = millis();
    while (millis() - start < 1000)
	{
        while(m_puart->available() == 2) {
            m_puart->readBytes(a,2);
			break;
        }  
    }
	if (a[1] == 0x4F) return true;
	else {
		return false;
	}
	
}

/**
 * \函数： synFrameInfo
 * \说明： SYN6288 文本合成函数：发送合成文本到SYN6288芯片进行合成播放，具备背景音乐选择。
 * \输入参数：
 *   *textData - 文本指针变量。
 *   length - 文本长度。
 *   music - 背景音乐：0-15。
 */  
void SYN6288::synFrameInfo(unsigned char *textData, unsigned int length = 0, unsigned char music = 0)  
{  
	/**需要发送的文本**/
	unsigned  char frameInfo[128];   	//定义的文本长度,如果过长可修改
	char temp = 0x00;           		//校验码初始化
	unsigned  int i = 0;
	if(music > 15) music = 0;
	if(length == 0) length = strlen((const char*)textData);

	/**帧固定配置信息**/
	frameInfo[0] = 0xFD ;            //构造帧头FD
	frameInfo[1] = 0x00 ;            //构造数据区长度的高字节
	frameInfo[2] = length + 3;       //构造数据区长度的低字节
	frameInfo[3] = 0x01;             //构造命令字：合成播放命令

#ifdef SYN6288_UTF8_TO_UNICODE 
	frameInfo[4] = 0x03+ (8*music);  //文本编码格式：00：GB2312  01：GBK  02：BIG5  03：Unicode
#else
	frameInfo[4] = 0x01+ (8*music);  //文本编码格式：00：GB2312  01：GBK  02：BIG5  03：Unicode
#endif

	/**发送帧信息**/
	memcpy(&frameInfo[5], textData, length);  //写入待发送文本
	for (int i = 0; i < 5 + length; i ++)
	{
		temp ^= frameInfo[i];
		m_puart->write(frameInfo[i]);
	}
	m_puart->write(temp);        	//发送校验位
}  

/**
 * \函数： synSet
 * \说明： SYN6288 设置指令发送。本函数用于配置，停止合成、暂停合成等设置 ，默认波特率9600bps。
 * \输入参数：
 *   *set_data - 设置指令指针。
 */  
void SYN6288::synSet(uint8_t *set_data)  
{  
    m_puart->write((char*)set_data,5);   
} 

/**
 * \函数： receiveAck
 * \说明： 发送的指令SYN6288是否接收成功。如果接收成功，回传值为0x41，否则回传0x45。
 * \返回值：
 *    - true：接收成功；false：接收失败。
 */
bool SYN6288::receiveAck(void)
{
	char a;
	unsigned long start = millis();
    while (millis() - start < 1000) {
        while(m_puart->available() > 0) {
            a = m_puart->read();
			if(a == 0x41) return true;
			else {
				return false;
			}
        }  
    }
	return false;
}

/**
 * \函数： rx_empty
 * \说明： 清除串口接收缓存器中的值
 */
void SYN6288::rx_empty(void) 
{
    while(m_puart->available() > 0) {
        m_puart->read();
    }
}


#ifdef SYN6288_UTF8_TO_UNICODE
/**
 * \函数：unicode_to_utf8
 * \说明：将Unicode转换为UTF8
 * \输入参数：
 *   *in - unicode代码指针
 *   **out - utf8二级指针
 */
int SYN6288::unicode_to_utf8(unsigned char *in, int insize, uint8_t **out)  
{  
    int i = 0;  
    int outsize = 0;  
    int charscount = 0;  
    uint8_t *result = NULL;  
    uint8_t *tmp = NULL;  
  
    charscount = insize / sizeof(uint16_t);  
    result = (uint8_t *)malloc(charscount * 3 + 1);  
    memset(result, 0, charscount * 3 + 1);  
    tmp = result;  
  
    for (i = 0; i < charscount; i++)  
    {  
        uint16_t unicode = in[i];  
          
        if (unicode >= 0x0000 && unicode <= 0x007f)  
        {  
            *tmp = (uint8_t)unicode;  
            tmp += 1;  
            outsize += 1;  
        }  
        else if (unicode >= 0x0080 && unicode <= 0x07ff)  
        {  
            *tmp = 0xc0 | (unicode >> 6);  
            tmp += 1;  
            *tmp = 0x80 | (unicode & (0xff >> 2));  
            tmp += 1;  
            outsize += 2;  
        }  
        else if (unicode >= 0x0800 && unicode <= 0xffff)  
        {  
            *tmp = 0xe0 | (unicode >> 12);  
            tmp += 1;  
            *tmp = 0x80 | (unicode >> 6 & 0x003f);  
            tmp += 1;  
            *tmp = 0x80 | (unicode & (0xff >> 2));  
            tmp += 1;  
            outsize += 3;  
        }  
    }   
    *tmp = '\0';  
    *out = result;  
    return 0;  
}  

/**
 * \函数：utf8_to_unicode
 * \说明：将UTF8转换为Unicode
 * \输入参数：
 *   *in - utf8指针
 *   **out - unicode二级指针
 *   *outsize - unicode代码长度指针
 */ 
int SYN6288::utf8_to_unicode(uint8_t *in, uint8_t **out, int *outsize)  
{  
    uint8_t *p = in;  
    uint8_t *result = NULL;  
    int resultsize = 0;  
    uint8_t *tmp = NULL;  
  
    result = (uint8_t *)malloc(strlen(in) * 2 + 2); /* should be enough */  
    memset(result, 0, strlen(in) * 2 + 2);  
    tmp = (uint8_t *)result;  
  
    while(*p)  
    {  
        if (*p >= 0x00 && *p <= 0x7f)  
        {  
            *tmp = '\0';  
            tmp++;  
            *tmp = *p;  
            tmp++;
            resultsize += 2;  
        }  
        else if ((*p & (0xff << 5))== 0xc0)  
        {  
            uint16_t t = 0;  
            uint8_t t1 = 0;  
            uint8_t t2 = 0;  
  
            t1 = *p & (0xff >> 3);  
            p++;  
            t2 = *p & (0xff >> 2);  
  
            *tmp = t1 >> 2;//t1 >> 2;  
            tmp++;  
  
            *tmp = t2 | ((t1 & (0xff >> 6)) << 6);//t2 | ((t1 & (0xff >> 6)) << 6);  
            tmp++;  
  
            resultsize += 2;  
        }  
        else if ((*p & (0xff << 4))== 0xe0)  
        {  
            uint16_t t = 0;  
            uint8_t t1 = 0;  
            uint8_t t2 = 0;  
            uint8_t t3 = 0;  
  
            t1 = *p & (0xff >> 3);  
            p++;  
            t2 = *p & (0xff >> 2);  
            p++;  
            t3 = *p & (0xff >> 2);  
  
            //Little Endian  
            *tmp = (t1 << 4) | (t2 >> 2);//(t1 << 4) | (t2 >> 2);  
            tmp++;  
  
            *tmp = ((t2 & (0xff >> 6)) << 6) | t3;//((t2 & (0xff >> 6)) << 6) | t3;  
            tmp++;  
            resultsize += 2;  
        }  
        p++;  
    }  
  
    *tmp = '\0';  
    tmp++;  
    *tmp = '\0';  
    resultsize += 2;  
  
    *out = result;  
    *outsize = resultsize;   
    return 0;  
}  
#endif
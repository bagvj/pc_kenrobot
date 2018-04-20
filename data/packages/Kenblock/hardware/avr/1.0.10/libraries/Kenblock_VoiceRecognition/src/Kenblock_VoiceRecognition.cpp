/**
 * \著作权  Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_VoiceRecognition.cpp
 * @作者：  Kenblcok
 * @版本：  V0.1.1
 * @时间：  2017/10/31
 * @描述：  语音识别模块串口控制驱动程序。
 *
 * \说明
 * 通过串口发送控制指令和接收语音识别返回值。语音识别模块使用LD3320 芯片。
 *
 * 默认为 软件串口通信，如需使用硬件串口，请注释掉 .h文件中的 //#define VR_USE_SOFTWARE_SERIAL
 *
 * \方法列表
 * 
 *    1.    VoiceRecognition(void);
 *    2.    int getReturnValue(uint32_t timeout);  	// 获取语音识别模块返回值，以十进制数返回，无指令返回0
 *    3.    bool addKeyword(int line,String str,int sendValue);// 给语音识别模块添加关键字、关键字对应的返回值
 *    5.    bool erase(void);	       	// 擦除语音识别模块所有关键字
 *    6.    bool close(void);			// 语音识别模块进入休眠状态
 *    7.    bool open(void);			// 语音识别模块退出休眠状态
 *      
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  jimmy           2017/10/27      0.1.0              新建库文件。
 *  KING            2017/10/31      0.1.1              修改实现函数。
 *  
 * \示例
 *  
 * 		1.VoiceRecognitionTest.ino
 */
 
#include "Kenblock_VoiceRecognition.h"

/**
 * \函数： VoiceRecognition
 * \说明： 初始化，不做任何操作
 */
#ifdef VR_USE_SOFTWARE_SERIAL
VoiceRecognition::VoiceRecognition(SoftwareSerial &uart): m_puart(&uart)
{

}
#else
VoiceRecognition::VoiceRecognition(HardwareSerial &uart): m_puart(&uart)
{

}
#endif

/**
 * \函数： begin
 * \说明： 初始化，设置通信波特率。
 * \输入参数：
 *   baud - 串口通信波特率值
 */
void VoiceRecognition::begin(uint32_t baud)
{
    m_puart->begin(baud);
    rx_empty();
}

/**
 * \函数： getReturnValue
 * \说明： 获取语音识别模块返回值，以十进制数返回，无指令返回0
 * \输入参数：
 *   timeout - 串口接收等待时间
 * \返回值：retValue （范围1-254），无指令返回0
 */
int VoiceRecognition::getReturnValue(uint32_t timeout)
{ 
	int retValue = 0;
	char recData[3] = {0};
	
	unsigned long start = millis();
	while (millis() - start < timeout) 
	{
		while(m_puart->available() >= 3)    // 接收串口数据
		{ 	
			m_puart->readBytes(recData,3);
			sscanf(recData, "%d", &retValue );
			return retValue;
		}
	}
	return 0;	
}

/**
 * \函数： addKeyword
 * \说明： 给语音识别模块添加关键字、关键字对应的返回值
 * \输入参数：
 *   line - 行号的值范围 1-39，值小于零代表反转
 *   str - 新添加的关键字，关键字为汉字拼音，每个字拼音之间用空格分隔，字符串长度不超过19
 *   sendValue - 返回值的值范围 1-254
 * \返回值：
 *   - true：设置成功；false：设置失败。
 * \其他：
 *   示例： addKeyword(1,"kai deng",1);  //在语音识别模块第“1”行存  “开灯”   返回值“1”
 */
bool VoiceRecognition::addKeyword(int line,String str,int sendValue)
{
	char str_line[3] = {0};
	char str_value[4] = {0};	
	sprintf(str_line,"%02d",line);
	sprintf(str_value,"%03d",sendValue);
	
	rx_empty();
	
	m_puart->write(str_line, 2);
	m_puart->write(',');
	m_puart->print(str);
	m_puart->write(',');
	m_puart->write(str_value, 3);
	m_puart->write(',');
	m_puart->write('$');
	
	return recvFind("OK!");	
}

/**
 * \函数： erase
 * \说明： 擦除语音识别模块所有关键字
 * \返回值：
 *   - true：设置成功；false：设置失败
 */
bool VoiceRecognition::erase(void)
{
	rx_empty();
	m_puart->print("erase$");
	return recvFind("OK!");
}

/**
 * \函数： close
 * \说明： 语音识别模块进入休眠状态
 * \返回值：
 *   - true：设置成功；false：设置失败
 */
bool VoiceRecognition::close(void)
{
	rx_empty();
	m_puart->print("close,$");
	return recvFind("OK!");
}

/**
 * \函数： open
 * \说明： 语音识别模块退出休眠状态
 * \返回值：
 *   - true：设置成功；false：设置失败
 */
bool VoiceRecognition::open(void)
{
	rx_empty();
	m_puart->print("open,$");
	return recvFind("OK!");
}

/**
 * \函数： rx_empty
 * \说明： 清除串口接收缓存器中的值
 */
void VoiceRecognition::rx_empty(void) 
{
    while(m_puart->available() > 0) {
        m_puart->read();
    }
}

/**
 * \函数： recvString
 * \说明： 接收字符串，并查找关键字。超时返回。
 * \输入参数：
 *   target - 关键字
 *   timeout - 串口接收等待时间
 * \返回值：
 *   - 返回关键字前接收到的字符串
 */
String VoiceRecognition::recvString(String target, uint32_t timeout)
{
    String data;
    char a;
    unsigned long start = millis();
    while (millis() - start < timeout) {
        while(m_puart->available() > 0) {
            a = m_puart->read();
			if(a == '\0') continue;
            data += a;
        }
        if (data.indexOf(target) != -1) {
            break;
        }   
    }
    return data;
}

/**
 * \函数： recvFind
 * \说明： 接收数据字符串，并查找关键字。超时返回。
 * \输入参数：
 *   target - 关键字
 *   timeout - 串口接收等待时间
 * \返回值：
 *   - true：搜索到关键字；false：无关键字。
 */
bool VoiceRecognition::recvFind(String target, uint32_t timeout)
{
    String data_tmp;
    data_tmp = recvString(target, timeout);
    if (data_tmp.indexOf(target) != -1) {
        return true;
    }
    return false;
}


























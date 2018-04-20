/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_4DigitalDisplay.cpp
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/07/21
 * @描述：  四位数码管的驱动。
 *
 * \说明
 * 四位数码管的驱动。四位数码管为共阳数码管，使用TM1637作为数码管驱动芯片。
 *
 * \方法列表
 * 
 *    1.    void    FourDigitalDisplay::init(void);
 *    2.    void    FourDigitalDisplay::set(uint8_t brightness, uint8_t SetData, uint8_t SetAddr);
 *    3.    void    FourDigitalDisplay::setPin(uint8_t port);
 *    4.    void    FourDigitalDisplay::setPin(uint8_t dataPin, uint8_t clkPin);
 *    5.    void    FourDigitalDisplay::display(uint16_t value);
 *    6.    void    FourDigitalDisplay::display(int16_t value);
 *    7.    void    FourDigitalDisplay::display(float value);
 *    8.   	void    FourDigitalDisplay::display(double value, uint8_t digits);
 *    9.   	void    FourDigitalDisplay::display(uint8_t DispData[]);
 *    10.   void    FourDigitalDisplay::displayBit(uint8_t BitAddr, uint8_t DispData);
 *    11.   void    FourDigitalDisplay::displayBit(uint8_t BitAddr, uint8_t DispData, uint8_t point_on);
 *    12.   void    FourDigitalDisplay::clearDisplay(void);
 *    13.   void    FourDigitalDisplay::setBrightness(uint8_t brightness);
 *
 *    14.   int16_t FourDigitalDisplay::checkNum(float v,int16_t b);
 *    15.   void    FourDigitalDisplay::write(uint8_t SegData[]);
 *    16.   void    FourDigitalDisplay::write(uint8_t BitAddr, uint8_t SegData);
 *    17.   void    FourDigitalDisplay::coding(uint8_t DispData[]);
 *    18.   uint8_t FourDigitalDisplay::coding(uint8_t DispData);
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/07/21      0.1.0              新建库文件。
 *  
 * \示例
 *  
 *    1.   DisplayTest.ino
 *    2.   NumberDisplay.ino
 *    3.   TimeDisplay.ino
 */
#include "Kenblock_4DigitalDisplay.h"

/* 共阳数码管段码（私有变量） ------------------------------------------------*/
const uint8_t TubeTab[] PROGMEM = 
{
	0x3f, 0x06, 0x5b, 0x4f, 0x66, 0x6d, 0x7d, 0x07, 0x7f, 0x6f, //0-9
	0x77, 0x7c, 0x39, 0x5e, 0x79, 0x71,                         //'A', 'B', 'C', 'D', 'E', 'F',
	0xbf, 0x86, 0xdb, 0xcf, 0xe6, 0xed, 0xfd, 0x87, 0xff, 0xef, //0.-9.
	0xf7, 0xfc, 0xb9, 0xde, 0xf9, 0xf1,                         //'A.', 'B.', 'C.', 'D.', 'E.', 'F.',
	0, 0x40                                                     //' ','-'
};

/**
 *\函数：FourDigitalDisplay
 * \说明：创建新的控制量，不做任何操作
 * \输入参数：无
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
FourDigitalDisplay::FourDigitalDisplay(void) 
{

}

/**
 * \函数：FourDigitalDisplay
 * \说明：替代构造函数，映射数码管模块引脚设置函数，设置控制引脚
 * \输入参数：
 *   port : Ex_Double_Digital  双路数字接口（4P接口：PD1、PD2、PD3、PD4）
 *   	d1 - 数码管模块clk 引脚
 *   	d2 - 数码管模块data 引脚
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
FourDigitalDisplay::FourDigitalDisplay(uint8_t port) 
{
	_clkPin = Ex_Double_Digital[port].d1;
	_dataPin = Ex_Double_Digital[port].d2;
	pinMode(_clkPin, OUTPUT);
	pinMode(_dataPin, OUTPUT);
	set();
	clearDisplay();
}
/**
 * \函数：FourDigitalDisplay
 * \说明：替代构造函数，映射数码管模块引脚设置函数，设置控制引脚
 * \输入参数：
 *   	clkPin - 数码管模块clk 引脚
 *   	dataPin - 数码管模块data 引脚
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
FourDigitalDisplay::FourDigitalDisplay(uint8_t dataPin, uint8_t clkPin)
{
	_dataPin = dataPin;
	_clkPin = clkPin;
	pinMode(_clkPin, OUTPUT);
	pinMode(_dataPin, OUTPUT);
	set();
	clearDisplay();
}

/**
 * \函数：setpin
 * \说明：设置控制引脚
 * \输入参数：
 *   port : Ex_Double_Digital  双路数字接口（4P接口：PD1、PD2、PD3、PD4）
 *   	d1 - 数码管模块clk 引脚
 *   	d2 - 数码管模块data 引脚
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void FourDigitalDisplay::setPin(uint8_t port)
{
	_clkPin = Ex_Double_Digital[port].d1;
	_dataPin = Ex_Double_Digital[port].d2;
	pinMode(_clkPin, OUTPUT);
	pinMode(_dataPin, OUTPUT);
	set();
	clearDisplay();
}

/**
 * \函数：setpin
 * \说明：设置控制引脚
 * \输入参数：
 *   	clkPin - 数码管模块clk 引脚
 *   	dataPin - 数码管模块data 引脚
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void FourDigitalDisplay::setPin(uint8_t dataPin, uint8_t clkPin)
{
	_dataPin = dataPin;
	_clkPin = clkPin;
	pinMode(_clkPin, OUTPUT);
	pinMode(_dataPin, OUTPUT);
	set();
	clearDisplay();
}

/**
 * \函数：clearDisplay
 * \说明：清除显示
 * \输入参数：无		 
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void FourDigitalDisplay::clearDisplay(void)
{
	uint8_t buf[4] = { ' ', ' ', ' ', ' ' };
	display(buf);
}

/**
 * \函数：init
 * \说明：初始化数码管模块，此处实际上只是调用了 clearDisplay 。
 * \输入参数：无
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void FourDigitalDisplay::init(void)
{
	clearDisplay();
}

/**
 * \函数：writeByte
 * \说明：向 TM1637 写一个字节的数据（8 bits）
 * \输入参数：
 *   	wr_data - 写入的数据		 
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void FourDigitalDisplay::writeByte(uint8_t wr_data)
{
	uint8_t i;
	uint8_t cnt0;
	for (i = 0; i < 8; i++)  //发送 8bit
	{
		digitalWrite(_clkPin, LOW);
		if (wr_data & 0x01)
		{
			digitalWrite(_dataPin, HIGH); //LSB first
		}
		else
		{
			digitalWrite(_dataPin, LOW);
		}
		wr_data >>= 1;
		digitalWrite(_clkPin, HIGH);
	}
	digitalWrite(_clkPin, LOW); //等待 ACK
	digitalWrite(_dataPin, HIGH);
	digitalWrite(_clkPin, HIGH);
	pinMode(_dataPin, INPUT);
	while (digitalRead(_dataPin))
	{
		cnt0 += 1;
		if (cnt0 == 200)
		{
			pinMode(_dataPin, OUTPUT);
			digitalWrite(_dataPin, LOW);
			cnt0 = 0;
		}
		//pinMode(_dataPin,INPUT);
	}
	pinMode(_dataPin, OUTPUT);
}

/**
 * \函数：start
 * \说明：TM1637开始信号，开始传输数据
 * \输入参数：无	 
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void FourDigitalDisplay::start(void)
{
	digitalWrite(_clkPin, HIGH); //发送开始信号
	digitalWrite(_dataPin, HIGH);
	digitalWrite(_dataPin, LOW);
	digitalWrite(_clkPin, LOW);
}

/**
 * \函数：start
 * \说明：TM1637停止信号，传输数据结束
 * \输入参数：无	 
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */  
void FourDigitalDisplay::stop(void)
{
	digitalWrite(_clkPin, LOW);
	digitalWrite(_dataPin, LOW);
	digitalWrite(_clkPin, HIGH);
	digitalWrite(_dataPin, HIGH);
}

/**
 * \函数：write
 * \说明：把数组写入特定的地址
 * \输入参数：
 *   	SegData[] - 需要写入显示模块的数组
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void FourDigitalDisplay::write(uint8_t SegData[])
{
	uint8_t i;
	start();    // 发送开始信号
	writeByte(ADDR_AUTO);
	stop();
	start();
	writeByte(Cmd_SetAddr);
	for (i = 0; i < 4; i++)
	{
		writeByte(SegData[3-i]);
	}
	stop();
	start();
	writeByte(Cmd_DispCtrl);
	stop();
}

/**
 * \函数：write
 * \说明：把一字节的数据写入指定地址
 * \输入参数：
 *   	BitAddr - 指定位地址（0~3）
 *   	SegData - 显示的数据
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void FourDigitalDisplay::write(uint8_t BitAddr, uint8_t SegData)
{
	start();    // 发送开始信号
	writeByte(ADDR_FIXED);
	stop();
	start();
	writeByte(BitAddr | STARTADDR);
	writeByte(SegData);
	stop();
	start();
	writeByte(Cmd_DispCtrl);
	stop();
}

/**
 * \函数：display
 * \说明：显示特定的值，此处显示 uint16_t 类型的数
 * \输入参数：
 *   	value - 显示的值
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void FourDigitalDisplay::display(uint16_t value)
{
	display((int16_t)value);
}

/**
 * \函数：display
 * \说明：显示特定的值，此处显示 int16_t 的数
 * \输入参数：
 *   	value - 显示的值
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void FourDigitalDisplay::display(int16_t value)
{
	display((double)value, 0);
}

/**
 * \函数：display
 * \说明：显示特定的值，此处显示 float 的数
 * \输入参数：
 *   	value - 显示的值
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void FourDigitalDisplay::display(float value)
{
	uint8_t i=0;
	bool isStart = false;
	uint8_t index = 0;
	uint8_t disp[]={0,0,0,0};
	bool isNeg = false;
	if((float)value<0)
	{
		isNeg = true;
		value = -value;
		disp[0] = 0x21;
		index++;
	}
	for(i=0;i<7;i++)
	{
		int16_t n = checkNum(value,3-i);
		if(n>=1||i==3)
		{
			isStart=true;
		}
		if(isStart)
		{
			if(i==3)
			{
				disp[index]=n+0x10;
			}
			else
			{
				disp[index]=n;
			}
			index++;
		}
		if(index>3)
		{
			break;
		}
	}
	display(disp);
}

/**
 * \函数：checkNum
 * \说明：提取 float 数据 显示的值
 * \输入参数：
 *   	v - 显示的值
 *   	b - 显示的值
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
int16_t FourDigitalDisplay::checkNum(float v,int16_t b)
{
	if(b>=0)
	{
		return floor((v-floor(v/pow(10,b+1))*(pow(10,b+1)))/pow(10,b));
	}
	else
	{
		b=-b;
		int16_t i=0;
		for(i=0;i<b;i++)
		{
			v = v*10;
		}
		return ((int16_t)(v)%10);
	}
}

/**
 * \函数：display
 * \说明：显示特定的值，此处显示 double 的数
 * \输入参数：
 *   	value - 显示的值
 *   	digits - 小数点位数
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void FourDigitalDisplay::display(double value, uint8_t digits)
{
Posotion_1:
	uint8_t buf[4] = { ' ', ' ', ' ', ' ' };
	uint8_t tempBuf[4];
	uint8_t b = 0;
	uint8_t bit_num = 0;
	uint8_t int_num = 0;
	uint8_t isNeg = 0;
	double number = value;
	
	//超出范围显示 E
	if (number >= 9999.5 || number <= -999.5)
	{
		buf[0] = ' ';
		buf[1] = ' ';
		buf[2] = ' ';
		buf[3] = 0x0e;
	}
	else
	{
		// 处理负数
		if (number < 0.0)
		{
			number = -number;
			isNeg = 1;
		}
		// 处理四舍五入，例如 display(1.999, 2) 显示为 "2.00"
		double rounding = 0.5;
		for (uint8_t i = 0; i < digits; ++i)
		{
			rounding /= 10.0;
		}
		number += rounding;

		// 分离整数部分和小数部分
		uint16_t int_part = (uint16_t)number; 			//整数部分
		double remainder = number - (double)int_part;	//小数部分
		do
		{
			uint16_t m = int_part;
			int_part /= 10;
			int8_t c = m - 10 * int_part;
			tempBuf[int_num] = c;
			int_num++;
		}
		while (int_part);

		bit_num = isNeg + int_num + digits; //总位数值

		if (bit_num > 4)
		{
			bit_num = 4;
			digits = 4 - (isNeg + int_num);
			goto Posotion_1;
		}
		b = 4 - bit_num;
		
		if (isNeg)
		{
			buf[b++] = 0x21; // 显示负号 '-' 
		}
		
		for (uint8_t i = int_num; i > 0; i--)
		{
			buf[b++] = tempBuf[i - 1];
		}
		// 显示小数点，但前提是有数字
		if (digits > 0)
		{
			buf[b - 1] += 0x10;  //显示小数点 '.'
			// 从 remainder 提取小数部分显示数字 
			while (digits-- > 0)
			{
				remainder *= 10.0;
				int16_t toPrint = int16_t(remainder);
				buf[b++] = toPrint;
				remainder -= toPrint;
			}
		}
	}
	display(buf);
}

/**
 * \函数：display
 * \说明：显示数组（4个字节）
 * \输入参数：
 *   	DispData[] - 显示的数组存储在此数组中
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void FourDigitalDisplay::display(uint8_t DispData[])
{
	uint8_t SegData[4];
	uint8_t i;
	for (i = 0; i < 4; i++)
	{
		SegData[i] = DispData[i];
	}
	coding(SegData);
	write(SegData);
}

/**
 * \函数：displayBit
 * \说明：指定位显示数字
 * \输入参数：
 *   	BitAddr - 显示的位（0-3）
 *   	DispData - 需要现实的数据		 
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void FourDigitalDisplay::displayBit(uint8_t BitAddr, uint8_t DispData)
{
	uint8_t SegData;

	if ((DispData >= 'A' && DispData <= 'F'))
	{
		DispData = DispData - 'A' + 10;
	}
	else if ((DispData >= 'a' && DispData <= 'f'))
	{
		DispData = DispData - 'a' + 10;
	}
	SegData = coding(DispData);
	write(BitAddr, SegData);
}

/**
 * \函数：displayBit
 * \说明：指定位显示数字，带小数点
 * \输入参数：
 *   	BitAddr - 显示的位（0-3）
 *   	DispData - 需要现实的数据
 *   	point_on - 显示时钟点":"		 
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void FourDigitalDisplay::displayBit(uint8_t BitAddr, uint8_t DispData, uint8_t point_on)
{
	uint8_t SegData;

	if ((DispData >= 'A' && DispData <= 'F'))
	{
		DispData = DispData - 'A' + 10;
	}
	else if ((DispData >= 'a' && DispData <= 'f'))
	{
		DispData = DispData - 'a' + 10;
	}
	if(point_on == POINT_ON )
	{
		SegData = coding(DispData+0x10);
	}
	else
	{
		SegData = coding(DispData);
	}
	write(BitAddr, SegData);
}

/**
 * \函数：set
 * \说明：设置亮度、数据、地址
 * \输入参数：
 *   	brightness - 数码管亮度，定义为 BRIGHTNESS_0 ~ BRIGHTNESS_7
 *   	SetData - 开始地址数据
 *   	SetAddr - 显示开始地址
 * \输出参数：
 *   	Cmd_SetData - 赋值Cmd_SetData
 *   	Cmd_SetAddr - 赋值Cmd_SetAddr		 
 *   	Cmd_DispCtrl - 亮度控制指令的值		 
 * \返回值：无
 * \其他：无
 */
void FourDigitalDisplay::set(uint8_t brightness, uint8_t SetData, uint8_t SetAddr)
{
	Cmd_SetData = SetData;
	Cmd_SetAddr = SetAddr;
	Cmd_DispCtrl = SEGDIS_ON + brightness;// 设置亮度，下一个周期生效
}

/**
 * \函数：setBrightness
 * \说明：设置数码管显示亮度
 * \输入参数：
 *   	brightness - 数码管亮度，定义为 BRIGHTNESS_0 ~ BRIGHTNESS_7		 
 * \输出参数：
 *   	Cmd_DispCtrl - 亮度控制指令的值
 * \返回值：无
 * \其他：无
 */
void FourDigitalDisplay::setBrightness(uint8_t brightness)
{
	Cmd_DispCtrl = SEGDIS_ON + brightness;
}

/**
 * \函数：coding
 * \说明：将要现实的值，转换为数码管段码，并替换DispData[] 的值。
 * \输入参数：
 *   	DispData[] - 显示的原始数组		 
 * \输出参数：
 *   	DispData[] - 转换后的数码管段码数组
 * \返回值：无
 * \其他：无
 */
void FourDigitalDisplay::coding(uint8_t DispData[])
{
	for (uint8_t i = 0; i < 4; i++)
	{
	if (DispData[i] >= sizeof(TubeTab) / sizeof(*TubeTab))
	{
		DispData[i] = 32; // 替换为 ' '（空）
	}
	//DispData[i] = TubeTab[DispData[i]];//+ PointData;
	DispData[i] = pgm_read_byte(&TubeTab[DispData[i]]);//+ PointData;
	}
}

/**
 * \函数：coding
 * \说明：将要现实的值，转换为数码管段码，并替换DispData[] 的值。
 * \输入参数：
 *   	DispData - 显示的原始数据		 
 * \输出参数：
 *   	DispData - 转换后的数码管段码数据
 * \返回值：无
 * \其他：无
 */
uint8_t FourDigitalDisplay::coding(uint8_t DispData)
{
	if (DispData >= sizeof(TubeTab) / sizeof(*TubeTab))
	{
		DispData = 32; // 替换为 ' '（空）
	}
	//DispData = TubeTab[DispData];//+ PointData;
	DispData = pgm_read_byte(&TubeTab[DispData]);//+ PointData;
	return DispData;
}

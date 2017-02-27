 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  RoDHT11.cpp
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  DHT11 温湿度传感模块的驱动函数。
 *
 * \说明
 * DHT11 温湿度传感模块的驱动函数。
 *
 * \方法列表
 * 
 * 		1. void RoDHT11::setPin(uint8_t pin)
 * 		2. int RoDHT11::readSensors(void)
 * 		3. int RoDHT11::readHumidity(void)
 * 		4. int RoDHT11::readTemperature(void)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建库文件。
 *  
 * \示例
 *  
 * 		1.DHT11Test1.ino
 * 		1.DHT11Test2.ino
 */
 
#include "RoDHT11.h"


/**
 * \函数：RoDHT11
 * \说明：初始化，不做任何操作
 * \输入参数：无
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
RoDHT11::RoDHT11(void)
{
	
}


/**
 * \函数：RoDHT11
 * \说明：替代构造函数，设置DHT11温湿度传感器的接口
 * \输入参数：
 *   pin - DHT11温湿度传感器的接口
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
RoDHT11::RoDHT11(uint8_t pin)
{
	_dht11_pin = pin;
	
}


/**
 * \函数：setpin
 * \说明：设置DHT11温湿度传感器的接口
 * \输入参数：
 *   pin - DHT11温湿度传感器的接口	
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void RoDHT11::setPin(uint8_t pin)
{
	_dht11_pin = pin;
}


/**
 * \函数：readSensors
 * \说明：读取DHT11的温度值、湿度值
 * \输入参数：无
 * \输出参数：传感器的温度值、湿度值
 * \返回值：传感器状态
 * \其他：无
 */
int RoDHT11::readSensors(void)
{
	// 设置数据缓存数组
	uint8_t bits[5];
	uint8_t cnt = 7;
	uint8_t idx = 0;

	// 清空数组
	for (int i=0; i< 5; i++) bits[i] = 0;

	// 拉低总线，发开始信号
	pinMode(_dht11_pin, OUTPUT);	
	digitalWrite(_dht11_pin, LOW);	//拉低总线，发开始信号
	delay(20);						//延时需要大于18ms
	
	digitalWrite(_dht11_pin, HIGH);	//开始信号
	delayMicroseconds(40);			//等待DHT11响应
	pinMode(_dht11_pin, INPUT);		//改为输入模式

	// 应答或超时
	unsigned int loopCnt = 10000;
	while(digitalRead(_dht11_pin) == LOW) 	//DHT11发出响应，拉高总线80us
			if (loopCnt-- == 0) return DHTLIB_ERROR_TIMEOUT;	//超时

	loopCnt = 10000;
	while(digitalRead(_dht11_pin) == HIGH)	//拉低总线80us后开发送数据
			if (loopCnt-- == 0) return DHTLIB_ERROR_TIMEOUT; 	//超时

	//  接收数据 - 40 BITS => 5 BYTES 数据或者超时退出
	for (int i=0; i<40; i++)
	{
			loopCnt = 10000;
			while(digitalRead(_dht11_pin) == LOW)	//等待50us
					if (loopCnt-- == 0) return DHTLIB_ERROR_TIMEOUT;

			unsigned long t = micros();				//获取系统时间（微秒）

			loopCnt = 10000;
			while(digitalRead(_dht11_pin) == HIGH)
					if (loopCnt-- == 0) return DHTLIB_ERROR_TIMEOUT;
				
			if ((micros() - t) > 40) bits[idx] |= (1 << cnt);//如果时间大于40us,值为1
			if (cnt == 0)   	// 判断cnt值
			{
					cnt = 7;    
					idx++;      // 下一字节
			}
			else cnt--;
	}

	// 校验
	// bits[1]和bits[3] 一直是零，所以忽略.
	humidity    = bits[0]; 
	temperature = bits[2]; 

	uint8_t sum = bits[0] + bits[2];  

	if (bits[4] != sum) return DHTLIB_ERROR_CHECKSUM;
	return DHTLIB_OK;
}

/**
 * \函数：readHumidity
 * \说明：读取DHT11的湿度值
 * \输入参数：无
 * \输出参数：无
 * \返回值：DHT11的湿度值
 * \其他：无
 */
int RoDHT11::readHumidity(void)
{
	int data; 
	
	//通过读取系统时间，读取传感器的时差，当时差小于500ms 时，返回上一次读取传感器的值
	if( (millis() -  _time ) > 500)
	{
		data = RoDHT11::readSensors();
		_time = millis();
		
		if( data ==  DHTLIB_OK )
		{
			return humidity;
		}
		else
		{
			return -1;
		}
	}
	else
	{
		return humidity;
	}
}

/**
 * \函数：readTemperature
 * \说明：读取DHT11的温度值
 * \输入参数：无
 * \输出参数：无
 * \返回值：DHT11的温度值
 * \其他：无
 */
int RoDHT11::readTemperature(void)
{
	int data; 
	
	//通过读取系统时间，读取传感器的时差，当时差小于500ms 时，返回上一次读取传感器的值
	if( (millis() -  _time ) > 500)
	{
		data = RoDHT11::readSensors();
		_time = millis();
		
		if( data ==  DHTLIB_OK )
		{
			return temperature;
		}
		else
		{
			return -1;
		}
	}
	else
	{
		return temperature;
	}
	
}
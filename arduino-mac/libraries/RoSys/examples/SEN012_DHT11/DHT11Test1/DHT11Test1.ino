/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  DHT11Test1.ino
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  DHT11 温湿度传感模块测试示例。
 * 
 * \说明
 * DHT11 温湿度传感模块测试示例。读取温湿度，串口显示。
 * 
 * \函数列表
 * 1. int RoDHT11::readSensors(void)
 * 
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建程序。
 * 
 */

#include "RoSys.h"

RoDHT11 dht(2);		//DHT11温湿度传感器模块接口

void setup()
{
	Serial.begin(9600);
	Serial.println("Type,\tstatus,\tHumidity (%),\tTemperature (C)");
}

void loop()
{
	int chk;
	Serial.print("DHT11, \t");
	chk = dht.readSensors();    // 读取数据
	switch (chk)
	{
		case DHTLIB_OK:  
					Serial.print("OK,\t"); 
					break;
		case DHTLIB_ERROR_CHECKSUM: 
					Serial.print("Checksum error,\t"); 
					break;
		case DHTLIB_ERROR_TIMEOUT: 
					Serial.print("Time out error,\t"); 
					break;
		default: 
					Serial.print("Unknown error,\t"); 
					break;
	}
	// 显示温湿度
	Serial.print(dht.humidity,1);
	Serial.print(",\t");
	Serial.println(dht.temperature,1);

	delay(1000);
}


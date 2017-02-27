/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  DHT11Test2.ino
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  DHT11 温湿度传感模块测试示例。
 * 
 * \说明
 * DHT11 温湿度传感模块测试示例。读取温湿度，串口显示。
 * 
 * \函数列表
 * 1. int RoDHT11::readHumidity(void); 
 * 2. int RoDHT11::readTemperature(void);
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
	int hum,temp;
	
	Serial.print("DHT11, \t");
  
	hum = dht.readHumidity();   	// 读取湿度数据
	temp = dht.readTemperature();	// 读取温度数据
  
	// 显示温湿度
	Serial.print(hum);
	Serial.print(",\t");
	Serial.println(temp);

	delay(1000);               		//读取数据周期不小于1s
}


/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  PM2.5Test .ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/11/03
 * @描述：  PM2.5传感模块测试实例。
 *
 * \说明
 * PM2.5传感模块测试实例，串口显示测量到的PM2.5浓度。使用GP2Y1051 灰尘传感器，波特率固定为2400 bit/s。
 *
 * \函数列表
 *
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING           2017/11/03      0.1.0              新建程序。
 *  
 */
#include <SoftwareSerial.h>

SoftwareSerial mySerial(13, 12);	// 软件串口：PD4端口（拓展版） // RX:13, TX:12。

float getPMValue()
{
	uint8_t PM2_5data[6]; 	// 数据存放数组
	uint8_t sum;			// 校验和
	float Value; 
	
	while(!(mySerial.read() == -1));	// 清楚已有数据
	delay(30); 
	while(mySerial.available() > 0)		// 判断串口是否接收到数据
	{
		if(mySerial.read() == 0xAA)		// 判断帧头
		{
			while((mySerial.readBytes(PM2_5data, 6)) == 6) 		// 帧头正确后接受6个字节
			{
				sum = PM2_5data[0] + PM2_5data[1] + PM2_5data[2] + PM2_5data[3];
				if(PM2_5data[4] == sum && PM2_5data[5] == 0xFF) // 根据校验和与帧尾判断接收数据是否正确
				{
					Value = (PM2_5data[0] * 256.0 + PM2_5data[1]) / 1024.0 * 5.00;   //转换类型      
					return Value * 700;							// 比例系数K为 700，需要自己调整
					break;
				}
			}
		}
	}
}

void setup() 
{
	mySerial.begin(2400);		// PM2.5传感模块的波特率必须为2400
	Serial.begin(115200);		// 串口初始化
}

void loop() 
{
	float PM2_5Value = getPMValue();	// 读取数据PM2.5值
	Serial.print("PM2.5 = ");
	Serial.print(PM2_5Value,2);			// 出口打印显示
	Serial.println("  ug/m3");
	delay(1000);
}


/**
 * \著作权 
 * @名称：  SetUserData.ino
 * @作者：  Miles Burton, Tim Newsome, Guil Barros, Rob Tillaart
 * @版本：  V0.1.0
 * @维护：  Kenblock
 * @时间：  2017/09/11
 * @描述：  用户数据读写操作。
 *
 * \说明
 * 用户数据读写操作。如果没有使用报警功能，可以向传感器写入两个字节（2 bytes）的数据。
 * 可以用作存储最后的温度值或者其他数据（断电不丢失）。
 * 以DS18B20 为例，存储于ROM的 BYTE2 BYTE3 位置。
 *  
 * \函数列表
 *	1.	void 	DallasTemperature::begin(void)
 *	2.	void    DallasTemperature::requestTemperatures()
 *	3.	bool 	DallasTemperature::requestTemperaturesByIndex(uint8_t deviceIndex)
 *	4.	void 	DallasTemperature::setUserDataByIndex(uint8_t deviceIndex, int16_t data)
 *	5.	int16_t DallasTemperature::getUserDataByIndex(uint8_t deviceIndex)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/11      0.1.0              做汉化修订注释。
 *  
 */

#include <OneWire.h>
#include <DallasTemperature.h>

// DS18B20模块接口
#define ONE_WIRE_BUS 2

// 设置一个oneWire实例,与任何oneWire设备通信(不只是Dallas温度ICs)
OneWire oneWire(ONE_WIRE_BUS);

// 传递oneWire参数到DallasTemperature。
DallasTemperature sensors(&oneWire);

int count = 0;

void setup(void)
{
  // 串口初始化
  Serial.begin(9600);
  Serial.println("Dallas Temperature IC Control Library Demo");

  // 传感器初始化
  sensors.begin();
  
}

void loop(void)
{ 
  // 调用sensors.requestTemperatures() 读取总线上全部设备温度
  // 请求总线上的所有设备
  Serial.print("Requesting temperatures...");
  sensors.requestTemperatures(); // 发送命令以获得温度
  Serial.println("DONE");
  
  Serial.print("Temperature for the device 1 (index 0) is: ");
  Serial.println(sensors.getTempCByIndex(0));  
  
  count++;
  sensors.setUserDataByIndex(0, count);		// 写入数据
  int x = sensors.getUserDataByIndex(0);	// 读出数据
  Serial.println(x);						// 打印显示
}

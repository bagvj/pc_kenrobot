/**
 * \著作权 
 * @名称：  Simple.ino
 * @作者：  Miles Burton, Tim Newsome, Guil Barros, Rob Tillaart
 * @版本：  V0.1.0
 * @维护：  Kenblock
 * @时间：  2017/09/11
 * @描述：  最简单的使用方式示例。
 *
 * \说明
 * 最简单的使用方式示例（DS18B20为例）。输出显示温度值，读取总线上第一个设备的温度值。
 *
 * \函数列表
 *	1.	void 	DallasTemperature::begin(void)
 *	2.	void    DallasTemperature::requestTemperatures()
 *	3.	bool 	DallasTemperature::requestTemperaturesByIndex(uint8_t deviceIndex)
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


void setup(voi
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

  // 使用getTempCByIndex(uint8_t deviceIndex) 函数，从总线上第一个设备读取温度。
  Serial.print("Temperature for the device 1 (index 0) is: ");
  Serial.println(sensors.getTempCByIndex(0));  
}

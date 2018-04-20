/**
 * \著作权 
 * @名称：  WaitForConversion.ino
 * @作者：  Miles Burton, Tim Newsome, Guil Barros, Rob Tillaart
 * @版本：  V0.1.0
 * @维护：  Kenblock
 * @时间：  2017/09/11
 * @描述：  异步温度转换示例。
 *
 * \说明
 * 异步温度转换示例。使用非阻塞/异步进行温度读取，串口显示不同方式的时间长度。
 *
 * \函数列表
 *	1.	void 	DallasTemperature::begin(void)
 *	2.	void    DallasTemperature::requestTemperatures()
 *	3.	bool 	DallasTemperature::requestTemperaturesByIndex(uint8_t deviceIndex)
 *	4.	void 	DallasTemperature::setWaitForConversion(bool flag)
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

void setup(void)
{
  // 串口初始化
  Serial.begin(115200);
  Serial.println("Dallas Temperature Control Library - Async Demo");
  Serial.println("\nDemo shows the difference in length of the call\n\n");

  // 传感器初始化
  sensors.begin();
}

void loop(void)
{ 
  // 请求温度转换 (传统方式)
  Serial.println("Before blocking requestForConversion");
  unsigned long start = millis(); //指令执行开始时间 

  sensors.requestTemperatures();

  unsigned long stop = millis();  //指令执行结束时间 
  Serial.println("After blocking requestForConversion");
  Serial.print("Time used: ");
  Serial.println(stop - start);
  
  // 获取温度
  Serial.print("Temperature: ");
  Serial.println(sensors.getTempCByIndex(0));  
  Serial.println("\n");
  
  // 请求温度转换 (非阻塞/异步方式 non-blocking / async)
  Serial.println("Before NON-blocking/async requestForConversion");
  start = millis();       
  sensors.setWaitForConversion(false);  // 使能异步模式
  sensors.requestTemperatures();
  sensors.setWaitForConversion(true);
  stop = millis();
  Serial.println("After NON-blocking/async requestForConversion");
  Serial.print("Time used: ");
  Serial.println(stop - start); 
  
  
  // 默认9位分辨率 
  // 注意：程序员应正处理待延时
  // 在这里可以做一些有用的事情，而不是延时
  int resolution = 9;
  delay(750/ (1 << (12-resolution)));//合理延时时间（即转换所需时间）
  
  // 获取温度
  Serial.print("Temperature: ");
  Serial.println(sensors.getTempCByIndex(0));  
  Serial.println("\n\n\n\n");  
  
  delay(5000);
}

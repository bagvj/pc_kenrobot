/**
 * \著作权 
 * @名称：  Multibus_simple.ino
 * @作者：  Miles Burton, Tim Newsome, Guil Barros, Rob Tillaart
 * @版本：  V0.1.0
 * @维护：  Kenblock
 * @时间：  2017/09/11
 * @描述：  多总线简单使用方式。
 *
 * \说明
 * 多总线简单使用方式。有多条总线挂载在多个引脚上，实现多传感器的温度读写。输出显示温度值。
 *
 * \函数列表
 *	1.	void 	DallasTemperature::begin(void)
 *	2.	bool 	DallasTemperature::getAddress(uint8_t* deviceAddress, uint8_t index)
 *	3.	bool 	DallasTemperature::setResolution(const uint8_t* deviceAddress, uint8_t newResolution)
 *	4.	void    DallasTemperature::requestTemperatures()
 *	5.	bool 	DallasTemperature::requestTemperaturesByIndex(uint8_t deviceIndex)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/11      0.1.0              做汉化修订注释。
 *  
 */
#include <OneWire.h>
#include <DallasTemperature.h>

OneWire ds18x20[] = {2,3};      				// 设置oneWire实例数组,并初始化接口

const int oneWirePinsCount=sizeof(ds18x20)/sizeof(OneWire); //自动计算数量

DallasTemperature sensor[oneWirePinsCount];		// 传递DallasTemperature实例数组



void setup(void) {
  // 串口初始化
  Serial.begin(9600);
  Serial.println("Dallas Temperature Multiple Bus Control Library Simple Demo");
  Serial.print("============Ready with ");
  Serial.print(oneWirePinsCount);
  Serial.println(" Sensors================");
  
  // 初始化所有定义的总线连接
  DeviceAddress deviceAddress;
  for (int i=0; i<oneWirePinsCount; i++) 
  {
    sensor[i].setOneWire(&ds18x20[i]);		// 传递oneWire参数到DallasTemperature。
    sensor[i].begin();						// 传感器初始化
    if (sensor[i].getAddress(deviceAddress, 0)) sensor[i].setResolution(deviceAddress, 12);	// 将精度设置为 12 位
  }
  
}

void loop(void) {
  // 调用sensors.requestTemperatures() 读取总线上全部设备温度
  // 请求总线上的所有设备
  Serial.print("Requesting temperatures...");
  for (int i=0; i<oneWirePinsCount; i++) 
  {
    sensor[i].requestTemperatures();
  }
  Serial.println("DONE");
  
  delay(1000);
  // 使用getTempCByIndex(uint8_t deviceIndex) 函数，从总线上第一个设备读取温度。
  for (int i=0; i<oneWirePinsCount; i++) 
  {
    float temperature=sensor[i].getTempCByIndex(0);
    Serial.print("Temperature for the sensor ");
    Serial.print(i);
    Serial.print(" is ：");
    Serial.println(temperature);
  }
  Serial.println();
}

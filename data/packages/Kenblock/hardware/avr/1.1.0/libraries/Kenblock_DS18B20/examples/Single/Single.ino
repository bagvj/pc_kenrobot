/**
 * \著作权 
 * @名称：  Single.ino
 * @作者：  Miles Burton, Tim Newsome, Guil Barros, Rob Tillaart
 * @版本：  V0.1.0
 * @维护：  Kenblock
 * @时间：  2017/09/11
 * @描述：  单个传感器（DS18B20为例）的使用示例。
 *
 * \说明
 * 单个传感器（DS18B20为例）的使用示例。输出显示温度值，只挂载一个设备。
 *
 * \函数列表
 *	1.	void 	DallasTemperature::begin(void)
 *	2.	uint8_t DallasTemperature::getDeviceCount(void)
 *	3.	bool 	DallasTemperature::isParasitePowerMode(void)
 *	4.	bool 	DallasTemperature::getAddress(uint8_t* deviceAddress, uint8_t index)
 *	5.	bool 	DallasTemperature::setResolution(const uint8_t* deviceAddress, uint8_t newResolution)
 *	6.	uint8_t DallasTemperature::getResolution(const uint8_t* deviceAddress)
 *	7.	void    DallasTemperature::requestTemperatures()
 *	8.	float 	DallasTemperature::getTempC(const uint8_t* deviceAddress)
 *	9.	float 	DallasTemperature::getTempF(const uint8_t* deviceAddress)
 *	10.	float 	DallasTemperature::toFahrenheit(float celsius)
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

// 使用这个数组存储设备地址
DeviceAddress insideThermometer;


void setup(void)
{
  // 串口初始化
  Serial.begin(9600);
  Serial.println("Dallas Temperature IC Control Library Demo");

  // 传感器初始化，获取总线上设备数量
  Serial.print("Locating devices...");
  sensors.begin();
  Serial.print("Found ");
  Serial.print(sensors.getDeviceCount(), DEC);
  Serial.println(" devices.");

  // 是否为寄生功率模式
  Serial.print("Parasite power is: "); 
  if (sensors.isParasitePowerMode()) Serial.println("ON");
  else Serial.println("OFF");
 
  // 手动分配地址。下面的地址将被更改为总线上的有效设备地址。
  // 设备地址可以通过使用oneWire.search(deviceAddress) 或单独通过sensors.getAddress(deviceAddress, index)
  // 可以在这里使用特定设备的地址（前提是你的地址是正确的）
  // insideThermometer = { 0x28, 0x1D, 0x39, 0x31, 0x2, 0x0, 0x0, 0xF0 };

  // 方法 1:
  // 在总线上搜索设备，并根据索引进行分配。理想情况下，您可以这样做，在总线上最初发现地址，
  // 然后使用这些地址，并在您知道总线上的设备(假设它们不会改变)时手动分配它们(见上面)。
  if (!sensors.getAddress(insideThermometer, 0)) Serial.println("Unable to find address for Device 0"); 
  
  // 方法 2: search()
  // search() 查找下一个设备。如果有新地址被返回，则返回1。 
  // 如果是0，意味着总线被短路，没有设备，或者已经取回了所有的设备。
  // 顺序是确定的。 你将总是在相同的设备得连接得到相同的顺序。
  //
  // 必须在search()之前调用
  //oneWire.reset_search();
  // 将发现的第一个地址分配给insideThermometer
  //if (!oneWire.search(insideThermometer)) Serial.println("Unable to find address for insideThermometer");

  // 显示总线地址
  Serial.print("Device 0 Address: ");
  printAddress(insideThermometer);
  Serial.println();

  // 将精度设置为 9 位(每个Dallas/Maxim传感器可以有几种不同的精度)
  sensors.setResolution(insideThermometer, 9);
 
  Serial.print("Device 0 Resolution: ");
  Serial.print(sensors.getResolution(insideThermometer), DEC); 
  Serial.println();
}

// 打印一个设备温度的函数
void printTemperature(DeviceAddress deviceAddress)
{
  // 方法 1 - 较慢
  //Serial.print("Temp C: ");
  //Serial.print(sensors.getTempC(deviceAddress));
  //Serial.print(" Temp F: ");
  //Serial.print(sensors.getTempF(deviceAddress)); 	// 需要再次调用getTempC，然后将温度转换为华氏温度。

  // 方法 2 - 较快
  float tempC = sensors.getTempC(deviceAddress);
  Serial.print("Temp C: ");
  Serial.print(tempC);
  Serial.print(" Temp F: ");
  Serial.println(DallasTemperature::toFahrenheit(tempC)); // 将tempC 转换为华氏温度。
}


void loop(void)
{ 
  // 调用sensors.requestTemperatures() 读取总线上全部设备温度
  // 请求总线上的所有设备
  Serial.print("Requesting temperatures...");
  sensors.requestTemperatures(); // 发送命令以获得温度
  Serial.println("DONE");
  
  // 几乎为立即响应。
  printTemperature(insideThermometer); // 打印温度数据
}

// 打印一个设备地址的函数
void printAddress(DeviceAddress deviceAddress)
{
  for (uint8_t i = 0; i < 8; i++)
  {
    if (deviceAddress[i] < 16) Serial.print("0");
    Serial.print(deviceAddress[i], HEX);
  }
}

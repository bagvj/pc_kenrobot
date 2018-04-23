/**
 * \著作权 
 * @名称：  Multiple.ino
 * @作者：  Miles Burton, Tim Newsome, Guil Barros, Rob Tillaart
 * @版本：  V0.1.0
 * @维护：  Kenblock
 * @时间：  2017/09/11
 * @描述：  同一总线上，多个传感器的使用。
 *
 * \说明
 * 同一总线上，多个传感器的使用（DS18B20为例）。输出显示温度值。
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
#define TEMPERATURE_PRECISION 9

// 设置一个oneWire实例,与任何oneWire设备通信(不只是Dallas温度ICs)
OneWire oneWire(ONE_WIRE_BUS);

// 传递oneWire参数到DallasTemperature。
DallasTemperature sensors(&oneWire);

// 使用这个数组存储设备地址
DeviceAddress insideThermometer, outsideThermometer;

void setup(void)
{
  // 串口初始化
  Serial.begin(9600);
  Serial.println("Dallas Temperature IC Control Library Demo");

  // 传感器初始化
  sensors.begin();

  // 获取总线上设备数量
  Serial.print("Locating devices...");
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
  // outsideThermometer   = { 0x28, 0x3F, 0x1C, 0x31, 0x2, 0x0, 0x0, 0x2 };

  // 在总线上搜索设备，并根据索引进行分配。理想情况下，您可以这样做，在总线上最初发现地址，
  // 然后使用这些地址，并在您知道总线上的设备(假设它们不会改变)时手动分配它们(见上面)。
  // 
  // 方法 1: by index
  if (!sensors.getAddress(insideThermometer, 0)) Serial.println("Unable to find address for Device 0"); 
  if (!sensors.getAddress(outsideThermometer, 1)) Serial.println("Unable to find address for Device 1"); 

  // 方法 2: search()
  // search() 查找下一个设备。如果有新地址被返回，则返回1。 
  // 如果是0，意味着总线被短路，没有设备，或者已经取回了所有的设备。
  // 顺序是确定的。 你将总是在相同的设备得连接得到相同的顺序。
  //
  // 必须在search()之前调用
  //oneWire.reset_search();
  // 将发现的第一个地址分配给insideThermometer
  //if (!oneWire.search(insideThermometer)) Serial.println("Unable to find address for insideThermometer");
  // 将发现的第二个地址分配给outsideThermometer
  //if (!oneWire.search(outsideThermometer)) Serial.println("Unable to find address for outsideThermometer");
  
  // 显示总线地址
  Serial.print("Device 0 Address: ");
  printAddress(insideThermometer);
  Serial.println();

  Serial.print("Device 1 Address: ");
  printAddress(outsideThermometer);
  Serial.println();

  // 将精度设置为 9 位(每个Dallas/Maxim传感器可以有几种不同的精度)
  sensors.setResolution(insideThermometer, TEMPERATURE_PRECISION);
  sensors.setResolution(outsideThermometer, TEMPERATURE_PRECISION);

  Serial.print("Device 0 Resolution: ");
  Serial.print(sensors.getResolution(insideThermometer), DEC); 
  Serial.println();

  Serial.print("Device 1 Resolution: ");
  Serial.print(sensors.getResolution(outsideThermometer), DEC); 
  Serial.println();
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

// 打印一个设备温度的函数
void printTemperature(DeviceAddress deviceAddress)
{
  float tempC = sensors.getTempC(deviceAddress);
  Serial.print("Temp C: ");
  Serial.print(tempC);
  Serial.print(" Temp F: ");
  Serial.print(DallasTemperature::toFahrenheit(tempC));
}

// 打印设备的分辨率
void printResolution(DeviceAddress deviceAddress)
{
  Serial.print("Resolution: ");
  Serial.print(sensors.getResolution(deviceAddress));
  Serial.println();    
}

// 用于打印设备的地址和温度
void printData(DeviceAddress deviceAddress)
{
  Serial.print("Device Address: ");
  printAddress(deviceAddress);
  Serial.print(" ");
  printTemperature(deviceAddress);
  Serial.println();
}


void loop(void)
{ 
  // 调用sensors.requestTemperatures() 读取总线上全部设备温度
  // 请求总线上的所有设备
  Serial.print("Requesting temperatures...");
  sensors.requestTemperatures();
  Serial.println("DONE");

  // 打印设备信息
  printData(insideThermometer);
  printData(outsideThermometer);
}


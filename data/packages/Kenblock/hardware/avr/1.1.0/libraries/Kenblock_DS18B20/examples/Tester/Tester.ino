/**
 * \著作权 
 * @名称：  Tester.ino
 * @作者：  Miles Burton, Tim Newsome, Guil Barros, Rob Tillaart
 * @版本：  V0.1.0
 * @维护：  Kenblock
 * @时间：  2017/09/11
 * @描述：  温度传感器（DS18B20为例）测试示例。
 *
 * \说明
 * 温度传感器（DS18B20为例）测试示例。输出显示温度值，如果总线上挂载多个温度传感器，可以全部显示。
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
 *	11.	bool 	DallasTemperature::requestTemperaturesByIndex(uint8_t deviceIndex)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/11      0.1.0              做汉化修订注释。
 *  
 */
#include <OneWire.h>
#include <DallasTemperature.h>

int ONE_WIRE_BUS = 2;           	// DS18B20模块接口
#define TEMPERATURE_PRECISION 9 	// 低精度：9位

// 设置一个oneWire实例,与任何oneWire设备通信(不只是Dallas温度ICs)
OneWire oneWire(ONE_WIRE_BUS);

// 传递oneWire参数到DallasTemperature。
DallasTemperature sensors(&oneWire);

int numberOfDevices; 				// 发现的温度传感器数量

DeviceAddress tempDeviceAddress; 	// 使用这个数组存储设备地址

void setup(void)
{
  // 串口初始化
  Serial.begin(9600);
  Serial.println("Dallas Temperature IC Control Library Demo");

  // 传感器初始化
  sensors.begin();
  
  // 获取总线上设备数量
  numberOfDevices = sensors.getDeviceCount();
  
  // 总线上的设备数量显示
  Serial.print("Locating devices...");
  
  Serial.print("Found ");
  Serial.print(numberOfDevices, DEC);
  Serial.println(" devices.");

  // 是否为寄生功率模式
  Serial.print("Parasite power is: "); 
  if (sensors.isParasitePowerMode()) Serial.println("ON");
  else Serial.println("OFF");
  
  // 遍历每个设备，打印出地址
  for(int i=0;i<numberOfDevices; i++)
  {
    // 在总线上搜索地址，并打印地址
    if(sensors.getAddress(tempDeviceAddress, i))
	{
		Serial.print("Found device ");
		Serial.print(i, DEC);
		Serial.print(" with address: ");
		printAddress(tempDeviceAddress);
		Serial.println();
		
		Serial.print("Setting resolution to ");
		Serial.println(TEMPERATURE_PRECISION, DEC);
		
		// 将精度设置为 TEMPERATURE_PRECISION 位(每个Dallas/Maxim传感器可以有几种不同的精度)
		sensors.setResolution(tempDeviceAddress, TEMPERATURE_PRECISION);
		
		Serial.print("Resolution actually set to: ");
		Serial.print(sensors.getResolution(tempDeviceAddress), DEC); 
		Serial.println();
	}
	else
	{
		Serial.print("Found ghost device at ");
		Serial.print(i, DEC);
		Serial.print(" but could not detect address. Check power and cabling");
	}
  }

}

// 打印传感器温度 函数
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
  
  
  // 遍历每个设备，打印出温度数据
  for(int i=0;i<numberOfDevices; i++)
  {
    // 在总线上搜索地址
    if(sensors.getAddress(tempDeviceAddress, i))
	{
		// 输出设备ID
		Serial.print("Temperature for device: ");
		Serial.println(i,DEC);
		
		printTemperature(tempDeviceAddress); // 打印设备温度的函数
	} 
	//else ghost device!检查你的电源和电缆 
  }
}

// 打印设备地址的函数
void printAddress(DeviceAddress deviceAddress)
{
  for (uint8_t i = 0; i < 8; i++)
  {
    if (deviceAddress[i] < 16) Serial.print("0");
    Serial.print(deviceAddress[i], HEX);
  }
}

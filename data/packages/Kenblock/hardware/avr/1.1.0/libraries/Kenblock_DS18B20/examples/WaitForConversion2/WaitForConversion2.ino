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
 * 异步温度转换示例。使用非阻塞/异步进行温度读取，演示不同温度精度，所需的温度转换时间。
 *
 * \函数列表
 *	1.	void 	DallasTemperature::begin(void)
 *	2.	bool 	DallasTemperature::getAddress(uint8_t* deviceAddress, uint8_t index)
 *	3.	void    DallasTemperature::requestTemperatures()
 *	4.	bool 	DallasTemperature::requestTemperaturesByIndex(uint8_t deviceIndex)
 *	5.	void 	DallasTemperature::setWaitForConversion(bool flag)
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
DeviceAddress tempDeviceAddress;

int  resolution = 12; 		//精度变量
unsigned long lastTempRequest = 0;
int  delayInMillis = 0;		//延时时间
float temperature = 0.0;
int  idle = 0;				//表示闲置的时间


void setup(void)
{
  Serial.begin(115200);
  Serial.println("Dallas Temperature Control Library - Async Demo");
  
  // 传感器初始化
  sensors.begin();
  sensors.getAddress(tempDeviceAddress, 0);
  sensors.setResolution(tempDeviceAddress, resolution);// 设置温度的精度
  
  sensors.setWaitForConversion(false);	// 使能异步模式
  sensors.requestTemperatures();		// 发送命令以获得温度
  delayInMillis = 750 / (1 << (12 - resolution)); // 计算合理延时时间
  lastTempRequest = millis(); 
  
  pinMode(13, OUTPUT); 
}

void loop(void)
{ 
  
  if (millis() - lastTempRequest >= delayInMillis) // waited long enough??
  {
    digitalWrite(13, LOW);
    Serial.print(" Temperature: ");
    temperature = sensors.getTempCByIndex(0);
    Serial.println(temperature, resolution - 8); //按设置精度打印温度值
	
    Serial.print("  Resolution: ");
    Serial.println(resolution); 				//打印温度精度值
	
    Serial.print("Idle counter: ");				//打印闲置次数值
    Serial.println(idle);     
    Serial.println(); 
    
    idle = 0; 
        
    // 获取温度后，我们在异步模式下开始下一次的温度读取
    // 在延时中我们演示不同分辨率的差异
    resolution++;
    if (resolution > 12) resolution = 9;
    
    sensors.setResolution(tempDeviceAddress, resolution);	// 改变温度的精度
    sensors.requestTemperatures(); 				// 发送命令以获得温度
    delayInMillis = 750 / (1 << (12 - resolution));
    lastTempRequest = millis(); 
  }
  
  digitalWrite(13, HIGH);
  // 可以在这里做一些有用的事情
  // 计算空闲时间
  delay(1);
  idle++;
}

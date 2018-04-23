/**
 * \著作权 
 * @名称：  DallasTemperature.cpp
 * @作者：  Miles Burton, Tim Newsome, Guil Barros, Rob Tillaart
 * @版本：  V3.7.2
 * @URL: 	  https://github.com/milesburton/Arduino-Temperature-Control-Library
 * @维护：  Kenblock
 * @时间：  2017/09/11
 * @描述：  Dallas温度传感器Arduino驱动库，支持DS18B20, DS18S20, DS1822, DS1820。
 *
 * \说明
 * Dallas温度传感器Arduino驱动库，支持DS18B20, DS18S20, DS1822, DS1820。Kenblock使用传感器型号为DS18B20。
 *
 * \常用公有方法列表：（仅列出常用的）
 * 
 *	1.	void 	  begin(void)	              //初始化
 *	2.	uint8_t getDeviceCount(void)	    //获取总线上设备数量
 *	3.	bool 	  isParasitePowerMode(void)	//是否为寄生功率模式
 *	4.	bool 	  getAddress(uint8_t* deviceAddress, uint8_t index)	//
 *	5.	bool 	  setResolution(const uint8_t* deviceAddress, uint8_t newResolution)  //将设备的分辨率设置为9、10、11或12位，默认9位
 *	6.	uint8_t getResolution(const uint8_t* deviceAddress)	//将设备的温度分辨率设置为9、10、11或12位，默认9位
 *	7.	void    requestTemperatures()	                      //发送总线上所有设备执行温度转换的命令
 *	8.	float 	getTempC(const uint8_t* deviceAddress)	    //读取指定设备摄氏温度 ℃
 *	9.	float 	getTempF(const uint8_t* deviceAddress)	    //读取指定设备华氏温度 ℉	
 *	10.	float 	toFahrenheit(float celsius)	                //将摄氏度温度转换为华氏温度
 *	11.	bool 	  requestTemperaturesByIndex(uint8_t deviceIndex)	//读取指定序号设备的摄氏度温度
  *	12.	更多函数参考示例用法。
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/11      3.7.2              做汉化修订注释。
 *  
 * \示例
 *  
 * 		1.Simple.ino			    //最简单的使用方式示例 
 * 		2.Single.ino 			    //单个传感器的使用示例
 * 		3.Tester.ino 			    //测试示例，同一个端口挂载多个传感器测试示例
 * 		4.TwoPin_DS18B20.ino	//两个引脚接两个DS18B20传感器的示例
 * 		5.WaitForConversion.ino 		//异步温度转换示例（传统模式 和 异步模式的差别 ）
 * 		6.WaitForConversion2.ino		//异步温度转换示例（异步模式 下不同精度的差别）
 * 		7.Multiple.ino			        //同一总线上，多个传感器的使用
 * 		8.Multibus_simple.ino 	    //多总线简单使用方式。
 * 		9.SetUserData.ino		        //用户数据读写操作
 * 		10.报警的案例暂时翻译了。
 */
#ifndef DallasTemperature_h
#define DallasTemperature_h

#define DALLASTEMPLIBVERSION "3.7.3"

// This library is free software; you can redistribute it and/or
// modify it under the terms of the GNU Lesser General Public
// License as published by the Free Software Foundation; either
// version 2.1 of the License, or (at your option) any later version.

// 设置为true，包括新的和删除操作符的代码 set to true to include code for new and delete operators
#ifndef REQUIRESNEW
#define REQUIRESNEW false
#endif

// 设置为true，包括实现警报搜索功能的代码 set to true to include code implementing alarm search functions
#ifndef REQUIRESALARMS
#define REQUIRESALARMS true
#endif

#include <inttypes.h>
#include <OneWire.h>

// Model IDs
#define DS18S20MODEL 0x10  // also DS1820
#define DS18B20MODEL 0x28
#define DS1822MODEL  0x22
#define DS1825MODEL  0x3B

// 单总线命令
#define STARTCONVO      0x44  // 告诉设备采取的温度读数，并把它放在暂存器
#define COPYSCRATCH     0x48  // 复制 EEPROM
#define READSCRATCH     0xBE  // 读 EEPROM
#define WRITESCRATCH    0x4E  // 向EEPROM写入数据
#define RECALLSCRATCH   0xB8  // 加载最后一次更新的数据
#define READPOWERSUPPLY 0xB4  // 读取设备电源模式寄：是否为寄生电源模式
#define ALARMSEARCH     0xEC  // 带有报警条件的设备的查询总线

// 暂存寄存器
#define TEMP_LSB        0
#define TEMP_MSB        1
#define HIGH_ALARM_TEMP 2
#define LOW_ALARM_TEMP  3
#define CONFIGURATION   4
#define INTERNAL_BYTE   5
#define COUNT_REMAIN    6
#define COUNT_PER_C     7
#define SCRATCHPAD_CRC  8

// 温度分辨率
#define TEMP_9_BIT  0x1F //  9 bit
#define TEMP_10_BIT 0x3F // 10 bit
#define TEMP_11_BIT 0x5F // 11 bit
#define TEMP_12_BIT 0x7F // 12 bit

// 错误标志
#define DEVICE_DISCONNECTED_C -127
#define DEVICE_DISCONNECTED_F -196.6
#define DEVICE_DISCONNECTED_RAW -7040

typedef uint8_t DeviceAddress[8];

class DallasTemperature
{
public:

    DallasTemperature();
    DallasTemperature(OneWire*);

    void setOneWire(OneWire*);

    // initialise bus
    void begin(void);

    // returns the number of devices found on the bus
    uint8_t getDeviceCount(void);

    // returns true if address is valid
    bool validAddress(const uint8_t*);

    // returns true if address is of the family of sensors the lib supports.
    bool validFamily(const uint8_t* deviceAddress);

    // finds an address at a given index on the bus
    bool getAddress(uint8_t*, uint8_t);

    // attempt to determine if the device at the given address is connected to the bus
    bool isConnected(const uint8_t*);

    // attempt to determine if the device at the given address is connected to the bus
    // also allows for updating the read scratchpad
    bool isConnected(const uint8_t*, uint8_t*);

    // read device's scratchpad
    bool readScratchPad(const uint8_t*, uint8_t*);

    // write device's scratchpad
    void writeScratchPad(const uint8_t*, const uint8_t*);

    // read device's power requirements
    bool readPowerSupply(const uint8_t*);

    // get global resolution
    uint8_t getResolution();

    // set global resolution to 9, 10, 11, or 12 bits
    void setResolution(uint8_t);

    // returns the device resolution: 9, 10, 11, or 12 bits
    uint8_t getResolution(const uint8_t*);

    // set resolution of a device to 9, 10, 11, or 12 bits
    bool setResolution(const uint8_t*, uint8_t);

    // sets/gets the waitForConversion flag
    void setWaitForConversion(bool);
    bool getWaitForConversion(void);

    // sets/gets the checkForConversion flag
    void setCheckForConversion(bool);
    bool getCheckForConversion(void);

    // sends command for all devices on the bus to perform a temperature conversion
    void requestTemperatures(void);

    // sends command for one device to perform a temperature conversion by address
    bool requestTemperaturesByAddress(const uint8_t*);

    // sends command for one device to perform a temperature conversion by index
    bool requestTemperaturesByIndex(uint8_t);

    // returns temperature raw value (12 bit integer of 1/128 degrees C)
    int16_t getTemp(const uint8_t*);

    // returns temperature in degrees C
    float getTempC(const uint8_t*);

    // returns temperature in degrees F
    float getTempF(const uint8_t*);

    // Get temperature for device index (slow)
    float getTempCByIndex(uint8_t);

    // Get temperature for device index (slow)
    float getTempFByIndex(uint8_t);

    // returns true if the bus requires parasite power
    bool isParasitePowerMode(void);

    bool isConversionAvailable(const uint8_t*);

#if REQUIRESALARMS

    typedef void AlarmHandler(const uint8_t*);

    // sets the high alarm temperature for a device
    // accepts a char.  valid range is -55C - 125C
    void setHighAlarmTemp(const uint8_t*, char);

    // sets the low alarm temperature for a device
    // accepts a char.  valid range is -55C - 125C
    void setLowAlarmTemp(const uint8_t*, char);

    // returns a signed char with the current high alarm temperature for a device
    // in the range -55C - 125C
    char getHighAlarmTemp(const uint8_t*);

    // returns a signed char with the current low alarm temperature for a device
    // in the range -55C - 125C
    char getLowAlarmTemp(const uint8_t*);

    // resets internal variables used for the alarm search
    void resetAlarmSearch(void);

    // search the wire for devices with active alarms
    bool alarmSearch(uint8_t*);

    // returns true if ia specific device has an alarm
    bool hasAlarm(const uint8_t*);

    // returns true if any device is reporting an alarm on the bus
    bool hasAlarm(void);

    // runs the alarm handler for all devices returned by alarmSearch()
    void processAlarms(void);

    // sets the alarm handler
    void setAlarmHandler(const AlarmHandler *);

    // The default alarm handler
    static void defaultAlarmHandler(const uint8_t*);

#endif

    // if no alarm handler is used the two bytes can be used as user data
    // example of such usage is an ID.
    // note if device is not connected it will fail writing the data.
    // note if address cannot be found no error will be reported.
    // in short use carefully
    void setUserData(const uint8_t*, int16_t );
    void setUserDataByIndex(uint8_t, int16_t );
    int16_t getUserData(const uint8_t* );
    int16_t getUserDataByIndex(uint8_t );

    // convert from Celsius to Fahrenheit
    static float toFahrenheit(float);

    // convert from Fahrenheit to Celsius
    static float toCelsius(float);

    // convert from raw to Celsius
    static float rawToCelsius(int16_t);

    // convert from raw to Fahrenheit
    static float rawToFahrenheit(int16_t);

#if REQUIRESNEW

    // initialize memory area
    void* operator new (unsigned int);

    // delete memory reference
    void operator delete(void*);

#endif

private:
    typedef uint8_t ScratchPad[9];

    // parasite power on or off
    bool parasite;

    // used to determine the delay amount needed to allow for the
    // temperature conversion to take place
    uint8_t bitResolution;

    // used to requestTemperature with or without delay
    bool waitForConversion;

    // used to requestTemperature to dynamically check if a conversion is complete
    bool checkForConversion;

    // count of devices on the bus
    uint8_t devices;

    // Take a pointer to one wire instance
    OneWire* _wire;

    // reads scratchpad and returns the raw temperature
    int16_t calculateTemperature(const uint8_t*, uint8_t*);

    int16_t millisToWaitForConversion(uint8_t);

    void	blockTillConversionComplete(uint8_t, const uint8_t*);

#if REQUIRESALARMS

    // required for alarmSearch
    uint8_t alarmSearchAddress[8];
    char alarmSearchJunction;
    uint8_t alarmSearchExhausted;

    // the alarm handler function pointer
    AlarmHandler *_AlarmHandler;

#endif

};
#endif
/**
 * \著作权 
 * @名称：  RTClib.h
 * @作者：  Adafruit, JeeLabs
 * @版本：  V1.2.1
 * @URL: 	  https://github.com/adafruit/RTClib
 * @维护：  Kenblock
 * @时间：  2017/09/13
 * @描述：  RTC时钟库，支持DS3231、DS1307、PCF8523时钟芯片。
 *
 * \说明
 * RTC时钟库，支持DS3231、DS1307、PCF8523时钟芯片，使用Wire通信。Kenblock使用DS3231 时钟芯片，IIC地址为 0x68。
 *
 * \常用公有方法列表：（仅列出常用的）
 * 
 *	1.	boolean RTC_DS3231::begin(void)		//初始化
 *	2.	bool 	RTC_DS3231::lostPower(void)	//查询是否失电
 *	3.	void 	RTC_DS3231::adjust(const DateTime& dt)	//设置时间
 *	4.	DateTime RTC_DS3231::now()			  //读取时钟芯片寄存器
 *	5.	DateTime::DateTime (const char* date, const char* time)	//时间数据Class。初始化如：DateTime now (__DATE__, __TIME__);
 *	6.	DateTime::DateTime (uint16_t year, uint8_t month, uint8_t day, uint8_t hour, uint8_t min, uint8_t sec)	//时间数据Class。初始化如：DateTime now (2017, 9, 13, 17, 20, 01);
 *	7.	uint16_t DateTime::year()				  //年
 *	8.	uint8_t DateTime::month()				  //月
 *	9.	uint8_t DateTime::day()					  //日
 *	10.	uint8_t DateTime::hour()				  //时
 *	11.	uint8_t DateTime::minute()				//分
 *	12.	uint8_t DateTime::second()				//秒
 *	13.	uint8_t DateTime::dayOfTheWeek()	//星期几
 *	14.	还有 DateTime、TimeSpan 等。
 *	15.	更多函数参考示例用法。
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/13      1.2.1              做汉化修订注释。
 *  
 * \示例
 *  
 * 		1.ds3231.ino			  //DS3231 使用示例，使用DateTime RTC_DS3231::now() 方式，更推荐此方式
 * 		2.ds3231_test.ino		//DS3231 使用示例，直接读取方式
 * 		3.其他芯片示例暂不翻译。
 */
 
#ifndef  Kenblock_RTClib_H
#define  Kenblock_RTClib_H

#include <Arduino.h>
class TimeSpan;


#define PCF8523_ADDRESS       0x68
#define PCF8523_CLKOUTCONTROL 0x0F
#define PCF8523_CONTROL_3     0x02

#define DS1307_ADDRESS  0x68
#define DS1307_CONTROL  0x07
#define DS1307_NVRAM    0x08

#define DS3231_ADDRESS  0x68
#define DS3231_CONTROL  0x0E
#define DS3231_STATUSREG 0x0F

#define SECONDS_PER_DAY 86400L

#define SECONDS_FROM_1970_TO_2000 946684800



// Simple general-purpose date/time class (no TZ / DST / leap second handling!)
class DateTime {
public:
    DateTime (uint32_t t =0);
    DateTime (uint16_t year, uint8_t month, uint8_t day,
                uint8_t hour =0, uint8_t min =0, uint8_t sec =0);
    DateTime (const DateTime& copy);
    DateTime (const char* date, const char* time);
    DateTime (const __FlashStringHelper* date, const __FlashStringHelper* time);
    uint16_t year() const       { return 2000 + yOff; }
    uint8_t month() const       { return m; }
    uint8_t day() const         { return d; }
    uint8_t hour() const        { return hh; }
    uint8_t minute() const      { return mm; }
    uint8_t second() const      { return ss; }
    uint8_t dayOfTheWeek() const;

    // 32-bit times as seconds since 1/1/2000
    long secondstime() const;   
    // 32-bit times as seconds since 1/1/1970
    uint32_t unixtime(void) const;

    DateTime operator+(const TimeSpan& span);
    DateTime operator-(const TimeSpan& span);
    TimeSpan operator-(const DateTime& right);

protected:
    uint8_t yOff, m, d, hh, mm, ss;
};

// Timespan which can represent changes in time with seconds accuracy.
class TimeSpan {
public:
    TimeSpan (int32_t seconds = 0);
    TimeSpan (int16_t days, int8_t hours, int8_t minutes, int8_t seconds);
    TimeSpan (const TimeSpan& copy);
    int16_t days() const         { return _seconds / 86400L; }
    int8_t  hours() const        { return _seconds / 3600 % 24; }
    int8_t  minutes() const      { return _seconds / 60 % 60; }
    int8_t  seconds() const      { return _seconds % 60; }
    int32_t totalseconds() const { return _seconds; }

    TimeSpan operator+(const TimeSpan& right);
    TimeSpan operator-(const TimeSpan& right);

protected:
    int32_t _seconds;
};

// RTC based on the DS1307 chip connected via I2C and the Wire library
enum Ds1307SqwPinMode { OFF = 0x00, ON = 0x80, SquareWave1HZ = 0x10, SquareWave4kHz = 0x11, SquareWave8kHz = 0x12, SquareWave32kHz = 0x13 };

class RTC_DS1307 {
public:
    boolean begin(void);
    static void adjust(const DateTime& dt);
    uint8_t isrunning(void);
    static DateTime now();
    static Ds1307SqwPinMode readSqwPinMode();
    static void writeSqwPinMode(Ds1307SqwPinMode mode);
    uint8_t readnvram(uint8_t address);
    void readnvram(uint8_t* buf, uint8_t size, uint8_t address);
    void writenvram(uint8_t address, uint8_t data);
    void writenvram(uint8_t address, uint8_t* buf, uint8_t size);
};

// RTC based on the DS3231 chip connected via I2C and the Wire library
enum Ds3231SqwPinMode { DS3231_OFF = 0x01, DS3231_SquareWave1Hz = 0x00, DS3231_SquareWave1kHz = 0x08, DS3231_SquareWave4kHz = 0x10, DS3231_SquareWave8kHz = 0x18 };

class RTC_DS3231 {
public:
    boolean begin(void);
    static void adjust(const DateTime& dt);
    bool lostPower(void);
    static DateTime now();
    static Ds3231SqwPinMode readSqwPinMode();
    static void writeSqwPinMode(Ds3231SqwPinMode mode);
	
	uint16_t getYear(); 
	uint8_t getMonth();	
	uint8_t getDay(); 
	uint8_t getDayOfTheWeek();
	uint8_t getHour(bool& h12, bool& PM); 
	uint8_t getHour(); 
	uint8_t getMinute(); 
	uint8_t getSecond(); 
	float getTemperature();
};


// RTC based on the PCF8523 chip connected via I2C and the Wire library
enum Pcf8523SqwPinMode { PCF8523_OFF = 7, PCF8523_SquareWave1HZ = 6, PCF8523_SquareWave32HZ = 5, PCF8523_SquareWave1kHz = 4, PCF8523_SquareWave4kHz = 3, PCF8523_SquareWave8kHz = 2, PCF8523_SquareWave16kHz = 1, PCF8523_SquareWave32kHz = 0 };

class RTC_PCF8523 {
public:
    boolean begin(void);
    void adjust(const DateTime& dt);
    boolean initialized(void);
    static DateTime now();

    Pcf8523SqwPinMode readSqwPinMode();
    void writeSqwPinMode(Pcf8523SqwPinMode mode);
};

// RTC using the internal millis() clock, has to be initialized before use
// NOTE: this clock won't be correct once the millis() timer rolls over (>49d?)
class RTC_Millis {
public:
    static void begin(const DateTime& dt) { adjust(dt); }
    static void adjust(const DateTime& dt);
    static DateTime now();

protected:
    static long offset;
};

#endif // Kenblock_RTClib_H

/**
 * \著作权 
 * @名称：  ds3231.ino
 * @作者：  Adafruit, JeeLabs
 * @版本：  V0.1.0
 * @维护：  Kenblock
 * @时间：  2017/09/13
 * @描述：  DS3231时钟使用示例。
 *
 * \说明
 * DS3231时钟使用示例，通过I2C通信，地址为：0x68。设置、读取日期、时间，将日期、时间串口打印出来。
 *
 * \函数列表
 *	1.	boolean RTC_DS3231::begin(void)		//初始化
 *	2.	bool 	RTC_DS3231::lostPower(void)	//查询是否失电
 *	3.	void 	RTC_DS3231::adjust(const DateTime& dt)	//设置时间
 *	4.	DateTime RTC_DS3231::now()			//读取时钟芯片寄存器
 *	5.	DateTime::DateTime (const char* date, const char* time)	//时间数据Class。初始化如：DateTime now (__DATE__, __TIME__);
 *	6.	DateTime::DateTime (uint16_t year, uint8_t month, uint8_t day, uint8_t hour, uint8_t min, uint8_t sec)	//时间数据Class。
 *	7.	uint16_t DateTime::year()				//年
 *	8.	uint8_t DateTime::month()				//月
 *	9.	uint8_t DateTime::day()					//日
 *	10.	uint8_t DateTime::hour()				//时
 *	11.	uint8_t DateTime::minute()				//分
 *	12.	uint8_t DateTime::second()				//秒
 *	13.	uint8_t DateTime::dayOfTheWeek()		//星期几
 *	14.	还有 DateTime、TimeSpan 等。
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/13     0.1.0              做汉化修订注释。
 *  
 */
#include <Wire.h>
#include "Kenblock_RTClib.h"

RTC_DS3231 rtc;

//星期数组
char daysOfTheWeek[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

void setup () {
  // 串口初始化
  Serial.begin(9600);
  while (!Serial); // for Leonardo/Micro/Zero


  delay(3000); // 延时一段时间，等待各部分初始化完成
  
  // 初始化时钟模块
  if (! rtc.begin()) {
    Serial.println("Couldn't find RTC");
    while (1);
  }
  
  // 查询是否失电，如果失电，需要重新设置时间
  if (rtc.lostPower()) {
    Serial.println("RTC lost power, lets set the time!");
	
    // 将日期和时间设置为程序编译的时间，即在编译此程序时的电脑系统的时间
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
	
    // 也可以设置一个确定的时间，比如设置为2017/9/13 16:15:14
    // rtc.adjust(DateTime(2017, 9, 13, 16, 15, 14));
  }
}

void loop () {
	// 读取时钟芯片寄存器,读取日期、时间。
    DateTime now = rtc.now();
	
    // 打印 年/月/日 星期 时:分:秒
    Serial.print(now.year(), DEC);
    Serial.print('/');
    Serial.print(now.month(), DEC);
    Serial.print('/');
    Serial.print(now.day(), DEC);
    Serial.print(" (");
    Serial.print(daysOfTheWeek[now.dayOfTheWeek()]);
    Serial.print(") ");
    Serial.print(now.hour(), DEC);
    Serial.print(':');
    Serial.print(now.minute(), DEC);
    Serial.print(':');
    Serial.print(now.second(), DEC);
    Serial.println();
    
	// 计算unix系统的时间：从1970/1/1 0时开始
    Serial.print(" since midnight 1/1/1970 = ");
    Serial.print(now.unixtime());			//计算unix系统的时间,单位为s
    Serial.print("s = ");
    Serial.print(now.unixtime() / 86400L);	//换算为天数
    Serial.println("d");
    
    // 计算未来时间：比如计算一个 7天12小时30分30秒后的时间
    DateTime future (now + TimeSpan(7,12,30,6));
	
    // 打印 
    Serial.print(" now + 7d + 12h + 30min + 30s: ");
    Serial.print(future.year(), DEC);
    Serial.print('/');
    Serial.print(future.month(), DEC);
    Serial.print('/');
    Serial.print(future.day(), DEC);
    Serial.print(' ');
    Serial.print(future.hour(), DEC);
    Serial.print(':');
    Serial.print(future.minute(), DEC);
    Serial.print(':');
    Serial.print(future.second(), DEC);
    Serial.println();
	
    delay(3000);
}
 /**
 * \著作权 
 * @名称：  uper_ds1307.cpp
 * @作者：  uper
 * @版本：  v171213
 * @URL:    http://www.uper.cc
 * @维护：  uper
 * @时间：  2017/12/13
 *
 * \说明
 * RTC时钟模块驱动
 *
 * \公有方法列表
 * 
 *    1.void ds1307Setup(uint8_t _scl, uint8_t _sda)
 *    2.uint8_t getSecond(void)
 *    3.uint8_t getMinute(void)
 *    4.uint8_t getHour(void)
 *    5.uint8_t getWeek(void)
 *    6.uint8_t getDay(void)
 *    7.uint8_t getMonth(void)
 *    8.uint16_t getYear(void)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  
 * \示例
 *  
 *    1.uper_RTC.ino
 */
#include "uper_ds1307.h"
#include "SoftIIC.h"
#include "string.h"


#define USE_SOFT_I2C 1

SoftIIC ds1307;

uint8_t uper_RTC::decToBcd(uint8_t val)
{
	return ( (val/10*16) + (val%10) );
}

//Convert binary coded decimal to normal decimal numbers
uint8_t uper_RTC::bcdToDec(uint8_t val)
{
	return ( (val/16*10) + (val%16) );
}

uper_RTC::uper_RTC()
{
	

    
}

void uper_RTC::ds1307Setup(uint8_t _scl, uint8_t _sda)
{

  ds1307.begin(_sda, _scl);
}

/*
 * Read 'count' bytes from the DS1307 starting at 'address'
 */
uint8_t uper_RTC::readDS1307(uint8_t address, uint8_t *buf, uint8_t count) {
  // issue a start condition, send device address and write direction bit
  if (!ds1307.start(DS1307ADDR | I2C_WRITE)) return false;

  // send the DS1307 address
  if (!ds1307.write(address)) return false;

  // issue a repeated start condition, send device address and read direction bit
  if (!ds1307.restart(DS1307ADDR | I2C_READ))return false;

  // read data from the DS1307
  for (uint8_t i = 0; i < count; i++) {

    // send Ack until last byte then send Ack
    buf[i] = ds1307.read(i == (count-1));
  }

  // issue a stop condition
  ds1307.stop();
  return true;
}
//------------------------------------------------------------------------------
/*
 * write 'count' bytes to DS1307 starting at 'address'
 */
uint8_t uper_RTC::writeDS1307(uint8_t address, uint8_t *buf, uint8_t count) {
  // issue a start condition, send device address and write direction bit
  if (!ds1307.start(DS1307ADDR | I2C_WRITE)) return false;

  // send the DS1307 address
  if (!ds1307.write(address)) return false;

  // send data to the DS1307
  for (uint8_t i = 0; i < count; i++) {
    if (!ds1307.write(buf[i])) return false;
  }

  // issue a stop condition
  ds1307.stop();
  return true;
}

/****************************************************************/
/*Function: Read time and date from RTC	*/
void uper_RTC::getTime()
{
    uint8_t r[8];
    
    if (!readDS1307(0, r, 7)) 
    {
        return;
    }
  
	second	   = bcdToDec(r[0] & 0x7f);
	minute	   = bcdToDec(r[1]);
	hour	   = bcdToDec(r[2] & 0x3f);// Need to change this if 12 hour am/pm
	week  	   = bcdToDec(r[3]);
	day        = bcdToDec(r[4]);
	month      = bcdToDec(r[5]);
	year	   = bcdToDec(r[6]);
}

/*******************************************************************/


void uper_RTC::fillByHMS(uint8_t _hour, uint8_t _minute, uint8_t _second)
{
    uint8_t r[3];
	// assign variables
	r[2] = decToBcd(_hour);
	r[1] = decToBcd(_minute);
	r[0] = decToBcd(_second);
	  
    if (!writeDS1307(0, r, 3)) 
    {
        return;
    }
}

void uper_RTC::fillByYMD(uint16_t _year, uint8_t _month, uint8_t _day)
{ 
    uint8_t r[3];
	// assign variables
	r[2] = decToBcd(_year-2000);
	r[1] = decToBcd(_month);
	r[0] = decToBcd(_day);
	  
    if (!writeDS1307(4, r, 3)) 
    {
        return;
    }  
}

void uper_RTC::fillByWeek(uint8_t _week)
{
    uint8_t r[1];
    
	r[0] = decToBcd(_week);
	  
    if (!writeDS1307(3, r, 1)) 
    {
        return;
    } 
}

uint8_t uper_RTC::getSecond(void)
{
    getTime();
	return second;
}
uint8_t uper_RTC::getMinute(void)
{
    getTime();
	return minute;
}
uint8_t uper_RTC::getHour(void)
{
    getTime();
	return hour;
}
uint8_t uper_RTC::getWeek(void)
{
    getTime();
	return week;
}
uint8_t uper_RTC::getDay(void)
{
    getTime();
	return day;
}
uint8_t uper_RTC::getMonth(void)
{
    getTime();
	return month;
}
uint16_t uper_RTC::getYear(void)
{
    getTime();
	return year+2000;
}
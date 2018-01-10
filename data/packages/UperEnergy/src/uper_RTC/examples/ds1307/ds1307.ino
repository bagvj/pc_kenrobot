/*
www.uper.cc
*/

#include <uper_ds1307.h>

RTC rtc;

void setup() {
  Serial.begin(9600);
  rtc.ds1307Setup(A5,A4);
  rtc.fillByHMS(17, 40, 00); // 17:40:00
  rtc.fillByYMD(2016, 1, 12);// 2016.01.12
  rtc.fillByWeek(2); // Tuesday      

}

void loop() {

  printTime();
  delay(500);
}

void printTime()
{
  Serial.print(rtc.getYear(), DEC);
  Serial.print("/");
  Serial.print(rtc.getMonth(), DEC);
  Serial.print("/");
  Serial.print(rtc.getDay(), DEC);
  Serial.print(" ");
  Serial.print(rtc.getHour(), DEC);
  Serial.print(":");
  Serial.print(rtc.getMinute(), DEC);
  Serial.print(":");
  Serial.print(rtc.getSecond(), DEC);
  
  Serial.print(" ");
  
  switch(rtc.getWeek())
  {
   case 1:Serial.println("Mon");
   break;
 
   case 2:Serial.println("Tues");
   break; 
   
   case 3:Serial.println("Wed");
   break;
   
   case 4:Serial.println("Thur");
   break;
   
   case 5:Serial.println("Fri");
   break;
   
   case 6:Serial.println("Sat");
   break;
   
   case 7:Serial.println("Sun");
   break;
  }

  
}

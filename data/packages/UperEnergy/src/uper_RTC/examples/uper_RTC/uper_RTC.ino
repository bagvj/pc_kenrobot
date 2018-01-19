#include <uper_ds1307.h>

uper_RTC uper_rtc;

void setup() {
  Serial.begin(9600);
  uper_rtc.ds1307Setup(A5,A4);
  uper_rtc.fillByHMS(17, 40, 00); // 17:40:00
  uper_rtc.fillByYMD(2016, 1, 12);// 2016.01.12
  uper_rtc.fillByWeek(2); // Tuesday      

}

void loop() {

  printTime();
  delay(500);
}

void printTime()
{
  Serial.print(uper_rtc.getYear(), DEC);
  Serial.print("/");
  Serial.print(uper_rtc.getMonth(), DEC);
  Serial.print("/");
  Serial.print(uper_rtc.getDay(), DEC);
  Serial.print(" ");
  Serial.print(uper_rtc.getHour(), DEC);
  Serial.print(":");
  Serial.print(uper_rtc.getMinute(), DEC);
  Serial.print(":");
  Serial.print(uper_rtc.getSecond(), DEC);
  
  Serial.print(" ");
  
  switch(uper_rtc.getWeek())
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

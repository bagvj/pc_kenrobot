#include <Wire.h>
#include "LiquidCrystal_I2C.h" 

LiquidCrystal_I2C lcd(0x27, 20, 4);

int SNUM[3] ;//定义3个传感器
#include "Servo_Motor.h"//调用小车驱动库文件
#define Left_wheel 2  //声明左轮连接2号口
#define Right_wheel 3  //申明右轮链接3号口

Servo_Motor sm(Left_wheel,Right_wheel);//创建一个小车工程名为sm

void setup()
{ 
  lcd.init();
  lcd.setCursor(0,0);
  lcd.print("test");
  
  pinMode(14, 0);
  pinMode(15, 0);
  pinMode(16, 0);
  pinMode(17, 0);
  pinMode(18, 0);
  pinMode(19, 0);

  pinMode(4,1);
  pinMode(5,1);
  pinMode(6,1);
  pinMode(7,1);

  digitalWrite(4,0);
  digitalWrite(5,1);
  digitalWrite(7,0);
  digitalWrite(6,1);
  delay(1000);
  digitalWrite(4,!0);
  digitalWrite(5,!1);
  digitalWrite(7,!0);
  digitalWrite(6,!1);
  delay(1000);
  
  sm.calibrate();
  sm.turnLeft(90);
  delay(500);
  sm.turnRight(90);
  delay(500);
  sm.run(-100);
  delay(500);
  sm.run(100);
   delay(1500);
   
}

void loop()
{
  SNUM[0] = digitalRead(14);
  SNUM[1] = digitalRead(15);
  SNUM[2] = digitalRead(16);
  for (int i = 0; i < 3; i++)
  {
    Serial.print(SNUM[i]);
  }
  Serial.println( );

 if ((SNUM[0]==0)&&SNUM[1]&&SNUM[2])//左端传感器检测到黑线
  {
  sm.turnLeft(5);
  }
  if (SNUM[0]&&(SNUM[1]==0)&&SNUM[2])//中间传感器检测到黑线
  {
  sm.run(100);
  }
  if (SNUM[0]&&SNUM[1]&&(SNUM[2]==0))//右端传感器检测到黑线
  {
     sm.turnRight(5);
  }    

}

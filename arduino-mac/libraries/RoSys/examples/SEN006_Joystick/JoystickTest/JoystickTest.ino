/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  JoystickTest.ino
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  Joystick 摇杆模块测试示例。
 * 
 * \说明
 *  Joystick 摇杆模块测试示例。出口显示遥感模块的X轴、Y轴、角度、离中心距离。
 * 
 * \函数列表
 *  1. int16_t RoJoystick::readX(void)
 *  2. int16_t RoJoystick::readY(void)
 *  3. float RoJoystick::angle(void)
 *  4. float RoJoystick::offcenter(void)
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建程序。
 * 
 */

#include "RoSys.h"

RoJoystick joystick(PA1);   //摇杆模块接口

int16_t x = 0;              //摇杆模块 X轴 的值
int16_t y = 0;              //摇杆模块 Y轴 的值
float angle = 0;            //操作杆的角度值
float offcenter = 0;        //操作杆离中心的距离

void setup()
{
  Serial.begin(9600);      //设置串口波特率为9600
}

void loop()
{
  //读取摇杆模块的值
  x = joystick.readX();
  y = joystick.readY();
  angle = joystick.angle();
  offcenter = joystick.offcenter();

  //串口输出显示
  Serial.print("Joystick:   X = ");
  Serial.print(x);
  Serial.print("   Y = ");
  Serial.print(y);
  Serial.print("   angle =");
  Serial.print(angle);
  Serial.print("   offcenter= ");
  Serial.println(offcenter);
  
  delay(10);               //延时10ms
}

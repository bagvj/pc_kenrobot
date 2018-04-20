/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  InfraredSensorSwitch.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/11/03
 * @描述：  Infrared Sensor Switch 红外避障模块测试实例。
 *
 * \说明
 * Infrared Sensor Switch 红外避障模块测试实例。
 *
 * \函数列表
 *
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING           2017/11/03      0.1.0              新建程序。
 *  
 */
int ledPin= 3;                   //LED模块接口引脚
int IRSwitchPin= 2;              //红外避障模块接口引脚

void setup()
{
  pinMode(ledPin, OUTPUT);       //设置LED灯的接口为输出模式
  pinMode(IRSwitchPin, INPUT);   //设置红外避障模块的接口为输入模式
}

void loop()
{
  int IRSwitchVal = digitalRead(IRSwitchPin); //设置变量,读取开关状态
  if (IRSwitchVal == LOW)        //判断输入值是否为高，即有无物体遮挡
  {
    digitalWrite(ledPin, HIGH);   //LED灯点亮
  }
  else
  {
    digitalWrite(ledPin, LOW);    //LED灯熄灭
  }
}


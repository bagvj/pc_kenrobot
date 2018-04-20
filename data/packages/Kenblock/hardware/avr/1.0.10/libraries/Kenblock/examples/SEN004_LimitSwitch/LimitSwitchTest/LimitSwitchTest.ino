/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  LimitSwitchTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/09/01
 * @描述：  LimitSwitch 限位开关模块测试示例。
 *
 * \说明
 * LimitSwitch 限位开关模块测试示例。
 *
 * \函数列表
 *
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/01      0.1.0              新建程序。
 *  
 */
int ledPin= 3;               	//LED模块接口引脚
int limitSwitchPin= 2;        	//限位开关模块接口引脚

void setup()
{
  pinMode(ledPin, OUTPUT);           	// 设置LED灯的接口为输出模式
  pinMode(limitSwitchPin, INPUT_PULLUP);// 设置限位开关模块的接口为输入，内部上拉
}

void loop()
{
  int value = digitalRead(limitSwitchPin); //设置变量,读取开关状态
  if (value == HIGH)    				//判断输入值是否为高，即限位开关被按下
  {
    digitalWrite(ledPin, HIGH);       	// LED灯点亮
  }
  else
  {
    digitalWrite(ledPin, LOW);        	// LED灯熄灭
  }
}


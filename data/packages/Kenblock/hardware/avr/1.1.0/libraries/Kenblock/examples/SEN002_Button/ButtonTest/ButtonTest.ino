/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  ButtonTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/09/01
 * @描述：  Button 按键模块测试示例。
 *
 * \说明
 * Button 按键模块测试示例。
 *
 * \函数列表
 *
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/01      0.1.0              新建程序。
 *  
 */
int ledPin= 3;                   	//LED模块接口引脚
int buttonPin = 2;               	//按键模块接口引脚

void setup()
{
  pinMode(ledPin, OUTPUT);         	// 设置LED灯的接口为输出模式
  pinMode(buttonPin, INPUT_PULLUP); //设置按键模块的接口为输入，内部上拉
}
void loop()
{
  int value = digitalRead(buttonPin); //设置变量,读取键值
  if (value == LOW)               	//检查输入值是否为低，即按键被按下
  {
    digitalWrite(ledPin, HIGH);    	// LED灯点亮
  }
  else                             	//按键弹起
  { 
    digitalWrite(ledPin, LOW);     	// LED灯熄灭
  }
}


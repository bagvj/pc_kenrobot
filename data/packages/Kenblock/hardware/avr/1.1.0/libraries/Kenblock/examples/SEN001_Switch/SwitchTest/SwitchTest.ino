/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  SwitchTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/09/01
 * @描述：  Switch 开关模块测试示例。
 *
 * \说明
 * Switch 开关模测试示例。
 *
 * \函数列表
 *
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/01      0.1.0              新建程序。
 *  
 */
int ledPin = 3;               		//LED模块接口引脚
int switchPin = 2;                  //开关模块接口引脚
void setup()
{
  pinMode(ledPin, OUTPUT);        	// 设置LED灯的接口为输出模式
  pinMode(switchPin, INPUT_PULLUP); // 设置开关模块的接口为输入，内部上拉
}

void loop()
{
  int value = digitalRead(switchPin); //设置变量,读取开关状态
  if (value == LOW)               	//判断输入值是否为
  {
    digitalWrite(ledPin, HIGH);    	// LED灯点亮
  }
  else
  {
    digitalWrite(ledPin, LOW);    	// LED灯熄灭
  }
}

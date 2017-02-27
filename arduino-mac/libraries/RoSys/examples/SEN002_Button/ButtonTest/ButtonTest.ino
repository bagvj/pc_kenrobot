/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  ButtonTest.ino
 * @作者：  RoSys
 * @版本：  V1.1.0
 * @时间：  2016/10/10
 * @描述：  Button 按键模块测试示例。
 * 
 * \说明
 * Button 按键模块测试示例。当按键按下时，主板上的13号引脚的LED（L）将会被点亮，松开后，灯熄灭。
 * 
 * \函数列表
 * 
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建程序。
 * 
 */
 
int led = 13;              	//选择灯的引脚
int button = 2;            	//按键接口

void setup()
{
  pinMode(led, OUTPUT);        		// 定义灯的引脚为输出引脚
  pinMode(button, INPUT_PULLUP);  	// 定义按键接口为输入，INPUT_PULLUP：设置为输入，内部上拉
}

void loop()
{
  int buttonVal = digitalRead(button); 	//设置变量,读取输入值
  if (buttonVal == LOW)               	//检查输入值是否为低，即按键被按下
  {
    digitalWrite(led, HIGH);       		// L灯亮起
  }
  else
  {
    digitalWrite(led, LOW);        		// L灯熄灭
  }
}

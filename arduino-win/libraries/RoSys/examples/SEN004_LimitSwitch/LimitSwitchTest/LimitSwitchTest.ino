/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  CrashTest.ino
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  LimitSwitch 限位开关模块测试示例。
 * 
 * \说明
 * LimitSwitch 限位开关模块测试示例。当限位开关被压下时（高电平），主板上的13号引脚的LED（L）将会被点亮，弹起时，L灯熄灭。
 * 
 * \函数列表
 * 
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建程序。
 * 
 */
 
int led = 13;              			//选择灯的引脚
int limitSwitch = 2;               	//限位开关模块接口

void setup()
{
  pinMode(led, OUTPUT);        			// 定义灯的引脚为输出引脚
  pinMode(limitSwitch, INPUT_PULLUP);  	// 定义碰撞传感接口为输入，INPUT_PULLUP：设置为输入，内部上拉
}

void loop()
{
  int value = digitalRead(limitSwitch); //设置变量,读取开关状态
  if (value == HIGH)               		//检查输入值是否为高，即限位开关被压下
  {
    digitalWrite(led, HIGH);       		// L灯亮起
  }
  else
  {
    digitalWrite(led, LOW);        		// L灯熄灭
  }
}

/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  SwitchTest.ino
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  Switch 开关模块测试示例。
 * 
 * \说明
 * Switch 开关模块测试示例。开关拨到LOW时，主板上的13号引脚的LED（L）将会被点亮，拨到HIGH，灯熄灭。
 * 
 * \函数列表
 * 
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建程序。
 * 
 */
 
int led = 13;              		//选择灯的引脚
int switch = 2;            		//开关模块接口

void setup()
{
  pinMode(led, OUTPUT);        		// 定义灯的引脚为输出引脚
  pinMode(switch, INPUT_PULLUP);  	// 定义开关接口为输入，INPUT_PULLUP：设置为输入，内部上拉
}

void loop()
{
  int switchVal = digitalRead(switch); 	//设置变量,读取开关状态
  if (switchVal == LOW)               	//检查输入值是否为低，即开关拨到LOW
  {
    digitalWrite(led, HIGH);       		// L灯亮起
  }
  else
  {
    digitalWrite(led, LOW);        		// L灯熄灭
  }
}

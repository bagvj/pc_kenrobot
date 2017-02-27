/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  TouchSensorTest.ino
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  TouchSensor 电容触摸模块测试示例。
 * 
 * \说明
 * TouchSensor 电容触摸模块测试示例。当触摸模块时，主板上的13号引脚的LED（L）将会被点亮，松开后，灯熄灭。
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
int touch = 2;          		//电容触摸模块接口

void setup()
{
  pinMode(led, OUTPUT);        			// 定义灯的引脚为输出引脚
  pinMode(touch, INPUT_PULLUP); 		// 定义电容触摸模块接口为输入，INPUT_PULLUP：设置为输入，内部上拉
  Serial.begin(9600);                	//设置串口波特率为9600 
}

void loop()
{
  int touchVal = digitalRead(touch); 	//设置变量,读取输入值
  if (touchVal == LOW)               	//检查输入值是否为低，即触摸按键
  {
    digitalWrite(led, HIGH);       		// L灯亮起
	Serial.println("DOWN");
  }
  else
  {
    digitalWrite(led, LOW);        		// L灯熄灭
	Serial.println("UP");
  }
  delay(500);
}

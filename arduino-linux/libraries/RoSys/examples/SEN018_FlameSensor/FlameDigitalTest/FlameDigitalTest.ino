/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  FlameDigitalTest.ino
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  Flame Sensor 火焰传感模块 数字输出 测试示例。
 * 
 * \说明
 * Flame Sensor 火焰传感模块 数字输出 测试示例。检测到火焰时，主板上的13号引脚的LED（L）将会被点亮，反之L灯熄灭。串口输出显示状态。
 *  
 * Flame Sensor 火焰传感模块 模拟输出 测试示例请见：FlameAnalogTest.ino
 * 
 * \函数列表
 * 
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建程序。
 * 
 */
 
int led = 13;                     		//选择灯的引脚
int flameSensor_D = 2;          	 	//火焰传感模块接口

void setup()
{
  pinMode(led, OUTPUT);           		// 定义灯的引脚为输出引脚
  pinMode(flameSensor_D, INPUT_PULLUP);  // 定义开关接口为输入，INPUT_PULLUP：设置为输入，内部上拉

  Serial.begin(9600);               	//设置波特率为9600
}

void loop()
{
  int value = digitalRead(flameSensor_D);  //设置变量,读取开关状态
  if (value == LOW)                 	//检查输入值是否为低，即检测到火焰
  {
    digitalWrite(led, HIGH);     		// L灯亮起
    Serial.println("Fire");
  }
  else
  {
    digitalWrite(led, LOW);      		// L灯熄灭
    Serial.println("NoFire");
  }
  delay(100);
}

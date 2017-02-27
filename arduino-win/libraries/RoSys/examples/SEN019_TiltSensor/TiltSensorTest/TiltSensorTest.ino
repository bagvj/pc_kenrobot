/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  TiltSensorTest.ino
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  Tilt Sensor 倾斜传感模块测试示例。
 * 
 * \说明
 * Tilt Sensor 倾斜传感模块测试示例。传感器倾斜时，主板上的13号引脚的LED（L）将会被点亮，没有倾斜时，L灯熄灭。串口发送状态。
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
int tiltSensor = 2;               	//倾斜传感模块接口

void setup()
{
  pinMode(led, OUTPUT);          	// 定义灯的引脚为输出引脚
  pinMode(tiltSensor, INPUT_PULLUP);   // 定义倾斜传感接口为输入，INPUT_PULLUP：设置为输入，内部上拉

  Serial.begin(9600);              	//设置波特率为9600
}

void loop()
{
  int value = digitalRead(tiltSensor); //设置变量,读取开关状态
  if (value == LOW)                 //检查输入值是否为低，即发生了倾斜
  {
    digitalWrite(led, HIGH);     	// L灯亮起
    Serial.println("Tilt");
  }
  else
  {
    digitalWrite(led, LOW);      	// L灯熄灭
    Serial.println("No Tilt");
  }
}

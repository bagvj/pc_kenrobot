/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  TrackingSensorTest.ino
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  Tracking Sensor 巡线传感模块测试示例。
 * 
 * \说明
 *  Tracking Sensor 巡线传感模块测试示例。传感器位于黑线上方时，输出高电平（HIGH），主板上的13号引脚的LED（L）将会被点亮，否则L灯熄灭。串口输出显示状态。
 * 
 * \函数列表
 * 
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建程序。
 * 
 */
 
int led = 13;                           	//选择灯的引脚
int trackingSensor = 2;                    	//巡线传感模块接口

void setup()
{
  pinMode(led, OUTPUT);                 	// 定义灯的引脚为输出引脚
  pinMode(trackingSensor, INPUT_PULLUP);   	// 定义巡线传感模块接口为输入，INPUT_PULLUP：设置为输入，内部上拉
  Serial.begin(9600);                     	//设置串口波特率为9600               
}

void loop()
{
  int value = digitalRead(trackingSensor); 	//设置变量,读取输入值
  if (value == HIGH)                       	//检查输入值是否为高，即传感器是否位于黑线上方
  {
    digitalWrite(led, HIGH);            	// L灯亮起
    Serial.println("HIGH");
  }
  else
  {
    digitalWrite(led, LOW);            		// L灯熄灭
    Serial.println("LOW");
  }
  delay(100);
}

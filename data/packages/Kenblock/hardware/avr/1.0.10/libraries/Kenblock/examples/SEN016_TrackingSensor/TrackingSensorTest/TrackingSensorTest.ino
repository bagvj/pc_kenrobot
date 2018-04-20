/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  TrackingSensorTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/09/01
 * @描述：  Tracking Sensor 巡线传感模块测试示例。
 * 
 * \说明
 *  Tracking Sensor 巡线传感模块测试示例。传感器位于黑线上方时，输出高电平（HIGH），主板上的3号引脚的LED将会被点亮，否则LED灯熄灭。串口输出显示状态。
 * 
 * \函数列表
 * 
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/01      0.1.0              新建程序。
 * 
 */
 
int ledPin = 3;                         //定义LED灯的引脚
int trackingPin = 2;                    //巡线传感模块接口

void setup()
{
  pinMode(ledPin, OUTPUT);            	// 设置LED灯的引脚为输出模式
  pinMode(trackingPin,INPUT);          	// 设置巡线传感模块接口为输入
  Serial.begin(9600);               	// 初始化串口，波特率为9600               
}

void loop()
{
  int value = digitalRead(trackingPin); //设置变量,读取输入值
  if (value == HIGH)                  	//检查输入值是否为高，即传感器是否位于黑线上方
  {
    digitalWrite(ledPin, HIGH);        	// LED灯亮起
    Serial.println("Detecting The Black Line");
  }
  else
  {
    digitalWrite(ledPin, LOW);        	// LED灯熄灭
    Serial.println("No Black Line");
  }
  delay(100);
}

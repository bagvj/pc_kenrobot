/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  MetalSensorTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/11/03
 * @描述：  Metal Sensor金属传感器测试示例。
 *  ·
 * \说明
 *  Metal Sensor金属传感器测试示例。根据是否监测到金属控制LED灯亮灭。
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING           2017/11/03      0.1.0              新建程序。
 * 
 */
int ledPin= 3;                     //LED模块接口引脚
int metalPin = 2;                  //金属传感器接口引脚

void setup()
{
  pinMode(ledPin, OUTPUT);         // 设置LED灯的接口为输出模式
  pinMode(metalPin, INPUT);        // 设置金属传感器的接口为输入模式
  Serial.begin(9600);              // 初始化串口，波特率为9600          
}
void loop()
{
  int metalVal = digitalRead(metalPin); //设置变量,读取输入值
  if (metalVal == LOW)                  //检查输入值是否为低，即检测到金属
  {
    digitalWrite(ledPin, HIGH);         // LED灯点亮
    Serial.println("Metal Detected");
  }
  else                                  //无物体
  { 
    digitalWrite(ledPin, LOW);          // LED灯熄灭
    Serial.println("Nothing");
  }
  delay(100);
}


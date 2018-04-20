/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  HallDigitalTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/09/01
 * @描述：  Hall Sensor 磁传感模块 数字输出 测试示例。
 * 
 * \说明
 * Hall Sensor 磁传感模块 数字输出 测试示例。
 *  
 * Hall Sensor 磁传感模块 模拟输出 测试示例请见：HallAnalogTest.ino
 * 
 * \函数列表
 * 
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING           2017/09/01      0.1.0              新建程序。
 * 
 */
 
int ledPin = 3;                     //选择灯的引脚
int hallDigitalPin = 2;             //磁传感模块接口

void setup()
{
  pinMode(ledPin, OUTPUT);           // 设置LED灯的引脚为输出
  pinMode(hallDigitalPin, INPUT_PULLUP);   // 设置磁传感模块为输入，内部上拉
  Serial.begin(9600);               // 初始化串口，波特率为9600
}

void loop()
{
  int value = digitalRead(hallDigitalPin);  //设置变量,读取开关状态
  if (value == LOW)                 //判断输入值是否为低，即检测到磁
  {
    digitalWrite(ledPin, HIGH);     // LED灯亮起
    Serial.println("Hall Detected");
  }
  else
  {
    digitalWrite(ledPin, LOW);      // LED灯熄灭
    Serial.println("Not Detected Hall");
  }
  delay(100);
}

/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  TiltTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/09/01
 * @描述：  Tilt Sensor 倾斜传感模块测试示例。
 * 
 * \说明
 * Tilt Sensor 倾斜传感模块测试示例。传感器倾斜时，主板上的3号引脚的LED将会被点亮，没有倾斜时，LED灯熄灭。串口发送状态。
 * 
 * \函数列表
 * 
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/01      0.1.0              新建程序。
 * 
 */
 
int ledPin = 3;                //定义LED灯的引脚
int tiltPin = 2;               //倾斜传感模块接口

void setup()
{
  pinMode(ledPin, OUTPUT);          //设置LED灯的引脚为输出模式
  pinMode(tiltPin, INPUT_PULLUP);   //设置倾斜传感接口为输入，内部上拉
  Serial.begin(9600);               //初始化串口，波特率为9600
}

void loop()
{
  int value = digitalRead(tiltPin); //设置变量,读取倾斜传感器状态
  if (value == LOW)                 //检查输入值是否为低，即发生了倾斜
  {
    digitalWrite(ledPin, HIGH);     // LED灯亮起
    Serial.println("Tilted To The Left");
  }
  else
  {
    digitalWrite(ledPin, LOW);      // LED灯熄灭
    Serial.println("Tilted To The Right");
  }
}


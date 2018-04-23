/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  PIRTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/09/01
 * @描述：  PIR 人体感知模块测试示例。
 *
 * \说明
 * PIR 人体感知模块测试示例。
 *
 * \函数列表
 *
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING           2017/09/01      0.1.0              新建程序。
 *  
 */
int ledPin = 3;                      //选择LED灯的引脚
int PirSensor = 2;                   //人体感知模块接口

void setup()
{
  pinMode(ledPin, OUTPUT);              //设置灯的引脚为输出引脚
  pinMode(PirSensor, INPUT);         	//设置人体感知模块接口为输入
  Serial.begin(9600);                 	//初始化串口，波特率为9600               
}

void loop()
{

  int value = digitalRead(PirSensor); 	//设置变量,读取输入值
  if (value == HIGH)                  	//检查输入值是否为高，即检测到有人体
  {
    digitalWrite(ledPin, HIGH);       	// LED灯亮起
    Serial.println("Somebody is in this area!");
  }
  else
  {
    digitalWrite(ledPin, LOW);        	// LED灯熄灭
    Serial.println("No one!");
  }
  delay(500);
}


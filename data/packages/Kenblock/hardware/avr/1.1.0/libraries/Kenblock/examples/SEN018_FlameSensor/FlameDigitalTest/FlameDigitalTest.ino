/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  FlameDigitalTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/09/01
 * @描述：  Flame Sensor 火焰传感模块 数字输出 测试示例。
 * 
 * \说明
 * Flame Sensor 火焰传感模块 数字输出 测试示例。检测到火焰时，主板上的3号引脚的LED将会被点亮，反之LED灯熄灭。串口输出显示状态。
 *  
 * Flame Sensor 火焰传感模块 模拟输出 测试示例请见：FlameAnalogTest.ino
 * 
 * \函数列表
 * 
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/01      0.1.0              新建程序。
 * 
 */
 
int ledPin = 3;                    		//选择LED灯的引脚
int flameDigitalPin = 2;             	//火焰传感模块接口

void setup()
{
  pinMode(ledPin, OUTPUT);           	// 设置LED灯的引脚为输出
  pinMode(flameDigitalPin, INPUT_PULLUP);// 设置火焰传感模块为输入，内部上拉
  Serial.begin(9600);               	// 初始化串口，波特率为9600
}

void loop()
{
  int value = digitalRead(flameDigitalPin);  //设置变量,读取开关状态
  if (value == 0)                 		//判断输入值是否为低，即检测到火焰
  {
    digitalWrite(ledPin, HIGH);     	// LED灯亮起
    Serial.println("Fire");
  }
  else
  {
    digitalWrite(ledPin, LOW);      	// LED灯熄灭
    Serial.println("NoFire");
  }
  delay(100);
}

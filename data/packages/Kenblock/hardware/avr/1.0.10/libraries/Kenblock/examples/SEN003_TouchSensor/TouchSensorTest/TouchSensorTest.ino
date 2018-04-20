/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  TouchSensorTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/09/01
 * @描述：  Touch 电容触摸模块测试示例。
 * 
 * \说明
 *  Touch 电容触摸模块测试示例。判断有无触摸控制LED灯亮灭。
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING           2017/09/01      0.1.0              新建程序。
 * 
 */
int ledPin= 3;                     	//LED模块接口引脚
int touchPin = 2;                  	//电容触摸模块接口引脚

void setup()
{
  pinMode(ledPin, OUTPUT);         	// 设置LED灯的接口为输出模式
  pinMode(touchPin, INPUT_PULLUP);  // 设置电容触摸模块的接口为输入，内部上拉
  Serial.begin(9600);          		// 初始化串口，波特率为9600          
}
void loop()
{
  int value = digitalRead(touchPin); //设置变量,读取输入值
  if (value == LOW)               	//检查输入值是否为低，即有物体触摸
  {
    digitalWrite(ledPin, HIGH);   	// LED灯点亮
    Serial.println("Touch an Object");
  }
  else                             	// 无物体
  { 
    digitalWrite(ledPin, LOW);     	// LED灯熄灭
    Serial.println("Nothing");
  }
  delay(100);
}


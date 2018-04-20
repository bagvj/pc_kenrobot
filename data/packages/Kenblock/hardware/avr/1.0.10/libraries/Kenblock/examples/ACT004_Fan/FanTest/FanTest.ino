/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  FanTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/09/01
 * @描述：  Fan 风扇模块测试示例。
 *
 * \说明
 * Fan 风扇模块测试示例测试示例。风扇速度由慢变化快。
 *
 * \函数列表
 *
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING           2017/09/01      0.1.0              新建程序。
 *  
 */
int fanPin = 3;                   	//风扇模块接口，可为3、9、10、11
void setup()
{
  pinMode(fanPin, OUTPUT);       	//设置风扇模块的引脚为输出模式
  Serial.begin(9600);       		//初始化串口，波特率为9600
}
void loop()
{
  int value;
  for (value = 0 ; value <= 255; value += 10)
  {
    analogWrite(fanPin, value);    	//设置引脚的占空比
    Serial.println(value);      	//串口输出占空比的值
    delay(300);
  }
}


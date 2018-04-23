/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  RelayTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/09/01
 * @描述：  Relay 继电器模块测试示例。
 * 
 * \说明
 *  Relay 继电器模块测试示例，控制。继电器吸合、断开测试。
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/01      0.1.0              新建程序。
 * 
 */

int relayPin = 2;                             //定义模块接口

void setup()
{
  pinMode(relayPin, OUTPUT);
}

void loop() 
{
  digitalWrite(relayPin, HIGH);
  delay(500);
  digitalWrite(relayPin, LOW); 
  delay(500);
}

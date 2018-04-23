/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  GasAnalogTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/09/01
 * @描述：  气体传感模块模拟量测试示例。
 *
 * \说明
 * GasAnalogTest 气体传感模块模拟量测试示例。
 *
 * \函数列表
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING           2017/09/01      0.1.0              新建程序。
 *  
 */

int gasPin = A1;
uint16_t gas;

void setup()
{
  Serial.begin(9600);           //初始化串口，波特率为9600
}

void loop()
{              
  gas = analogRead(gasPin);       //设置变量，读取数据   
  Serial.print("Gas = "); 
  Serial.println(gas);
  delay(100);                    //延时100ms
}


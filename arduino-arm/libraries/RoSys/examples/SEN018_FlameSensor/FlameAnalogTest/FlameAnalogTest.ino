/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  FlameAnalogTest.ino
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  Flame Sensor 火焰传感模块 模拟输出 测试示例。
 * 
 * \说明
 *  Flame Sensor 火焰传感模块 模拟输出 测试示例。串口输出显示数值。
 *  
 *  Flame Sensor 火焰传感模块 数字输出 测试示例请见：FlameDigitalTest.ino
 * 
 * \函数列表
 * 
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建程序。
 * 
 */
int flameSensor_A = A0;     	//火焰传感器接口（模拟）
void setup()
{
	Serial.begin(9600);       	//设置串口波特率为9600
}

void loop()
{
	int value;
	value = 1023 - analogRead(flameSensor_A);   //读取数据火焰传感器的值
	Serial.print("Flame Sensor Value: ");
	Serial.println(value);                      //发送数值
 
	delay(100);
}

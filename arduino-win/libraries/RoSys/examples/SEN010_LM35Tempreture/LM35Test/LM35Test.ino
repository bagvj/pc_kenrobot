/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  LM35Test.ino
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  LM35模拟温度传感模块测试示例。
 * 
 * \说明
 *  LM35模拟温度传感模块测试示例。
 * 
 * \函数列表
 * 
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建程序。
 * 
 */
int analogTemp = A0;        	//LM35传感器接口
void setup()
{
	Serial.begin(9600);   	//设置串口波特率为9600
}

void loop()
{
	int value = analogRead(analogTemp);             //设置变量，读取数据
	Serial.print(value);                         //发送数值
	Serial.print("   Temp: ");
	float celsius = value * (5.0 / 1024 * 100);  //计算得到摄氏温度
	Serial.print(celsius);
	Serial.print(" C   ");
	Serial.print((celsius * 9) / 5 + 32);        //转换成华氏温度并发送，F=C*1.8 +32
	Serial.println(" F");
	delay(1000);
}

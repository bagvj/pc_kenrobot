/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  FanTest.ino
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  风扇模块测试示例。
 * 
 * \说明
 * 风扇模块测试示例。通过PWM控制风扇转速。
 * 
 * \函数列表
 * 
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建程序。
 * 
 */
int fan = 3;                 	//风扇模块接口，PWM接口：3、9、10、11

void setup()
{
	pinMode(fan, OUTPUT);      	//设置接口为输出接口
	Serial.begin(9600);      		//设置串口波特率为9600
}

void loop()
{
	int value;
	for (value = 0 ; value <= 255; value += 10)
	{
		analogWrite(fan, value);    //PWM调速
		Serial.println(value);      //串口输出PWM值
		delay(500);
	}
}

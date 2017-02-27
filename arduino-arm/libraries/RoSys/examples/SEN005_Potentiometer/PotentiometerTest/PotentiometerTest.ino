/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  PotentiometerTest.ino
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  Potentiometer Sensor 电位器模块测试示例。
 * 
 * \说明
 *  Potentiometer Sensor 电位器模块测试示例。输出数值、电压值。
 * 
 * \函数列表
 * 
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建程序。
 * 
 */
int potentiometer = A0;   		//电位器模块接口
void setup()
{
	Serial.begin(9600);       	//设置串口波特率为9600
}

void loop()
{
	float voltage;                            
	int value = analogRead(potentiometer);    	//设置变量，读取数据：0-1023
	Serial.print("Value: ");
	Serial.print(value);                     	//发送数值
    
	voltage = (5.0 * value)/1024 ;            	//以5V 作为参考，计算电压值
	Serial.print("      Voltage: ");
	Serial.println(voltage);                 	//发送电压值

	delay(100);
}

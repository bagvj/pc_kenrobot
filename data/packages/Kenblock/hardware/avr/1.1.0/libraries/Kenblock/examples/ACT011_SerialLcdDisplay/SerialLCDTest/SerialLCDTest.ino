/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  SerialLCDTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/11/03
 * @描述：  Kenblock 串口液晶屏模块 测试示例。
 *
 * \说明
 * Kenblock 串口液晶屏模块 测试示例。需要配合 USART HMI.exe 上位机软件使用。
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/11/03      0.1.0              新建程序。
 *  
 */
 
// 绝对路径，引用文件内的数组，使用时需要修改路径位置（不得含有中文名称）。
// Arduino IDE中文编码是UTF-8，和串口屏所支持的编码有差别，所以要输出中文的话要更改hz.c文件下的数组。
// 请勿使用Arduino IDE 编程环境打开编辑该文件。
#include"C:\Users\bzyy\Desktop\SerialLCD\hz.c"  

char mark = '"';				// 双引号 //char mark = 0x22;
int Potentiometerpin = A1;      // 电位器模块接口引脚
float Resistance;
int16_t temp; 
 
void end()//数据结束包，每发送一条指令都要加上这个
{
	for(int i=0;i<3;i++)Serial.write(0xFF);delay(2);
}

void setup()
{
	Serial.begin(9600);
}
void loop()
{
	temp = analogRead(Potentiometerpin);     //设置变量，读取数据   
	Resistance = (10.0 * temp)/1024;

	// Serial.print("t0.txt=\"KenBlock\"");end();//发送英文可以直接使用该语句
	Serial.print("t0.txt=");delay(2);		//发送中文文本
	Serial.write(mark);delay(2);
	Serial.print(hz[0]);delay(2);
	Serial.write(mark);delay(2);
	end();

	Serial.print("t1.txt=");delay(2);		//发送中文文本
	Serial.write(mark);delay(2);
	Serial.print(hz[1]);delay(2);
	Serial.print(Resistance);delay(2);    //发送数值
	Serial.write(mark);delay(2);
	end();
	delay(500);
}
















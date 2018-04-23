/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  LM35Test.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/09/01
 * @描述：  LM35 模拟温度传感模块测试示例。
 * 
 * \说明
 *  LM35 模拟温度传感模块测试示例。串口显示摄氏温度和华式温度。
 * 
 * \函数列表
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING           2017/09/01      0.1.0              新建程序。
 * 
 */
int LM35pin = A1;             	//模拟温度传感模块接口引脚
float celsius;
float fahrenheit;
int16_t temp;

void setup()
{
  Serial.begin(9600);           //初始化串口，波特率为9600
}

void loop()
{              
  temp = analogRead(LM35pin);       //设置变量，读取数据   
  celsius = temp *(5.0/1023*100);   //摄氏温度
  fahrenheit = celsius * 1.8 + 32;  //华氏温度
  Serial.print("Celsius = ");      
  Serial.println(celsius);         	//发送数值
  Serial.print("Fahrenheit = ");      
  Serial.println(fahrenheit);                 
  delay(500);            
}

/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  PotentiometerTest .ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/09/01
 * @描述：  Potentiometer 电位器模块测试示例。
 *
 * \说明
 * Potentiometer  电位器模块测试示例。
 *
 * \函数列表
 *
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING           2017/09/01      0.1.0              新建程序。
 *  
 */
int potentiometerPin = A1;             	//电位器模块接口引脚
float resistance;
int16_t temp;  
void setup()
{
  Serial.begin(9600);           		//初始化串口，波特率为9600
}

void loop()
{              
  temp = analogRead(potentiometerPin);     	//设置变量，读取数据   
  resistance = (10.0 * temp)/1024;
  Serial.print("Resistance = ");      
  Serial.println(resistance);             	//发送数值
  delay(100);            
}



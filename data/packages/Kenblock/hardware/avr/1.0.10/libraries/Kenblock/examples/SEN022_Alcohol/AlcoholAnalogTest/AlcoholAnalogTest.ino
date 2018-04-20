/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  AlcoholAnalogTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/09/01
 * @描述：  酒精传感模块模拟量测试示例。
 *
 * \说明
 * AlcoholAnalogTest 酒精传感模块模拟量测试示例。
 *
 * \函数列表
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/01      0.1.0              新建程序。
 *  
 */
int alcoholPin = A1;              	//酒精传感模块接口引脚
int16_t alcohol;  

void setup()
{
  Serial.begin(9600);           	//初始化串口，波特率为9600
}

void loop()
{              
  alcohol = analogRead(alcoholPin);    	//设置变量，读取数据   
  Serial.print("Alcohol = "); 
  Serial.println(alcohol);
  delay(100);                    		//延时100ms
}


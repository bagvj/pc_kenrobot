/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  AnalogLightTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/09/01
 * @描述：  Light 光敏传感模块测试示例。
 * 
 * \说明
 *  Light 光敏传感模块测试示例。串口显示光照强度。
 * 
 * \函数列表
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/01      0.1.0              新建程序。
 * 
 */
int lightPin = A1;             	//光敏传感模块接口引脚
int16_t light;  
void setup()
{
  Serial.begin(9600);           //初始化串口，波特率为9600
}

void loop()
{              
  light = analogRead(lightPin);       	//设置变量，读取数据   
  Serial.print("Light = ");      
  Serial.println(light);            	//发送数值
  delay(100);            
}

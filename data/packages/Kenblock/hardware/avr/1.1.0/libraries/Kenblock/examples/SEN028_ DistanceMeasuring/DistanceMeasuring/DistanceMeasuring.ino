/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  AnalogSoundTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/09/01
 * @描述：  DistanceMeasuringSensor GP2Y0A21距离传感器测试示例。
 * 
 * \说明
 *  DistanceMeasuringSensor GP2Y0A21距离传感器测试示例。串口显示测量距离，单位cm。
 * 
 * \函数列表
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING           2017/09/01      0.1.0              新建程序。
 * 
 */
int distanceSensorPin = A1;                //距离传感器接口引脚

//GP2Y0A21 传感器的输出很不稳定，在相同情况下读取传感器，你不可能取得全部相同的值，因此必须多次读取传感器，然后取得其平均数。
int distance_average_value(int average_count) 
{
  int sum = 0;
  for (int i=0; i<average_count; i++) 
  {
    int sensor_value = analogRead(distanceSensorPin);  	//读取传感器的值
    int distance_cm = pow(3027.4/sensor_value, 1.2134); //将数值转化为距离(单位cm)
    sum = sum + distance_cm;
  }
  return(sum/average_count);  							//返回平均值
}

void setup()
{
  Serial.begin(9600);                        //初始化串口，波特率为9600
}

void loop()
{              
  int distance = distance_average_value(20);			//设置变量，读取数据。读取20次的平均值。   
  Serial.print("Distance = ");      
  Serial.print(distance);                 	//发送数值
  Serial.println(" cm");
  delay(500);            
}
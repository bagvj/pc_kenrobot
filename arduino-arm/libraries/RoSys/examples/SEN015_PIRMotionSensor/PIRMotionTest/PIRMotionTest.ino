/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  PIRMotionTest.ino
 * @作者：  RoSys
 * @版本：  V1.0.0
 * @时间：  2016/10/10
 * @描述：  PIR Motion Sensor 人体感知模块测试示例。
 * 
 * \说明
 *  PIR Motion Sensor 人体感知模块测试示例。当有人时，主板上的13号引脚的LED（L）将会被点亮，并发送提示；松开后，灯熄灭。
 * 
 * \函数列表
 * 
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/10/10      1.0.0              新建程序。
 * 
 */
 
int led = 13;                    	  	//选择灯的引脚
int pirMotion = 2;                    	//人体感知模块接口

void setup()
{
  pinMode(led, OUTPUT);            		// 定义灯的引脚为输出引脚
  pinMode(pirMotion, INPUT_PULLUP);   	// 定义人体感知模块接口为输入，INPUT_PULLUP：设置为输入，内部上拉
  Serial.begin(9600);                	//设置串口波特率为9600               
}

void loop()
{
  //人体感知模块，上电后5s左右后数据才稳定
  int value = digitalRead(pirMotion); 	//设置变量,读取输入值
  if (value == HIGH)                  	//检查输入值是否为高，即检测到有人体
  {
    digitalWrite(led, HIGH);       		// L灯亮起
    Serial.println("Somebody is in this area!");
  }
  else
  {
    digitalWrite(led, LOW);        		// L灯熄灭
    Serial.println("No one!");
  }
  delay(500);
}

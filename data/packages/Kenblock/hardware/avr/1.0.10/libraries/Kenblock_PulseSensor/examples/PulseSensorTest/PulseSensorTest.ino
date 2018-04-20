/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  PulseSensorTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/11/08
 * @描述：  Pulse Sensor 心率传感模块 测试程序。
 *
 * \说明
 * Pulse Sensor 心率传感模块 测试程序。使用定时器2。发送心率数据到机进行显示！
 * 
 * \函数列表
 * 		void 	begin(void);	  // 初始化。初始化中断函数，定时2ms中断。
 * 		int 	readBPM(void);	// 读取当前心率值（次/分钟）。
 * 
 * 	可外部使用的变量：
 * 		int 	Signal; 		    // 传入的原始数据
 * 		int 	BPM; 			      // 心跳速率
 * 		int 	IBI; 			      // 心跳间隔
 * 		
 * 		boolean Pulse; 			  // 心跳高时为真，低时为假
 * 		boolean QS; 			    // 发现一个心跳的标志位
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/11/08      0.1.0              新建程序。
 *  
 */
#include "Kenblock_PulseSensor.h"

PulseSensor pulse(A1);			    //心率传感模块接口


//往上位机发送数据，不同标识符代表不同类型数据
void sendDataToComputer(char symbol, int data ) 
{
    Serial.print(symbol);       //发送标识符，不同标识符代表不同类型数据
    Serial.println(data);       //数据
}

void setup()
{
	Serial.begin(115200);         //初始化串口，波特率为115200。
	pulse.begin();				        //初始化。初始化中断函数，定时2ms中断。
}

void loop() 
{
  sendDataToComputer('S', pulse.Signal);	//发送原始数据
  if (pulse.QS == true)  					        //发现心跳
  {                     
    sendDataToComputer('B',pulse.BPM);	  //发送心跳速率数据 
    sendDataToComputer('Q',pulse.IBI);	  //发送心跳间隔数据    
    pulse.QS = false;            		      //清除标志位
  }
	
	//也可以使用以下读取方式
	// int myBPM = pulse.readBPM();
	
  delay(10); 
} 
/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  PluseSenor.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/09/01
 * @描述：  PluseSenorTest 心率传感模块测试示例。
 * 
 * \说明
 *  PluseSenorTest 利用光电容积法侧心率，串口显示测得的数据。
 * 
 * \函数列表
 * 
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING           2017/09/01      0.1.0              新建程序。
 * 
 */
#include <TimerOne.h>
// #include <MsTimer2.h>

#include "Kenblock.h"

int pulsePin = A1;                  //心率传感模快接口
int blinkPin = 13;                  //LED引脚，显示心跳

volatile int BPM;                   //心跳速率
volatile int Signal;                //传入的原始数据
volatile int IBI = 0;               //心跳间隔
volatile boolean Pulse = false;     //心跳高时为真，低时为假
volatile boolean QS = false;        //发现一个心跳的标志位

void setup()
{
  pinMode(blinkPin,OUTPUT);         //LED用来显示你的心跳
  Serial.begin(115200);            	//初始化串口，波特率为115200
  Timer1.initialize(2000);  		//定时器初始化，中断2ms      
  Timer1.attachInterrupt(Timing);  	//定时器中断 
  
  // MsTimer2::set(2, Timing); 		//定时器初始化，中断2ms 
  // MsTimer2::start();
}

void loop() 
{
    sendDataToComputer('S', Signal);//发送原始数据
    if (QS == true)  				//发现心跳
    {                     
          sendDataToComputer('B',BPM);   
          sendDataToComputer('Q',IBI);    
          QS = false;            // 清除标志位
     }
    delay(10);                         
}  

void sendDataToComputer(char symbol, int data ) //往上位机端发送数据
{
    Serial.print(symbol);       //前缀说明发送的是哪种类型的数据
    Serial.println(data);       //数据
}

//中断处理函数
int rate[10];                    //数组存放最后的10个IBI数据
unsigned long sampleCounter = 0; //用于确定脉冲时序
unsigned long lastBeatTime = 0;  //查找IBI
int P =512;                      //波峰（默认处于中值）
int T = 512;                     //波谷
int thresh = 512;                //心跳瞬间
int amp = 100;                   //保持脉冲波形的幅度
boolean firstBeat = true;       
boolean secondBeat = false;  
void Timing()
{     
  Signal = analogRead(pulsePin);//读取传感器的值
  sampleCounter += 2;           //根据该值确定程序执行的时间
  int N = sampleCounter - lastBeatTime;      

  //找到心跳波形中的波峰和波谷
  if(Signal < thresh && N > (IBI/5)*3)
  {    
    if(Signal < T) T = Signal;  //波谷
  }
  if(Signal > thresh && Signal > P) P = Signal;//波峰
  if(N > 250)                  //避免高频噪声
  {                                 
    if((Signal > thresh) && (Pulse == false) && (N > (IBI/5)*3))
    {        
      Pulse = true;                      //发现心跳时设置标志位
      //digitalWrite(blinkPin,HIGH);       //点亮LED
      IBI = sampleCounter - lastBeatTime;//测量两个心跳之间的时间
      lastBeatTime = sampleCounter;          
      if(secondBeat)
      {                     
        secondBeat = false;                 
        for(int i=0; i<=9; i++)rate[i] = IBI; // 存放10个数据
      }
      if(firstBeat)   // 第一次捕获时是没有数据的，所以要将第二次判断的标志位置1，然后返回
      {                        
        firstBeat = false;                  
        secondBeat = true;                 
        return;                         
      }   
      word runningTotal = 0;                
      for(int i=0; i<=8; i++)
      { 
        rate[i] = rate[i+1];                 
        runningTotal += rate[i];         // 接收数据
      }
      rate[9] = IBI;                        
      runningTotal += rate[9];                
      runningTotal /= 10;                // 多次取值求平均值
      BPM = 60000/runningTotal;          // 求出心跳次数
      QS = true;                         // 设置发现心跳标志
    }                       
  }

  if(Signal < thresh && Pulse == true)   //心跳结束
  {  
    //digitalWrite(blinkPin, LOW);       //关闭LED
    Pulse = false;                    
    amp = P - T;                         //得到振幅
    thresh = amp/2 + T;                  //设置阀值，为振幅的一半
    P = thresh;                          //每次结束后要重新设置P、T的值
    T = thresh;
  }
  if(N > 2500)                           //错误检测，2.5秒内都没有脉冲
  {                          
    thresh = 512;                         
    P = 512;                              
    T = 512;                               
    lastBeatTime = sampleCounter;         
    firstBeat = true;                     
    secondBeat = false;                   
  }                          
}










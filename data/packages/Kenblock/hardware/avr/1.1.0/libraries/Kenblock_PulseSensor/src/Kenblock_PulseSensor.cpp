/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_PulseSensor.cpp
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/11/08
 * @描述：  Kenblock 心率传感模块 驱动库。
 *
  * \说明
 * 		Kenblock 心率传感模块 驱动库。读取传感器数据，计算心率值（次/分钟）、心跳间隔值（毫秒）。
 *
 * 	定时器使用说明：
 * 		可以使用定时器1、定时器2。默认使用定时器2。如需使用定时器1，请在.h文件中取消注释 // #define Pulse_USE_TimerOne 。
 * 		使用时要避免和Kenblock其他模块的库冲突。比如定时器1 会和Kenblock颜色传感器模块、步进电机驱动模块、Servo舵机库冲突。
 *
 * \方法列表
 * 
 * 		void 	begin(void);	  // 初始化。初始化中断函数，定时2ms中断。
 * 		int 	readBPM(void);	// 读取当前心率值（次/分钟）。
 * 
 * 	可外部使用的变量：
 * 		int 	Signal; 		// 传入的原始数据
 * 		int 	BPM; 			  // 心跳速率
 * 		int 	IBI; 			  // 心跳间隔
 * 		
 * 		boolean Pulse; 		// 心跳高时为真，低时为假
 * 		boolean QS; 			// 发现一个心跳的标志位
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/11/08      0.1.0              新建库文件。
 *  
 * \示例
 *  
 * 		1.PulseSensorTest.ino   // 心率测试。
 */
 
#include "Kenblock_PulseSensor.h"

int PulseSensor::pulsePin;              //心率传感模快接口
int PulseSensor::Signal;                //传入的原始数据
int PulseSensor::BPM;                   //心跳速率
int PulseSensor::IBI = 600;             //心跳间隔
boolean PulseSensor::Pulse = false;     //心跳高时为真，低时为假
boolean PulseSensor::QS = false;        //发现一个心跳的标志位


/**
 * \函数： PulseSensor
 * \说明： 初始化，定义Pulse Sensor 端口。
 * \输入参数：
 *   pin - Pulse Sensor模拟端口。
 */
PulseSensor::PulseSensor(int pin)
{
	PulseSensor::pulsePin = pin;
}


/**
 * \函数： begin
 * \说明： 初始化。初始化中断函数，定时2ms中断。
 */
void PulseSensor::begin(void)
{
	
#ifdef Pulse_USE_TimerOne
	//使用定时器1 做定时2ms 中断
	Timer1.initialize(2000);  				    //定时器初始化，中断2ms      
	Timer1.attachInterrupt(PulseTiming);  //定时器中断 
#else 
	//使用定时器2 做定时2ms 中断	
	MsTimer2::set(2, PulseTiming); 			  //定时器初始化，中断2ms 
	MsTimer2::start();
#endif

}

/**
 * \函数： readBPM
 * \说明： 读取当前心率值（次/分钟）。
 * \返回值：
 *    - 当前心率值（次/分钟）。
 * \其他：
 */ 
int PulseSensor::readBPM(void)
{
	return PulseSensor::BPM;
}

//中断处理函数中的变量
int PulseSensor::_rate[10]; 
unsigned long PulseSensor::_sampleCounter = 0; //用于确定脉冲时序
unsigned long PulseSensor::_lastBeatTime = 0;  //查找IBI
int PulseSensor::_P =512;                      //波峰（默认处于中值）
int PulseSensor::_T = 512;                     //波谷
int PulseSensor::_thresh = 512;                //心跳瞬间
int PulseSensor::_amp = 100;                   //保持脉冲波形的幅度
boolean PulseSensor::_firstBeat = true;       
boolean PulseSensor::_secondBeat = false;  

/**
 * \函数： PulseTiming
 * \说明： 中断服务函数，读取传感器数据，计算心率值（次/分钟）、心跳间隔值（毫秒）。
 * \其他： 
 * 		心率速率值为10次取平均。
 */
void PulseSensor::PulseTiming(void)
{ 
	cli();     
	Signal = analogRead(pulsePin);	//读取传感器的值
	_sampleCounter += 2;           	//根据该值确定程序执行的时间
	int N = _sampleCounter - _lastBeatTime;      

	//找到心跳波形中的波峰和波谷
	if(Signal < _thresh && N > (IBI/5)*3)
	{    
		if(Signal < _T) _T = Signal;  	//波谷
	}
	if(Signal > _thresh && Signal > _P) _P = Signal;	//波峰
	
	if(N > 250)                  		  //避免高频噪声
	{                                 
		if((Signal > _thresh) && (Pulse == false) && (N > (IBI/5)*3))
		{        
			Pulse = true;                    		    //发现心跳时设置标志位
			//digitalWrite(blinkPin,HIGH);     		  //点亮LED
			IBI = _sampleCounter - _lastBeatTime;		//测量两个心跳之间的时间
			_lastBeatTime = _sampleCounter;          
			if(_secondBeat)
			{                     
				_secondBeat = false;                 
				for(int i=0; i<=9; i++)_rate[i] = IBI; // 存放10个数据
			}
			if(_firstBeat)   	// 第一次捕获时是没有数据的，所以要将第二次判断的标志位置1，然后返回
			{                        
				_firstBeat = false;                  
				_secondBeat = true;                 
				return;                         
			}   
			word runningTotal = 0;                
			for(int i=0; i<=8; i++)
			{ 
				_rate[i] = _rate[i+1];                 
				runningTotal += _rate[i];      	// 接收数据
			}
			_rate[9] = IBI;                        
			runningTotal += _rate[9];                
			runningTotal /= 10;                	// 多次取值求平均值
			BPM = 60000/runningTotal;          	// 求出心跳次数
			QS = true;                         	// 设置发现心跳标志
		}                       
	}

	if(Signal < _thresh && Pulse == true)	//心跳结束
	{  
		//digitalWrite(blinkPin, LOW);   	  //关闭LED
		Pulse = false;                    
		_amp = _P - _T;                     //得到振幅
		_thresh = _amp/2 + _T;              //设置阀值，为振幅的一半
		_P = _thresh;                      	//每次结束后要重新设置P、T的值
		_T = _thresh;
	}
	if(N > 2500)                         	//错误检测，2.5秒内都没有脉冲
	{                          
		_thresh = 512;                         
		_P = 512;                              
		_T = 512;                               
		_lastBeatTime = _sampleCounter;         
		_firstBeat = true;                     
		_secondBeat = false;                   
	}  
	sei(); 	
}
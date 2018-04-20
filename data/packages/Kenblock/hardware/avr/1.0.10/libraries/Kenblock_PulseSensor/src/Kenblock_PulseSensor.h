/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_PulseSensor.h
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
 
#ifndef Kenblock_PulseSensor_H
#define Kenblock_PulseSensor_H
#include <Arduino.h>


// 心率传感器使用定时器1 
// #define Pulse_USE_TimerOne


// 如果定义了 Pulse_USE_TimerOne 则使用定时器1，否则使用定时器2。
#ifdef Pulse_USE_TimerOne
#include <TimerOne.h> 	// 定时器1，需要包含此库
#else 
#include <MsTimer2.h> 	// 定时器2，需要包含此库
#endif

/**
 * Class: PulseSensor
 * \说明：Class PulseSensor 的声明
 */
class PulseSensor
{
  public:
	PulseSensor(int pin);
	void begin(void);
	int readBPM(void);
	
	static int pulsePin; 	//心率传感模快接口
	static int Signal; 		//传入的原始数据
	static int BPM; 		  //心跳速率
	static int IBI; 		  //心跳间隔
	
	static boolean Pulse; //心跳高时为真，低时为假
	static boolean QS; 		//发现一个心跳的标志位

  private:
	static void PulseTiming(void);
  
  	//中断处理函数中的变量
	static int _rate[10]; 	//数组存放最后的10个IBI数据
	static unsigned long _sampleCounter; //用于确定脉冲时序
	static unsigned long _lastBeatTime;  //查找IBI
	static int _P;    		  //波峰（默认处于中值）
	static int _T;			    //波谷
	static int _thresh; 	  //心跳瞬间
	static int _amp; 		    //保持脉冲波形的幅度
	static boolean _firstBeat;       
	static boolean _secondBeat; 
};

#endif // Kenblock_PulseSensor_H


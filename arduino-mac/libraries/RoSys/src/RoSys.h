 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  RoSys.h
 * @作者：  RoSys
 * @版本：  V0.1.0
 * @时间：  2016/04/25
 * @描述：  RoSys ATmega328 Main-board 驱动函数库。
 *
 * \说明
 * RoSys ATmega328 Main-board 驱动函数库.本文件为集合文件，在Arduino IDE中只需要包含 RoSys.h 即可使用所有库。
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/04/25      0.1.0              新建库文件。
 * 
 */
 
#ifndef RoSys_H
#define RoSys_H

#include <Arduino.h>
#include "RoSysConfig.h"

// 将使用到的模块的头文件添加在这里
#include "RoDCMotor.h"
#include "RoLineTracking.h"
#include "RoDHT11.h"
#include "RoJoystick.h"
#include "RoBuzzer.h"

#include "Ro7SegmentDisplay.h"
#include "RoLedMatrix.h"
#include "RoRGBLed.h"
//#include "RoWiFi.h"



/**************  RoSys ATmega328 Main-board GPIO 定义 **************/

//电机接口定义
RoMotor_dif MotorPort[3] =
{
  { NC, NC }, { 7, 6 }, { 4, 5 },
};
/************  RoSys ATmega328 Main-board GPIO 定义 END ************/


/********************  IO Expansion Shield 定义 ********************/

//双路数字接口 ：PD1/PD2/PD3/PD4
Ex_Double_Digital_dif		Ex_Double_Digital[5] =
{
	{ NC, NC }, { 2, 3 }, { 8, 9 }, { 10, 11 }, { 12, 13 },
};

//四路数字接口,最后一个为IIC-INT ：PD5/PD6/IIC-INT
Ex_Quadruple_Digital_dif 	Ex_Quadruple_Digital[4] =
{
	{ NC, NC, NC, NC }, { 2, 3, 8, 9 }, { 10, 11, 12, 13 }, { A4, A5, 2, NC },
};

//双路模拟接口 ：PA1/PA2
Ex_Double_Analog_dif		Ex_Double_Analog[3] =
{
	{ NC, NC }, { A0, A1 }, { A2, A3 },
};

//四路模拟接口 ：PA3
Ex_Quadruple_Analog_dif 	Ex_Quadruple_Analog[2] =
{
	{ NC, NC, NC, NC }, { A0, A1, A2, A3 },
};
/******************  IO Expansion Shield 定义 END ******************/

// 使用通用Arduino 函数，但需要简化处理的添加在这里


#endif // RoSys_H

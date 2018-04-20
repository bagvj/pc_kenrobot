 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock.h
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/07/20
 * @描述：  Kenblock ATmega328 Main-board 引脚定义。
 *
 * \说明
 * Kenblock ATmega328 Main-board 引脚定义。主要定义了接口拓展包的引脚，包含PD1、PD2、PD3、PD4、PD5、PD6、PA1、PA2、PA3、IIC_INT。
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/07/20      0.1.0              新建库文件。
 * 
 */
 
#ifndef Kenblock_H
#define Kenblock_H

#include <Arduino.h>
#include <stdint.h>
#include <stdbool.h>
#include "KenblockConfig.h"

// 将使用到的模块的头文件添加在这里
//#include "Kenblock_Motor.h"

/**************  Kenblock ATmega328 Main-board GPIO 定义 **************/

//电机接口定义 
Motor_dif MotorPort[3] =
{
  { NC, NC }, { 7, 6 }, { 4, 5 },
};
/************  Kenblock ATmega328 Main-board GPIO 定义 END ************/


/********************  IO Expansion Shield 定义 ********************/

//双路数字接口 ：PD1/PD2/PD3/PD4
Ex_Double_Digital_dif		Ex_Double_Digital[5] =
{
	{ NC, NC }, { 2, 3 }, { 8, 9 }, { 10, 11 }, { 12, 13 },
};

//四路数字接口,最后一个为IIC-INT ：PD5/PD6/IIC_INT
Ex_Quadruple_Digital_dif 	Ex_Quadruple_Digital[5] =
{
	{ NC, NC, NC, NC }, { A0, A1, A2, A3 }, { 2, 3, 8, 9 }, { 10, 11, 12, 13 }, { A4, A5, 2, NC },
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


#endif // Kenblock_H

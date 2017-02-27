 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  RoSysConfig.h
 * @作者：  RoSys
 * @版本：  V0.1.0
 * @时间：  2016/04/25
 * @描述：  驱动函数库的配置文件。
 *
 * \说明
 * RoSys ATmega328 Main-board 驱动函数库配置文件，可以添加条件编译定义等。
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/04/25      0.1.0              新建库文件。
 *  
 */

#ifndef RoSysConfig_H
#define RoSysConfig_H

#include <utility/Servo.h>
#include <utility/Wire.h>
#include <utility/EEPROM.h>
#include <utility/SoftwareSerial.h>
#include <utility/SPI.h>

// 添加特殊定义
// 比如条件编译定义等




/**************  电机接口定义  ***************/
// 电机接口定义
typedef struct
{
  uint8_t dir;
  uint8_t pwm;
} RoMotor_dif;

#define NC  (0)
#define MA  (0x01)		//{ 7, 6 }
#define MB  (0x02)		//{ 4, 5 }

extern RoMotor_dif MotorPort[3] ;

/************  电机接口定义 END  *************/


/************  IO扩展板接口定义  *************/
// IO扩展板接口定义
//双路数字接口
typedef struct
{
  uint8_t d1;
  uint8_t d2;
} Ex_Double_Digital_dif;

//四路数字接口
typedef struct
{
  uint8_t d1;
  uint8_t d2;
  uint8_t d3;
  uint8_t d4;
} Ex_Quadruple_Digital_dif;

//双路模拟接口
typedef struct
{
  uint8_t a1;
  uint8_t a2;
} Ex_Double_Analog_dif;

//四路模拟接口
typedef struct
{
  uint8_t a1;
  uint8_t a2;
  uint8_t a3;
  uint8_t a4;
} Ex_Quadruple_Analog_dif;

#define NC  (0)
#define PD1  (0x01)		//{ 2, 3 }
#define PD2  (0x02)		//{ 8, 9 }
#define PD3  (0x03)		//{ 10, 11 }
#define PD4  (0x04)		//{ 12, 13 }

#define PD5  (0x01)		//{ 2, 3, 8, 9 }
#define PD6  (0x02)		//{ 10, 11, 12, 13 }
#define IIC_INT  (0x03)	//{ A4, A5, 2, NC },

#define PA1  (0x01)		//{ A0, A1 }
#define PA2  (0x02)		//{ A2, A3 },

#define PA3  (0x01)		//{ A0, A1, A2, A3 }

extern Ex_Double_Digital_dif 	Ex_Double_Digital[5] ;
extern Ex_Quadruple_Digital_dif Ex_Quadruple_Digital[4] ;
extern Ex_Double_Analog_dif		Ex_Double_Analog[3] ;
extern Ex_Quadruple_Analog_dif 	Ex_Quadruple_Analog[2] ;

/**********  IO扩展板接口定义 END  ***********/


#endif // RoSysConfig_H


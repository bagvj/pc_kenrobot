 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  KenblockConfig.h
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/07/20
 * @描述：  驱动函数库的配置文件。
 *
 * \说明
 * Kenblock ATmega328 Main-board 驱动函数库配置文件，可以添加条件编译定义等。
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/07/20      0.1.0              新建库文件。
 *  
 */

#ifndef KenblockConfig_H
#define KenblockConfig_H


// 添加特殊定义
// 比如条件编译定义等




/**************  电机接口定义  ***************/
// 电机接口定义
typedef struct
{
  uint8_t dir;
  uint8_t pwm;
} Motor_dif;

#define NC  (0)
#define MA  (0x01)
#define MB  (0x02)

extern Motor_dif MotorPort[3] ;

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

#undef  PD1
#undef  PD2
#undef  PD3
#undef  PD4
#undef  PD5
#undef  PD6
#undef  PA1
#undef  PA2
#undef  PA3

#define NC  (0)
#define PD1  (0x01)
#define PD2  (0x02)
#define PD3  (0x03)
#define PD4  (0x04)

#define PD5  (0x02)
#define PD6  (0x03)
#define IIC_INT  (0x04)

#define PA1  (0x01)
#define PA2  (0x02)

#define PA3  (0x01)

extern Ex_Double_Digital_dif 	Ex_Double_Digital[5] ;
extern Ex_Quadruple_Digital_dif Ex_Quadruple_Digital[5] ;
extern Ex_Double_Analog_dif		Ex_Double_Analog[3] ;
extern Ex_Quadruple_Analog_dif 	Ex_Quadruple_Analog[2] ;

/**********  IO扩展板接口定义 END  ***********/


#endif // KenblockConfig_H


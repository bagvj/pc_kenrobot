/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_Ultrasonic.h
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/11/13
 * @描述：  Kenblock超声波模块 驱动库。
 *
 * \说明
 * Kenblock超声波模块 驱动库。拨码开关可设置IIC地址，默认地址为0xF0。
 *
 * \方法列表
 * 		  Ultrasonic(uint8_t UltrasonicAddress);  // 初始化，设置IIC地址，默认地址为0xF0。
 * 		  boolean   begin();            // IIC初始化，验证通信是否正常 
 * 		  uint16_t  requstDistance();   // 读取超声波测距距离。实际距离小于30cm时，测得数据可能不准确。
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/11/13      0.1.0              新建库文件。
 *  
 * \示例
 *  
 * 		1.UltrasonicTest.ino
 */
 
#ifndef Kenblock_Ultrasonic_H
#define Kenblock_Ultrasonic_H

#include <Arduino.h>
#include <Wire.h>
#include "KenblockConfig.h"

// 超声波模块默认IIC地址为0xF0
#define ULTRASONIC_ADDRESS   0xF0 

/**
 * Class: Ultrasonic
 * \说明：Class Ultrasonic 的声明
 */
class Ultrasonic {

  public:
    Ultrasonic();
    boolean begin(uint8_t UltrasonicAddress = ULTRASONIC_ADDRESS);  
    uint16_t requstDistance();

  private:
    uint8_t _UltrasonicAddress;
    uint8_t _dataH;
    uint8_t _dataL;
    uint16_t _distance;
    uint8_t _flag;
};
#endif // Kenblock_Ultrasonic_H


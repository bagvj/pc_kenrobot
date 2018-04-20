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
 
#include "Kenblock_Ultrasonic.h"

/**
 * \函数： Ultrasonic
 * \说明： 初始化，设置IIC地址，默认地址为0xF0。如果通过拨码改变了超声波模块的IIC地址，则初始化时需要正确设置IIC地址。
 * \其他： 
 *   拨码开关设置IIC地址设置如下：
 * <pre>
 *                     IIC地址设置对应关系表
 * ---------+---------+---------+---------+-------------------------
 *   拨码1  |  拨码2  |  拨码3  |  拨码4  |     IIC通信地址
 * ---------+---------+---------+---------+-------------------------
 *     0    |    0    |    0    |    0    | 0xF0（默认/无拨码开关）
 *     0    |    0    |    0    |    1    |         0xF1 
 *     0    |    0    |    1    |    0    |         0xF2 
 *     0    |    0    |    1    |    1    |         0xF3 
 *     0    |    1    |    0    |    0    |         0xF4 
 *     0    |    1    |    0    |    1    |         0xF5 
 *     0    |    1    |    1    |    0    |         0xF6 
 *     0    |    1    |    1    |    1    |         0xF7 
 *     1    |    0    |    0    |    0    |         0xF8 
 *     1    |    0    |    0    |    1    |         0xF9 
 *     1    |    0    |    1    |    0    |         0xFA 
 *     1    |    0    |    1    |    1    |         0xFB 
 *     1    |    1    |    0    |    0    |         0xFC 
 *     1    |    1    |    0    |    1    |         0xFD 
 *     1    |    1    |    1    |    0    |         0xFE 
 *     1    |    1    |    1    |    1    |         0xFF 
 * ---------+---------+---------+---------+-------------------------
 * </pre>
 */
Ultrasonic::Ultrasonic() 
{
  
}

/**
 * \函数： begin
 * \说明： IIC初始化，验证通信是否正常
 */
boolean Ultrasonic::begin(uint8_t UltrasonicAddress) 
{
  _UltrasonicAddress = UltrasonicAddress;
  Wire.begin();     //初始化IIC总线，设置为主机
  Wire.beginTransmission(_UltrasonicAddress);
  _dataH = Wire.endTransmission();
  return !_dataH;
}

/**
 * \函数： requstDistance
 * \说明： 读取超声波测距距离。实际距离小于30cm时，测得数据可能不准确。
 * \返回值：
 *    - 超声波的测距距离。
 * \其他：
 */ 
uint16_t Ultrasonic::requstDistance() 
{ 
  Wire.requestFrom((uint8_t)_UltrasonicAddress, (uint8_t)2);  // 从设备读取2个字节的数据
  while (Wire.available())                                    // 从设备发送请求
  {
    if (_flag == 0)
    { 
      _flag++;
      _dataH = Wire.read(); 
    }
    else if (_flag == 1)
    {
      _flag = 0;
      _dataL = Wire.read(); 
      _distance = _dataL + (_dataH << 8);
    }
  }
  return _distance;
}


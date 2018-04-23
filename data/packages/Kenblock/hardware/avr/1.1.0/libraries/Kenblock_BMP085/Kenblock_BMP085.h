 /**
 * \著作权 
 * @名称：  Kenblock_BMP085.h
 * @作者：  Adafruit
 * @版本：  V1.0.0
 * @URL: 	https://github.com/adafruit/Adafruit-BMP085-Library
 * @维护：  Kenblock
 * @时间：  2017/09/20
 * @描述：  BMP085/BMP180 气压传感器驱动库。
 *
 * \说明
 *  BMP085/BMP180 气压传感器驱动库。通过传感器获取气压、温度、海拔高度值。使用I2C 通信，I2C地址：0x77 。
 *  
 * \方法列表：
 * 
 * 		1. boolean 	Kenblock_BMP085::begin(uint8_t mode)
 * 		2. float 	Kenblock_BMP085::readTemperature(void)
 * 		3. int32_t 	Kenblock_BMP085::readPressure(void)
 * 		4. float 	Kenblock_BMP085::readAltitude(float sealevelPressure)
 * 		4. int32_t 	Kenblock_BMP085::readSealevelPressure(float altitude_meters)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/20      1.0.0              做汉化修订注释。
 *  
 * \示例
 *  
 * 		1.BMP085test.ino			//示例 
 */

#ifndef KENBLOCK_BMP085_H
#define KENBLOCK_BMP085_H

#if (ARDUINO >= 100)
 #include "Arduino.h"
#else
 #include "WProgram.h"
#endif
#include "Wire.h"

#define BMP085_DEBUG 0

#define BMP085_I2CADDR 0x77

#define BMP085_ULTRALOWPOWER 0
#define BMP085_STANDARD      1
#define BMP085_HIGHRES       2
#define BMP085_ULTRAHIGHRES  3
#define BMP085_CAL_AC1           0xAA  // R   Calibration data (16 bits)
#define BMP085_CAL_AC2           0xAC  // R   Calibration data (16 bits)
#define BMP085_CAL_AC3           0xAE  // R   Calibration data (16 bits)    
#define BMP085_CAL_AC4           0xB0  // R   Calibration data (16 bits)
#define BMP085_CAL_AC5           0xB2  // R   Calibration data (16 bits)
#define BMP085_CAL_AC6           0xB4  // R   Calibration data (16 bits)
#define BMP085_CAL_B1            0xB6  // R   Calibration data (16 bits)
#define BMP085_CAL_B2            0xB8  // R   Calibration data (16 bits)
#define BMP085_CAL_MB            0xBA  // R   Calibration data (16 bits)
#define BMP085_CAL_MC            0xBC  // R   Calibration data (16 bits)
#define BMP085_CAL_MD            0xBE  // R   Calibration data (16 bits)

#define BMP085_CONTROL           0xF4 
#define BMP085_TEMPDATA          0xF6
#define BMP085_PRESSUREDATA      0xF6
#define BMP085_READTEMPCMD       0x2E
#define BMP085_READPRESSURECMD   0x34


class Kenblock_BMP085 {
 public:
  Kenblock_BMP085();
  boolean begin(uint8_t mode = BMP085_ULTRAHIGHRES);  	// 设置精度，为超高精度
  float readTemperature(void);
  int32_t readPressure(void);
  int32_t readSealevelPressure(float altitude_meters = 0);
  float readAltitude(float sealevelPressure = 101325); 	// 标准大气压强 101325 Pa
  uint16_t readRawTemperature(void);
  uint32_t readRawPressure(void);
  
 private:
  int32_t computeB5(int32_t UT);
  uint8_t read8(uint8_t addr);
  uint16_t read16(uint8_t addr);
  void write8(uint8_t addr, uint8_t data);

  uint8_t oversampling;

  int16_t ac1, ac2, ac3, b1, b2, mb, mc, md;
  uint16_t ac4, ac5, ac6;
};

#endif //  KENBLOCK_BMP085_H

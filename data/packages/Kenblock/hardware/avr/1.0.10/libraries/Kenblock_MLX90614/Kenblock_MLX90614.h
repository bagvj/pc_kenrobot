 /**
 * \著作权 
 * @名称：  Kenblock_MLX90614.h
 * @作者：  Adafruit
 * @版本：  V1.0.0
 * @URL: 	https://github.com/adafruit/Adafruit-MLX90614-Library
 * @维护：  Kenblock
 * @时间：  2017/09/20
 * @描述：  非接触式测温模块的驱动函数。
 *
 * \说明
 * 非接触式测温模块的驱动函数。使用传感器为 MLX90614。使用I2C 通信，I2C地址：0x5A 。
 *
 * \常用公有方法列表：
 * 
 * 		1. boolean	MLX90614::begin(void) 
 * 		2. double	MLX90614::readObjectTempF(void) 
 * 		3. double	MLX90614::readAmbientTempF(void) 
 * 		4. double	MLX90614::readObjectTempC(void) 
 *      5. double	MLX90614::readAmbientTempC(void) 
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/20      1.0.0              做汉化修订注释。
 *  
 * \示例
 *  
 * 		1.mlxtest.ino			//最简单的使用方式示例 
 */
#ifndef Kenblock_MLX90614_H
#define Kenblock_MLX90614_H

#if (ARDUINO >= 100)
 #include "Arduino.h"
#else
 #include "WProgram.h"
#endif
#include "Wire.h"


#define MLX90614_I2CADDR 0x5A

// RAM
#define MLX90614_RAWIR1 0x04
#define MLX90614_RAWIR2 0x05
#define MLX90614_TA 	0x06
#define MLX90614_TOBJ1 	0x07
#define MLX90614_TOBJ2 	0x08
// EEPROM
#define MLX90614_TOMAX 	0x20
#define MLX90614_TOMIN 	0x21
#define MLX90614_PWMCTRL 0x22
#define MLX90614_TARANGE 0x23
#define MLX90614_EMISS 	0x24
#define MLX90614_CONFIG 0x25
#define MLX90614_ADDR 	0x0E
#define MLX90614_ID1 	0x3C
#define MLX90614_ID2 	0x3D
#define MLX90614_ID3 	0x3E
#define MLX90614_ID4 	0x3F


class MLX90614  {
 public:
  MLX90614(void);
  boolean begin(void);

  float readObjectTempC(void);
  float readAmbientTempC(void);
  float readObjectTempF(void);
  float readAmbientTempF(void);

 private:
  float readTemp(uint8_t reg);

  uint8_t _addr;
  uint16_t read16(uint8_t addr);
  void write16(uint8_t addr, uint16_t data);
};

#endif	// Kenblock_MLX90614_H
 /**
 * \著作权 
 * @名称：  Kenblock_MLX90614.cpp
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
 * APDS-9960 传感器具有多个功能，具有距离、光照强度、RGB颜色、手势传感器。
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

#include "Kenblock_MLX90614.h"

/**
 * \函数：Adafruit_MLX90614
 * \说明：初始化，IIC通信地址赋值
 * \输入参数：
 * 	i2caddr - MLX90614 IIC通信地址
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
MLX90614::MLX90614(void) {
  _addr = MLX90614_I2CADDR;
}

/**
 * \函数：begin
 * \说明：IIC通信初始化
 * \输入参数：无
 * \输出参数：无
 * \返回值：true
 * \其他：无
 */
boolean MLX90614::begin(void) {
  Wire.begin();

  /*
  for (uint8_t i=0; i<0x20; i++) {
    Serial.print(i); Serial.print(" = ");
    Serial.println(read16(i), HEX);
  }
  */
  return true;
}


/**
 * \函数：readObjectTempF
 * \说明：获取被测物体的华氏温度
 * \输入参数：无
 * \输出参数：无
 * \返回值：被测物体的华氏温度
 * \其他：无
 */
float MLX90614::readObjectTempF(void) {
  return (readTemp(MLX90614_TOBJ1) * 9 / 5) + 32;
}

/**
 * \函数：readAmbientTempF
 * \说明：获取当前环境的华氏温度
 * \输入参数：无
 * \输出参数：无
 * \返回值：当前环境的华氏温度
 * \其他：无
 */
float MLX90614::readAmbientTempF(void) {
  return (readTemp(MLX90614_TA) * 9 / 5) + 32;
}

/**
 * \函数：readObjectTempC
 * \说明：获取被测物体的摄氏温度
 * \输入参数：无
 * \输出参数：无
 * \返回值：被测物体的摄氏温度
 * \其他：无
 */
float MLX90614::readObjectTempC(void) {
  return readTemp(MLX90614_TOBJ1);	//0x07
}

/**
 * \函数：readAmbientTempC
 * \说明：获取当前环境的摄氏温度
 * \输入参数：无
 * \输出参数：无
 * \返回值：当前环境的摄氏温度
 * \其他：无
 */
float MLX90614::readAmbientTempC(void) {
  return readTemp(MLX90614_TA);	//0x06
}

/**
 * \函数：readTemp
 * \说明：将读取到的数据进行处理，转为摄氏温度
 * \输入参数：
 *  reg - 注册地址
 * \输出参数：无
 * \返回值：
 *  temp - 摄氏温度
 * \其他：无
 */
float MLX90614::readTemp(uint8_t reg) {
  float temp;
  
  temp = read16(reg);
  temp *= .02;
  temp  -= 273.15;
  return temp;
}

/*********************************************************************/
/**
 * \函数：read16
 * \说明：通过iic，从注册地址内读取一个16位的数据
 * \输入参数：
 *  a - 注册地址
 * \输出参数：无
 * \返回值：
 *  ret - 读取到的数据
 * \其他：无
 */
uint16_t MLX90614::read16(uint8_t a) {
  uint16_t ret;

  Wire.beginTransmission(_addr); 	//开始传输设备 
  Wire.write(a); 					//发送注册地址进行读操作
  Wire.endTransmission(false); 		//结束传输
  
  Wire.requestFrom(_addr, (uint8_t)3);//请求读取3个字节的数据
  ret = Wire.read(); 				//读取数据
  ret |= Wire.read() << 8; 			//读取数据

  uint8_t pec = Wire.read();

  return ret;
}

/**
 * \著作权 
 * @名称：  ColorSensor.ino
 * @作者：  SparkFun
 * @版本：  V0.1.0
 * @维护：  Kenblock
 * @时间：  2017/09/20
 * @描述：  APDS-9960 手势/RGB颜色传感器，环境光强度和颜色识别示例。
 *
 * \说明
 *	APDS-9960 手势/RGB颜色传感器，环境光强度和颜色识别示例。串口显示当前环境下的光强和RGB三基色的值。
 *
 * \接口
 *	IIC-INT接口。但未使用外部中断。
 *
 * \函数列表
 * 		1. bool	Kenblock_APDS9960::init() 
 * 		2. bool Kenblock_APDS9960::enableLightSensor(bool interrupts)
 * 		3. bool Kenblock_APDS9960::readAmbientLight(uint16_t &val)
 * 		4. bool Kenblock_APDS9960::readRedLight(uint16_t &val)
 * 		5. bool Kenblock_APDS9960::readGreenLight(uint16_t &val)
 * 		6. bool Kenblock_APDS9960::readBlueLight(uint16_t &val)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/20      0.1.0              做汉化修订注释。
 *  
 */

#include <Wire.h>
#include <Kenblock_APDS9960.h>

// 全局变量
Kenblock_APDS9960 apds = Kenblock_APDS9960();
uint16_t ambient_light = 0;
uint16_t red_light = 0;
uint16_t green_light = 0;
uint16_t blue_light = 0;

void setup() {
 
  Serial.begin(9600);//初始化串口，波特率为9600
  Serial.println();
  Serial.println(F("--------------------------------"));
  Serial.println(F("Kenblock APDS-9960 - ColorSensor"));
  Serial.println(F("--------------------------------"));
  
  // 初始化APDS-9960(配置I2C和初始值)，判断初始化是否完成
  if ( apds.init() ) {
    Serial.println(F("APDS-9960 initialization complete"));
  } else {
    Serial.println(F("Something went wrong during APDS-9960 init!"));
  }
  
  // 启动APDS-9960光线传感器(无中断)
  if ( apds.enableLightSensor(false) ) {
    Serial.println(F("Light sensor is now running"));
  } else {
    Serial.println(F("Something went wrong during light sensor init!"));
  }
  
  // 等待初始化和校准完成
  delay(500);
}

void loop() {
  
  // 读取光照强度、RGB三基色的值
  if (  !apds.readAmbientLight(ambient_light) ||
        !apds.readRedLight(red_light) ||
        !apds.readGreenLight(green_light) ||
        !apds.readBlueLight(blue_light) ) {
    Serial.println("Error reading light values");
  } else {
    Serial.print("Ambient: ");
    Serial.print(ambient_light);
    Serial.print(" Red: ");
    Serial.print(red_light);
    Serial.print(" Green: ");
    Serial.print(green_light);
    Serial.print(" Blue: ");
    Serial.println(blue_light);
  }
  
  // 等待1s再进行下一次读取
  delay(1000);
}
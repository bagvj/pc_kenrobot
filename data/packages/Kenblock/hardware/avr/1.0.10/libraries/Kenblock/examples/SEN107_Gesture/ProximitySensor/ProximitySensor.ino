/**
 * \著作权 
 * @名称：  ProximityTest.ino
 * @作者：  SparkFun
 * @版本：  V0.1.0
 * @维护：  Kenblock
 * @时间：  2017/09/20
 * @描述：  APDS-9960 手势/RGB颜色传感器，距离感应器示例。
 *
 * \说明
 *	APDS-9960 手势/RGB颜色传感器，距离感应器示例。感知最近的物体，物体离传感器距离越近，数值越大。串口显示数据。
 *
 * \接口
 *	IIC-INT接口。但未使用外部中断0。
 *
 * \函数列表
 * 		1. bool	Kenblock_APDS9960::init() 
 * 		2. bool Kenblock_APDS9960::setProximityGain(uint8_t drive)
 * 		3. bool Kenblock_APDS9960::enableProximitySensor(bool interrupts)
 * 		4. bool Kenblock_APDS9960::readProximity(uint8_t &val)
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
uint8_t proximity_data = 0;

void setup() {
 
  Serial.begin(9600);//初始化串口，波特率为9600
  Serial.println();
  Serial.println(F("------------------------------------"));
  Serial.println(F("Kenblock APDS-9960 - ProximitySensor"));
  Serial.println(F("------------------------------------"));
  
  // 初始化APDS-9960(配置I2C和初始值)，判断初始化是否完成
  if ( apds.init() ) {
    Serial.println(F("APDS-9960 initialization complete"));
  } else {
    Serial.println(F("Something went wrong during APDS-9960 init!"));
  }
  
  // 调整距离传感器增益
  if ( !apds.setProximityGain(PGAIN_2X) ) {
    Serial.println(F("Something went wrong trying to set PGAIN"));
  }
  
  // 启动APDS-9960 距离传感器(无中断)
  if ( apds.enableProximitySensor(false) ) {
    Serial.println(F("Proximity sensor is now running"));
  } else {
    Serial.println(F("Something went wrong during sensor init!"));
  }
}

void loop() {
  
  // 读距离值
  if ( !apds.readProximity(proximity_data) ) {
    Serial.println("Error reading proximity value");
  } else {
    Serial.print("Proximity: ");
    Serial.println(proximity_data);
  }
  
  // 等待250 ms 再进行下一次读取
  delay(250);
}
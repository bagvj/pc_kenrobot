/**
 * \著作权 
 * @名称：  ProximityInterrupt.ino
 * @作者：  SparkFun
 * @版本：  V0.1.0
 * @维护：  Kenblock
 * @时间：  2017/09/20
 * @描述：  APDS-9960 手势/RGB颜色传感器，距离感应器 中断 示例。
 *
 * \说明
 *	APDS-9960 手势/RGB颜色传感器，距离感应器 中断 示例。当物体进入设置的中断距离阈值范围内时，模块产生中断，
 *  此时串口打印物体与传感器之间的距离，LED灯闪烁。距离越小数值越大。
 *
 * \接口
 *	IIC-INT接口。使用外部中断0（引脚2）。
 *
 * \函数列表
 * 		1. bool	Kenblock_APDS9960::init() 
 * 		2. bool Kenblock_APDS9960::setProximityGain(uint8_t drive) 
 * 		3. bool Kenblock_APDS9960::setProximityIntLowThreshold(uint8_t threshold)
 * 		4. bool Kenblock_APDS9960::setProximityIntHighThreshold(uint8_t threshold)
 * 		5. bool Kenblock_APDS9960::enableProximitySensor(bool interrupts)
 * 		6. bool Kenblock_APDS9960::readProximity(uint8_t &val)
 * 		7. bool Kenblock_APDS9960::clearProximityInt()
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/20      0.1.0              做汉化修订注释。
 *  
 */
 
#include <Wire.h>
#include <Kenblock_APDS9960.h>

#define APDS9960_INT    2  // 设置红外手势传感器的中断引脚
#define LED_PIN         13 // 显示中断的 LED

#define PROX_INT_HIGH   50 // 产生中断的距离阈值
#define PROX_INT_LOW    0  // 远离无中断

// 全局变量
Kenblock_APDS9960 apds = Kenblock_APDS9960();
uint8_t proximity_data = 0;
int isr_flag = 0;

void setup() {
  
  
  pinMode(LED_PIN, OUTPUT);		// 设置LED为输出模式
  pinMode(APDS9960_INT, INPUT);	//设置中断引脚为输入模式
  
  Serial.begin(9600);			//初始化串口，波特率为9600
  Serial.println();
  Serial.println(F("---------------------------------------"));
  Serial.println(F("Kenblock APDS-9960 - ProximityInterrupt"));
  Serial.println(F("---------------------------------------"));
  
  // 初始化中断服务例程，下降沿触发
  attachInterrupt(0, interruptRoutine, FALLING);
  
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
  
  // 设置接近中断阈值
  if ( !apds.setProximityIntLowThreshold(PROX_INT_LOW) ) {
    Serial.println(F("Error writing low threshold"));
  }
  if ( !apds.setProximityIntHighThreshold(PROX_INT_HIGH) ) {
    Serial.println(F("Error writing high threshold"));
  }
  
  // 启动APDS-9960 距离传感器(中断)
  if ( apds.enableProximitySensor(true) ) {
    Serial.println(F("Proximity sensor is now running"));
  } else {
    Serial.println(F("Something went wrong during sensor init!"));
  }
}

void loop() {
  
  // 如果中断发生，打印出距离值
  if ( isr_flag == 1 ) {
  
    // 读距离值
    if ( !apds.readProximity(proximity_data) ) {
      Serial.println("Error reading proximity value");
    } else {
      Serial.print("Proximity detected! Level: ");
      Serial.println(proximity_data);
    }
    
    // LED灯闪亮
    digitalWrite(LED_PIN, HIGH);
    delay(500);
    digitalWrite(LED_PIN, LOW);
    
    // 重置标记和清除APDS-9960中断(非常重要!)
    isr_flag = 0;
    if ( !apds.clearProximityInt() ) {
      Serial.println("Error clearing interrupt");
    }
  }
}

void interruptRoutine() {
  isr_flag = 1;
}
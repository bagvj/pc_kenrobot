/**
 * \著作权 
 * @名称：  AmbientLightInterrupt.ino
 * @作者：  SparkFun
 * @版本：  V0.1.0
 * @维护：  Kenblock
 * @时间：  2017/09/20
 * @描述：  APDS-9960 手势/RGB颜色传感器，环境光强、颜色 中断 示例。
 *
 * \说明
 *	APDS-9960 手势/RGB颜色传感器，环境光强、颜色 中断 示例。当模块处于强光环境或弱光环境时产生中断，串口打印光强和RGB三基色的强度值，LED灯闪烁。
 *
 * \接口
 *	IIC-INT接口。使用外部中断0（引脚2）。
 *
 * \函数列表
 * 		1. bool	Kenblock_APDS9960::init() 
 * 		2. bool Kenblock_APDS9960::setLightIntLowThreshold(uint16_t threshold)
 * 		3. bool Kenblock_APDS9960::setLightIntHighThreshold(uint16_t threshold)
 * 		4. bool Kenblock_APDS9960::enableLightSensor(bool interrupts)
 * 		5. bool Kenblock_APDS9960::getLightIntLowThreshold(uint16_t &threshold)
 * 		6. bool Kenblock_APDS9960::getLightIntHighThreshold(uint16_t &threshold)
 * 		7. bool Kenblock_APDS9960::setAmbientLightIntEnable(uint8_t enable)
 * 		8. bool Kenblock_APDS9960::readAmbientLight(uint16_t &val)
 * 		9. bool Kenblock_APDS9960::readRedLight(uint16_t &val)
 * 		10. bool Kenblock_APDS9960::readGreenLight(uint16_t &val)
 * 		11. bool Kenblock_APDS9960::readBlueLight(uint16_t &val) 
 * 		12. bool Kenblock_APDS9960::clearAmbientLightInt()
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

#define LIGHT_INT_HIGH  1000 // 强光中断阈值
#define LIGHT_INT_LOW   10   // 弱光中断阈值

// 全局变量
Kenblock_APDS9960 apds = Kenblock_APDS9960();
uint16_t ambient_light = 0;
uint16_t red_light = 0;
uint16_t green_light = 0;
uint16_t blue_light = 0;
int isr_flag = 0;
uint16_t threshold = 0;

void setup() {
  
  pinMode(LED_PIN, OUTPUT);		// 设置LED为输出模式
  pinMode(APDS9960_INT, INPUT);	//设置中断引脚为输入模式
  
  Serial.begin(9600);			//初始化串口，波特率为9600
  Serial.println();
  Serial.println(F("-------------------------------------"));
  Serial.println(F("Kenblock APDS-9960 - Light Interrupts"));
  Serial.println(F("-------------------------------------"));
  
  // 初始化中断服务例程，下降沿触发
  attachInterrupt(0, interruptRoutine, FALLING);
  
  // 初始化APDS-9960(配置I2C和初始值)，判断初始化是否完成
  if ( apds.init() ) {
    Serial.println(F("APDS-9960 initialization complete"));
  } else {
    Serial.println(F("Something went wrong during APDS-9960 init!"));
  }
  
  // 设置强光和弱光时的中断阀值
  if ( !apds.setLightIntLowThreshold(LIGHT_INT_LOW) ) {
    Serial.println(F("Error writing low threshold"));
  }
  if ( !apds.setLightIntHighThreshold(LIGHT_INT_HIGH) ) {
    Serial.println(F("Error writing high threshold"));
  }
  
  // 启动APDS-9960光线传感器(无中断)
  if ( apds.enableLightSensor(false) ) {
    Serial.println(F("Light sensor is now running"));
  } else {
    Serial.println(F("Something went wrong during light sensor init!"));
  }
  
  // 读高与低阈值中断
  if ( !apds.getLightIntLowThreshold(threshold) ) {
    Serial.println(F("Error reading low threshold"));
  } else {
    Serial.print(F("Low Threshold: "));
    Serial.println(threshold);
  }
  if ( !apds.getLightIntHighThreshold(threshold) ) {
    Serial.println(F("Error reading high threshold"));
  } else {
    Serial.print(F("High Threshold: "));
    Serial.println(threshold);
  }
  
  // 中断使能
  if ( !apds.setAmbientLightIntEnable(1) ) {
    Serial.println(F("Error enabling interrupts"));
  }
  
  // 等待初始化和校准完成
  delay(500);
}

void loop() {
  
  // 如果中断发生，打印光强和RGB三基色的强度值
  if ( isr_flag == 1 ) {
    
    // 读取光照强度、RGB三基色的值，然后打印
    if (  !apds.readAmbientLight(ambient_light) ||
          !apds.readRedLight(red_light) ||
          !apds.readGreenLight(green_light) ||
          !apds.readBlueLight(blue_light) ) {
      Serial.println("Error reading light values");
    } else {
      Serial.print("Interrupt! Ambient: ");
      Serial.print(ambient_light);
      Serial.print(" R: ");
      Serial.print(red_light);
      Serial.print(" G: ");
      Serial.print(green_light);
      Serial.print(" B: ");
      Serial.println(blue_light);
    }
    
    // LED灯闪亮
    digitalWrite(LED_PIN, HIGH);
    delay(500);
    digitalWrite(LED_PIN, LOW);
    
    // 重置标记和清除APDS-9960中断(非常重要!)
    isr_flag = 0;
    if ( !apds.clearAmbientLightInt() ) {
      Serial.println("Error clearing interrupt");
    }
  }
}

void interruptRoutine() {
  isr_flag = 1;
}
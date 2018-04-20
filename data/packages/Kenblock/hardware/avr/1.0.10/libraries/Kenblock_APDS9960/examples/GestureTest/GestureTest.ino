/**
 * \著作权 
 * @名称：  GestureTest.ino
 * @作者：  SparkFun
 * @版本：  V0.1.0
 * @维护：  Kenblock
 * @时间：  2017/09/20
 * @描述：  APDS-9960 手势/RGB颜色传感器，手势识别示例，识别上、下、左、右、接近、远离手势。
 *
 * \说明
 *	APDS-9960 手势/RGB颜色传感器，识别手势示例，识别上、下、左、右、接近、远离手势。串口显示识别到的手势。
 * 
 * \手势说明：
 *  1. 上、下、左、右滑动手势：这个很简单，就是往对应方向滑动，传感器8cm范围内均可正确识别。
 *  2. 接近手势：保持手在传感器上方 8cm 左右至少1秒钟，然后从远到近滑动，再把手移走（从上、下、左、右方向）
 *     直至不遮挡住传感器为止。
 *  3. 远离手势：保持手在传感器上方 5cm 以内至少1秒钟，然后从近到远滑动，直到传感器检测不到的距离（10cm以上）。
 *
 * \接口
 *	IIC-INT接口。使用外部中断0（引脚2）。
 *
 * \函数列表
 * 		1. bool	Kenblock_APDS9960::init() 
 * 		2. bool Kenblock_APDS9960::enableGestureSensor(bool interrupts)
 * 		3. bool Kenblock_APDS9960::isGestureAvailable()
 * 		4. int Kenblock_APDS9960::readGesture()
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/20      0.1.0              做汉化修订注释。
 *  
 */

#include <Wire.h>
#include <Kenblock_APDS9960.h>

#define APDS9960_INT    2 // 设置红外手势传感器的中断引脚

// 全局变量
Kenblock_APDS9960 apds = Kenblock_APDS9960();
int isr_flag = 0;

void setup() {

  
  pinMode(APDS9960_INT, INPUT);	// 设置中断引脚为输入模式

  Serial.begin(9600);			//初始化串口，波特率为9600
  Serial.println();
  Serial.println(F("--------------------------------"));
  Serial.println(F("Kenblock APDS-9960 - GestureTest"));
  Serial.println(F("--------------------------------"));
  
  // 初始化中断服务例程，下降沿触发
  attachInterrupt(0, interruptRoutine, FALLING);

  // 初始化APDS-9960(配置I2C和初始值)，判断初始化是否完成
  if ( apds.init() ) {
    Serial.println(F("APDS-9960 initialization complete"));
  } else {
    Serial.println(F("Something went wrong during APDS-9960 init!"));
  }
  
  // 启动APDS-9960手势传感器（中断）
  if ( apds.enableGestureSensor(true) ) {
    Serial.println(F("Gesture sensor is now running"));
  } else {
    Serial.println(F("Something went wrong during gesture sensor init!"));
  }
}

void loop() {
  if( isr_flag == 1 ) {
    detachInterrupt(0);
    handleGesture();
    isr_flag = 0;
    attachInterrupt(0, interruptRoutine, FALLING);
  }
}

void interruptRoutine() {
  isr_flag = 1;
}

void handleGesture() {
    if ( apds.isGestureAvailable() ) {
    switch ( apds.readGesture() ) {
      case DIR_UP:
        Serial.println("UP");
        break;
      case DIR_DOWN:
        Serial.println("DOWN");
        break;
      case DIR_LEFT:
        Serial.println("LEFT");
        break;
      case DIR_RIGHT:
        Serial.println("RIGHT");
        break;
      case DIR_NEAR:
        Serial.println("NEAR");
        break;
      case DIR_FAR:
        Serial.println("FAR");
        break;
      default:
        Serial.println("NONE");
    }
  }
}
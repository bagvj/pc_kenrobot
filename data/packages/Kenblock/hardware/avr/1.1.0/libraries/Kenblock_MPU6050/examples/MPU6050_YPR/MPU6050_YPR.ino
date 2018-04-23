// I2C device class (I2Cdev) demonstration Arduino sketch for MPU6050 class using DMP (MotionApps v2.0)
// 6/21/2012 by Jeff Rowberg <jeff@rowberg.net>
// Updates should (hopefully) always be available at https://github.com/jrowberg/i2cdevlib
//
// Changelog:
//      2013-05-08 - added seamless Fastwire support
//                 - added note about gyro calibration
//      2012-06-21 - added note about Arduino 1.0.1 + Leonardo compatibility error
//      2012-06-20 - improved FIFO overflow handling and simplified read process
//      2012-06-19 - completely rearranged DMP initialization code and simplification
//      2012-06-13 - pull gyro and accel data from FIFO packet instead of reading directly
//      2012-06-09 - fix broken FIFO read sequence and change interrupt detection to RISING
//      2012-06-05 - add gravity-compensated initial reference frame acceleration output
//                 - add 3D math helper file to DMP6 example sketch
//                 - add Euler output and Yaw/Pitch/Roll output formats
//      2012-06-04 - remove accel offset clearing for better results (thanks Sungon Lee)
//      2012-06-01 - fixed gyro sensitivity to be 2000 deg/sec instead of 250
//      2012-05-30 - basic DMP initialization working

/* ============================================
I2Cdev device library code is placed under the MIT license
Copyright (c) 2012 Jeff Rowberg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
===============================================
*/

// I2Cdev and MPU6050 must be installed as libraries, or else the .cpp/.h files
// for both classes must be in the include path of your project
#include "I2Cdev.h"

#include "MPU6050_6Axis_MotionApps20.h"
//#include "MPU6050.h" // not necessary if using MotionApps include file

// Arduino Wire library is required if I2Cdev I2CDEV_ARDUINO_WIRE implementation
// is used in I2Cdev.h
#if I2CDEV_IMPLEMENTATION == I2CDEV_ARDUINO_WIRE
    #include "Wire.h"
#endif

// class default I2C address is 0x68
// specific I2C addresses may be passed as a parameter here
// AD0 low = 0x68 (default for SparkFun breakout and InvenSense evaluation board)
// AD0 high = 0x69
MPU6050 mpu;
//MPU6050 mpu(0x69); // <-- use for AD0 high

/* =========================================================================
   NOTE: In addition to connection 3.3v, GND, SDA, and SCL, this sketch
   depends on the MPU-6050's INT pin being connected to the Arduino's
   external interrupt #0 pin. On the Arduino Uno and Mega 2560, this is
   digital I/O pin 2.
 * ========================================================================= */

/* =========================================================================
   NOTE: Arduino v1.0.1 with the Leonardo board generates a compile error
   when using Serial.write(buf, len). The Teapot output uses this method.
   The solution requires a modification to the Arduino USBAPI.h file, which
   is fortunately simple, but annoying. This will be fixed in the next IDE
   release. For more info, see these links:

   http://arduino.cc/forum/index.php/topic,109987.0.html
   http://code.google.com/p/arduino/issues/detail?id=958
 * ========================================================================= */


// uncomment "OUTPUT_READABLE_YAWPITCHROLL" if you want to see the yaw/
// pitch/roll angles (in degrees) calculated from the quaternions coming
// from the FIFO. Note this also requires gravity vector calculations.
// Also note that yaw/pitch/roll angles suffer from gimbal lock (for
// more info, see: http://en.wikipedia.org/wiki/Gimbal_lock)

#define OUTPUT_READABLE_YAWPITCHROLL


#define INTERRUPT_PIN 2 // 中断引脚为 端口2（外部中断0）
#define LED_PIN 13      // LED灯端口
bool blinkState = false;

// MPU 控制/状态 变量
bool dmpReady = false;  // 如果DMP初始化成功，设为true
uint8_t mpuIntStatus;   // 保存MPU的中断状态字节
uint8_t devStatus;      // 每次设备操作后返回状态值(0 =成功，!0 =错误)
uint16_t packetSize;    // 可读的DMP数据包的大小(默认为42字节)
uint16_t fifoCount;     // 当前FIFO中的所有字节数
uint8_t fifoBuffer[64]; // FIFO存储缓冲区

// 方向/运动 变量
Quaternion q;           // [w, x, y, z]         四元数的集合
VectorFloat gravity;    // [x, y, z]            重力向量
float ypr[3];           // [yaw, pitch, roll]   偏航(yaw)/俯仰(pitch)/滚转(roll)和重力矢量


// ================================================================
// ===                      中断检测程序                        ===
// ================================================================

volatile bool mpuInterrupt = false;     // MPU产生外部中断标志，若中断值设为true
void dmpDataReady() 
{
  mpuInterrupt = true;
}


// ================================================================
// ===                        初始化设置                        ===
// ================================================================

void setup() 
{
  // I2C 总线初始化 (I2Cdev 库不会自动执行初始化)
  #if I2CDEV_IMPLEMENTATION == I2CDEV_ARDUINO_WIRE
    Wire.begin();
    Wire.setClock(400000); // 设置I2C时钟速率400 khz。如果有无法通过编译，请注释这一行。
  #elif I2CDEV_IMPLEMENTATION == I2CDEV_BUILTIN_FASTWIRE
    Fastwire::setup(400, true);
  #endif

  // 初始化串口，波特率为115200
  Serial.begin(115200);
  while (!Serial); // 等待Leonardo的枚举，其他主板会立即执行

  // 初始化MPU6050
  Serial.println(F("Initializing I2C devices..."));
  mpu.initialize();
  pinMode(INTERRUPT_PIN, INPUT);

  // 测试MPU6050连接状态
  Serial.println(F("Testing device connections..."));
  Serial.println(mpu.testConnection() ? F("MPU6050 connection successful") : F("MPU6050 connection failed"));

  // 等待准备。串口发送任何字符开始DMP编程和演示。
  Serial.println(F("\nSend any character to begin DMP programming and demo: "));
  while (Serial.available() && Serial.read()); // 清空缓冲区
  while (!Serial.available());                 // 等待数据
  while (Serial.available() && Serial.read()); // 再次清空缓冲区

  // 加载并配置DMP
  Serial.println(F("Initializing DMP..."));
  devStatus = mpu.dmpInitialize();

  // 在这里提供你自己的陀螺仪偏移量，提高精度
  mpu.setXGyroOffset(220);
  mpu.setYGyroOffset(76);
  mpu.setZGyroOffset(-85);
  mpu.setZAccelOffset(1788); // 1688，我的测试芯片工厂默认为该数值

  // 确保DMP配置成功(如果是的话，返回0)
  if (devStatus == 0) 
  {
    // 使能DMP，现在已经准备好了
    Serial.println(F("Enabling DMP..."));
    mpu.setDMPEnabled(true);

    // 使能Arduino外部中断0（Uno为引脚2），上升沿触发
    Serial.println(F("Enabling interrupt detection (Arduino external interrupt 0)..."));
    attachInterrupt(digitalPinToInterrupt(INTERRUPT_PIN), dmpDataReady, RISING);
    mpuIntStatus = mpu.getIntStatus();

    // 设置DMP准备就绪标志，从而在loop() 中知道DMP是可用，并继续
    Serial.println(F("DMP ready! Waiting for first interrupt..."));
    dmpReady = true;

    // 获得预期的DMP数据包大小以供以后比较使用。默认读出为42
    packetSize = mpu.dmpGetFIFOPacketSize();
  } 
  else 
  {
    // ERROR!否则初始化失败
    // 1 = 初始内存加载失败(通常代码将是1)
    // 2 = DMP配置更新失败
    Serial.print(F("DMP Initialization failed (code "));
    Serial.print(devStatus);
    Serial.println(F(")"));
  }

  // 配置LED
  pinMode(LED_PIN, OUTPUT);
}



// ================================================================
// ===                       主程序循环                         ===
// ================================================================

void loop() 
{
  // 如果DMP配置失败，就不要做别的了
  if (!dmpReady) return;
  // 读取当前FIFO计数
  fifoCount = mpu.getFIFOCount();							   

  // 等待MPU中断或额外的数据包
  while (!mpuInterrupt && fifoCount < packetSize) 
  {
  }

  // 重置中断标志并读取MPU INT_STATUS 字节
  mpuInterrupt = false;
  mpuIntStatus = mpu.getIntStatus();

  // 读取当前FIFO计数
  fifoCount = mpu.getFIFOCount();

  // 检查溢出(除非我们的代码效率太低，否则不应该发生这种情况)
  if ((mpuIntStatus & 0x10) || fifoCount == 1024) 
  {
    // 重置，这样我们就可以继续清除数据
    mpu.resetFIFO();
    Serial.println(F("FIFO overflow!"));

  // 否则，检查DMP数据是否准备中断(这应该经常发生)
  } 
  else if (mpuIntStatus & 0x02) 
  {
    // 等待正确的数据长度，等待时间应该是非常短的 
    while (fifoCount < packetSize) fifoCount = mpu.getFIFOCount();

    // 从FIFO读取数据包
    mpu.getFIFOBytes(fifoBuffer, packetSize);
    
    // 跟踪 FIFO 计数 > 1包可用数据
    // (这让我们可以立即阅读更多内容，而无需等待中断)
    fifoCount -= packetSize;

    // 输出 偏航(yaw)、俯仰(pitch)、滚转(roll) 角度
    mpu.dmpGetQuaternion(&q, fifoBuffer);
    mpu.dmpGetGravity(&gravity, &q);
    mpu.dmpGetYawPitchRoll(ypr, &q, &gravity);//从DMP中取出Yaw、Pitch、Roll三个轴的角度，放入数组ypr。单位：弧度
    Serial.print("ypr\t");
    Serial.print(ypr[0] * 180/M_PI);
    Serial.print("\t");
    Serial.print(ypr[1] * 180/M_PI);
    Serial.print("\t");
    Serial.println(ypr[2] * 180/M_PI);

    // LED闪烁
    blinkState = !blinkState;
    digitalWrite(LED_PIN, blinkState);
  }
}

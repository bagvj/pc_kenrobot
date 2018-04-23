/**
 * \著作权 
 * @名称：  HMC5883L_raw.ino
 * @作者：  Jeff Rowberg
 * @版本：  V1.0.0
 * @维护：  Kenblock
 * @时间：  2017/10/10
 * @描述：  HMC5883L 电子罗盘传感模块测试示例。
 *
 * \说明
 * HMC5883L 电子罗盘传感模块测试示例。读取xyz的值，计算航向，串口打印显示。
 *
 * \函数列表
 * 		1. void HMC5883L::initialize();       // 初始化。
 * 		2. bool HMC5883L::testConnection();   // 连接状态测试。
 * 		3. void HMC5883L::getHeading(int16_t *x, int16_t *y, int16_t *z); // 同时读取xyz轴的磁力值。
 *    4. int16_t HMC5883L::getHeadingX();   // 读取x轴的磁力值。
 *    5. int16_t HMC5883L::getHeadingY();   // 读取y轴的磁力值。
 *    6. int16_t HMC5883L::getHeadingZ();   // 读取z轴的磁力值。
 *    7. float HMC5883L::getAngle();        // 读取航向值。
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/10/10      1.0.0              做汉化修订注释。
 *  
 */

// 在I2Cdev . h中使用I2Cdev I2CDEV_ARDUINO_WIRE实现时，需要Arduino Wire库
#include "Wire.h"

// 必须安装 I2Cdev 和 HMC5883L 库
#include "I2Cdev.h"
#include "HMC5883L.h"

// 默认I2C地址为0x1E
HMC5883L mag;

int16_t mx, my, mz;

#define LED_PIN 13
bool blinkState = false;

void setup() 
{
  // I2C 总线初始化
  Wire.begin();

  // 初始化串口，波特率为115200
  Serial.begin(115200);

  // 初始化 HMC5883L
  Serial.println("Initializing I2C devices...");
  mag.initialize();

  // 测试 HMC5883L 连接状态
  Serial.println("Testing device connections...");
  Serial.println(mag.testConnection() ? "HMC5883L connection successful" : "HMC5883L connection failed");

  // 配置LED
  pinMode(LED_PIN, OUTPUT);
}

void loop() 
{
  // 从设备读取原始的航向测量值
  // 也可以使用：getHeadingX();/getHeadingX();/getHeadingX();
  mag.getHeading(&mx, &my, &mz);

  // 输出显示 mag x/y/z值
  Serial.print("mag:\t");
  Serial.print(mx); Serial.print("\t");
  Serial.print(my); Serial.print("\t");
  Serial.print(mz); Serial.print("\t");

  // 读取航向，0度表表示正北方向
  float heading = mag.getAngle();
  Serial.print("heading:\t");
  Serial.println(heading); 
  
  // 也可以用上面已读取的数据，进行计算航向，0度表表示正北方向
  // float heading = atan2(my, mx);
  // if(heading < 0)
    // heading += 2 * M_PI;
  // Serial.print("heading:\t");
  // Serial.println(heading * 180/M_PI);

  // LED闪烁
  blinkState = !blinkState;
  digitalWrite(LED_PIN, blinkState);
  
  delay(100);
}

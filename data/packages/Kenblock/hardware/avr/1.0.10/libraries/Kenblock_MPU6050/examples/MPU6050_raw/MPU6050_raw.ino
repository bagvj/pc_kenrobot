/**
 * \著作权 
 * @名称：  MPU6050_raw.ino
 * @作者：  Jeff Rowberg
 * @版本：  V1.0.0
 * @维护：  Kenblock
 * @时间：  2017/10/10
 * @描述：  MPU6050 加速度和陀螺仪传感模块测试示例。
 *
 * \说明
 * MPU6050 加速度和陀螺仪传感模块测试示例。串口显示测量的6轴原始数据。
 *
 * \函数列表
 * 		1. void MPU6050::initialize()
 * 		2. bool MPU6050::testConnection()
 * 		3. void MPU6050::getMotion6(int16_t* ax, int16_t* ay, int16_t* az, int16_t* gx, int16_t* gy, int16_t* gz)
 * 		4. void MPU6050::getAcceleration(int16_t* x, int16_t* y, int16_t* z)
 *    5. void MPU6050::getRotation(int16_t* x, int16_t* y, int16_t* z) 
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/10/10      1.0.0              做汉化修订注释。
 *  
 */

// 必须安装 I2Cdev 和 MPU6050 库
#include "I2Cdev.h"
#include "MPU6050.h"

// 在I2Cdev.h中使用I2Cdev I2CDEV_ARDUINO_WIRE实现时，需要包含Wire库
#if I2CDEV_IMPLEMENTATION == I2CDEV_ARDUINO_WIRE
    #include "Wire.h"
#endif

MPU6050 accelgyro; 			    // 默认I2C地址为0x68
//MPU6050 accelgyro(0x69); 	// 如果AD0 为高电平，则I2C地址为0x69

int16_t ax, ay, az;
int16_t gx, gy, gz;

// 串口打印数据格式：显示 加速度计/陀螺仪 X/Y/Z轴的值，按列表显示，十进制显示，易于阅读。
#define OUTPUT_READABLE_ACCELGYRO

// 串口打印数据格式：十六进制显示，易于解析。
//#define OUTPUT_BINARY_ACCELGYRO

#define LED_PIN 13
bool blinkState = false;

void setup() {

    // I2C 总线初始化 (I2Cdev 库不会自动执行初始化)
    #if I2CDEV_IMPLEMENTATION == I2CDEV_ARDUINO_WIRE
        Wire.begin();
    #elif I2CDEV_IMPLEMENTATION == I2CDEV_BUILTIN_FASTWIRE
        Fastwire::setup(400, true);
    #endif

    // 初始化串口，波特率为115200
    Serial.begin(115200);

    // 初始化MPU6050
    Serial.println("Initializing I2C devices...");
    accelgyro.initialize();

    // 测试MPU6050连接状态
    Serial.println("Testing device connections...");
    Serial.println(accelgyro.testConnection() ? "MPU6050 connection successful" : "MPU6050 connection failed");

    // 可使用下面的代码更改 加速度计/陀螺仪 偏移值
    /*
    Serial.println("Updating internal sensor offsets...");
    // -76	-2359	1688	0	0	0
    Serial.print(accelgyro.getXAccelOffset()); Serial.print("\t"); // -76
    Serial.print(accelgyro.getYAccelOffset()); Serial.print("\t"); // -2359
    Serial.print(accelgyro.getZAccelOffset()); Serial.print("\t"); // 1688
    Serial.print(accelgyro.getXGyroOffset()); Serial.print("\t"); // 0
    Serial.print(accelgyro.getYGyroOffset()); Serial.print("\t"); // 0
    Serial.print(accelgyro.getZGyroOffset()); Serial.print("\t"); // 0
    Serial.print("\n");
    accelgyro.setXGyroOffset(220);
    accelgyro.setYGyroOffset(76);
    accelgyro.setZGyroOffset(-85);
    Serial.print(accelgyro.getXAccelOffset()); Serial.print("\t"); // -76
    Serial.print(accelgyro.getYAccelOffset()); Serial.print("\t"); // -2359
    Serial.print(accelgyro.getZAccelOffset()); Serial.print("\t"); // 1688
    Serial.print(accelgyro.getXGyroOffset()); Serial.print("\t"); // 0
    Serial.print(accelgyro.getYGyroOffset()); Serial.print("\t"); // 0
    Serial.print(accelgyro.getZGyroOffset()); Serial.print("\t"); // 0
    Serial.print("\n");
    */

    pinMode(LED_PIN, OUTPUT);
}

void loop() {
    // 从设备读取 加速度计/陀螺仪 原始的测量值
    accelgyro.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

    // 也可以分别读取 加速度计/陀螺仪 的数据
    //accelgyro.getAcceleration(&ax, &ay, &az);
    //accelgyro.getRotation(&gx, &gy, &gz);

    #ifdef OUTPUT_READABLE_ACCELGYRO
        // 显示 加速度计/陀螺仪 轴的值，按列表显示
        Serial.print("accel/gyro:\tax:");
        Serial.print(ax); Serial.print("\t\tay:");
        Serial.print(ay); Serial.print("\t\taz:");
        Serial.print(az); Serial.print("\tgx:");
        Serial.print(gx); Serial.print("\t\tgy:");
        Serial.print(gy); Serial.print("\t\tgz:");
        Serial.println(gz);
    #endif

    #ifdef OUTPUT_BINARY_ACCELGYRO
		// 十六进制显示
        Serial.write((uint8_t)(ax >> 8)); Serial.write((uint8_t)(ax & 0xFF));
        Serial.write((uint8_t)(ay >> 8)); Serial.write((uint8_t)(ay & 0xFF));
        Serial.write((uint8_t)(az >> 8)); Serial.write((uint8_t)(az & 0xFF));
        Serial.write((uint8_t)(gx >> 8)); Serial.write((uint8_t)(gx & 0xFF));
        Serial.write((uint8_t)(gy >> 8)); Serial.write((uint8_t)(gy & 0xFF));
        Serial.write((uint8_t)(gz >> 8)); Serial.write((uint8_t)(gz & 0xFF));
    #endif

    // LED闪烁
    blinkState = !blinkState;
    digitalWrite(LED_PIN, blinkState);
}

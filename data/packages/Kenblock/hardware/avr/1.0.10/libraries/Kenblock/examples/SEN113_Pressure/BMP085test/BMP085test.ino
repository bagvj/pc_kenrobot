/**
 * \著作权 
 * @名称：  BMP085test.ino
 * @作者：  Adafruit
 * @版本：  V1.0.0
 * @维护：  Kenblock
 * @时间：  2017/09/20
 * @描述：  BMP085传感器示例，获取气压、温度、海拔高度值。
 *
 * \说明
 *	BMP085传感器示例，获取气压、温度、海拔高度值。串口打印气压、温度、高度信息。
 *
 * \函数列表
 * 		1. boolean 	Kenblock_BMP085::begin(uint8_t mode)
 * 		2. float 	Kenblock_BMP085::readTemperature(void)
 * 		3. int32_t 	Kenblock_BMP085::readPressure(void)
 * 		4. float 	Kenblock_BMP085::readAltitude(float sealevelPressure)
 * 		4. int32_t 	Kenblock_BMP085::readSealevelPressure(float altitude_meters)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/20      1.0.0              做汉化修订注释。
 *  
 */
#include "Wire.h"
#include "Kenblock_BMP085.h"

Kenblock_BMP085 bmp;
  
void setup() {
	Serial.begin(9600);
	if (!bmp.begin()) {
		Serial.println("Could not find a valid BMP085 sensor, check wiring!");
		while (1) {}
	}
}
  
void loop() {
	// 读取温度，串口显示
    Serial.print("Temperature = ");
    Serial.print(bmp.readTemperature());
    Serial.println(" *C");
	
    // 读取大气压强，单位为Pa，串口显示
    Serial.print("Pressure = ");
    Serial.print(bmp.readPressure());
    Serial.println(" Pa");
    
    // 读取海拔高度，按标准大气压计算，标准大气压强 101325 Pa
    Serial.print("Altitude = ");
    Serial.print(bmp.readAltitude());
    Serial.println(" meters");
	
	// 读取海平面大气压，为计算所得
    Serial.print("Pressure at sealevel (calculated) = ");
    Serial.print(bmp.readSealevelPressure());
    Serial.println(" Pa");

	// 如果你知道现在的海平面气压会随天气变化而变化，你就可以得到更精确的高度。
	// 假设海平面气压为 101500 Pa，然后计算海拔高度。
    Serial.print("Real altitude = ");
    Serial.print(bmp.readAltitude(101500));
    Serial.println(" meters");
    
    Serial.println();
    delay(500);
}
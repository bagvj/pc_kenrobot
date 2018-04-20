/**
 * \著作权 
 * @名称：  dht33_test.ino
 * @作者：  Rob Tillaart
 * @版本：  V0.1.01
 * @维护：  Kenblock
 * @时间：  2017/09/11
 * @描述：  DHT33测试示例。
 *
 * \说明
 * DHT33测试示例。输出显示湿度值、温度值。
 *
 * \函数列表
 *	1.	int8_t dht::read33(uint8_t pin)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/11      0.1.01              做汉化修订注释。
 *  
 */

#include <dht.h>

dht DHT;

#define DHT33_PIN 2

void setup()
{
    Serial.begin(115200);
    Serial.println("DHT TEST PROGRAM ");
    Serial.print("LIBRARY VERSION: ");
    Serial.println(DHT_LIB_VERSION);
    Serial.println();
    Serial.println("Type,\tstatus,\tHumidity (%),\tTemperature (C)\tTime (us)");
}

void loop()
{
    // 读取数据
    Serial.print("DHT33, \t");

    uint32_t start = micros();
    int chk = DHT.read33(DHT33_PIN);
    uint32_t stop = micros();

    switch (chk)
    {
    case DHTLIB_OK:
        Serial.print("OK,\t");
        break;
    case DHTLIB_ERROR_CHECKSUM:
        Serial.print("Checksum error,\t");
        break;
    case DHTLIB_ERROR_TIMEOUT:
        Serial.print("Time out error,\t");
        break;
    case DHTLIB_ERROR_CONNECT:
        Serial.print("Connect error,\t");
        break;
    case DHTLIB_ERROR_ACK_L:
        Serial.print("Ack Low error,\t");
        break;
    case DHTLIB_ERROR_ACK_H:
        Serial.print("Ack High error,\t");
        break;
    default:
        Serial.print("Unknown error,\t");
        break;
    }
    // 输出显示数据
    Serial.print(DHT.humidity, 1);
    Serial.print(",\t");
    Serial.print(DHT.temperature, 1);
    Serial.print(",\t");
    Serial.print(stop - start);
    Serial.println();
    
	// 对于UNO + DHT33 ，400ms似乎是传感器读取之间的最小延迟

    delay(1000);
}

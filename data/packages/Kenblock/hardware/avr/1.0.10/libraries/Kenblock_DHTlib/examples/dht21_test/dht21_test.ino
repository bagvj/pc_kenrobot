/**
 * \著作权 
 * @名称：  dht21_test.ino
 * @作者：  Rob Tillaart
 * @版本：  V0.1.02
 * @维护：  Kenblock
 * @时间：  2017/09/11
 * @描述：  DHT21测试示例。
 *
 * \说明
 * DHT21测试示例。输出显示湿度值、温度值。
 *
 * \函数列表
 *	1.	int8_t dht::read21(uint8_t pin)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/11      0.1.02              做汉化修订注释。
 *  
 */

#include <dht.h>

dht DHT;
int DHT21Pin = 2;            			//DHT21模块接口

void setup()
{
    Serial.begin(115200);
    Serial.println("DHT TEST PROGRAM ");
    Serial.print("LIBRARY VERSION: ");
    Serial.println(DHT_LIB_VERSION);
    Serial.println();
    Serial.println("Type,\tstatus,\tHumidity (%),\tTemperature (C)");
}

void loop()
{
    // 读取数据
    Serial.print("DHT21, \t");
    int chk = DHT.read21(DHT21Pin);
	// 输出状态
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
    Serial.println(DHT.temperature, 1);

    delay(2000);
}
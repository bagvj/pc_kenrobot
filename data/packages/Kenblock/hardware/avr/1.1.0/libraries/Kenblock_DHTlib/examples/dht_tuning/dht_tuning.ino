/**
 * \著作权 
 * @名称：  dht_tuning.ino
 * @作者：  Rob Tillaart
 * @版本：  V0.1.0
 * @维护：  Kenblock
 * @时间：  2017/09/11
 * @描述：  DHT22 寻找读取的最小时间。
 *
 * \说明
 * DHT22 寻找读取的最小时间。通过串口输出显示。
 *
 * \函数列表
 *	1.	int8_t dht::read11(uint8_t pin)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/11      0.1.0              做汉化修订注释。
 *  
 */

#include <dht.h>

dht DHT;

#define DHT22_PIN 2

void setup()
{
  Serial.begin(115200);
  Serial.println("DHT TEST PROGRAM ");
  Serial.print("LIBRARY VERSION: ");
  Serial.println(DHT_LIB_VERSION);
  Serial.println();
  Serial.println("Type,\tstatus,\t\tHumidity (%),\tTemperatur (C),\tT_Read (us)\tT_Cycle (us)\tT_Delay (us)");
}

int del = 500;
uint32_t startRead = 0;
uint32_t stopRead = 0;
uint32_t startCycle = 0;
uint32_t stopCycle = 0;
uint32_t tempCycle = 0;

void loop()
{
  while(del > 0){
    // 读取数据
    Serial.print("DHT22, \t");
    
    startRead = micros();
    int chk = DHT.read22(DHT22_PIN);
    stopRead = micros();

    switch (chk)
    {
    case DHTLIB_OK:
      Serial.print("OK,\t\t");
      del -= 10;
      break;
    case DHTLIB_ERROR_CHECKSUM:
      Serial.print("Checksum,\t");
      break;
    case DHTLIB_ERROR_TIMEOUT:
      Serial.print("Time out,\t");
      del += 10;
      break;
    case DHTLIB_ERROR_CONNECT:
      Serial.print("Connect,\t");
      break;
    case DHTLIB_ERROR_ACK_L:
      Serial.print("Ack Low,\t");
      break;
    case DHTLIB_ERROR_ACK_H:
      Serial.print("Ack High,\t");
      break;
    default:
      Serial.print("Unknown,\t");
      break;
    }
    // 输出显示数据
    Serial.print(DHT.humidity, 1);
    Serial.print(",\t\t");
    Serial.print(DHT.temperature, 1);
    Serial.print(",\t\t");
    Serial.print(stopRead - startRead);
    Serial.print(",\t\t");
    stopCycle = micros();
    tempCycle = micros();
    Serial.print(stopCycle - startCycle);
    startCycle = tempCycle;
    Serial.print(",\t\t");
    Serial.print(del);
    Serial.print("000");
    Serial.println();

    delay(del);
  }
  while(1);
}
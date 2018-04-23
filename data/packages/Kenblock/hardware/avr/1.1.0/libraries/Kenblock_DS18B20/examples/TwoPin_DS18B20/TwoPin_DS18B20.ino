/**
 * \著作权 
 * @名称：  TwoPin_DS18B20.ino
 * @作者：  Miles Burton, Tim Newsome, Guil Barros, Rob Tillaart
 * @版本：  V0.1.0
 * @维护：  Kenblock
 * @时间：  2017/09/11
 * @描述：  两个引脚接两个DS18B20传感器的示例。
 *
 * \说明
 * 两个引脚接两个DS18B20传感器的示例。
 *
 * \函数列表
 *	1.	void 	DallasTemperature::begin(void)
 *	2.	void    DallasTemperature::requestTemperatures()
 *	3.	bool 	DallasTemperature::requestTemperaturesByIndex(uint8_t deviceIndex)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/11      0.1.0              做汉化修订注释。
 *  
 */
#include <OneWire.h>
#include <DallasTemperature.h>

#define ONE_WIRE_BUS_1 2
#define ONE_WIRE_BUS_2 4

OneWire oneWire_in(ONE_WIRE_BUS_1);
OneWire oneWire_out(ONE_WIRE_BUS_2);

DallasTemperature sensor_inhouse(&oneWire_in);
DallasTemperature sensor_outhouse(&oneWire_out);

void setup(void)
{
    Serial.begin(9600);
    Serial.println("Dallas Temperature Control Library Demo - TwoPin_DS18B20");

    sensor_inhouse.begin();
    sensor_outhouse.begin();
}

void loop(void)
{
    Serial.print("Requesting temperatures...");
    sensor_inhouse.requestTemperatures();
    sensor_outhouse.requestTemperatures();
    Serial.println(" done");

    Serial.print("Inhouse: ");
    Serial.println(sensor_inhouse.getTempCByIndex(0));

    Serial.print("Outhouse: ");
    Serial.println(sensor_outhouse.getTempCByIndex(0));
}
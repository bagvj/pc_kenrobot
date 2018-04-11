#include "uper_Ultrasonic.h"
 /**
 * \著作权 
 * @名称：  uper_Ultrasonic.cpp
 * @作者：  uper
 * @版本：  v180315
 * @URL: 	http://www.uper.cc
 * @维护：  uper
 * @时间：  2018/3/15
 *
 * \说明
 * 超声波传感器
 *
 * \公有方法列表
 * 
 * 		1.float distance()         //模拟口
 *       2.float distancenum(void)  //数字口
 * 		
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  uper              2018/3/28      v180328             添加数字接口
 * \示例
 * uper_Ultrasonic.ino
 */
// 模拟接口
UPER_Ultrasonic::UPER_Ultrasonic(uint8_t pin)
{
	_Ultrasonic_pin = pin;
}
// 数字接口
UPER_Ultrasonic::UPER_Ultrasonic(uint8_t pin_1,uint8_t pin_2)
{
	_Ultrasonic_pin1 = pin_1;
	_Ultrasonic_pin2 = pin_2;
}
// 模拟口测距
float UPER_Ultrasonic::distance(void)
{
	float   n = analogRead(_Ultrasonic_pin);    //读取A0口的电压值 
 	float vol = ((n/1024))*200+1; 
    
 	return (float)vol;
}
// 数字口测距
float UPER_Ultrasonic::distancenum(void)
{
   pinMode(_Ultrasonic_pin1, OUTPUT);
   pinMode(_Ultrasonic_pin2, INPUT);
   digitalWrite(_Ultrasonic_pin1, LOW);
   delayMicroseconds(2);
   digitalWrite(_Ultrasonic_pin1, HIGH);
   delayMicroseconds(10);
   digitalWrite(_Ultrasonic_pin1, LOW);
   float distance = pulseIn(_Ultrasonic_pin2, HIGH) / 58.00;
   delay(10);
   return distance;
}
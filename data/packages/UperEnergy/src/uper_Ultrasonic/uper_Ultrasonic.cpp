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
 * 		1.int distance()
 * 		
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  
 * \示例
 * uper_Ultrasonic.ino
 */
UPER_Ultrasonic::UPER_Ultrasonic(uint8_t pin)
{
	_Ultrasonic_pin = pin;
}

int UPER_Ultrasonic::distance(void)
{
	float   n = analogRead(_Ultrasonic_pin);    //读取A0口的电压值
 
 	float vol = ((n/1024))*200+1; 
    
 	return (int)vol;
}
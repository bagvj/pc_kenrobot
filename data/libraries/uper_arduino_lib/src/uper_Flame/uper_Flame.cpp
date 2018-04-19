 /**
 * \著作权 
 * @名称：  uper_Flame.cpp
 * @作者：  uper
 * @版本：  v180315
 * @URL: 	http://www.uper.cc
 * @维护：  uper
 * @时间：  2018/3/15
 *
 * \说明
 * 火焰传感器
 *
 * \公有方法列表
 * 
 * 		1.int read()
 * 		
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  
 * \示例
 * uper_Flame.ino
 */
#include "uper_Flame.h"

UPER_Flame::UPER_Flame(int pin)
{
	_pin = pin;
}

int UPER_Flame::read()
{
// 读取火焰传感器
	return analogRead(_pin);
}

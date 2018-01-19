 /**
 * \著作权 
 * @名称：  uper_Light.cpp
 * @作者：  uper
 * @版本：  v171213
 * @URL: 	http://www.uper.cc
 * @维护：  uper
 * @时间：  2017/12/13
 *
 * \说明
 * 光敏传感器
 *
 * \公有方法列表
 * 
 * 		1.int read()
 * 		
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  
 * \示例
 */
#include "uper_Light.h"

UPER_Light::UPER_Light(int pin)
{
	_pin = pin;
}

int UPER_Light::read()
{
// 读取光照强度
	return analogRead(_pin);
}

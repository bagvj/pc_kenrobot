 /**
 * \著作权 
 * @名称：  uper_Gray.cpp
 * @作者：  uper
 * @版本：  v171213
 * @URL: 	http://www.uper.cc
 * @维护：  uper
 * @时间：  2017/12/13
 *
 * \说明
 * 灰度传感器
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
#include "uper_Gray.h"

UPER_Gray::UPER_Gray(int pin)
{
	_pin = pin;
}

int UPER_Gray::read()
{
// 读取灰度传感器值
	return analogRead(_pin);
}

 /**
 * \著作权 
 * @名称：  uper_Touch.cpp
 * @作者：  uper
 * @版本：  v180315
 * @URL: 	http://www.uper.cc
 * @维护：  uper
 * @时间：  2018/3/15
 *
 * \说明
 * 触摸按钮
 *
 * \公有方法列表
 * 
 * 		1.int read()
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  
 * \示例
 *  
 * 		1.uper_Touch.ino
 */
#include "uper_Touch.h"

UPER_Touch::UPER_Touch(int pin)
{
	_pin = pin;
}

int UPER_Touch::read()
{
// 读取触摸开关的状态
	return digitalRead(_pin);
}

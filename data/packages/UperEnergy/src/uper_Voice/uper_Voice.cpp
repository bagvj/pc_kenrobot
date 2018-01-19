 /**
 * \著作权 
 * @名称：  uper_Voice.cpp
 * @作者：  uper
 * @版本：  v171213
 * @URL: 	http://www.uper.cc
 * @维护：  uper
 * @时间：  2017/12/13
 *
 * \说明
 * 声音传感器
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
 * 		1.uper_Voice.ino
 */
#include "uper_Voice.h"

UPER_Voice::UPER_Voice(int pin)
{
	_pin = pin;
}

int UPER_Voice::read()
{
// 读取声音传感器
	return digitalRead(_pin);
}

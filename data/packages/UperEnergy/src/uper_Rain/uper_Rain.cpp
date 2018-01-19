 /**
 * \著作权 
 * @名称：  uper_Rain.cpp
 * @作者：  uper
 * @版本：  v171213
 * @URL: 	http://www.uper.cc
 * @维护：  uper
 * @时间：  2017/12/13
 *
 * \说明
 * 雨水传感器
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
 * 		1.uper_Rain.ino
 */
#include "uper_Rain.h"

UPER_Rain::UPER_Rain(int pin)
{
	_pin = pin;
}

int UPER_Rain::read()
{
// 读取雨水传感器状态
	return digitalRead(_pin);
}

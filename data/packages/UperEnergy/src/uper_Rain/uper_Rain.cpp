 /**
 * \著作权 
 * @名称：  uper_Button.cpp
 * @作者：  uper
 * @版本：  v180315
 * @URL: 	http://www.uper.cc
 * @维护：  uper
 * @时间：  2018/3/15
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
// 读取雨水传感器状态
int UPER_Rain::read()
{
	return digitalRead(_pin);
}
int UPER_Rain::open()
{
	return digitalWrite(_pin,HIGH);
}

int UPER_Rain::close()
{
	return digitalWrite(_pin,LOW);
}

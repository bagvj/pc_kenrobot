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
 * button按钮
 *
 * \公有方法列表
 * 
 * 		1.int read()
 *    	2.void open();
 *		3.void close();
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  
 * \示例
 *  
 * 		1.uper_Button.ino
 */
#include "uper_Button.h"

UPER_Button::UPER_Button(int pin)
{
	_pin = pin;
}

int UPER_Button::read()
{
// 读取按钮状态
	return digitalRead(_pin);
}
void UPER_Button::open()
{
// 读取按钮状态
	return digitalRead(_pin);
}

void UPER_Button::close()
{
// 读取按钮状态
	return digitalRead(_pin);
}

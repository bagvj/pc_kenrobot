 /**
 * \著作权 
 * @名称：  uper_MQ5.cpp
 * @作者：  uper
 * @版本：  v171213
 * @URL: 	http://www.uper.cc
 * @维护：  uper
 * @时间：  2017/12/13
 *
 * \说明
 * MQ5危险气体传感器
 *
 * \公有方法列表
 * 
 * 		1.int read()
 * 		
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  
 * \示例
 * uper_MQ5.ino
 */
#include "uper_MQ5.h"

UPER_MQ5::UPER_MQ5(int pin)
{
	_pin = pin;
}

int UPER_MQ5::read()
{
// 读取mq5危险气体
	return analogRead(_pin);
}

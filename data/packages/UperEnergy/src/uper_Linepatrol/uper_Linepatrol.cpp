 /**
 * \著作权 
 * @名称：  uper_Linepatrol.cpp
 * @作者：  uper
 * @版本：  v180315
 * @URL: 	http://www.uper.cc
 * @维护：  uper
 * @时间：  2018/3/15
 *
 * \说明
 * 巡线传感器
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
 * 		1.uper_Linepatrol.ino
 */
#include "uper_Linepatrol.h"

UPER_Linepatrol::UPER_Linepatrol(int pin)
{
	_pin = pin;
}

int UPER_Linepatrol::read()
{
// 读取巡线传感器状态
	return digitalRead(_pin);
}

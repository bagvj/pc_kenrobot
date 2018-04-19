 /**
 * \著作权 
 * @名称：  uper_Rotate.cpp
 * @作者：  uper
 * @版本：  v180315
 * @URL: 	http://www.uper.cc
 * @维护：  uper
 * @时间：  2018/3/15
 *
 * \说明
 * 旋转电位器
 *
 * \公有方法列表
 * 
 * 		1.int read()
 * 		
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  
 * \示例
 * uper_Rotate.ino
 */
#include "uper_Rotate.h"

UPER_Rotate::UPER_Rotate(int pin)
{
	_pin = pin;
}

int UPER_Rotate::read()
{
// 读取旋转电位器值
	return analogRead(_pin);
}

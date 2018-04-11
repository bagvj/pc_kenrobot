 /**
 * \著作权 
 * @名称：  uper_Magnetic .cpp
 * @作者：  uper
 * @版本：  v180315
 * @URL: 	http://www.uper.cc
 * @维护：  uper
 * @时间：  2018/3/15
 *
 * \说明
 * 磁力开关
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
 * 		1.uper_Magnetic .ino
 */
#include "uper_Magnetic .h"

UPER_Magnetic::UPER_Magnetic(int pin)
{
	_pin = pin;
}

int UPER_Magnetic::read()
{
// 读取磁力开关状态
	return digitalRead(_pin);
}

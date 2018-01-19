 /**
 * \著作权 
 * @名称：  uper_SoundIntensity.cpp
 * @作者：  uper
 * @版本：  v171213
 * @URL: 	http://www.uper.cc
 * @维护：  uper
 * @时间：  2017/12/13
 *
 * \说明
 * 声强传感器
 *
 * \公有方法列表
 * 
 * 		1.int read()
 * 		
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  
 * \示例
 * uper_SoundIntensity.ino
 */
#include "uper_SoundIntensity.h"

UPER_SoundIntensity::UPER_SoundIntensity(int pin)
{
	_pin = pin;
}

int UPER_SoundIntensity::read()
{
// 读取声强传感器值
	return analogRead(_pin);
}

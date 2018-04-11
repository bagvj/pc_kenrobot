 /**
 * \著作权 
 * @名称：  uper_Soil.cpp
 * @作者：  uper
 * @版本：  v180315
 * @URL: 	http://www.uper.cc
 * @维护：  uper
 * @时间：  2018/3/15
 *
 * \说明
 * 土壤传感器
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
 * 		1.uper_Soil.ino
 */
#include "uper_Soil.h"

UPER_Soil::UPER_Soil(int pin)
{
	_pin = pin;
}

int UPER_Soil::read()
{
// 读取土壤湿度
	return analogRead(_pin);
}

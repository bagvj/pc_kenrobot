 /**
 * \著作权 
 * @名称：  uper_Servo.cpp
 * @作者：  uper
 * @版本：  v171213
 * @URL: 	http://www.uper.cc
 * @维护：  uper
 * @时间：  2017/12/13
 *
 * \说明
 *	舵机驱动
 *
 * \公有方法列表
 * 
 * 		1.void begin(int baudrate = 9600)
 * 		2.void run(int index, int angle)
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  
 * \示例
 *  
 * 		1.uper_Servo.ino
 */
#include "uper_Servo.h"

unsigned char command[11] = {
	0xa3, 0x3a, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00,
	0x00, 0x0d, 0x0a
};

void uper_Servo::begin(int baudrate) {
	Serial.begin(baudrate);
}

void uper_Servo::run(int index, int angle) {
	index = index > 5 ? 5 : (index < 1 ? 1 : index);
	angle = angle > 180 ? 180 : (angle < 0 ? 0 : angle);

	command[4] = index;
	command[6] = angle;

	Serial.write(command, 11);
}
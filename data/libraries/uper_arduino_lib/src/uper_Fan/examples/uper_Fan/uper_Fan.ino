#include "uper_Fan.h"

// 风扇接在(2,3)这个耳机孔上
// 可用耳机孔：FAN_A、FAN_B、FAN_C、FAN_D
UPER_Fan uper_fan(FAN_A);

void setup() {
	//风扇初始化
	uper_fan.begin();
}

void loop() {
	//风扇正转，速度100
	uper_fan.run(100, true);
	delay(1000);
	//风扇停止
	uper_fan.run(0, true);
	
	delay(1000);

	//风扇反转，速度100
	uper_fan.run(100, false);
	delay(1000);
	//风扇停止
	uper_fan.run(0, false);
	delay(1000);
}
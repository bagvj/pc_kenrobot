#include "uper_Step.h"

void step_ISR();

uper_Step uper_step(2, &step_ISR);

void setup() {
	Serial.begin(9600);
	//开始计数
	uper_step.begin();
}


void loop() {
	Serial.println(uper_step.getCount());
	delay(2000);
	Serial.println(uper_step.getCount());
	delay(2000);
	Serial.println(uper_step.getCount());
	//停止计数
	uper_step.stop();
	Serial.println(uper_step.getCount());
	delay(2000);
	Serial.println(uper_step.getCount());

	uper_step.begin();
	Serial.println(uper_step.getCount());
	delay(2000);
	Serial.println(uper_step.getCount());
	uper_step.stop();
}

void step_ISR() {
	uper_step.doCount();
}

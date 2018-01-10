#include "uper_Step.h"

void step_ISR();

Step step(2, &step_ISR);

void setup() {
	Serial.begin(9600);
	//开始计数
	step.begin();
}


void loop() {
	Serial.println(step.getCount());
	delay(2000);
	Serial.println(step.getCount());
	delay(2000);
	Serial.println(step.getCount());
	//停止计数
	step.stop();
	Serial.println(step.getCount());
	delay(2000);
	Serial.println(step.getCount());

	step.begin();
	Serial.println(step.getCount());
	delay(2000);
	Serial.println(step.getCount());
	step.stop();
}

void step_ISR() {
	step.doCount();
}

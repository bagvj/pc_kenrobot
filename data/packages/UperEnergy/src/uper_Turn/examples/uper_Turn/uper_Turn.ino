#include "uper_Turn.h"

void step_ISR();

Uper_Turn uper_turn(2, &step_ISR);

void setup() {
  Serial.begin(9600);
  //开始计数
  pinMode(3,INPUT);
  pinMode(6,OUTPUT);
  pinMode(7,OUTPUT);
  uper_turn.begin(RISING);
  uper_turn.turn_Forward(6,7);  //开始正转
}


void loop() {
      Serial.println(uper_turn.getCount());
    //旋转90度
    if (uper_turn.getCount() == 6) {
        uper_turn.turn_Stop(6,7); //停止转动
    }

}

void step_ISR() {
  uper_turn.doCount();
}
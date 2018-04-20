#include "uper_Turn.h"

void step_ISR();

Uper_Turn uper_turn(2, 6, 7, &step_ISR);//设置数字管脚2为中断管脚，必须是2
int num = 0; //定义一个变量，存储马达脉冲
void setup() {
  Serial.begin(9600);

  uper_turn.begin();   //可写可不写，默认RISING
  uper_turn.turn_Forward();  //开始正转
}


void loop() {
      Serial.println(uper_turn.getCount());
      // 获得马达脉冲
      num = uper_turn.getCount();
    //旋转90度
      // 进行判断，如果脉冲为多少（这个数据暂时需要自己填）时，停止转动
    if (uper_turn.getCount() == 6) {
        uper_turn.turn_Stop(); //停止转动
    }

}

void step_ISR() {
  uper_turn.doCount();
}
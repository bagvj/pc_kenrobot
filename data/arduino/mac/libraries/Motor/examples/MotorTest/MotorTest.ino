/*
chenlvzhou 2017.3.3
http://clz.me/
*/

#include "Motor.h"

Motor motor_l(4,5);
Motor motor_r(7,6);
void setup() 
{
  
}  
void loop()
{
  motor_l.run(1,0);//direction&speed
  motor_r.run(0,0);
  motor_l.setSpeed(200);//0~255
  motor_l.setdirection(0);//0 or 1
}

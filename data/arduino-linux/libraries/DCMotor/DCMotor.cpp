#include "DCMotor.h"


/**
 * \函数：DCMotor
 * \说明：替代构造函数，映射直流电机引脚设置函数，分配输出引脚
 * \输入参数：
 *   fri_pin - 方向控制引脚
 *   src_pin - PWM输出引脚(模拟输出脚:3, 5, 6, 9, 10, 11)
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
DCMotor::DCMotor(uint8_t fri_pin,uint8_t src_pin)
{
  _dc_fri_pin = fri_pin;
  _dc_src_pin = src_pin;
  
  pinMode(_dc_fri_pin, OUTPUT);
  pinMode(_dc_src_pin, OUTPUT);

}



/**
 * \函数：run
 * \说明：控制电机正转或反转，速度为speed
 * \输入参数：
 *   speed - 速度的值范围 -255~255，值小于零代表反转
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void DCMotor::run(int16_t speed)
{
  speed	= speed > 255 ? 255 : speed;
  speed	= speed < -255 ? -255 : speed;

  if(_last_speed != speed)
  {
    _last_speed = speed;
  }
  else
  {
    return;
  }

  if(speed >= 0)
  {
    digitalWrite(_dc_fri_pin,LOW);
    analogWrite(_dc_src_pin,speed);
  }
  else
  {
    analogWrite(_dc_fri_pin,-speed);
    digitalWrite(_dc_src_pin,LOW);
  }
}


/**
 * \函数：stop
 * \说明：电机停止转动
 * \输入参数：无
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */
void DCMotor::stop(void)
{
  DCMotor::run(0);
}


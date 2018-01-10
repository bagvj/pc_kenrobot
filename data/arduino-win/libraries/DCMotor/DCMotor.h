#ifndef DCMotor_H
#define DCMotor_H

#include <stdint.h>
#include <stdbool.h>
#include <Arduino.h>

/**
 * Class: DCMotor
 * \说明：Class DCMotor 的声明
 */
class DCMotor
{
	public:
	
		/**
		 * \函数：DCMotor
		 * \说明：替代构造函数，映射直流电机引脚设置函数，分配输出引脚
		 * \输入参数：
		 *   dir_pin - 方向控制引脚
		 *   pwm_pin - PWM输出引脚(模拟输出脚:3, 5, 6, 9, 10, 11)
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */	
		DCMotor(uint8_t fri_pin,uint8_t src_pin);
		
		/**
		 * \函数：setpin
		 * \说明：设置直流电机控制引脚
		 * \输入参数：
		 *   port - 主板电机接口。
		 *   	MotorPort.dir - 方向控制引脚
		 *   	MotorPort.pwm - PWM输出引脚
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */

		void run(int16_t speed);

  		/**
		 * \函数：stop
		 * \说明：电机停止转动
		 * \输入参数：无
		 * \输出参数：无
		 * \返回值：无
		 * \其他：无
		 */
		void stop(void);
		
	private:
		volatile uint8_t _dc_fri_pin;
		volatile uint8_t _dc_src_pin;
		int16_t  _last_speed;
};
#endif // DCMotor_H
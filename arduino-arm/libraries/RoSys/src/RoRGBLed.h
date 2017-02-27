/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  RoRBGLed.cpp
 * @作者：  RoSys
 * @版本：  V0.1.0
 * @时间：  2016/08/25
 * @描述：  彩色LED灯模块、灯带驱动函数，RoRBGLed.c 的头文件。
 *
 * \说明
 * 彩色LED灯模块、灯带驱动函数。支持WS2811/2812B彩色LED，支持多个LED灯级联。
 *
 * \方法列表
 * 
 *    3. void RoRGBLed::setPin(uint8_t port)
 *    4. uint8_t RoRGBLed::getNumber()
 *    5. cRGB RoRGBLed::getColorAt(uint8_t index)
 *    6. bool RoRGBLed::setColorAt(uint8_t index, uint8_t red, uint8_t green, uint8_t blue)
 *    7. bool RoRGBLed::setColor(uint8_t index, uint8_t red, uint8_t green, uint8_t blue)
 *    8. bool RoRGBLed::setColor(uint8_t red, uint8_t green, uint8_t blue)
 *    9. bool RoRGBLed::setColor(uint8_t index, long value)
 *    10. void RoRGBLed::show()
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2016/08/25      0.1.0              新建库文件。
 *  
 * \实例
 *  
 * 		1.RoRGBled.ino
 * 		1.RoRGBledTest.ino
 * @example ColorLoopTest.ino
 * @example IndicatorsTest.ino
 * @example WhiteBreathLightTest.ino
 */
 
#ifndef RoRGBLed_h
#define RoRGBLed_h
#include <stdint.h>
#include <stdbool.h>
#include <Arduino.h>
#include "RoSysConfig.h"

#define DEFAULT_MAX_LED_NUMBER  (16)

//颜色值结构体
struct cRGB
{
  uint8_t g;
  uint8_t r;
  uint8_t b;
};

/**
 * Class: RoRGBLed
 * \说明：Class RoRGBLed 的声明
 */
 
class RoRGBLed
{
	public:
		/**
		* Alternate Constructor which can call your own function to map the RoRGBLed to arduino port,
		* no pins are used or initialized here, it only assigned the LED display buffer. The default
		*number of light strips is 32.
		* \param[in]
		*   None
		*/
		RoRGBLed(void);
		
		/**
		* Alternate Constructor which can call your own function to map the RoRGBLed to arduino port,
		* it will assigned the LED display buffer and initialization the GPIO of LED lights. You can
		* set any arduino digital pin for the LED data PIN, The default number of light strips is 32.
		* \param[in]
		*   port - arduino port
		*/
		RoRGBLed(uint8_t port);

		/**
		* Alternate Constructor which can call your own function to map the RoRGBLed to arduino port,
		* it will assigned the LED display buffer and initialization the GPIO of LED lights. You can
		* set any slot for the LED data PIN, and reset the LED numberby this constructor.
		* \param[in]
		*   port - arduino port
		* \param[in]
		*   led_num - The LED number
		*/
		RoRGBLed(uint8_t port, uint8_t led_num);
		/**
		* Destructor which can call your own function, it will release the LED buffer
		*/
		~RoRGBLed(void);

		/**
		* \par Function
		*   setPin
		* \par Description
		*   Reset the LED available data PIN by its arduino port.
		* \param[in]
		*   port - arduino port(should digital pin)
		* \par Output
		*   None
		* \return
		*   None
		* \par Others
		*   None
		*/
		void setPin(uint8_t port);

		/**
		* \par Function
		*   getNumber
		* \par Description
		*   Get the LED number you can light it.
		* \par Output
		*   None
		* \return
		*   The total number of LED's
		* \par Others
		*   The index value from 1 to the max
		*/
		uint8_t getNumber(void);

		/**
		* \par Function
		*   getColorAt
		* \par Description
		*   Get the LED color value from its index
		* \param[in]
		*   index - The LED index number you want to read its value
		* \par Output
		*   None
		* \return
		*   The LED color value, include the R,G,B
		* \par Others
		*   The index value from 1 to the max
		*/
		cRGB getColorAt(uint8_t index);

		/**
		* \par Function
		*   setColorAt
		* \par Description
		*   Set the LED color for any LED.
		* \param[in]
		*   index - The LED index number you want to set its color
		* \param[in]
		*   red - Red values
		* \param[in]
		*   green - green values
		* \param[in]
		*   blue - blue values
		* \par Output
		*   None
		* \return
		*   TRUE: Successful implementation
		*   FALSE: Wrong execution
		* \par Others
		*   The index value from 0 to the max.
		*/
		bool setColorAt(uint8_t index, uint8_t red, uint8_t green, uint8_t blue);

		/**
		* \par Function
		*   setColor
		* \par Description
		*   Set the LED color for any LED.
		* \param[in]
		*   index - The LED index number you want to set its color
		* \param[in]
		*   red - Red values
		* \param[in]
		*   green - green values
		* \param[in]
		*   blue - blue values
		* \par Output
		*   None
		* \return
		*   TRUE: Successful implementation
		*   FALSE: Wrong execution
		* \par Others
		*   The index value from 1 to the max, if you set the index 0, all the LED will be lit
		*/
		bool setColor(uint8_t index, uint8_t red, uint8_t green, uint8_t blue);

		/**
		* \par Function
		*   setColor
		* \par Description
		*   Set the LED color for all LED.
		* \param[in]
		*   red - Red values
		* \param[in]
		*   green - green values
		* \param[in]
		*   blue - blue values
		* \par Output
		*   None
		* \return
		*   TRUE: Successful implementation
		*   FALSE: Wrong execution
		* \par Others
		*   All the LED will be lit.
		*/
		bool setColor(uint8_t red, uint8_t green, uint8_t blue);

		/**
		* \par Function
		*   setColor
		* \par Description
		*   Set the LED color for any LED.
		* \param[in]
		*   value - the LED color defined as long type, for example (white) = 0xFFFFFF
		* \par Output
		*   None
		* \return
		*   TRUE: Successful implementation
		*   FALSE: Wrong execution
		* \par Others
		*   The index value from 1 to the max, if you set the index 0, all the LED will be lit
		*/
		bool setColor(uint8_t index, long value);

		/**
		* \par Function
		*   setNumber
		* \par Description
		*   Assigned the LED display buffer by the LED number
		* \param[in]
		*   num_leds - The LED number you used
		* \par Output
		*   None
		* \return
		*   None
		* \par Others
		*   None
		*/
		void setNumber(uint8_t num_led);

		/**
		* \par Function
		*   show
		* \par Description
		*   Transmission the data to WS2812
		* \par Output
		*   None
		* \return
		*   None
		* \par Others
		*   None
		*/
		void show(void);

	private:
		uint16_t count_led;
		uint8_t *pixels;

		/**
		* \par Function
		*   rgbled_sendarray_mask
		* \par Description
		*   Set the LED color for any LED.
		* \param[in]
		*   *data - the LED color store memory address
		* \param[in]
		*   datlen - the data length need to be transmitted.
		* \param[in]
		*   maskhi - the gpio pin mask
		* \param[in]
		*   *port - the gpio port address
		* \par Output
		*   None
		* \return
		*   TRUE: Successful implementation
		*   FALSE: Wrong execution
		* \par Others
		*   None
		*/
		void rgbled_sendarray_mask(uint8_t *array, uint16_t length, uint8_t _pinMask, uint8_t *port);

		const volatile uint8_t *ws2812_port;
		volatile uint8_t *ws2812_port_reg;
		uint8_t _pinMask;
};
#endif		// RoRGBLed_H

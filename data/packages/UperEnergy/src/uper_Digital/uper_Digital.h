 /**
 * \著作权 
 * @名称：  uper_Digital.cpp
 * @作者：  uper
 * @版本：  v180416
 * @URL: 	http://www.uper.cc
 * @维护：  uper
 * @时间：  2018/04/16
 *
 * \说明
 * 数码管
 *
 * \公有方法列表
 * 
 * 		1.init()									//初始化
 * 		2.displayOn()								//设置四位数码管开
 * 		3.displayOff()								//设置四位数码管关
 *		4.clear()									//清屏
 *		5.displayString(char *aString)				//显示字符串
 *		6.setDot(unsigned int aPos, bool aState)    //设置第几个点亮
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  
 * \示例
 *  
 * 		1.uper_Digital.ino
 */
#include <Arduino.h>
#include <uper_Wire.h>


#ifndef UPER__DIGITAL__H
#define UPER__DIGITAL__H

#define TM1650_USE_PROGMEM

#ifdef TM1650_USE_PROGMEM
#include <avr/pgmspace.h>
#endif

#define TM1650_DISPLAY_BASE 0x34 // Address of the left-most digit 
#define TM1650_DCTRL_BASE   0x24 // Address of the control register of the left-most digit
#define TM1650_NUM_DIGITS   16 // max number of digits
#define TM1650_MAX_STRING   128 // number of digits

#define TM1650_BIT_ONOFF	0b00000001
#define TM1650_MSK_ONOFF	0b11111110
#define TM1650_BIT_DOT		0b00000001
#define TM1650_MSK_DOT		0b11110111
#define TM1650_BRIGHT_SHIFT	4
#define TM1650_MSK_BRIGHT	0b10001111
#define TM1650_MIN_BRIGHT	0
#define TM1650_MAX_BRIGHT	7

#ifndef TM1650_USE_PROGMEM
const byte TM1650_CDigits[128] {
#else
const PROGMEM byte TM1650_CDigits[128] {
#endif
//0x00  0x01  0x02  0x03  0x04  0x05  0x06  0x07  0x08  0x09  0x0A  0x0B  0x0C  0x0D  0x0E  0x0F
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 0x00
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 0x10
  0x00, 0x82, 0x21, 0x00, 0x00, 0x00, 0x00, 0x02, 0x39, 0x0F, 0x00, 0x00, 0x00, 0x40, 0x80, 0x00, // 0x20
  0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7f, 0x6f, 0x00, 0x00, 0x00, 0x48, 0x00, 0x53, // 0x30
  0x00, 0x77, 0x7C, 0x39, 0x5E, 0x79, 0x71, 0x6F, 0x76, 0x06, 0x1E, 0x00, 0x38, 0x00, 0x54, 0x3F, // 0x40
  0x73, 0x67, 0x50, 0x6D, 0x78, 0x3E, 0x00, 0x00, 0x00, 0x6E, 0x00, 0x39, 0x00, 0x0F, 0x00, 0x08, // 0x50 
  0x63, 0x5F, 0x7C, 0x58, 0x5E, 0x7B, 0x71, 0x6F, 0x74, 0x02, 0x1E, 0x00, 0x06, 0x00, 0x54, 0x5C, // 0x60
  0x73, 0x67, 0x50, 0x6D, 0x78, 0x1C, 0x00, 0x00, 0x00, 0x6E, 0x00, 0x39, 0x30, 0x0F, 0x00, 0x00  // 0x70
};

class UPER_Digital {
    public:
        UPER_Digital(unsigned int aNumDigits = 4);
        
	void	init();
	void	clear();
	void	displayOn();
	void	displayOff();
	void	displayState(bool aState);
	void	displayString(char *aString);
	void	displayString(String aString);
	void	displayString(float value);
	void	displayString(int value);
	void	displayString(long value);
	int 	displayRunning(char *aString);
	int 	displayRunningShift();
	void	setBrightness(unsigned int aValue = TM1650_MAX_BRIGHT);
	void	setBrightnessGradually(unsigned int aValue = TM1650_MAX_BRIGHT);
	inline unsigned int getBrightness() { return iBrightness; };

	void	controlPosition(unsigned int aPos, byte aValue);
	void	setPosition(unsigned int aPos, byte aValue);
	void	setDot(unsigned int aPos, bool aState);
	byte	getPosition(unsigned int aPos) { return iBuffer[aPos]; };
	inline unsigned int	getNumPositions() { return iNumDigits; };

    private:
	char 	*iPosition;
	bool	iActive;
	unsigned int	iNumDigits;
	unsigned int	iBrightness;
    char	iString[TM1650_MAX_STRING+1];
    byte 	iBuffer[TM1650_NUM_DIGITS+1];
    byte 	iCtrl[TM1650_NUM_DIGITS];
};

//  ----  Implementation ----

/** Constructor, uses default values for the parameters
 * so could be called with no parameters.
 * aNumDigits - number of display digits (default = 4)
 */
UPER_Digital::UPER_Digital(unsigned int aNumDigits) {
	iNumDigits =  (aNumDigits > TM1650_NUM_DIGITS) ? TM1650_NUM_DIGITS : aNumDigits;
}

/** Initialization
 * initializes the driver. Turns display on, but clears all digits.
 */
void UPER_Digital::init() {
	iPosition = NULL;
	for (int i=0; i<iNumDigits; i++) {
		iBuffer[i] = 0;
		iCtrl[i] = 0;
	}
    Wire.beginTransmission(TM1650_DISPLAY_BASE);
    iActive = (Wire.endTransmission() == 0);
	clear();
	displayOn();
}

/** Set brightness of all digits equally
 * aValue - brightness value with 1 being the lowest, and 7 being the brightest
 */
void UPER_Digital::setBrightness(unsigned int aValue) {
	if (!iActive) return;

	iBrightness = (aValue > TM1650_MAX_BRIGHT) ? TM1650_MAX_BRIGHT : aValue;

	for (int i=0; i<iNumDigits; i++) {
		Wire.beginTransmission(TM1650_DCTRL_BASE+i);
		iCtrl[i] = (iCtrl[i] & TM1650_MSK_BRIGHT) | ( iBrightness << TM1650_BRIGHT_SHIFT );
		Wire.write((byte) iCtrl[i]);
		Wire.endTransmission();
	}
}

/** Set brightness of all digits equally
 * aValue - brightness value with 1 being the lowest, and 7 being the brightest
 */
void UPER_Digital::setBrightnessGradually(unsigned int aValue) {
	if (!iActive || aValue == iBrightness) return;

	if (aValue > TM1650_MAX_BRIGHT) aValue = TM1650_MAX_BRIGHT;
	int step = (aValue < iBrightness) ? -1 : 1;
	unsigned int i = iBrightness;
	do {
		setBrightness(i);
		delay(50);
		i += step;
	} while (i!=aValue);
}

/** Turns display on or off according to aState
 */
void UPER_Digital::displayState (bool aState)
{
  if (aState) displayOn ();
  else displayOff();
}

/** Turns the display on
 */
void UPER_Digital::displayOn ()
// turn all digits on
{
  if (!iActive) return;
  for (int i=0; i<iNumDigits; i++) {
    Wire.beginTransmission(TM1650_DCTRL_BASE+i);
	iCtrl[i] = (iCtrl[i] & TM1650_MSK_ONOFF) | TM1650_BIT_DOT;
    Wire.write((byte) iCtrl[i]);
    Wire.endTransmission();
  }
}
/** Turns the display off
 */
void UPER_Digital::displayOff ()
// turn all digits off
{
  if (!iActive) return;
  for (int i=0; i<iNumDigits; i++) {
    Wire.beginTransmission(TM1650_DCTRL_BASE+i);
	iCtrl[i] = (iCtrl[i] & TM1650_MSK_ONOFF);
    Wire.write((byte) iCtrl[i]);
    Wire.endTransmission();
  }
}

/** Directly write to the CONTROL register of the digital position
 * aPos = position to set the control register for
 * aValue = value to write to the position
 *
 * Internal control buffer is updated as well
 */
void UPER_Digital::controlPosition(unsigned int aPos, byte aValue) {
	if (!iActive) return;
	if (aPos < iNumDigits) {
	    Wire.beginTransmission(TM1650_DCTRL_BASE + (int) aPos);
	    iCtrl[aPos] = aValue;
		Wire.write(aValue);
	    Wire.endTransmission();
	}
}

/** Directly write to the digit register of the digital position
 * aPos = position to set the digit register for
 * aValue = value to write to the position
 *
 * Internal position buffer is updated as well
 */
void UPER_Digital::setPosition(unsigned int aPos, byte aValue) {
	if (!iActive) return;
	if (aPos < iNumDigits) {
	    Wire.beginTransmission(TM1650_DISPLAY_BASE + (int) aPos);
	    iBuffer[aPos] = aValue;
	    Wire.write(aValue);
	    Wire.endTransmission();
	}
}

/** Directly set/clear a 'dot' next to a specific position
 * aPos = position to set/clear the dot for
 * aState = display the dot if true, clear if false
 *
 * Internal buffer is updated as well
 */
void	UPER_Digital::setDot(unsigned int aPos, bool aState) {
	iBuffer[aPos] = iBuffer[aPos] & 0x7F |(aState ? 0b10000000 : 0);
	setPosition(aPos, iBuffer[aPos]);
}

/** Clear all digits. Keep the display on.
 */
void UPER_Digital::clear()
// clears all digits
{
  if (!iActive) return;
  for (int i=0; i<iNumDigits; i++) {
    Wire.beginTransmission(TM1650_DISPLAY_BASE+i);
 	iBuffer[i] = 0;
	Wire.write((byte) 0);
    Wire.endTransmission();
  }
}

/** Display string on the display 
 * aString = character array to be displayed
 *
 * Internal buffer is updated as well
 * Only first N positions of the string are displayed if
 *  the string is longer than the number of digits
 */
void UPER_Digital::displayString(char *aString)
{
	if (!iActive) return;
	unsigned int slen =strlen(aString);
	String bString = aString;
	for (int i = 0; i < 4 - slen; i++) 
		bString = " " + bString;

	for (int i = 0; i<iNumDigits; i++) {
		byte a = ((byte)bString.charAt(i)) & 0b01111111;
		byte dot = ((byte)bString.charAt(i)) & 0b10000000;
#ifndef TM1650_USE_PROGMEM	  
		iBuffer[i] = TM1650_CDigits[a];
#else
		iBuffer[i] = pgm_read_byte_near(TM1650_CDigits + a);
#endif
		if (a) {
			Wire.beginTransmission(TM1650_DISPLAY_BASE + i);
			Wire.write(iBuffer[i] | dot);
			Wire.endTransmission();
		}
		else
			break;

	}

}
void UPER_Digital::displayString(String aString)
{
	if (!iActive) return;
	unsigned int slen = aString.length();
	for (int i = 0; i < 4 - slen; i++)
		aString = " " + aString;
	for (int i = 0; i<iNumDigits; i++) {
		byte a = ((byte)aString.charAt(i)) & 0b01111111;
		byte dot = ((byte)aString.charAt(i)) & 0b10000000;
#ifndef TM1650_USE_PROGMEM	  
		iBuffer[i] = TM1650_CDigits[a];
#else
		iBuffer[i] = pgm_read_byte_near(TM1650_CDigits + a);
#endif
		if (a) {
			Wire.beginTransmission(TM1650_DISPLAY_BASE + i);
			Wire.write(iBuffer[i] | dot);
			Wire.endTransmission();
		}
		else
			break;

	}
}
void UPER_Digital::displayString(float value)
{
	if (!iActive) return;
	String aString = String("") + value;
	aString = aString + "_";
	aString.replace("000_", "");
	aString.replace("00_", "");
	aString.replace("0_", "");
	unsigned int slen = aString.length();

	for (int i = 0; i < 4 - slen; i++)
		aString = " " + aString;
	for (int i = 0; i<iNumDigits; i++) {
		byte a = ((byte)aString.charAt(i)) & 0b01111111;
		byte dot = ((byte)aString.charAt(i)) & 0b10000000;
#ifndef TM1650_USE_PROGMEM	  
		iBuffer[i] = TM1650_CDigits[a];
#else
		iBuffer[i] = pgm_read_byte_near(TM1650_CDigits + a);
#endif
		if (a) {
			Wire.beginTransmission(TM1650_DISPLAY_BASE + i);
			Wire.write(iBuffer[i] | dot);
			Wire.endTransmission();
		}
		else
			break;

	}
}
void UPER_Digital::displayString(int value)
{
	if (!iActive) return;
	String aString = String("") + value;
	unsigned int slen = aString.length();

	for (int i = 0; i < 4 - slen; i++)
		aString = " " + aString;
	for (int i = 0; i<iNumDigits; i++) {
		byte a = ((byte)aString.charAt(i)) & 0b01111111;
		byte dot = ((byte)aString.charAt(i)) & 0b10000000;
#ifndef TM1650_USE_PROGMEM	  
		iBuffer[i] = TM1650_CDigits[a];
#else
		iBuffer[i] = pgm_read_byte_near(TM1650_CDigits + a);
#endif
		if (a) {
			Wire.beginTransmission(TM1650_DISPLAY_BASE + i);
			Wire.write(iBuffer[i] | dot);
			Wire.endTransmission();
		}
		else
			break;

	}
}
void UPER_Digital::displayString(long value)
{
	displayString((int)value);
}

/** Display string on the display in a running fashion
 * aString = character array to be displayed
 *
 * Starts with first N positions of the string.
 * Subsequent characters are displayed with 1 char shift each time displayRunningShift() is called
 *
 * returns: number of iterations remaining to display the whole string
 */
int UPER_Digital::displayRunning(char *aString) {

	strncpy(iString, aString, TM1650_MAX_STRING+1);
	iPosition = iString;
	iString[TM1650_MAX_STRING] = '\0'; //just in case.
    	displayString(iPosition);

	int l = strlen(iPosition);
	if (l <= iNumDigits) return 0;
	return (l - iNumDigits);
}

/** Display next segment (shifting to the left) of the string set by displayRunning()
 * Starts with first N positions of the string.
 * Subsequent characters are displayed with 1 char shift each time displayRunningShift is called
 *
 * returns: number of iterations remaining to display the whole string
 */
int UPER_Digital::displayRunningShift() {
    	if (strlen(iPosition) <= iNumDigits) return 0;
    	displayString(++iPosition);
	return (strlen(iPosition) - iNumDigits);
}



#endif /* UPER__DIGITAL__H*/



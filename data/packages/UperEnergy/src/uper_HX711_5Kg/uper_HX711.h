#ifndef __HX711__H__
#define __HX711__H__

#include <Arduino.h>

class HX711 {
public:
	HX711(int, int);
	void getMaopi();
	unsigned int getWeight();
	unsigned long read(void);

private:
	int sckPin, dtPin;
	unsigned long Buffer;
	unsigned int Weight_Maopi;
	unsigned int Weight_Shiwu;
};

#endif

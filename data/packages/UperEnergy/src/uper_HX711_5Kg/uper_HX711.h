#ifndef UPER__HX711__H__
#define UPER__HX711__H__

#include <Arduino.h>

class UPER_HX711 {
public:
	UPER_HX711(int, int);
	void getMaopi();
	unsigned int getWeight();
	unsigned long read(void);

private:
	int sckPin, dtPin;
	unsigned long Buffer;
	unsigned int Weight_Maopi;
	unsigned int Weight_Shiwu;
};

#endif/*UPER__HX711__H__*/

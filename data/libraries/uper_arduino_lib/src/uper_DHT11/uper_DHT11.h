#ifndef UPER__DHT11__H
#define UPER__DHT11__H

#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif

#define DHT11LIB_VERSION "0.4.1"

#define DHTLIB_OK				0
#define DHTLIB_ERROR_CHECKSUM	-1
#define DHTLIB_ERROR_TIMEOUT	-2

class UPER_DHT11
{
public:
	UPER_DHT11(int pin);
    int read();
    int getHumidity(bool immediately = false);
    int getTemperature(bool immediately = false);

private:
	int _humidity;
	int _temperature;
	int _pin;
};
#endif/*UPER__DHT11__H*/
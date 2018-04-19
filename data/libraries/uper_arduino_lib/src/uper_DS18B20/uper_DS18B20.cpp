
 /**
 * \著作权 
 * @名称：  uper_DS18B20.cpp
 * @作者：  uper
 * @版本：  v180315
 * @URL:    http://www.uper.cc
 * @维护：  uper
 * @时间：  2018/3/15
 *
 * \说明
 * ds18b20传感器
 *
 * \公有方法列表
 * 
 *      1.void UPER_DS18B20::begin(void)
 *      2.void UPER_DS18B20::requestTemperatures()
 *      3.float UPER_DS18B20::getTempCByIndex(uint8_t deviceIndex)
 *      
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  
 * \示例
 * uper_DS18B20.ino
 */
#include "uper_DS18B20.h"


#if ARDUINO >= 100
#include "Arduino.h"
#else
extern "C" {
#include "WConstants.h"
}
#endif

UPER_DS18B20::UPER_DS18B20() {}
UPER_DS18B20::UPER_DS18B20(OneWire* _oneWire)

#if REQUIRESALARMS
: _AlarmHandler(&defaultAlarmHandler)
#endif
{
    setOneWire(_oneWire);
}

bool UPER_DS18B20::validFamily(const uint8_t* deviceAddress){
    switch (deviceAddress[0]){
        case DS18S20MODEL:
        case DS18B20MODEL:
        case DS1822MODEL:
        case DS1825MODEL:
            return true;
        default:
            return false;
    }
}

void UPER_DS18B20::setOneWire(OneWire* _oneWire){

    _wire = _oneWire;
    devices = 0;
    parasite = false;
    bitResolution = 9;
    waitForConversion = true;
    checkForConversion = true;

}

// initialise the bus
void UPER_DS18B20::begin(void){

    DeviceAddress deviceAddress;

    _wire->reset_search();
    devices = 0; // Reset the number of devices when we enumerate wire devices

    while (_wire->search(deviceAddress)){

        if (validAddress(deviceAddress)){

            if (!parasite && readPowerSupply(deviceAddress)) parasite = true;

            ScratchPad scratchPad;

            readScratchPad(deviceAddress, scratchPad);

            bitResolution = max(bitResolution, getResolution(deviceAddress));

            devices++;
        }
    }

}


uint8_t UPER_DS18B20::getDeviceCount(void){
    return devices;
}


bool UPER_DS18B20::validAddress(const uint8_t* deviceAddress){
    return (_wire->crc8(deviceAddress, 7) == deviceAddress[7]);
}


bool UPER_DS18B20::getAddress(uint8_t* deviceAddress, uint8_t index){

    uint8_t depth = 0;

    _wire->reset_search();

    while (depth <= index && _wire->search(deviceAddress)) {
        if (depth == index && validAddress(deviceAddress)) return true;
        depth++;
    }

    return false;

}


bool UPER_DS18B20::isConnected(const uint8_t* deviceAddress){

    ScratchPad scratchPad;
    return isConnected(deviceAddress, scratchPad);

}


bool UPER_DS18B20::isConnected(const uint8_t* deviceAddress, uint8_t* scratchPad)
{
    bool b = readScratchPad(deviceAddress, scratchPad);
    return b && (_wire->crc8(scratchPad, 8) == scratchPad[SCRATCHPAD_CRC]);
}

bool UPER_DS18B20::readScratchPad(const uint8_t* deviceAddress, uint8_t* scratchPad){

    int b = _wire->reset();
    if (b == 0) return false;

    _wire->select(deviceAddress);
    _wire->write(READSCRATCH);


    for(uint8_t i = 0; i < 9; i++){
        scratchPad[i] = _wire->read();
    }

    b = _wire->reset();
    return (b == 1);
}


void UPER_DS18B20::writeScratchPad(const uint8_t* deviceAddress, const uint8_t* scratchPad){

    _wire->reset();
    _wire->select(deviceAddress);
    _wire->write(WRITESCRATCH);
    _wire->write(scratchPad[HIGH_ALARM_TEMP]); // high alarm temp
    _wire->write(scratchPad[LOW_ALARM_TEMP]); // low alarm temp

    if (deviceAddress[0] != DS18S20MODEL) _wire->write(scratchPad[CONFIGURATION]);

    _wire->reset();
    _wire->select(deviceAddress);

    _wire->write(COPYSCRATCH, parasite);
    delay(20);  // <--- added 20ms delay to allow 10ms long EEPROM write operation (as specified by datasheet)

    if (parasite) delay(10); // 10ms delay
    _wire->reset();

}

bool UPER_DS18B20::readPowerSupply(const uint8_t* deviceAddress){

    bool ret = false;
    _wire->reset();
    _wire->select(deviceAddress);
    _wire->write(READPOWERSUPPLY);
    if (_wire->read_bit() == 0) ret = true;
    _wire->reset();
    return ret;

}



void UPER_DS18B20::setResolution(uint8_t newResolution){

    bitResolution = constrain(newResolution, 9, 12);
    DeviceAddress deviceAddress;
    for (int i=0; i<devices; i++)
    {
        getAddress(deviceAddress, i);
        setResolution(deviceAddress, bitResolution);
    }

}


bool UPER_DS18B20::setResolution(const uint8_t* deviceAddress, uint8_t newResolution){

    ScratchPad scratchPad;
    if (isConnected(deviceAddress, scratchPad)){

        if (deviceAddress[0] != DS18S20MODEL){

            switch (newResolution){
            case 12:
                scratchPad[CONFIGURATION] = TEMP_12_BIT;
                break;
            case 11:
                scratchPad[CONFIGURATION] = TEMP_11_BIT;
                break;
            case 10:
                scratchPad[CONFIGURATION] = TEMP_10_BIT;
                break;
            case 9:
            default:
                scratchPad[CONFIGURATION] = TEMP_9_BIT;
                break;
            }
            writeScratchPad(deviceAddress, scratchPad);
        }
        return true;  // new value set
    }

    return false;

}


uint8_t UPER_DS18B20::getResolution(){
    return bitResolution;
}


uint8_t UPER_DS18B20::getResolution(const uint8_t* deviceAddress){

    if (deviceAddress[0] == DS18S20MODEL) return 12;

    ScratchPad scratchPad;
    if (isConnected(deviceAddress, scratchPad))
    {
        switch (scratchPad[CONFIGURATION])
        {
        case TEMP_12_BIT:
            return 12;

        case TEMP_11_BIT:
            return 11;

        case TEMP_10_BIT:
            return 10;

        case TEMP_9_BIT:
            return 9;
        }
    }
    return 0;

}



void UPER_DS18B20::setWaitForConversion(bool flag){
    waitForConversion = flag;
}

bool UPER_DS18B20::getWaitForConversion(){
    return waitForConversion;
}



void UPER_DS18B20::setCheckForConversion(bool flag){
    checkForConversion = flag;
}

bool UPER_DS18B20::getCheckForConversion(){
    return checkForConversion;
}

bool UPER_DS18B20::isConversionAvailable(const uint8_t* deviceAddress){

    ScratchPad scratchPad;
    readScratchPad(deviceAddress, scratchPad);
    return scratchPad[0];

}

void UPER_DS18B20::requestTemperatures(){

    _wire->reset();
    _wire->skip();
    _wire->write(STARTCONVO, parasite);

    if (!waitForConversion) return;
    blockTillConversionComplete(bitResolution, NULL);

}


bool UPER_DS18B20::requestTemperaturesByAddress(const uint8_t* deviceAddress){

    uint8_t bitResolution = getResolution(deviceAddress);
    if (bitResolution == 0){
     return false; //Device disconnected
    }

    if (_wire->reset() == 0){
        return false;
    }

    _wire->select(deviceAddress);
    _wire->write(STARTCONVO, parasite);


    // ASYNC mode?
    if (!waitForConversion) return true;

    blockTillConversionComplete(bitResolution, deviceAddress);

    return true;

}


void UPER_DS18B20::blockTillConversionComplete(uint8_t bitResolution, const uint8_t* deviceAddress){
    
    int delms = millisToWaitForConversion(bitResolution);
    if (deviceAddress != NULL && checkForConversion && !parasite){
        unsigned long now = millis();
        while(!isConversionAvailable(deviceAddress) && (millis() - delms < now));
    } else {
        delay(delms);
    }
    
}

int16_t UPER_DS18B20::millisToWaitForConversion(uint8_t bitResolution){

    switch (bitResolution){
    case 9:
        return 94;
    case 10:
        return 188;
    case 11:
        return 375;
    default:
        return 750;
    }

}


bool UPER_DS18B20::requestTemperaturesByIndex(uint8_t deviceIndex){

    DeviceAddress deviceAddress;
    getAddress(deviceAddress, deviceIndex);

    return requestTemperaturesByAddress(deviceAddress);

}

float UPER_DS18B20::getTempCByIndex(uint8_t deviceIndex){

    DeviceAddress deviceAddress;
    if (!getAddress(deviceAddress, deviceIndex)){
        return DEVICE_DISCONNECTED_C;
    }

    return getTempC((uint8_t*)deviceAddress);

}

float UPER_DS18B20::getTempFByIndex(uint8_t deviceIndex){

    DeviceAddress deviceAddress;

    if (!getAddress(deviceAddress, deviceIndex)){
        return DEVICE_DISCONNECTED_F;
    }

    return getTempF((uint8_t*)deviceAddress);

}

int16_t UPER_DS18B20::calculateTemperature(const uint8_t* deviceAddress, uint8_t* scratchPad){

    int16_t fpTemperature =
    (((int16_t) scratchPad[TEMP_MSB]) << 11) |
    (((int16_t) scratchPad[TEMP_LSB]) << 3);

    

    if (deviceAddress[0] == DS18S20MODEL){
        fpTemperature = ((fpTemperature & 0xfff0) << 3) - 16 +
            (
                ((scratchPad[COUNT_PER_C] - scratchPad[COUNT_REMAIN]) << 7) /
                  scratchPad[COUNT_PER_C]
            );
    }

    return fpTemperature;
}


int16_t UPER_DS18B20::getTemp(const uint8_t* deviceAddress){

    ScratchPad scratchPad;
    if (isConnected(deviceAddress, scratchPad)) return calculateTemperature(deviceAddress, scratchPad);
    return DEVICE_DISCONNECTED_RAW;

}

float UPER_DS18B20::getTempC(const uint8_t* deviceAddress){
    return rawToCelsius(getTemp(deviceAddress));
}


float UPER_DS18B20::getTempF(const uint8_t* deviceAddress){
    return rawToFahrenheit(getTemp(deviceAddress));
}

bool UPER_DS18B20::isParasitePowerMode(void){
    return parasite;
}


void UPER_DS18B20::setUserData(const uint8_t* deviceAddress, int16_t data)
{
    ScratchPad scratchPad;
    if (isConnected(deviceAddress, scratchPad))
    {
        scratchPad[HIGH_ALARM_TEMP] = data >> 8;
        scratchPad[LOW_ALARM_TEMP] = data & 255;
        writeScratchPad(deviceAddress, scratchPad);
    }
}

int16_t UPER_DS18B20::getUserData(const uint8_t* deviceAddress)
{
    int16_t data = 0;
    ScratchPad scratchPad;
    if (isConnected(deviceAddress, scratchPad))
    {
        data = scratchPad[HIGH_ALARM_TEMP] << 8;
        data += scratchPad[LOW_ALARM_TEMP];
    }
    return data;
}

int16_t UPER_DS18B20::getUserDataByIndex(uint8_t deviceIndex)
{
    DeviceAddress deviceAddress;
    getAddress(deviceAddress, deviceIndex);
    return getUserData((uint8_t*) deviceAddress);
}

void UPER_DS18B20::setUserDataByIndex(uint8_t deviceIndex, int16_t data)
{
    DeviceAddress deviceAddress;
    getAddress(deviceAddress, deviceIndex);
    setUserData((uint8_t*) deviceAddress, data);
}


float UPER_DS18B20::toFahrenheit(float celsius){
    return (celsius * 1.8) + 32;
}

float UPER_DS18B20::toCelsius(float fahrenheit){
    return (fahrenheit - 32) * 0.555555556;
}

float UPER_DS18B20::rawToCelsius(int16_t raw){

    if (raw <= DEVICE_DISCONNECTED_RAW)
    return DEVICE_DISCONNECTED_C;
    // C = RAW/128
    return (float)raw * 0.0078125;

}

float UPER_DS18B20::rawToFahrenheit(int16_t raw){

    if (raw <= DEVICE_DISCONNECTED_RAW)
    return DEVICE_DISCONNECTED_F;
    // C = RAW/128
    // F = (C*1.8)+32 = (RAW/128*1.8)+32 = (RAW*0.0140625)+32
    return ((float)raw * 0.0140625) + 32;

}

#if REQUIRESALARMS


void UPER_DS18B20::setHighAlarmTemp(const uint8_t* deviceAddress, char celsius){

    if (celsius > 125) celsius = 125;
    else if (celsius < -55) celsius = -55;

    ScratchPad scratchPad;
    if (isConnected(deviceAddress, scratchPad)){
        scratchPad[HIGH_ALARM_TEMP] = (uint8_t)celsius;
        writeScratchPad(deviceAddress, scratchPad);
    }

}


void UPER_DS18B20::setLowAlarmTemp(const uint8_t* deviceAddress, char celsius){
    if (celsius > 125) celsius = 125;
    else if (celsius < -55) celsius = -55;

    ScratchPad scratchPad;
    if (isConnected(deviceAddress, scratchPad)){
        scratchPad[LOW_ALARM_TEMP] = (uint8_t)celsius;
        writeScratchPad(deviceAddress, scratchPad);
    }

}


char UPER_DS18B20::getHighAlarmTemp(const uint8_t* deviceAddress){

    ScratchPad scratchPad;
    if (isConnected(deviceAddress, scratchPad)) return (char)scratchPad[HIGH_ALARM_TEMP];
    return DEVICE_DISCONNECTED_C;

}


char UPER_DS18B20::getLowAlarmTemp(const uint8_t* deviceAddress){

    ScratchPad scratchPad;
    if (isConnected(deviceAddress, scratchPad)) return (char)scratchPad[LOW_ALARM_TEMP];
    return DEVICE_DISCONNECTED_C;

}

void UPER_DS18B20::resetAlarmSearch(){

    alarmSearchJunction = -1;
    alarmSearchExhausted = 0;
    for(uint8_t i = 0; i < 7; i++){
        alarmSearchAddress[i] = 0;
    }

}


bool UPER_DS18B20::alarmSearch(uint8_t* newAddr){

    uint8_t i;
    char lastJunction = -1;
    uint8_t done = 1;

    if (alarmSearchExhausted) return false;
    if (!_wire->reset()) return false;

    // send the alarm search command
    _wire->write(0xEC, 0);

    for(i = 0; i < 64; i++){

        uint8_t a = _wire->read_bit( );
        uint8_t nota = _wire->read_bit( );
        uint8_t ibyte = i / 8;
        uint8_t ibit = 1 << (i & 7);


        if (a && nota) return false;

        if (!a && !nota){
            if (i == alarmSearchJunction){
                // this is our time to decide differently, we went zero last time, go one.
                a = 1;
                alarmSearchJunction = lastJunction;
            }else if (i < alarmSearchJunction){

                // take whatever we took last time, look in address
                if (alarmSearchAddress[ibyte] & ibit){
                    a = 1;
                }else{
                    // Only 0s count as pending junctions, we've already exhausted the 0 side of 1s
                    a = 0;
                    done = 0;
                    lastJunction = i;
                }
            }else{
                // we are blazing new tree, take the 0
                a = 0;
                alarmSearchJunction = i;
                done = 0;
            }

        }

        if (a) alarmSearchAddress[ibyte] |= ibit;
        else alarmSearchAddress[ibyte] &= ~ibit;

        _wire->write_bit(a);
    }

    if (done) alarmSearchExhausted = 1;
    for (i = 0; i < 8; i++) newAddr[i] = alarmSearchAddress[i];
    return true;

}

bool UPER_DS18B20::hasAlarm(const uint8_t* deviceAddress){

    ScratchPad scratchPad;
    if (isConnected(deviceAddress, scratchPad)){

        char temp = calculateTemperature(deviceAddress, scratchPad) >> 7;

        // check low alarm
        if (temp <= (char)scratchPad[LOW_ALARM_TEMP]) return true;

        // check high alarm
        if (temp >= (char)scratchPad[HIGH_ALARM_TEMP]) return true;
    }

    // no alarm
    return false;

}

bool UPER_DS18B20::hasAlarm(void){

    DeviceAddress deviceAddress;
    resetAlarmSearch();
    return alarmSearch(deviceAddress);

}

void UPER_DS18B20::processAlarms(void){

    resetAlarmSearch();
    DeviceAddress alarmAddr;

    while (alarmSearch(alarmAddr)){

        if (validAddress(alarmAddr)){
            _AlarmHandler(alarmAddr);
        }

    }
}

void UPER_DS18B20::setAlarmHandler(AlarmHandler *handler){
    _AlarmHandler = handler;
}

void UPER_DS18B20::defaultAlarmHandler(const uint8_t* deviceAddress){}

#endif

#if REQUIRESNEW

void* UPER_DS18B20::operator new(unsigned int size){ // Implicit NSS obj size

    void * p; // void pointer
    p = malloc(size); // Allocate memory
    memset((UPER_DS18B20*)p,0,size); // Initialise memory

    //!!! CANT EXPLICITLY CALL CONSTRUCTOR - workaround by using an init() methodR - workaround by using an init() method
    return (UPER_DS18B20*) p; // Cast blank region to NSS pointer
}

void UPER_DS18B20::operator delete(void* p){

    UPER_DS18B20* pNss =  (UPER_DS18B20*) p; // Cast to NSS pointer
    pNss->~UPER_DS18B20(); // Destruct the object

    free(p); // Free the memory
}

#endif

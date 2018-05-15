/**
 * \著作权 
 * @名称：  uper_ESP8266.cpp
 * @作者：  uper
 * @版本：  v171213
 * @URL:    http://www.uper.cc
 * @维护：  uper
 * @时间：  2017/12/22
 *
 * \说明
 * esp8266 wifi 模块驱动函数
 *
 * \公有方法列表
 * 
 *  1.  bool joinAP(String ssid, String pwd,uint8_t pattern=DEFAULT_PATTERN);//连接wifi，名称 密码 模式 
 *  2.  bool createTCP(String addr, uint32_t port);  //创建TCP简单模式连接，设置IP地址和端口
 *  3.  bool setOprToStationSoftAP(); //获取AP状态
 *  4.  uint32_t recv(uint8_t *buffer, uint32_t buffer_size, uint32_t timeout = 1000);  //获得返回字符串
 *  5.  bool enableMUX(void);  //Enable IP MUX(multiple connection mode). 
 *  6. bool send(const uint8_t *buffer, uint32_t len); //Send data based on TCP or UDP builded already in single mode. 

 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  
 * \示例
 *  
 *      1.uper_ConnectWiFi.ino
 *		2.uper_debug.ino
  *		3.uper_HTTPGET.ino
  *		4.uper_TCPClientMultiple.ino
  *		5.uper_TCPClientSingle.ino     //主要实现效果
  *		6.uper_TCPClientSingleUNO.ino
  *		7.uper_TCPServer.ino
  *		8.uper_test.ino
  *		9.uper_UDPClientMultiple.ino
  *		10.uper_UDPClientSingle.ino
 */

#include "uper_ESP8266.h"
#include <avr/pgmspace.h>

#define LOG_OUTPUT_DEBUG            (1)
#define LOG_OUTPUT_DEBUG_PREFIX     (1)

#define logDebug(arg)\
    do {\
        if (LOG_OUTPUT_DEBUG)\
        {\
            if (LOG_OUTPUT_DEBUG_PREFIX)\
            {\
                Serial.print("[LOG Debug: ");\
                Serial.print((const char*)__FILE__);\
                Serial.print(",");\
                Serial.print((unsigned int)__LINE__);\
                Serial.print(",");\
                Serial.print((const char*)__FUNCTION__);\
                Serial.print("] ");\
            }\
            Serial.print(arg);\
        }\
    } while(0)

#ifdef ESP8266_USE_SOFTWARE_SERIAL
UPER_ESP8266::UPER_ESP8266(SoftwareSerial &uart, uint32_t baud): m_puart(&uart)
{
    m_puart->begin(baud);
    rx_empty();
}
#else
UPER_ESP8266::UPER_ESP8266(HardwareSerial &uart, uint32_t baud): m_puart(&uart)
{
    m_puart->begin(baud);
    rx_empty();
}
#endif

bool UPER_ESP8266::kick(void)
{
    return eAT();
}

bool UPER_ESP8266::restart(void)
{
    unsigned long start;
    if (eATRST()) {
        delay(2000);
        start = millis();
        while (millis() - start < 3000) {
            if (eAT()) {
                delay(1500); /* Waiting for stable */
                return true;
            }
            delay(100);
        }
    }
    return false;
}

String UPER_ESP8266::getVersion(void)
{
    String version;
    eATGMR(version);
    return version;
}

bool UPER_ESP8266::setEcho(uint8_t mode)
{
    return eATE(mode);
}

bool UPER_ESP8266::restore(void)
{
    return eATRESTORE();
}
bool UPER_ESP8266::setUart(uint32_t baudrate,uint8_t pattern)
{
    return eATSETUART(baudrate,pattern);
}

bool UPER_ESP8266::deepSleep(uint32_t time)
{
    return eATGSLP(time);
}


bool UPER_ESP8266::setOprToStation(uint8_t pattern1,uint8_t pattern2)
{
    uint8_t mode;
    if (!qATCWMODE(&mode,pattern1)) {
        return false;
    }
    if (mode == 1) {
        return true;
    } else {
        if (sATCWMODE(1,pattern2)){
            return true;
        } else {
            return false;
        }
    }
}
String UPER_ESP8266::getWifiModeList(void)
{   
     String list;
     eATCWMODE(list);
     return list;
}
bool UPER_ESP8266::setOprToSoftAP(uint8_t pattern1,uint8_t pattern2)
{
    uint8_t mode;
    if (!qATCWMODE(&mode,pattern1)) {
        return false;
    }
    if (mode == 2) {
        return true;
    } else {
        if (sATCWMODE(2,pattern2) ){
            return true;
        } else {
            return false;
        }
    }
}

bool UPER_ESP8266::setOprToStationSoftAP(uint8_t pattern1,uint8_t pattern2)
{
    uint8_t mode;
    if (!qATCWMODE(&mode,pattern1)) {
        return false;
    }
    if (mode == 3) {
        return true;
    } else {
        if (sATCWMODE(3,pattern2) ){
            return true;
        } else {
            return false;
        }
    }
}

uint8_t UPER_ESP8266::getOprMode(uint8_t pattern1)
{
	uint8_t mode;
	if (!qATCWMODE(&mode,pattern1)) {
        return 0;
    } else {
		return mode;
    }
}

String UPER_ESP8266::getNowConecAp(uint8_t pattern)
{   
     String ssid;
     qATCWJAP(ssid,pattern);
     return ssid;
}


String UPER_ESP8266::getAPList(void)
{
    String list;
    eATCWLAP(list);
    return list;
}

bool UPER_ESP8266::joinAP(String ssid, String pwd,uint8_t pattern)
{
    return sATCWJAP(ssid, pwd,pattern);
}

bool UPER_ESP8266::leaveAP(void)
{
    return eATCWQAP();
}

String UPER_ESP8266::getSoftAPParam(uint8_t pattern)
{   
     String list;
     qATCWSAP(list,pattern);
     return list;
}



bool UPER_ESP8266::setSoftAPParam(String ssid, String pwd, uint8_t chl, uint8_t ecn,uint8_t pattern)
{
    return sATCWSAP(ssid, pwd, chl, ecn,pattern);
}

String UPER_ESP8266::getJoinedDeviceIP(void)
{
    String list;
    eATCWLIF(list);
    return list;
}

String UPER_ESP8266::getDHCP(uint8_t pattern)
{   
     String dhcp;
     qATCWDHCP(dhcp,pattern);
     return dhcp;
}
bool UPER_ESP8266::setDHCP(uint8_t mode, uint8_t en, uint8_t pattern)
{
    return sATCWDHCP(mode, en, pattern);
}

bool UPER_ESP8266::setAutoConnect(uint8_t en)
{
    return eATCWAUTOCONN(en);
}
String UPER_ESP8266::getStationMac(uint8_t pattern)
{
    String mac;
    qATCIPSTAMAC(mac,pattern);
    return mac;
}


bool UPER_ESP8266::setStationMac(String mac,uint8_t pattern)
{
   return eATCIPSTAMAC(mac,pattern);
}

String UPER_ESP8266::getStationIp(uint8_t pattern)
{
    String ip;
    qATCIPSTAIP(ip,pattern);
    return ip;
}

bool UPER_ESP8266::setStationIp(String ip,String gateway,String netmask,uint8_t pattern)
{
   return eATCIPSTAIP(ip,gateway,netmask,pattern);
}

String UPER_ESP8266::getAPIp(uint8_t pattern)
{
    String ip;
    qATCIPAP(ip,pattern);
    return ip;
}

bool UPER_ESP8266::setAPIp(String ip,uint8_t pattern)
{
   return eATCIPAP(ip,pattern);
}

bool UPER_ESP8266::startSmartConfig(uint8_t type)
{
    return eCWSTARTSMART(type);
}

bool UPER_ESP8266::stopSmartConfig(void)
{
    return eCWSTOPSMART();
}




String UPER_ESP8266::getIPStatus(void)
{
    String list;
    eATCIPSTATUS(list);
    return list;
}

String UPER_ESP8266::getLocalIP(void)
{
    String list;
    eATCIFSR(list);
    return list;
}

bool UPER_ESP8266::enableMUX(void)
{
    return sATCIPMUX(1);
}

bool UPER_ESP8266::disableMUX(void)
{
    return sATCIPMUX(0);
}

bool UPER_ESP8266::createTCP(String addr, uint32_t port)
{
    return sATCIPSTARTSingle("TCP", addr, port);
}

bool UPER_ESP8266::releaseTCP(void)
{
    return eATCIPCLOSESingle();
}

bool UPER_ESP8266::registerUDP(String addr, uint32_t port)
{
    return sATCIPSTARTSingle("UDP", addr, port);
}

bool UPER_ESP8266::unregisterUDP(void)
{
    return eATCIPCLOSESingle();
}

bool UPER_ESP8266::createTCP(uint8_t mux_id, String addr, uint32_t port)
{
    return sATCIPSTARTMultiple(mux_id, "TCP", addr, port);
}

bool UPER_ESP8266::releaseTCP(uint8_t mux_id)
{
    return sATCIPCLOSEMulitple(mux_id);
}

bool UPER_ESP8266::registerUDP(uint8_t mux_id, String addr, uint32_t port)
{
    return sATCIPSTARTMultiple(mux_id, "UDP", addr, port);
}

bool UPER_ESP8266::unregisterUDP(uint8_t mux_id)
{
    return sATCIPCLOSEMulitple(mux_id);
}

bool UPER_ESP8266::setTCPServerTimeout(uint32_t timeout)
{
    return sATCIPSTO(timeout);
}

bool UPER_ESP8266::startTCPServer(uint32_t port)
{
    if (sATCIPSERVER(1, port)) {
        return true;
    }
    return false;
}

bool UPER_ESP8266::stopTCPServer(void)
{
    sATCIPSERVER(0);
    restart();
    return false;
}

bool UPER_ESP8266::setCIPMODE(uint8_t mode)
{
    return sATCIPMODE(mode);
}

bool UPER_ESP8266::saveTransLink (uint8_t mode,String ip,uint32_t port)
{
    return eATSAVETRANSLINK(mode,ip,port);
}

bool UPER_ESP8266::setPing(String ip)
{
    return eATPING(ip);
}




bool UPER_ESP8266::startServer(uint32_t port)
{
    return startTCPServer(port);
}

bool UPER_ESP8266::stopServer(void)
{
    return stopTCPServer();
}

bool UPER_ESP8266::send(const uint8_t *buffer, uint32_t len)
{
    return sATCIPSENDSingle(buffer, len);
}

bool UPER_ESP8266::sendFromFlash(uint8_t mux_id, const uint8_t *buffer, uint32_t len)
{
    return sATCIPSENDMultipleFromFlash(mux_id, buffer, len);
}

bool UPER_ESP8266::sendFromFlash(const uint8_t *buffer, uint32_t len)
{
    return sATCIPSENDSingleFromFlash(buffer, len);
}

bool UPER_ESP8266::send(uint8_t mux_id, const uint8_t *buffer, uint32_t len)
{
    return sATCIPSENDMultiple(mux_id, buffer, len);
}

uint32_t UPER_ESP8266::recv(uint8_t *buffer, uint32_t buffer_size, uint32_t timeout)
{
    return recvPkg(buffer, buffer_size, NULL, timeout, NULL);
}

uint32_t UPER_ESP8266::recv(uint8_t mux_id, uint8_t *buffer, uint32_t buffer_size, uint32_t timeout)
{
    uint8_t id;
    uint32_t ret;
    ret = recvPkg(buffer, buffer_size, NULL, timeout, &id);
    if (ret > 0 && id == mux_id) {
        return ret;
    }
    return 0;
}

uint32_t UPER_ESP8266::recv(uint8_t *coming_mux_id, uint8_t *buffer, uint32_t buffer_size, uint32_t timeout)
{
    return recvPkg(buffer, buffer_size, NULL, timeout, coming_mux_id);
}

/*----------------------------------------------------------------------------*/
/* +IPD,<id>,<len>:<data> */
/* +IPD,<len>:<data> */

uint32_t UPER_ESP8266::recvPkg(uint8_t *buffer, uint32_t buffer_size, uint32_t *data_len, uint32_t timeout, uint8_t *coming_mux_id)
{
    String data;
    char a;
    int32_t index_PIPDcomma = -1;
    int32_t index_colon = -1; /* : */
    int32_t index_comma = -1; /* , */
    int32_t len = -1;
    int8_t id = -1;
    bool has_data = false;
    uint32_t ret;
    unsigned long start;
    uint32_t i;
    
    if (buffer == NULL) {
        return 0;
    }
    
    start = millis();
    while (millis() - start < timeout) {
        if(m_puart->available() > 0) {
            a = m_puart->read();
            data += a;
        }
        
        index_PIPDcomma = data.indexOf("+IPD,");
        if (index_PIPDcomma != -1) {
            index_colon = data.indexOf(':', index_PIPDcomma + 5);
            if (index_colon != -1) {
                index_comma = data.indexOf(',', index_PIPDcomma + 5);
                /* +IPD,id,len:data */
                if (index_comma != -1 && index_comma < index_colon) { 
                    id = data.substring(index_PIPDcomma + 5, index_comma).toInt();
                    if (id < 0 || id > 4) {
                        return 0;
                    }
                    len = data.substring(index_comma + 1, index_colon).toInt();
                    if (len <= 0) {
                        return 0;
                    }
                } else { /* +IPD,len:data */
                    len = data.substring(index_PIPDcomma + 5, index_colon).toInt();
                    if (len <= 0) {
                        return 0;
                    }
                }
                has_data = true;
                break;
            }
        }
    }
    
    if (has_data) {
        i = 0;
        ret = len > buffer_size ? buffer_size : len;
        start = millis();
        while (millis() - start < 3000) {
            while(m_puart->available() > 0 && i < ret) {
                a = m_puart->read();
                buffer[i++] = a;
            }
            if (i == ret) {
                rx_empty();
                if (data_len) {
                    *data_len = len;    
                }
                if (index_comma != -1 && coming_mux_id) {
                    *coming_mux_id = id;
                }
                return ret;
            }
        }
    }
    return 0;
}

void UPER_ESP8266::rx_empty(void) 
{
    while(m_puart->available() > 0) {
        m_puart->read();
    }
}

String UPER_ESP8266::recvString(String target, uint32_t timeout)
{
    String data;
    char a;
    unsigned long start = millis();
    while (millis() - start < timeout) {
        while(m_puart->available() > 0) {
            a = m_puart->read();
			if(a == '\0') continue;
            data += a;
        }
        if (data.indexOf(target) != -1) {
            break;
        }   
    }
    
    return data;
}

String UPER_ESP8266::recvString(String target1, String target2, uint32_t timeout)
{
    String data;
    char a;
    unsigned long start = millis();
    while (millis() - start < timeout) {
        while(m_puart->available() > 0) {
            a = m_puart->read();
			if(a == '\0') continue;
            data += a;
        }
        if (data.indexOf(target1) != -1) {
            break;
        } else if (data.indexOf(target2) != -1) {
            break;
        }
    }
    return data;
}

String UPER_ESP8266::recvString(String target1, String target2, String target3, uint32_t timeout)
{
    String data;
    char a;
    unsigned long start = millis();
    while (millis() - start < timeout) {
        while(m_puart->available() > 0) {
            a = m_puart->read();
			if(a == '\0') continue;
            data += a;
        }
        if (data.indexOf(target1) != -1) {
            break;
        } else if (data.indexOf(target2) != -1) {
            break;
        } else if (data.indexOf(target3) != -1) {
            break;
        }
    }
    return data;
}

bool UPER_ESP8266::recvFind(String target, uint32_t timeout)
{
    String data_tmp;
    data_tmp = recvString(target, timeout);
    if (data_tmp.indexOf(target) != -1) {
        return true;
    }
    return false;
}

bool UPER_ESP8266::recvFindAndFilter(String target, String begin, String end, String &data, uint32_t timeout)
{
    String data_tmp;
    data_tmp = recvString(target, timeout);
    if (data_tmp.indexOf(target) != -1) {
        int32_t index1 = data_tmp.indexOf(begin);
        int32_t index2 = data_tmp.indexOf(end);
        if (index1 != -1 && index2 != -1) {
            index1 += begin.length();
            data = data_tmp.substring(index1, index2);
            return true;
        }
    }
    data = data_tmp;
    return false;
}

bool UPER_ESP8266::eAT(void)
{
    rx_empty();
    m_puart->println(F("AT"));
    return recvFind("OK");
}

bool UPER_ESP8266::eATRST(void) 
{
    rx_empty();
    m_puart->println(F("AT+RST"));
    return recvFind("OK");
}

bool UPER_ESP8266::eATGMR(String &version)
{
    rx_empty();
    delay(3000);
    m_puart->println(F("AT+GMR"));
    return recvFindAndFilter("OK", "\r\r\n", "\r\n\r\nOK", version,10000); 
}

bool UPER_ESP8266::eATGSLP(uint32_t time)
{
    rx_empty();
    m_puart->print(F("AT+GSLP="));
    m_puart->println(time);
    return recvFind("OK");
}


bool UPER_ESP8266::eATE(uint8_t mode)
{
    rx_empty();
    m_puart->print(F("ATE"));
    m_puart->println(mode);
    return recvFind("OK");
}

bool UPER_ESP8266::eATRESTORE(void)
{
    rx_empty();
    m_puart->println(F("AT+RESTORE"));
    return recvFind("OK");
}


bool UPER_ESP8266::eATSETUART(uint32_t baudrate,uint8_t pattern)
{
    rx_empty();
    if(pattern>3||pattern<1){
        return false;
        }
    switch(pattern){
        case 1:
            m_puart->print(F("AT+UART="));
            break;
        case 2:
            m_puart->print(F("AT+UART_CUR="));
            break;
        case 3:
             m_puart->print(F("AT+UART_DEF="));
             break;    
    }
    m_puart->print(baudrate);
    m_puart->print(F(","));
    m_puart->print(8);
    m_puart->print(F(","));
    m_puart->print(1);
    m_puart->print(F(","));
    m_puart->print(0);
    m_puart->print(F(","));
    m_puart->println(0);
    if(recvFind("OK",5000)){

    m_puart->begin(baudrate);
    return true;
    }
    else{
    return false;
    }
 
}


bool UPER_ESP8266::qATCWMODE(uint8_t *mode,uint8_t pattern) 
{
    String str_mode;
    bool ret;
    if (!mode||!pattern) {
        return false;
    }
    rx_empty();
    switch(pattern)
    {
        case 1 :
            m_puart->println(F("AT+CWMODE_DEF?"));
            break;
        case 2:
            m_puart->println(F("AT+CWMODE_CUR?"));
            break;
        default:
            m_puart->println(F("AT+CWMODE?"));
    }
    ret = recvFindAndFilter("OK", ":", "\r\n\r\nOK", str_mode); 
    if (ret) {
        *mode = (uint8_t)str_mode.toInt();       
        return true;
    } else {
        return false;
    }
}
bool UPER_ESP8266::eATCWMODE(String &list) 
{
    rx_empty();
    m_puart->println(F("AT+CWMODE=?"));
    return recvFindAndFilter("OK", "+CWMODE:(", ")\r\n\r\nOK", list);
}

bool UPER_ESP8266::sATCWMODE(uint8_t mode,uint8_t pattern)
{
    if(!pattern){
        return false;
        }
    String data;
    rx_empty();
    switch(pattern)
    {
        case 1 :
            m_puart->print(F("AT+CWMODE_DEF="));
            break;
        case 2:
            m_puart->print(F("AT+CWMODE_CUR="));
            break;
        default:
            m_puart->print(F("AT+CWMODE="));
    }
    m_puart->println(mode);
    data = recvString("OK", "no change");

    if (data.indexOf("OK") != -1 || data.indexOf("no change") != -1) {
        return true;
    }
    return false;
}


bool UPER_ESP8266::qATCWJAP(String &ssid,uint8_t pattern) 
{

    bool ret;
    if (!pattern) {
        return false;
    }
    rx_empty();
    switch(pattern)
    {
        case 1 :
            m_puart->println(F("AT+CWJAP_DEF?"));
            break;
        case 2:
            m_puart->println(F("AT+CWJAP_CUR?"));
            break;
        default:
            m_puart->println(F("AT+CWJAP?"));
    }
    ssid = recvString("OK", "No AP");
    if (ssid.indexOf("OK") != -1 || ssid.indexOf("No AP") != -1) {
        return true;
    }
    return false;
 
}

bool UPER_ESP8266::sATCWJAP(String ssid, String pwd,uint8_t pattern)
{
    String data;
    if (!pattern) {
        return false;
    }
    rx_empty();
    switch(pattern)
    {
        case 1 :
            m_puart->print(F("AT+CWJAP_DEF=\""));

            break;
        case 2:
            m_puart->print(F("AT+CWJAP_CUR=\""));
            break;
        default:
            m_puart->print(F("AT+CWJAP=\""));
    }
    
    m_puart->print(ssid);
    m_puart->print(F("\",\""));
    m_puart->print(pwd);
    m_puart->println(F("\""));
    
    data = recvString("OK", "FAIL", 10000);
    if (data.indexOf("OK") != -1) {
        return true;
    }
    return false;
}

bool UPER_ESP8266::eATCWLAP(String &list) 
{
    String data;
    rx_empty();
    m_puart->println(F("AT+CWLAP"));
    return recvFindAndFilter("OK", "\r\r\n", "\r\n\r\nOK", list, 15000);
}




bool UPER_ESP8266::eATCWQAP(void)
{
    String data;
    rx_empty();
    m_puart->println(F("AT+CWQAP"));
    return recvFind("OK");
}


bool UPER_ESP8266::qATCWSAP(String &List,uint8_t pattern) 
{
    if (!pattern) {
        return false;
    }
    rx_empty();
    switch(pattern)
    {
        case 1 :
            m_puart->println(F("AT+CWSAP_DEF?"));

            break;
        case 2:
            m_puart->println(F("AT+CWSAP_CUR?"));
            break;
        default:
            m_puart->println(F("AT+CWSAP?"));
    }
    return recvFindAndFilter("OK", "\r\r\n", "\r\n\r\nOK", List,10000);

}

bool UPER_ESP8266::sATCWSAP(String ssid, String pwd, uint8_t chl, uint8_t ecn,uint8_t pattern)
{
    String data;
    if (!pattern) {
        return false;
    }
    rx_empty();
    switch(pattern){
         case 1 :
            m_puart->print(F("AT+CWSAP_DEF=\""));

            break;
        case 2:
            m_puart->print(F("AT+CWSAP_CUR=\""));
            break;
        default:
            m_puart->print(F("AT+CWSAP=\""));

    }
    m_puart->print(ssid);
    m_puart->print(F("\",\""));
    m_puart->print(pwd);
    m_puart->print(F("\","));
    m_puart->print(chl);
    m_puart->print(F(","));
    m_puart->println(ecn);
    
    data = recvString("OK", "ERROR", 5000);
    if (data.indexOf("OK") != -1) {
        return true;
    }
    return false;
}

bool UPER_ESP8266::eATCWLIF(String &list)
{
    String data;
    rx_empty();
    m_puart->println(F("AT+CWLIF"));
    return recvFindAndFilter("OK", "\r\r\n", "\r\n\r\nOK", list);
}

bool UPER_ESP8266::qATCWDHCP(String &List,uint8_t pattern) 
{
    if (!pattern) {
        return false;
    }
    rx_empty();
    switch(pattern)
    {
        case 1 :
            m_puart->println(F("AT+CWDHCP_DEF?"));
            break;
        case 2:
            m_puart->println(F("AT+CWDHCP_CUR?"));
            break;
        default:
            m_puart->println(F("AT+CWDHCP?"));
    }

    return recvFindAndFilter("OK", "\r\r\n", "\r\nOK", List,10000);

}


bool UPER_ESP8266::sATCWDHCP(uint8_t mode, uint8_t en, uint8_t pattern)
{
    String data;
    if (!pattern) {
        return false;
    }
    rx_empty();
    switch(pattern){
         case 1 :
            m_puart->print(F("AT+CWDHCP_DEF="));

            break;
        case 2:
            m_puart->print(F("AT+CWDHCP_CUR="));
            break;
        default:
            m_puart->print(F("AT+CWDHCP="));

    }
    m_puart->print(mode);
    m_puart->print(F(","));
    m_puart->println(en);    
    data = recvString("OK", "ERROR", 2000);

    if (data.indexOf("OK") != -1) {
        return true;
    }
    return false;
}


bool UPER_ESP8266::eATCWAUTOCONN(uint8_t en)
{

    rx_empty();
    if(en>1||en<0){
        return false;
    }
    m_puart->print(F("AT+CWAUTOCONN="));
    m_puart->println(en);
    return recvFind("OK");

}

bool UPER_ESP8266::qATCIPSTAMAC(String &mac,uint8_t pattern)
{

    rx_empty();
    if (!pattern) {
        return false;
    }
    switch(pattern){
         case 1 :
            m_puart->println(F("AT+CIPSTAMAC_DEF?"));

            break;
        case 2:
            m_puart->println(F("AT+CIPSTAMAC_CUR?"));
            break;
        default:
            m_puart->println(F("AT+CIPSTAMAC?"));

    }
    return recvFindAndFilter("OK", "\r\r\n", "\r\n\r\nOK", mac,2000);

}



bool UPER_ESP8266::eATCIPSTAMAC(String mac,uint8_t pattern)
{

    rx_empty();
    if (!pattern) {
        return false;
    }
    switch(pattern){
         case 1 :
            m_puart->print(F("AT+CIPSTAMAC_DEF="));

            break;
        case 2:
            m_puart->print(F("AT+CIPSTAMAC_CUR="));
            break;
        default:
            m_puart->print(F("AT+CIPSTAMAC="));

    }
    m_puart->print(F("\""));
    m_puart->print(mac);
    m_puart->println(F("\""));
    return recvFind("OK");

}

bool UPER_ESP8266::qATCIPSTAIP(String &ip,uint8_t pattern)
{

    rx_empty();
    if (!pattern) {
        return false;
    }
    switch(pattern){
         case 1 :
            m_puart->println(F("AT+CIPSTA_DEF?"));

            break;
        case 2:
            m_puart->println(F("AT+CIPSTA_CUR?"));
            break;
        default:
            m_puart->println(F("AT+CIPSTA?"));

    }
    return recvFindAndFilter("OK", "\r\r\n", "\r\n\r\nOK", ip,2000);

}

bool UPER_ESP8266::eATCIPSTAIP(String ip,String gateway,String netmask,uint8_t pattern)
{

    rx_empty();
    if (!pattern) {
        return false;
    }
    switch(pattern){
         case 1 :
            m_puart->print(F("AT+CIPSTA_DEF="));

            break;
        case 2:
            m_puart->print(F("AT+CIPSTA_CUR="));
            break;
        default:
            m_puart->print(F("AT+CIPSTA="));

    }
    m_puart->print(F("\""));
    m_puart->print(ip);
    m_puart->print(F("\",\""));
    m_puart->print(gateway);
    m_puart->print(F("\",\""));
    m_puart->print(netmask);
    m_puart->println(F("\""));
    return recvFind("OK");

}


bool UPER_ESP8266::qATCIPAP(String &ip,uint8_t pattern)
{

    rx_empty();
    if (!pattern) {
        return false;
    }
    switch(pattern){
         case 1 :
            m_puart->println(F("AT+CIPAP_DEF?"));

            break;
        case 2:
            m_puart->println(F("AT+CIPAP_CUR?"));
            break;
        default:
            m_puart->println(F("AT+CIPAP?"));

    }
    return recvFindAndFilter("OK", "\r\r\n", "\r\n\r\nOK", ip,2000);

}


bool UPER_ESP8266::eATCIPAP(String ip,uint8_t pattern)
{

    rx_empty();
    if (!pattern) {
        return false;
    }
    switch(pattern){
         case 1 :
            m_puart->print(F("AT+CIPAP_DEF="));

            break;
        case 2:
            m_puart->print(F("AT+CIPAP_CUR="));
            break;
        default:
            m_puart->print(F("AT+CIPAP="));

    }
    m_puart->print(F("\""));
    m_puart->print(ip);
    m_puart->println(F("\""));
    return recvFind("OK");

}


bool UPER_ESP8266::eCWSTARTSMART(uint8_t type)
{
    rx_empty();
    m_puart->print(F("AT+CWSTARTSMART="));
    m_puart->println(type);
    return recvFind("OK");
}

bool UPER_ESP8266::eCWSTOPSMART(void)
{
    rx_empty();
    m_puart->println(F("AT+CWSTOPSMART"));
    return recvFind("OK");
}

bool UPER_ESP8266::eATCIPSTATUS(String &list)
{
    String data;
    delay(100);
    rx_empty();
    m_puart->println(F("AT+CIPSTATUS"));
    return recvFindAndFilter("OK", "\r\r\n", "\r\n\r\nOK", list);
}
bool UPER_ESP8266::sATCIPSTARTSingle(String type, String addr, uint32_t port)
{
    String data;
    rx_empty();
    m_puart->print(F("AT+CIPSTART=\""));
    m_puart->print(type);
    m_puart->print(F("\",\""));
    m_puart->print(addr);
    m_puart->print(F("\","));
    m_puart->println(port);
    
    data = recvString("OK", "ERROR", "ALREADY CONNECT", 10000);
    if (data.indexOf("OK") != -1 || data.indexOf("ALREADY CONNECT") != -1) {
        return true;
    }
    return false;
}
bool UPER_ESP8266::sATCIPSTARTMultiple(uint8_t mux_id, String type, String addr, uint32_t port)
{
    String data;
    rx_empty();
    m_puart->print(F("AT+CIPSTART="));
    m_puart->print(mux_id);
    m_puart->print(F(",\""));
    m_puart->print(type);
    m_puart->print(F("\",\""));
    m_puart->print(addr);
    m_puart->print(F("\","));
    m_puart->println(port);
    
    data = recvString("OK", "ERROR", "ALREADY CONNECT", 10000);
    if (data.indexOf("OK") != -1 || data.indexOf("ALREADY CONNECT") != -1) {
        return true;
    }
    return false;
}
bool UPER_ESP8266::sATCIPSENDSingle(const uint8_t *buffer, uint32_t len)
{
    rx_empty();
    m_puart->print(F("AT+CIPSEND="));
    m_puart->println(len);
    if (recvFind(">", 5000)) {
        rx_empty();
        for (uint32_t i = 0; i < len; i++) {
            m_puart->write(buffer[i]);
        }
        return recvFind("SEND OK", 10000);
    }
    return false;
}
bool UPER_ESP8266::sATCIPSENDMultiple(uint8_t mux_id, const uint8_t *buffer, uint32_t len)
{
    rx_empty();
    m_puart->print(F("AT+CIPSEND="));
    m_puart->print(mux_id);
    m_puart->print(F(","));
    m_puart->println(len);
    if (recvFind(">", 5000)) {
        rx_empty();
        for (uint32_t i = 0; i < len; i++) {
            m_puart->write(buffer[i]);
        }
        return recvFind("SEND OK", 10000);
    }
    return false;
}
bool UPER_ESP8266::sATCIPSENDSingleFromFlash(const uint8_t *buffer, uint32_t len)
{
    rx_empty();
    m_puart->print(F("AT+CIPSEND="));
    m_puart->println(len);
    if (recvFind(">", 5000)) {
        rx_empty();
        for (uint32_t i = 0; i < len; i++) {
            m_puart->write((char) pgm_read_byte(&buffer[i]));
        }
        return recvFind("SEND OK", 10000);
    }
    return false;
}
bool UPER_ESP8266::sATCIPSENDMultipleFromFlash(uint8_t mux_id, const uint8_t *buffer, uint32_t len)
{
    rx_empty();
    m_puart->print(F("AT+CIPSEND="));
    m_puart->print(mux_id);
    m_puart->print(F(","));
    m_puart->println(len);
    if (recvFind(">", 5000)) {
        rx_empty();
        for (uint32_t i = 0; i < len; i++) {
            m_puart->write((char) pgm_read_byte(&buffer[i]));
        }
        return recvFind("SEND OK", 10000);
    }
    return false;
}
bool UPER_ESP8266::sATCIPCLOSEMulitple(uint8_t mux_id)
{
    String data;
    rx_empty();
    m_puart->print(F("AT+CIPCLOSE="));
    m_puart->println(mux_id);
    
    data = recvString("OK", "link is not", 5000);
    if (data.indexOf("OK") != -1 || data.indexOf("link is not") != -1) {
        return true;
    }
    return false;
}
bool UPER_ESP8266::eATCIPCLOSESingle(void)
{
    rx_empty();
    m_puart->println(F("AT+CIPCLOSE"));
    return recvFind("OK", 5000);
}
bool UPER_ESP8266::eATCIFSR(String &list)
{
    rx_empty();
    m_puart->println(F("AT+CIFSR"));
    return recvFindAndFilter("OK", "\r\r\n", "\r\n\r\nOK", list);
}
bool UPER_ESP8266::sATCIPMUX(uint8_t mode)
{
    String data;
    rx_empty();
    m_puart->print(F("AT+CIPMUX="));
    m_puart->println(mode);
    
    data = recvString("OK", "Link is builded");
    if (data.indexOf("OK") != -1) {
        return true;
    }
    return false;
}
bool UPER_ESP8266::sATCIPSERVER(uint8_t mode, uint32_t port)
{
    String data;
    if (mode) {
        rx_empty();
        m_puart->print(F("AT+CIPSERVER=1,"));
        m_puart->println(port);
        
        data = recvString("OK", "no change");
        if (data.indexOf("OK") != -1 || data.indexOf("no change") != -1) {
            return true;
        }
        return false;
    } else {
        rx_empty();
        m_puart->println(F("AT+CIPSERVER=0"));
        return recvFind("\r\r\n");
    }
}


bool UPER_ESP8266::sATCIPMODE(uint8_t mode)
{
    String data;
    if(mode>1||mode<0){
        return false;
        }
    rx_empty();
    m_puart->print(F("AT+CIPMODE="));
    m_puart->println(mode);
    
    data = recvString("OK", "Link is builded",2000);
    if (data.indexOf("OK") != -1 ) {
        return true;
    }
    return false;
}




bool UPER_ESP8266::eATSAVETRANSLINK(uint8_t mode,String ip,uint32_t port)
{

    String data;
    rx_empty();
    m_puart->print(F("AT+SAVETRANSLINK="));
    m_puart->print(mode);
    m_puart->print(F(",\""));
    m_puart->print(ip);
    m_puart->print(F("\","));
    m_puart->println(port);
    data = recvString("OK", "ERROR",2000);
    if (data.indexOf("OK") != -1 ) {
        return true;
    }
    return false;
}



bool UPER_ESP8266::eATPING(String ip)
{
    rx_empty();
    m_puart->print(F("AT+PING="));
    m_puart->print(F("\""));
    m_puart->print(ip);
    m_puart->println(F("\""));
    return recvFind("OK",2000);
}



bool UPER_ESP8266::sATCIPSTO(uint32_t timeout)
{
    rx_empty();
    m_puart->print(F("AT+CIPSTO="));
    m_puart->println(timeout);
    return recvFind("OK");
}


 /**
 * \著作权 
 * @名称：  ESP8266.h
 * @作者：  ITEAD
 * @版本：  V1.0.0
 * @URL: 	https://github.com/itead/ITEADLIB_Arduino_WeeESP8266
 * @维护：  Kenblock
 * @时间：  2017/10/17
 * @描述：  ESP8266 WiFi模块驱动库。
 *
 * \说明
 * ESP8266 WiFi模块驱动库。
 *
 * \常用公有方法列表：
 * 		void 	begin(uint32_t baud);//WiFi初始化，设置串口波特率。
 * 		bool    kick (void); 		//测试AT，验证ESP8266是否存在"AT"。
 * 		bool    restart (void); 	//复位重启 "AT+RST"。
 * 		bool 	restore(void);		//恢复出厂设置 "AT+RESTORE"。
 * 		String  getVersion (void); 	//查询AT版本信息"AT+GMR"。
 * 		bool	setBaud(uint32_t baud);		//设置ESP8266串口通信波特率。
 * 		bool    setOprToStation (void); 			//设置为Station 模式 "AT+CWMODE=1"。
 * 		bool    setOprToSoftAP (void); 				//设置为AP 模式 "AT+CWMODE=2"。
 * 		bool    setOprToStationSoftAP (void); 		//设置为AP + Station模式 "AT+CWMODE=3"。
 * 		String  getAPList (void); 					//列出当前可用 AP列表。
 * 		bool    joinAP (String ssid, String pwd); 	//加入AP（连接到WiFi）。
 * 		bool    leaveAP (void); 					//退出与AP的连接（断开WiFi连接）。
 * 		bool    setSoftAPParam (String ssid, String pwd, uint8_t chl=7, uint8_t ecn=4); //设置AP模式下的参数（WiFi名称及密码）。
 * 		String  getJoinedDeviceIP (void); 			//查看已接入设备的IP。 
 * 		String  getIPStatus (void); //获得连接状态(UDP 和 TCP)。 
 * 		String  getLocalIP (void); 	//查询ESP8266自身IP地址。 
 * 		bool    enableMUX (void); 	//启用多链接。
 * 		bool    disableMUX (void);	//禁用多链接（即设为单链接）。
 * 		bool    createTCP (String addr, uint32_t port); 	//在单链接模式下 创建TCP连接。
 * 		bool    releaseTCP (void); 							//在单链接模式下 关闭TCP连接。
 * 		bool    registerUDP (String addr, uint32_t port); 	//在单链接模式下 注册UDP端口号。
 * 		bool    unregisterUDP (void);						//在单链接模式下 注销UDP端口号 。
 * 		bool    createTCP (uint8_t mux_id, String addr, uint32_t port); 	//在多链接模式下 创建TCP连接，mux_id：0-4。
 * 		bool    releaseTCP (uint8_t mux_id); 								//在多链接模式下 关闭TCP连接，mux_id：0-4。 
 * 		bool    registerUDP (uint8_t mux_id, String addr, uint32_t port); 	//在多链接模式下 注册UDP端口号，mux_id：0-4。
 * 		bool    unregisterUDP (uint8_t mux_id); 							//在多链接模式下 注销UDP端口号，mux_id：0-4。
 * 		bool    setTCPServerTimeout (uint32_t timeout=180); 	//设置TCP服务超时时间（s）。
 * 		bool    startServer (uint32_t port=333); 	//开始服务（仅多链接模式下）。
 * 		bool    stopServer (void); 					//停止服务（仅多链接模式下）。
 * 		bool    startTCPServer (uint32_t port=333);	//设置为TCP服务器模式，并开启（仅多链接模式下）。
 * 		bool    stopTCPServer (void); 				//关闭TCP服务服务器（仅多链接模式下）。
 * 		bool    send (const uint8_t *buffer, uint32_t len); 				//发送数据，单链接模式下基于已建立的TCP 或 UDP连接发送数据。
 * 		bool    send (uint8_t mux_id, const uint8_t *buffer, uint32_t len); //发送数据，多链接模式下基于已建立的某一TCP 或 UDP连接发送数据，mux_id：0-4。
 * 		uint32_t    recv (uint8_t *buffer, uint32_t buffer_size, uint32_t timeout=1000); 					//接收数据，单链接模式下 接收已建立的TCP或UDP连接 的数据。
 * 		uint32_t    recv (uint8_t mux_id, uint8_t *buffer, uint32_t buffer_size, uint32_t timeout=1000);  	//接收数据，多链接模式下 接收已建立的某一TCP或UDP连接的 数据，mux_id：0-4
 * 		uint32_t    recv (uint8_t *coming_mux_id, uint8_t *buffer, uint32_t buffer_size, uint32_t timeout=1000); //接收数据，多链接模式下 接收已建立的所有TCP或UDP连接的 数据。
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/10/17      1.0.0              做汉化修订注释。
 *  
 * \示例
 *  
 * 		1.TCPServerUNO.ino			//AP模式 或者 AP兼Station模式 设置为TCP服务器示例。常用！
 * 		2.TCPClientSingleUNO.ino	//Station模式 或者 AP兼Station模式 作为 TCP客户端 使用的示例。
 * 		3.PassthroughTransmission.ino	//WiFi 透传，操作同TCPClientSingleUNO.ino。
 * 		4.ConnectWiFi.ino			//Station模式 连接WiFi。
 * 		5.其他：若要支持UNO，请自行修改测试。
 */
#ifndef __ESP8266_H__
#define __ESP8266_H__

#include "Arduino.h"

//#define ESP8266_USE_SOFTWARE_SERIAL

#ifdef ESP8266_USE_SOFTWARE_SERIAL
#include "SoftwareSerial.h"
#endif

//The way of encrypstion
#define    OPEN          0
#define    WEP           1
#define    WAP_PSK       2
#define    WAP2_PSK      3
#define    WAP_WAP2_PSK  4

//Communication mode 
#define    TCP     1
#define    tcp     1
#define    UDP     0
#define    udp     0

#define    OPEN    1
#define    CLOSE   0

//The type of initialized WIFI
#define    STA     1
#define    AP      2
#define    AP_STA  3


/**
 * Provide an easy-to-use way to manipulate ESP8266. 
 */
class ESP8266 : public Print {
 public:
 
#ifdef ESP8266_USE_SOFTWARE_SERIAL
    /*
     * Constuctor. 
     *
     * @param uart - an reference of SoftwareSerial object. 
     *
     * @warning parameter baud depends on the AT firmware. 9600 is an common value. 
     */
    ESP8266(SoftwareSerial &uart);
#else /* HardwareSerial */
    /*
     * Constuctor. 
     *
     * @param uart - an reference of HardwareSerial object. 
     *
     * @warning parameter baud depends on the AT firmware. 115200 is an common value. 
     */
    ESP8266(HardwareSerial &uart);
#endif
    
     /*
     * Begin. 
     * 
     * @param baud - the buad rate to communicate with ESP8266(default:9600). 
     *
     * @warning parameter baud depends on the AT firmware. 9600 is an common value. 
     */
    void begin(uint32_t baud = 9600);						 
    /** 
     * Verify ESP8266 whether live or not. 
     *
     * Actually, this method will send command "AT" to ESP8266 and waiting for "OK". 
     * 
     * @retval true - alive.
     * @retval false - dead.
     */
    bool kick(void);
    
    /**
     * Restart ESP8266 by "AT+RST". 
     *
     * This method will take 3 seconds or more. 
     *
     * @retval true - success.
     * @retval false - failure.
     */
    bool restart(void);
	
	/**
     * Restore ESP8266 by "AT+RESTORE". 
     *
     * This method will take 3 seconds or more. 
     *
     * @retval true - success.
     * @retval false - failure.
     */
	bool restore(void);
	
	/**
     * Set ESP8266 uart baudrate. 
     *
     * param baud - ESP8266 uart baudrate.
     *
     * @retval true - success.
     * @retval false - failure.
     */
	bool setBaud(uint32_t baud = 115200);
    
    /**
     * Get the version of AT Command Set. 
     * 
     * @return the string of version. 
     */
    String getVersion(void);
    
    /**
     * Set operation mode to staion. 
     * 
     * @retval true - success.
     * @retval false - failure.
     */
    bool setOprToStation(void);
    
    /**
     * Set operation mode to softap. 
     * 
     * @retval true - success.
     * @retval false - failure.
     */
    bool setOprToSoftAP(void);
    
    /**
     * Set operation mode to station + softap. 
     * 
     * @retval true - success.
     * @retval false - failure.
     */
    bool setOprToStationSoftAP(void);
    
    /**
     * Search available AP list and return it.
     * 
     * @return the list of available APs. 
     * @note This method will occupy a lot of memeory(hundreds of Bytes to a couple of KBytes). 
     *  Do not call this method unless you must and ensure that your board has enough memery left.
     */
    String getAPList(void);
    
    /**
     * Join in AP. 
     *
     * @param ssid - SSID of AP to join in. 
     * @param pwd - Password of AP to join in. 
     * @retval true - success.
     * @retval false - failure.
     * @note This method will take a couple of seconds. 
     */
    bool joinAP(String ssid, String pwd);
    
    
    /**
     * Enable DHCP for client mode. 
     *
     * @param mode - server mode (0=soft AP, 1=station, 2=both
     * @param enabled - true if dhcp should be enabled, otherwise false
     * 
     * @note This method will enable DHCP but only for client mode!
     */
    bool enableClientDHCP(uint8_t mode, boolean enabled);
    
    /**
     * Leave AP joined before. 
     *
     * @retval true - success.
     * @retval false - failure.
     */
    bool leaveAP(void);
    
    /**
     * Set SoftAP parameters. 
     * 
     * @param ssid - SSID of SoftAP. 
     * @param pwd - PASSWORD of SoftAP. 
     * @param chl - the channel (1 - 13, default: 7). 
     * @param ecn - the way of encrypstion (0 - OPEN, 1 - WEP, 
     *  2 - WPA_PSK, 3 - WPA2_PSK, 4 - WPA_WPA2_PSK, default: 4). 
     * @note This method should not be called when station mode. 
     */
    bool setSoftAPParam(String ssid, String pwd, uint8_t chl = 7, uint8_t ecn = 4);
    
    /**
     * Get the IP list of devices connected to SoftAP. 
     * 
     * @return the list of IP.
     * @note This method should not be called when station mode. 
     */
    String getJoinedDeviceIP(void);
    
    /**
     * Get the current status of connection(UDP and TCP). 
     * 
     * @return the status. 
     */
    String getIPStatus(void);
    
    /**
     * Get the IP address of ESP8266. 
     *
     * @return the IP list. 
     */
    String getLocalIP(void);
    
    /**
     * Enable IP MUX(multiple connection mode). 
     *
     * In multiple connection mode, a couple of TCP and UDP communication can be builded. 
     * They can be distinguished by the identifier of TCP or UDP named mux_id. 
     * 
     * @retval true - success.
     * @retval false - failure.
     */
    bool enableMUX(void);
    
    /**
     * Disable IP MUX(single connection mode). 
     *
     * In single connection mode, only one TCP or UDP communication can be builded. 
     * 
     * @retval true - success.
     * @retval false - failure.
     */
    bool disableMUX(void);
    
    
    /**
     * Create TCP connection in single mode. 
     * 
     * @param addr - the IP or domain name of the target host. 
     * @param port - the port number of the target host. 
     * @retval true - success.
     * @retval false - failure.
     */
    bool createTCP(String addr, uint32_t port);
    
    /**
     * Release TCP connection in single mode. 
     * 
     * @retval true - success.
     * @retval false - failure.
     */
    bool releaseTCP(void);
    
    /**
     * Register UDP port number in single mode.
     * 
     * @param addr - the IP or domain name of the target host. 
     * @param port - the port number of the target host. 
     * @retval true - success.
     * @retval false - failure.
     */
    bool registerUDP(String addr, uint32_t port);
    
    /**
     * Unregister UDP port number in single mode. 
     * 
     * @retval true - success.
     * @retval false - failure.
     */
    bool unregisterUDP(void);
  
    /**
     * Create TCP connection in multiple mode. 
     * 
     * @param mux_id - the identifier of this TCP(available value: 0 - 4). 
     * @param addr - the IP or domain name of the target host. 
     * @param port - the port number of the target host. 
     * @retval true - success.
     * @retval false - failure.
     */
    bool createTCP(uint8_t mux_id, String addr, uint32_t port);
    
    /**
     * Release TCP connection in multiple mode. 
     * 
     * @param mux_id - the identifier of this TCP(available value: 0 - 4). 
     * @retval true - success.
     * @retval false - failure.
     */
    bool releaseTCP(uint8_t mux_id);
    
    /**
     * Register UDP port number in multiple mode.
     * 
     * @param mux_id - the identifier of this TCP(available value: 0 - 4). 
     * @param addr - the IP or domain name of the target host. 
     * @param port - the port number of the target host. 
     * @retval true - success.
     * @retval false - failure.
     */
    bool registerUDP(uint8_t mux_id, String addr, uint32_t port);
    
    /**
     * Unregister UDP port number in multiple mode. 
     * 
     * @param mux_id - the identifier of this TCP(available value: 0 - 4). 
     * @retval true - success.
     * @retval false - failure.
     */
    bool unregisterUDP(uint8_t mux_id);


    /**
     * Set the timeout of TCP Server. 
     * 
     * @param timeout - the duration for timeout by second(0 ~ 28800, default:180). 
     * @retval true - success.
     * @retval false - failure.
     */
    bool setTCPServerTimeout(uint32_t timeout = 180);
    
    /**
     * Start TCP Server(Only in multiple mode). 
     * 
     * After started, user should call method: getIPStatus to know the status of TCP connections. 
     * The methods of receiving data can be called for user's any purpose. After communication, 
     * release the TCP connection is needed by calling method: releaseTCP with mux_id. 
     *
     * @param port - the port number to listen(default: 333).
     * @retval true - success.
     * @retval false - failure.
     *
     * @see String getIPStatus(void);
     * @see uint32_t recv(uint8_t *coming_mux_id, uint8_t *buffer, uint32_t len, uint32_t timeout);
     * @see bool releaseTCP(uint8_t mux_id);
     */
    bool startTCPServer(uint32_t port = 333);

    /**
     * Stop TCP Server(Only in multiple mode). 
     * 
     * @retval true - success.
     * @retval false - failure.
     */
    bool stopTCPServer(void);
    
    /**
     * Start Server(Only in multiple mode). 
     * 
     * @param port - the port number to listen(default: 333).
     * @retval true - success.
     * @retval false - failure.
     *
     * @see String getIPStatus(void);
     * @see uint32_t recv(uint8_t *coming_mux_id, uint8_t *buffer, uint32_t len, uint32_t timeout);
     */
    bool startServer(uint32_t port = 333);

    /**
     * Stop Server(Only in multiple mode). 
     * 
     * @retval true - success.
     * @retval false - failure.
     */
    bool stopServer(void);
	
	/**
     * 在多链接状态下向TCP或UDP链接0 发生一个字节。
     * 用途：主要作用wifi发生数据print、println
     * 说明：速度较慢。	 
     */
	size_t write(uint8_t c) {
		char data[1] = {0};
		data[0] = c;
		return send(0, data, 1);
		}
		
	bool setCIPMODE(uint8_t mode);
	bool startSend();

    /**
     * Send data based on TCP or UDP builded already in single mode. 
     * 
     * @param buffer - the buffer of data to send. 
     * @param len - the length of data to send. 
     * @retval true - success.
     * @retval false - failure.
     */
    bool send(const uint8_t *buffer, uint32_t len);
            
    /**
     * Send data based on one of TCP or UDP builded already in multiple mode. 
     * 
     * @param mux_id - the identifier of this TCP(available value: 0 - 4). 
     * @param buffer - the buffer of data to send. 
     * @param len - the length of data to send. 
     * @retval true - success.
     * @retval false - failure.
     */
    bool send(uint8_t mux_id, const uint8_t *buffer, uint32_t len);
    
    /**
     * Receive data from TCP or UDP builded already in single mode. 
     *
     * @param buffer - the buffer for storing data. 
     * @param buffer_size - the length of the buffer. 
     * @param timeout - the time waiting data. 
     * @return the length of data received actually. 
     */
    uint32_t recv(uint8_t *buffer, uint32_t buffer_size, uint32_t timeout = 1000);
    
    /**
     * Receive data from one of TCP or UDP builded already in multiple mode. 
     *
     * @param mux_id - the identifier of this TCP(available value: 0 - 4). 
     * @param buffer - the buffer for storing data. 
     * @param buffer_size - the length of the buffer. 
     * @param timeout - the time waiting data. 
     * @return the length of data received actually. 
     */
    uint32_t recv(uint8_t mux_id, uint8_t *buffer, uint32_t buffer_size, uint32_t timeout = 1000);
    
    /**
     * Receive data from all of TCP or UDP builded already in multiple mode. 
     *
     * After return, coming_mux_id store the id of TCP or UDP from which data coming. 
     * User should read the value of coming_mux_id and decide what next to do. 
     * 
     * @param coming_mux_id - the identifier of TCP or UDP. 
     * @param buffer - the buffer for storing data. 
     * @param buffer_size - the length of the buffer. 
     * @param timeout - the time waiting data. 
     * @return the length of data received actually. 
     */
    uint32_t recv(uint8_t *coming_mux_id, uint8_t *buffer, uint32_t buffer_size, uint32_t timeout = 1000);

private:

    /* 
     * Empty the buffer or UART RX.
     */
    void rx_empty(void);
 
    /* 
     * Recvive data from uart. Return all received data if target found or timeout. 
     */
    String recvString(String target, uint32_t timeout = 1000);
    
    /* 
     * Recvive data from uart. Return all received data if one of target1 and target2 found or timeout. 
     */
    String recvString(String target1, String target2, uint32_t timeout = 1000);
    
    /* 
     * Recvive data from uart. Return all received data if one of target1, target2 and target3 found or timeout. 
     */
    String recvString(String target1, String target2, String target3, uint32_t timeout = 1000);
    
    /* 
     * Recvive data from uart and search first target. Return true if target found, false for timeout.
     */
    bool recvFind(String target, uint32_t timeout = 1000);
    
    /* 
     * Recvive data from uart and search first target and cut out the substring between begin and end(excluding begin and end self). 
     * Return true if target found, false for timeout.
     */
    bool recvFindAndFilter(String target, String begin, String end, String &data, uint32_t timeout = 1000);
    
    /*
     * Receive a package from uart. 
     *
     * @param buffer - the buffer storing data. 
     * @param buffer_size - guess what!
     * @param data_len - the length of data actually received(maybe more than buffer_size, the remained data will be abandoned).
     * @param timeout - the duration waitting data comming.
     * @param coming_mux_id - in single connection mode, should be NULL and not NULL in multiple. 
     */
    uint32_t recvPkg(uint8_t *buffer, uint32_t buffer_size, uint32_t *data_len, uint32_t timeout, uint8_t *coming_mux_id);
    
    
    bool eAT(void);
    bool eATRST(void);
	bool eATRESTORE(void);
    bool eATGMR(String &version);
	bool sATCIOBAUD(uint32_t baud);
    
    bool qATCWMODE(uint8_t *mode);
    bool sATCWMODE(uint8_t mode);
    bool sATCWJAP(String ssid, String pwd);
    bool sATCWDHCP(uint8_t mode, boolean enabled);
    bool eATCWLAP(String &list);
    bool eATCWQAP(void);
    bool sATCWSAP(String ssid, String pwd, uint8_t chl, uint8_t ecn);
    bool eATCWLIF(String &list);
    
    bool eATCIPSTATUS(String &list);
    bool sATCIPSTARTSingle(String type, String addr, uint32_t port);
    bool sATCIPSTARTMultiple(uint8_t mux_id, String type, String addr, uint32_t port);
	bool sATCIPSEND();
    bool sATCIPSENDSingle(const uint8_t *buffer, uint32_t len);
    bool sATCIPSENDMultiple(uint8_t mux_id, const uint8_t *buffer, uint32_t len);
    bool sATCIPCLOSEMulitple(uint8_t mux_id);
    bool eATCIPCLOSESingle(void);
    bool eATCIFSR(String &list);
    bool sATCIPMUX(uint8_t mode);
    bool sATCIPSERVER(uint8_t mode, uint32_t port = 333);
    bool sATCIPSTO(uint32_t timeout);
	bool sATCIPMODE(uint8_t mode);
    
    /*
     * +IPD,len:data
     * +IPD,id,len:data
     */
    
#ifdef ESP8266_USE_SOFTWARE_SERIAL
    SoftwareSerial *m_puart; /* The UART to communicate with ESP8266 */
#else
    HardwareSerial *m_puart; /* The UART to communicate with ESP8266 */
#endif
};

#endif /* #ifndef __ESP8266_H__ */


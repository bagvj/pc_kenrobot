 /**
 * \著作权 
 * @名称：  Kenblock_APDS9960.h
 * @作者：  SparkFun
 * @版本：  V1.4.2
 * @URL: 	https://github.com/sparkfun/SparkFun_APDS-9960_Sensor_Arduino_Library
 * @维护：  Kenblock
 * @时间：  2017/09/20
 * @描述：  APDS-9960 手势/RGB传感器驱动库。
 *
 * \说明
 *  APDS-9960 手势/RGB传感器驱动库。使用传感器为 Avago APDS-9960。使用I2C 通信，I2C地址：0x39 。
 *
 * \接口
 *	IIC-INT接口。部分应用使用外部中断0（引脚2）。  
 *
 * \常用公有方法列表：
 * 
 * 		1. bool	Kenblock_APDS9960::init() 
 * 		2. bool Kenblock_APDS9960::enableGestureSensor(bool interrupts)
 * 		3. bool Kenblock_APDS9960::isGestureAvailable()
 * 		4. int 	Kenblock_APDS9960::readGesture() 
 *  
 * 		4. bool Kenblock_APDS9960::setProximityGain(uint8_t drive)
 * 		5. bool Kenblock_APDS9960::enableProximitySensor(bool interrupts)
 * 		6. bool Kenblock_APDS9960::readProximity(uint8_t &val)
 *  
 * 		7. bool Kenblock_APDS9960::enableLightSensor(bool interrupts)
 * 		8. bool Kenblock_APDS9960::readAmbientLight(uint16_t &val)
 * 		9. bool Kenblock_APDS9960::readRedLight(uint16_t &val)
 * 		10. bool Kenblock_APDS9960::readGreenLight(uint16_t &val)
 * 		11. bool Kenblock_APDS9960::readBlueLight(uint16_t &val)
 *  
 * 		12. 更多方法参考示例和函数列表。
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/20      1.4.2              做汉化修订注释。
 *  
 * \示例
 *  
 * 		1.GestureTest.ino			//手势识别示例 
 * 		2.ProximityTest.ino			//距离感应器示例 
 * 		3.ColorSensor.ino			//环境光强度和颜色识别示例 
 * 		4.AmbientLightInterrupt.ino	//环境光强、颜色 中断 示例
 * 		5.ProximityInterrupt.ino	//距离感应器 中断 示例
 */
 
#ifndef Kenblock_APDS9960_H
#define Kenblock_APDS9960_H

#include <Arduino.h>

/* 调试 */
#define DEBUG                   0

/* APDS-9960 I2C 地址 */
#define APDS9960_I2C_ADDR       0x39

/* 手势传感器设定参数 */
#define GESTURE_THRESHOLD_OUT   10	//阀值
#define GESTURE_SENSITIVITY_1   50	//灵敏度
#define GESTURE_SENSITIVITY_2   20	//灵敏度

/* 错误返回值 */
#define ERROR                   0xFF

/* 可接受的设备 ID */
#define APDS9960_ID_1           0xAB
#define APDS9960_ID_2           0x9C 

/* Misc 参数 */
#define FIFO_PAUSE_TIME         30  //FIFO连续读取之间的等待时间(ms)

/* APDS-9960 的寄存器地址 */
#define APDS9960_ENABLE         0x80
#define APDS9960_ATIME          0x81
#define APDS9960_WTIME          0x83
#define APDS9960_AILTL          0x84
#define APDS9960_AILTH          0x85
#define APDS9960_AIHTL          0x86
#define APDS9960_AIHTH          0x87
#define APDS9960_PILT           0x89
#define APDS9960_PIHT           0x8B
#define APDS9960_PERS           0x8C
#define APDS9960_CONFIG1        0x8D
#define APDS9960_PPULSE         0x8E
#define APDS9960_CONTROL        0x8F
#define APDS9960_CONFIG2        0x90
#define APDS9960_ID             0x92
#define APDS9960_STATUS         0x93
#define APDS9960_CDATAL         0x94
#define APDS9960_CDATAH         0x95
#define APDS9960_RDATAL         0x96
#define APDS9960_RDATAH         0x97
#define APDS9960_GDATAL         0x98
#define APDS9960_GDATAH         0x99
#define APDS9960_BDATAL         0x9A
#define APDS9960_BDATAH         0x9B
#define APDS9960_PDATA          0x9C
#define APDS9960_POFFSET_UR     0x9D
#define APDS9960_POFFSET_DL     0x9E
#define APDS9960_CONFIG3        0x9F
#define APDS9960_GPENTH         0xA0
#define APDS9960_GEXTH          0xA1
#define APDS9960_GCONF1         0xA2
#define APDS9960_GCONF2         0xA3
#define APDS9960_GOFFSET_U      0xA4
#define APDS9960_GOFFSET_D      0xA5
#define APDS9960_GOFFSET_L      0xA7
#define APDS9960_GOFFSET_R      0xA9
#define APDS9960_GPULSE         0xA6
#define APDS9960_GCONF3         0xAA
#define APDS9960_GCONF4         0xAB
#define APDS9960_GFLVL          0xAE
#define APDS9960_GSTATUS        0xAF
#define APDS9960_IFORCE         0xE4
#define APDS9960_PICLEAR        0xE5
#define APDS9960_CICLEAR        0xE6
#define APDS9960_AICLEAR        0xE7
#define APDS9960_GFIFO_U        0xFC
#define APDS9960_GFIFO_D        0xFD
#define APDS9960_GFIFO_L        0xFE
#define APDS9960_GFIFO_R        0xFF

/* 位字段 */
#define APDS9960_PON            0b00000001
#define APDS9960_AEN            0b00000010
#define APDS9960_PEN            0b00000100
#define APDS9960_WEN            0b00001000
#define APSD9960_AIEN           0b00010000
#define APDS9960_PIEN           0b00100000
#define APDS9960_GEN            0b01000000
#define APDS9960_GVALID         0b00000001

/* On/Off 定义 */
#define OFF                     0
#define ON                      1

/* 用来设置工作模式的参数 */
#define POWER                   0
#define AMBIENT_LIGHT           1
#define PROXIMITY               2
#define WAIT                    3
#define AMBIENT_LIGHT_INT       4
#define PROXIMITY_INT           5
#define GESTURE                 6
#define ALL                     7

/* LED 驱动电流值 */
#define LED_DRIVE_100MA         0
#define LED_DRIVE_50MA          1
#define LED_DRIVE_25MA          2
#define LED_DRIVE_12_5MA        3

/* 接近增益值 (PGAIN)  */
#define PGAIN_1X                0
#define PGAIN_2X                1
#define PGAIN_4X                2
#define PGAIN_8X                3

/* 光敏增益值 (AGAIN)  */
#define AGAIN_1X                0
#define AGAIN_4X                1
#define AGAIN_16X               2
#define AGAIN_64X               3

/* 手势增益值 (GGAIN)  */
#define GGAIN_1X                0
#define GGAIN_2X                1
#define GGAIN_4X                2
#define GGAIN_8X                3

/* LED 升压值 */
#define LED_BOOST_100           0
#define LED_BOOST_150           1
#define LED_BOOST_200           2
#define LED_BOOST_300           3    

/* 手势识别判断等待时间 */
#define GWTIME_0MS              0
#define GWTIME_2_8MS            1
#define GWTIME_5_6MS            2
#define GWTIME_8_4MS            3
#define GWTIME_14_0MS           4
#define GWTIME_22_4MS           5
#define GWTIME_30_8MS           6
#define GWTIME_39_2MS           7

/* 默认值 */
#define DEFAULT_ATIME           219     // 103ms
#define DEFAULT_WTIME           246     // 27ms
#define DEFAULT_PROX_PPULSE     0x87    // 16us, 8 脉冲
#define DEFAULT_GESTURE_PPULSE  0x89    // 16us, 10 脉冲
#define DEFAULT_POFFSET_UR      0       // 0 偏移
#define DEFAULT_POFFSET_DL      0       // 0 偏移
#define DEFAULT_CONFIG1         0x60    // No 12x wait (WTIME) factor
#define DEFAULT_LDRIVE          LED_DRIVE_100MA //0
#define DEFAULT_PGAIN           PGAIN_4X		//2
#define DEFAULT_AGAIN           AGAIN_4X		//1
#define DEFAULT_PILT            0       // 低接近阀值
#define DEFAULT_PIHT            50      // 高接近阀值
#define DEFAULT_AILT            0xFFFF  // 强制中断校准
#define DEFAULT_AIHT            0
#define DEFAULT_PERS            0x11    // 2 consecutive prox or ALS for int.
#define DEFAULT_CONFIG2         0x01    // 没有饱和中断或LED助推  
#define DEFAULT_CONFIG3         0       // 使所有的二极管, 无 SAI
#define DEFAULT_GPENTH          40      // 进入手势识别的阈值
#define DEFAULT_GEXTH           30      // 退出手势识别的阈值    
#define DEFAULT_GCONF1          0x40    // 4 gesture events for int., 1 for exit
#define DEFAULT_GGAIN           GGAIN_4X
#define DEFAULT_GLDRIVE         LED_DRIVE_100MA
#define DEFAULT_GWTIME          GWTIME_2_8MS
#define DEFAULT_GOFFSET         0       // 手势模式没有偏移缩放
#define DEFAULT_GPULSE          0xC9    // 32us, 10 脉冲
#define DEFAULT_GCONF3          0       // 所有的光电二极管在手势时活动
#define DEFAULT_GIEN            0       // 禁用手势中断

/* 手势方向定义 */
enum {
  DIR_NONE,  //0
  DIR_LEFT,
  DIR_RIGHT,
  DIR_UP,
  DIR_DOWN,
  DIR_NEAR,
  DIR_FAR,
  DIR_ALL
};

/* 状态定义 */
enum {
  NA_STATE,
  NEAR_STATE,
  FAR_STATE,
  ALL_STATE
};

/* 手势数据存放 */
typedef struct gesture_data_type {
    uint8_t u_data[32];
    uint8_t d_data[32];
    uint8_t l_data[32];
    uint8_t r_data[32];
    uint8_t index;
    uint8_t total_gestures;
    uint8_t in_threshold;
    uint8_t out_threshold;
} gesture_data_type;

/* APDS9960 Class */
class Kenblock_APDS9960 {
public:

    /* 初始化 */
    Kenblock_APDS9960();
    ~Kenblock_APDS9960();
    bool init();
    uint8_t getMode();
    bool setMode(uint8_t mode, uint8_t enable);
    
    /* APDS-9960的打开和关闭 */
    bool enablePower();
    bool disablePower();
    
    /* 使能或禁用特定传感器 */
    bool enableLightSensor(bool interrupts = false);
    bool disableLightSensor();
    bool enableProximitySensor(bool interrupts = false);
    bool disableProximitySensor();
    bool enableGestureSensor(bool interrupts = true);
    bool disableGestureSensor();
    
    /* LED 驱动电流控制 */
    uint8_t getLEDDrive();
    bool setLEDDrive(uint8_t drive);
    uint8_t getGestureLEDDrive();
    bool setGestureLEDDrive(uint8_t drive);
    
    /* 增益控制 */
    uint8_t getAmbientLightGain();
    bool setAmbientLightGain(uint8_t gain);
    uint8_t getProximityGain();
    bool setProximityGain(uint8_t gain);
    uint8_t getGestureGain();
    bool setGestureGain(uint8_t gain);
    
    /* 获取、设置环境光中断的阀值 */
    bool getLightIntLowThreshold(uint16_t &threshold);
    bool setLightIntLowThreshold(uint16_t threshold);
    bool getLightIntHighThreshold(uint16_t &threshold);
    bool setLightIntHighThreshold(uint16_t threshold);
    
    /* 获取、设置距离传感器中断的阀值 */
    bool getProximityIntLowThreshold(uint8_t &threshold);
    bool setProximityIntLowThreshold(uint8_t threshold);
    bool getProximityIntHighThreshold(uint8_t &threshold);
    bool setProximityIntHighThreshold(uint8_t threshold);
    
    /* 获取、设置中断使能状态 */
    uint8_t getAmbientLightIntEnable();
    bool setAmbientLightIntEnable(uint8_t enable);
    uint8_t getProximityIntEnable();
    bool setProximityIntEnable(uint8_t enable);
    uint8_t getGestureIntEnable();
    bool setGestureIntEnable(uint8_t enable);
    
    /* 清除中断 */
    bool clearAmbientLightInt();
    bool clearProximityInt();
    
    /* 环境光照强度方法 */
    bool readAmbientLight(uint16_t &val);
    bool readRedLight(uint16_t &val);
    bool readGreenLight(uint16_t &val);
    bool readBlueLight(uint16_t &val);
    
    /* 接近传感器的方法 */
    bool readProximity(uint8_t &val);
    
    /* 手势识别的方法 */
    bool isGestureAvailable();
    int readGesture();
    
private:

    /* 手势处理 */
    void resetGestureParameters();
    bool processGestureData();
    bool decodeGesture();

    /* 接近中断阈值 */
    uint8_t getProxIntLowThresh();
    bool setProxIntLowThresh(uint8_t threshold);
    uint8_t getProxIntHighThresh();
    bool setProxIntHighThresh(uint8_t threshold);
    
    /* LED 升压控制 */
    uint8_t getLEDBoost();
    bool setLEDBoost(uint8_t boost);
    
    /* 接近光电二极管选择 */
    uint8_t getProxGainCompEnable();
    bool setProxGainCompEnable(uint8_t enable);
    uint8_t getProxPhotoMask();
    bool setProxPhotoMask(uint8_t mask);
    
    /* 手势阈值控制 */
    uint8_t getGestureEnterThresh();
    bool setGestureEnterThresh(uint8_t threshold);
    uint8_t getGestureExitThresh();
    bool setGestureExitThresh(uint8_t threshold);
    
    /* 手势 LED, 增益, 时间控制 */
    uint8_t getGestureWaitTime();
    bool setGestureWaitTime(uint8_t time);
    
    /* 手势模式 */
    uint8_t getGestureMode();
    bool setGestureMode(uint8_t mode);

    /* I2C 数据读取命令 */
    bool wireWriteByte(uint8_t val);
    bool wireWriteDataByte(uint8_t reg, uint8_t val);
    bool wireWriteDataBlock(uint8_t reg, uint8_t *val, unsigned int len);
    bool wireReadDataByte(uint8_t reg, uint8_t &val);
    int wireReadDataBlock(uint8_t reg, uint8_t *val, unsigned int len);

    /* 私有成员 */
    gesture_data_type gesture_data_;
    int gesture_ud_delta_;
    int gesture_lr_delta_;
    int gesture_ud_count_;
    int gesture_lr_count_;
    int gesture_near_count_;
    int gesture_far_count_;
    int gesture_state_;
    int gesture_motion_;
};

#endif //Kenblock_APDS9960_H
 /**
 * \著作权 
 * @名称：  Kenblock_APDS9960.cpp
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

 #include <Arduino.h>
 #include <Wire.h>
 
 #include "Kenblock_APDS9960.h"
 
/**
 * \函数：Kenblock_APDS9960()
 * \说明：实例化Kenblock_APDS9960对象，对私有成员变量赋值
 * \输入参数：无
 * \输出参数：无
 * \返回值：  无
 * \其他：    无
 */ 
Kenblock_APDS9960::Kenblock_APDS9960()
{
    gesture_ud_delta_ = 0;
    gesture_lr_delta_ = 0;
    
    gesture_ud_count_ = 0;
    gesture_lr_count_ = 0;
    
    gesture_near_count_ = 0;
    gesture_far_count_ = 0;
    
    gesture_state_ = 0;
    gesture_motion_ = DIR_NONE;
}
 
/**
 * \函数：~Kenblock_APDS9960
 * \说明：初始化，不做任何操作，加~为了和Kenblock_APDS9960区分
 * \输入参数：无
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */ 
Kenblock_APDS9960::~Kenblock_APDS9960()
{

}

/**
 * \函数：init
 * \说明：初始化iic，并将相关寄存器的值设为默认值
 * \输入参数：无	
 * \输出参数：无
 * \返回值：  
 *   	ture - 设置成功； false - 设置失败
 * \其他：    无
 */
bool Kenblock_APDS9960::init()
{
    uint8_t id;

    /* 初始化 I2C */
    Wire.begin();
     
    /* 从ID寄存器（0x92）读取值并与APDS-9960的设备ID核对（0xab，0x9c） */
    if( !wireReadDataByte(APDS9960_ID, id) ) {
        return false;
    }
    if( !(id == APDS9960_ID_1 || id == APDS9960_ID_2) ) {
        return false;
    }
     
    /* 设置使能寄存器的值为0（禁用所有功能） */
    if( !setMode(ALL, OFF) ) {
        return false;
    }
    
    /* 设置环境光和接近寄存器的默认值 */
    if( !wireWriteDataByte(APDS9960_ATIME, DEFAULT_ATIME) ) {
        return false;
    }
    if( !wireWriteDataByte(APDS9960_WTIME, DEFAULT_WTIME) ) {
        return false;
    }
    if( !wireWriteDataByte(APDS9960_PPULSE, DEFAULT_PROX_PPULSE) ) {
        return false;
    }
    if( !wireWriteDataByte(APDS9960_POFFSET_UR, DEFAULT_POFFSET_UR) ) {
        return false;
    }
    if( !wireWriteDataByte(APDS9960_POFFSET_DL, DEFAULT_POFFSET_DL) ) {
        return false;
    }
    if( !wireWriteDataByte(APDS9960_CONFIG1, DEFAULT_CONFIG1) ) {
        return false;
    }
    if( !setLEDDrive(DEFAULT_LDRIVE) ) {
        return false;
    }
    if( !setProximityGain(DEFAULT_PGAIN) ) {
        return false;
    }
    if( !setAmbientLightGain(DEFAULT_AGAIN) ) {
        return false;
    }
    if( !setProxIntLowThresh(DEFAULT_PILT) ) {
        return false;
    }
    if( !setProxIntHighThresh(DEFAULT_PIHT) ) {
        return false;
    }
    if( !setLightIntLowThreshold(DEFAULT_AILT) ) {
        return false;
    }
    if( !setLightIntHighThreshold(DEFAULT_AIHT) ) {
        return false;
    }
    if( !wireWriteDataByte(APDS9960_PERS, DEFAULT_PERS) ) {
        return false;
    }
    if( !wireWriteDataByte(APDS9960_CONFIG2, DEFAULT_CONFIG2) ) {
        return false;
    }
    if( !wireWriteDataByte(APDS9960_CONFIG3, DEFAULT_CONFIG3) ) {
        return false;
    }
    
    /* 设置手势感知寄存器的默认值 */
    if( !setGestureEnterThresh(DEFAULT_GPENTH) ) {
        return false;
    }
    if( !setGestureExitThresh(DEFAULT_GEXTH) ) {
        return false;
    }
    if( !wireWriteDataByte(APDS9960_GCONF1, DEFAULT_GCONF1) ) {
        return false;
    }
    if( !setGestureGain(DEFAULT_GGAIN) ) {
        return false;
    }
    if( !setGestureLEDDrive(DEFAULT_GLDRIVE) ) {
        return false;
    }
    if( !setGestureWaitTime(DEFAULT_GWTIME) ) {
        return false;
    }
    if( !wireWriteDataByte(APDS9960_GOFFSET_U, DEFAULT_GOFFSET) ) {
        return false;
    }
    if( !wireWriteDataByte(APDS9960_GOFFSET_D, DEFAULT_GOFFSET) ) {
        return false;
    }
    if( !wireWriteDataByte(APDS9960_GOFFSET_L, DEFAULT_GOFFSET) ) {
        return false;
    }
    if( !wireWriteDataByte(APDS9960_GOFFSET_R, DEFAULT_GOFFSET) ) {
        return false;
    }
    if( !wireWriteDataByte(APDS9960_GPULSE, DEFAULT_GPULSE) ) {
        return false;
    }
    if( !wireWriteDataByte(APDS9960_GCONF3, DEFAULT_GCONF3) ) {
        return false;
    }
    if( !setGestureIntEnable(DEFAULT_GIEN) ) {
        return false;
    }
    
#if 0
    /* Gesture config register dump */
    uint8_t reg;
    uint8_t val;
  
    for(reg = 0x80; reg <= 0xAF; reg++) {
        if( (reg != 0x82) && \
            (reg != 0x8A) && \
            (reg != 0x91) && \
            (reg != 0xA8) && \
            (reg != 0xAC) && \
            (reg != 0xAD) )
        {
            wireReadDataByte(reg, val);
            Serial.print(reg, HEX);
            Serial.print(": 0x");
            Serial.println(val, HEX);
        }
    }

    for(reg = 0xE4; reg <= 0xE7; reg++) {
        wireReadDataByte(reg, val);
        Serial.print(reg, HEX);
        Serial.print(": 0x");
        Serial.println(val, HEX);
    }
#endif

    return true;
}

/*******************************************************************************
 * Public methods for controlling the APDS-9960
 ******************************************************************************/

/**
 * \函数：getMode
 * \说明：读取并返回ENABLE寄存器的值
 * \输入参数：无	
 * \输出参数：无
 * \返回值：  
 *		enable_value - 寄存器的值； ERROR - 0xFF
 * \其他：    无  	
 */ 
uint8_t Kenblock_APDS9960::getMode()
{
    uint8_t enable_value;
    
    /* 从ENABLE寄存器（0x80）读取值 */
    if( !wireReadDataByte(APDS9960_ENABLE, enable_value) ) {
        return ERROR;
    }
    
    return enable_value;
}

 /**
 * \函数：setMode
 * \说明：使能或失能APDS9960
 * \输入参数：
 *   	mode - 选择模式
 *		enable - 使能或失能
 * \输出参数：无
 * \返回值：  
 *  	true - 设置成功；false - 设置失败
 * \其他：    无
 */
bool Kenblock_APDS9960::setMode(uint8_t mode, uint8_t enable)
{
    uint8_t reg_val;

    /* 从ENABLE寄存器（0x80）读取值 */
    reg_val = getMode();
    if( reg_val == ERROR ) {
        return false;
    }
    
    /* 改变要写入 ENABLE 寄存器的变量的值 */
    enable = enable & 0x01;
    if( mode >= 0 && mode <= 6 ) {
        if (enable) {
            reg_val |= (1 << mode);
        } else {
            reg_val &= ~(1 << mode);
        }
    } else if( mode == ALL ) {
        if (enable) {
            reg_val = 0x7F;
        } else {
            reg_val = 0x00;
        }
    }
        
    /* 将值写入ENABLE寄存器 */
    if( !wireWriteDataByte(APDS9960_ENABLE, reg_val) ) {
        return false;
    }
        
    return true;
}

 /**
 * \函数：enableLightSensor
 * \说明：使能RGB光传感器
 * \输入参数：
 *   	interrupts - 中断开关
 * \输出参数：无
 * \返回值：  
 *  	true - 设置成功；false - 设置失败
 * \其他：    无
 */ 
bool Kenblock_APDS9960::enableLightSensor(bool interrupts)
{
    
    /* 设置默认的增益，中断，启用电源，并使能传感器 */
    if( !setAmbientLightGain(DEFAULT_AGAIN) ) {
        return false;
    }
    if( interrupts ) {
        if( !setAmbientLightIntEnable(1) ) {
            return false;
        }
    } else {
        if( !setAmbientLightIntEnable(0) ) {
            return false;
        }
    }
    if( !enablePower() ){
        return false;
    }
    if( !setMode(AMBIENT_LIGHT, 1) ) {
        return false;
    }
    
    return true;

}

 /**
 * \函数：disableLightSensor
 * \说明：失能RGB光传感器
 * \输入参数：无
 * \输出参数：无
 * \返回值：  
 *  	true - 设置成功；false - 设置失败
 * \其他：    无
 */
bool Kenblock_APDS9960::disableLightSensor()
{
    if( !setAmbientLightIntEnable(0) ) {
        return false;
    }
    if( !setMode(AMBIENT_LIGHT, 0) ) {
        return false;
    }
    
    return true;
}

/**
 * \函数：enableProximitySensor
 * \说明：使能距离传感器
 * \输入参数：
 *   	interrupts - 中断开关
 * \输出参数：无
 * \返回值：  
 *  	true - 设置成功；false - 设置失败
 * \其他：    无
 */ 
bool Kenblock_APDS9960::enableProximitySensor(bool interrupts)
{
    /* 设置默认的增益，LED，中断，启用电源，并使能传感器 */
    if( !setProximityGain(DEFAULT_PGAIN) ) {
        return false;
    }
    if( !setLEDDrive(DEFAULT_LDRIVE) ) {
        return false;
    }
    if( interrupts ) {
        if( !setProximityIntEnable(1) ) {
            return false;
        }
    } else {
        if( !setProximityIntEnable(0) ) {
            return false;
        }
    }
    if( !enablePower() ){
        return false;
    }
    if( !setMode(PROXIMITY, 1) ) {
        return false;
    }
    
    return true;
}
/**
 * \函数：disableProximitySensor
 * \说明：禁用距离传感器
 * \输入参数：无
 * \输出参数：无
 * \返回值：  
 *  	true - 设置成功；false - 设置失败
 * \其他：    无
 */ 
bool Kenblock_APDS9960::disableProximitySensor()
{
	if( !setProximityIntEnable(0) ) {
		return false;
	}
	if( !setMode(PROXIMITY, 0) ) {
		return false;
	}

	return true;
}

 /**
 * \函数：enableGestureSensor
 * \说明：使能手势识别传感器
 * \输入参数：
 *   	interrupts - 中断开关
 * \输出参数：无
 * \返回值：  
 *  	true - 设置成功；false - 设置失败
 * \其他：    无
 */ 
bool Kenblock_APDS9960::enableGestureSensor(bool interrupts)
{
    
    /* 启用姿势模式
       设置 ENABLE 为 0 (power off)
       设置 WTIME 为 0xFF
       设置 AUX 为 LED_BOOST_300
       使能 ENABLE寄存器中PON, WEN, PEN, GEN
    */
    resetGestureParameters();
    if( !wireWriteDataByte(APDS9960_WTIME, 0xFF) ) {
        return false;
    }
    if( !wireWriteDataByte(APDS9960_PPULSE, DEFAULT_GESTURE_PPULSE) ) {
        return false;
    }
    if( !setLEDBoost(LED_BOOST_300) ) {
        return false;
    }
    if( interrupts ) {
        if( !setGestureIntEnable(1) ) {
            return false;
        }
    } else {
        if( !setGestureIntEnable(0) ) {
            return false;
        }
    }
    if( !setGestureMode(1) ) {
        return false;
    }
    if( !enablePower() ){
        return false;
    }
    if( !setMode(WAIT, 1) ) {
        return false;
    }
    if( !setMode(PROXIMITY, 1) ) {
        return false;
    }
    if( !setMode(GESTURE, 1) ) {
        return false;
    }
    
    return true;
}

 /**
 * \函数：disableGestureSensor
 * \说明：失能手势识别传感器
 * \输入参数：无
 * \输出参数：无
 * \返回值：  
 *  	true - 设置成功；false - 设置失败
 * \其他：    无
 */ 
bool Kenblock_APDS9960::disableGestureSensor()
{
    resetGestureParameters();
    if( !setGestureIntEnable(0) ) {
        return false;
    }
    if( !setGestureMode(0) ) {
        return false;
    }
    if( !setMode(GESTURE, 0) ) {
        return false;
    }
    
    return true;
}

 /**
 * \函数：isGestureAvailable
 * \说明：判断是否有无手势可供识别
 * \输入参数：无	
 * \输出参数：
 *		val - 0和1
 * \返回值：  
 *		true - 有；false - 无
 * \其他：    无  
 *   
 */	
bool Kenblock_APDS9960::isGestureAvailable()
{
    uint8_t val;
    
    /* 从GSTATUS寄存器（0xAF）读取数据 */
    if( !wireReadDataByte(APDS9960_GSTATUS, val) ) {
        return ERROR;
    }
    
    /* 移动并屏蔽 GVALID 位 */
    val &= APDS9960_GVALID;
    
    /* Return true/false based on GVALID bit */
    if( val == 1) {
        return true;
    } else {
        return false;
    }
}


 /**
 * \函数：readGesture
 * \说明：手势识别的处理过程，并返回手势判断的最佳值
 * \输入参数：无	
 * \输出参数：无
 * \返回值：  
 *		motion：手势对应的值， -1 - 识别错误
 * \其他：    无  
 *   
 */	
int Kenblock_APDS9960::readGesture()
{
    uint8_t fifo_level = 0;
    uint8_t bytes_read = 0;
    uint8_t fifo_data[128];
    uint8_t gstatus;
    int motion;
    int i;
    
    /* 确保电源和手势上的数据是有效的 */
    if( !isGestureAvailable() || !(getMode() & 0b01000001) ) {
        return DIR_NONE;
    }
    
    /* 保持循环，只要手势数据有效 */
    while(1) {
    
        /* 等一段时间收集下一批FIFO数据 */
        delay(FIFO_PAUSE_TIME);
        
        /* 获取状态寄存器的内容。数据仍然有效吗? */
        if( !wireReadDataByte(APDS9960_GSTATUS, gstatus) ) {
            return ERROR;
        }
        
        /* 如果有有效数据，读取FIFO */
        if( (gstatus & APDS9960_GVALID) == APDS9960_GVALID ) {
        
            /* 读取当前的FIFO级别 */
            if( !wireReadDataByte(APDS9960_GFLVL, fifo_level) ) {
                return ERROR;
            }

#if DEBUG
            Serial.print("FIFO Level: ");
            Serial.println(fifo_level);
#endif

            /* 如果在FIFO中有数据，把它读入我们的数据块 */
            if( fifo_level > 0) {
                bytes_read = wireReadDataBlock(  APDS9960_GFIFO_U, 
                                                (uint8_t*)fifo_data, 
                                                (fifo_level * 4) );
                if( bytes_read == -1 ) {
                    return ERROR;
                }
#if DEBUG
                Serial.print("FIFO Dump: ");
                for ( i = 0; i < bytes_read; i++ ) {
                    Serial.print(fifo_data[i]);
                    Serial.print(" ");
                }
                Serial.println();
#endif

                /* 如果至少有一组数据，将数据排序为U /D/L/R */
                if( bytes_read >= 4 ) {
                    for( i = 0; i < bytes_read; i += 4 ) {
                        gesture_data_.u_data[gesture_data_.index] = \
                                                            fifo_data[i + 0];
                        gesture_data_.d_data[gesture_data_.index] = \
                                                            fifo_data[i + 1];
                        gesture_data_.l_data[gesture_data_.index] = \
                                                            fifo_data[i + 2];
                        gesture_data_.r_data[gesture_data_.index] = \
                                                            fifo_data[i + 3];
                        gesture_data_.index++;
                        gesture_data_.total_gestures++;
                    }
                    
#if DEBUG
                Serial.print("Up Data: ");
                for ( i = 0; i < gesture_data_.total_gestures; i++ ) {
                    Serial.print(gesture_data_.u_data[i]);
                    Serial.print(" ");
                }
                Serial.println();
#endif

                    /* 过滤和处理手势数据。解码近/远的状态 */
                    if( processGestureData() ) {
                        if( decodeGesture() ) {
                            //***TODO: U-Turn 手势
#if DEBUG
                            //Serial.println(gesture_motion_);
#endif
                        }
                    }
                    
                    /* 重置数据 */
                    gesture_data_.index = 0;
                    gesture_data_.total_gestures = 0;
                }
            }
        } else {
    
            /* 判决最佳手势，然后清除 */
            delay(FIFO_PAUSE_TIME);
            decodeGesture();
            motion = gesture_motion_;
#if DEBUG
            Serial.print("END: ");
            Serial.println(gesture_motion_);
#endif
            resetGestureParameters();
            return motion;
        }
    }
}

 /**
 * \函数：enablePower
 * \说明：使能APDS9960供电
 * \输入参数：无
 * \输出参数：无
 * \返回值：  
 *  	true - 设置成功；false - 设置失败
 * \其他：    无
 */ 
bool Kenblock_APDS9960::enablePower()
{
    if( !setMode(POWER, 1) ) {
        return false;
    }
    
    return true;
}
 /**
 * \函数：disablePower
 * \说明：禁用APDS9960供电
 * \输入参数：无
 * \输出参数：无
 * \返回值：  
 *  	true - 设置成功；false - 设置失败
 * \其他：    无
 */
bool Kenblock_APDS9960::disablePower()
{
    if( !setMode(POWER, 0) ) {
        return false;
    }
    
    return true;
}

/*******************************************************************************
 * 环境光和颜色传感器控制
 ******************************************************************************/

/**
 * \函数：readAmbientLight
 * \说明：读取当前环境的光照强度，16位
 * \输入参数：无	
 * \输出参数：
 *		val - 光照强度解析值
 * \返回值：  
 *		true - 读取成功；false - 读取失败
 * \其他：    无  
 *   
 */
bool Kenblock_APDS9960::readAmbientLight(uint16_t &val)
{
    uint8_t val_byte;
    val = 0;
    
    /* 从CDATAL寄存器（0x94）读取数据，读两次，先读低8位，再读高8位 */
    if( !wireReadDataByte(APDS9960_CDATAL, val_byte) ) {
        return false;
    }
    val = val_byte;
    
    /* 从CDATAH寄存器（0x95）读取数据，高8位 */
    if( !wireReadDataByte(APDS9960_CDATAH, val_byte) ) {
        return false;
    }
    val = val + ((uint16_t)val_byte << 8);
    
    return true;
}
 /**
 * \函数：readRedLight
 * \说明：读取当前环境的红光强度，16位
 * \输入参数：无	
 * \输出参数：
 *		val - 红光强度解析值
 * \返回值：  
 *		true - 读取成功；false - 读取失败
 * \其他：    无  
 *   
 */
bool Kenblock_APDS9960::readRedLight(uint16_t &val)
{
    uint8_t val_byte;
    val = 0;
    
    /* 从RDATAL寄存器（0x96）读取数据，读两次，先读低8位，再读高8位 */
    if( !wireReadDataByte(APDS9960_RDATAL, val_byte) ) {
        return false;
    }
    val = val_byte;
    
    /* 从RDATAH寄存器（0x97）读取数据，高8位 */
    if( !wireReadDataByte(APDS9960_RDATAH, val_byte) ) {
        return false;
    }
    val = val + ((uint16_t)val_byte << 8);
    
    return true;
}
 
 /**
 * \函数：readGreenLight
 * \说明：读取当前环境的绿光强度，16位
 * \输入参数：无	
 * \输出参数：
 *		val - 绿光强度解析值
 * \返回值：  
 *		true - 读取成功；false - 读取失败
 * \其他：    无  
 *   
 */	
bool Kenblock_APDS9960::readGreenLight(uint16_t &val)
{
    uint8_t val_byte;
    val = 0;
    
    /* 从GDATAL寄存器（0x98）读取数据，读两次，先读低8位，再读高8位 */
    if( !wireReadDataByte(APDS9960_GDATAL, val_byte) ) {
        return false;
    }
    val = val_byte;
    
    /* 从GDATAH寄存器（0x99）读取数据，高8位 */
    if( !wireReadDataByte(APDS9960_GDATAH, val_byte) ) {
        return false;
    }
    val = val + ((uint16_t)val_byte << 8);
    
    return true;
}

 /**
 * \函数：readBlueLight
 * \说明：读取当前环境的蓝光强度，16位
 * \输入参数：无	
 * \输出参数：
 *		val - 蓝光强度解析值
 * \返回值：  
 *		true - 读取成功；false - 读取失败
 * \其他：    无  
 *   
 */
bool Kenblock_APDS9960::readBlueLight(uint16_t &val)
{
    uint8_t val_byte;
    val = 0;
    
    /* 从BDATAL寄存器（0x9A）读取数据，读两次，先读低8位，再读高8位 */
    if( !wireReadDataByte(APDS9960_BDATAL, val_byte) ) {
        return false;
    }
    val = val_byte;
    
    /* 从BDATAH寄存器（0x9B）读取数据，高8位 */
    if( !wireReadDataByte(APDS9960_BDATAH, val_byte) ) {
        return false;
    }
    val = val + ((uint16_t)val_byte << 8);
    
    return true;
}

/*******************************************************************************
 * 接近传感器控制
 ******************************************************************************/

 /**
 * \函数：readProximity
 * \说明：读取距离，8位
 * \输入参数：无	
 * \输出参数：
 *		val - 距离值
 * \返回值：  
 *		true - 读取成功；false - 读取失败
 * \其他：    无  
 *   
 */
bool Kenblock_APDS9960::readProximity(uint8_t &val)
{
    val = 0;
    
    /* /从接近传感器PDATA寄存器（0x9C）读取数据  */
    if( !wireReadDataByte(APDS9960_PDATA, val) ) {
        return false;
    }
    
    return true;
}

/*******************************************************************************
 * 高级手势控制
 ******************************************************************************/

/**
 * 说明：重置手势数据成员中的所有参数
 */
void Kenblock_APDS9960::resetGestureParameters()
{
    gesture_data_.index = 0;
    gesture_data_.total_gestures = 0;
    
    gesture_ud_delta_ = 0;
    gesture_lr_delta_ = 0;
    
    gesture_ud_count_ = 0;
    gesture_lr_count_ = 0;
    
    gesture_near_count_ = 0;
    gesture_far_count_ = 0;
    
    gesture_state_ = 0;
    gesture_motion_ = DIR_NONE;
}

/**
 * 说明：处理原始的手势数据以确定手势（方向、远离/接近）
 * 返回：如果为有效手势返回真，否则返回假.
 */
bool Kenblock_APDS9960::processGestureData()
{
    uint8_t u_first = 0;
    uint8_t d_first = 0;
    uint8_t l_first = 0;
    uint8_t r_first = 0;
    uint8_t u_last = 0;
    uint8_t d_last = 0;
    uint8_t l_last = 0;
    uint8_t r_last = 0;
    int ud_ratio_first;
    int lr_ratio_first;
    int ud_ratio_last;
    int lr_ratio_last;
    int ud_delta;
    int lr_delta;
    int i;

    /* 如果少于4种手势，是不够的 */
    if( gesture_data_.total_gestures <= 4 ) {
        return false;
    }
    
    /* 确保数据不会超出范围 */
    if( (gesture_data_.total_gestures <= 32) && \
        (gesture_data_.total_gestures > 0) ) {
        
        /* 在阀值内查找 U/D/L/R_first 数据 */
        for( i = 0; i < gesture_data_.total_gestures; i++ ) {
            if( (gesture_data_.u_data[i] > GESTURE_THRESHOLD_OUT) &&
                (gesture_data_.d_data[i] > GESTURE_THRESHOLD_OUT) &&
                (gesture_data_.l_data[i] > GESTURE_THRESHOLD_OUT) &&
                (gesture_data_.r_data[i] > GESTURE_THRESHOLD_OUT) ) {
                
                u_first = gesture_data_.u_data[i];
                d_first = gesture_data_.d_data[i];
                l_first = gesture_data_.l_data[i];
                r_first = gesture_data_.r_data[i];
                break;
            }
        }
        
        /* 如果 _first数据是0，那就没有更好的数据了 */
        if( (u_first == 0) || (d_first == 0) || \
            (l_first == 0) || (r_first == 0) ) {
            
            return false;
        }
        /* 在U/D/L/R阀值内查找最后一个数据 */
        for( i = gesture_data_.total_gestures - 1; i >= 0; i-- ) {
#if DEBUG
            Serial.print(F("Finding last: "));
            Serial.print(F("U:"));
            Serial.print(gesture_data_.u_data[i]);
            Serial.print(F(" D:"));
            Serial.print(gesture_data_.d_data[i]);
            Serial.print(F(" L:"));
            Serial.print(gesture_data_.l_data[i]);
            Serial.print(F(" R:"));
            Serial.println(gesture_data_.r_data[i]);
#endif
            if( (gesture_data_.u_data[i] > GESTURE_THRESHOLD_OUT) &&
                (gesture_data_.d_data[i] > GESTURE_THRESHOLD_OUT) &&
                (gesture_data_.l_data[i] > GESTURE_THRESHOLD_OUT) &&
                (gesture_data_.r_data[i] > GESTURE_THRESHOLD_OUT) ) {
                
                u_last = gesture_data_.u_data[i];
                d_last = gesture_data_.d_data[i];
                l_last = gesture_data_.l_data[i];
                r_last = gesture_data_.r_data[i];
                break;
            }
        }
    }
    /* 确保我们不除以0 */
	if( ((u_first + d_first) == 0) ||
		((l_first + r_first) == 0) ||
		((u_last + d_last) == 0) ||
		((l_last + r_last) == 0) ) {

		return false;
	}
    /* 计算第一个和最后一个比例的上/下和左/右 */
    ud_ratio_first = ((u_first - d_first) * 100) / (u_first + d_first);
    lr_ratio_first = ((l_first - r_first) * 100) / (l_first + r_first);
    ud_ratio_last = ((u_last - d_last) * 100) / (u_last + d_last);
    lr_ratio_last = ((l_last - r_last) * 100) / (l_last + r_last);
       
#if DEBUG
    Serial.print(F("Last Values: "));
    Serial.print(F("U:"));
    Serial.print(u_last);
    Serial.print(F(" D:"));
    Serial.print(d_last);
    Serial.print(F(" L:"));
    Serial.print(l_last);
    Serial.print(F(" R:"));
    Serial.println(r_last);

    Serial.print(F("Ratios: "));
    Serial.print(F("UD Fi: "));
    Serial.print(ud_ratio_first);
    Serial.print(F(" UD La: "));
    Serial.print(ud_ratio_last);
    Serial.print(F(" LR Fi: "));
    Serial.print(lr_ratio_first);
    Serial.print(F(" LR La: "));
    Serial.println(lr_ratio_last);
#endif
       
    /* 确定第一个和最后一个比率之间的差异 */
    ud_delta = ud_ratio_last - ud_ratio_first;
    lr_delta = lr_ratio_last - lr_ratio_first;
    
#if DEBUG
    Serial.print("Deltas: ");
    Serial.print("UD: ");
    Serial.print(ud_delta);
    Serial.print(" LR: ");
    Serial.println(lr_delta);
#endif

    /* 积累UD和LR的值 */
    gesture_ud_delta_ += ud_delta;
    gesture_lr_delta_ += lr_delta;
    
#if DEBUG
    Serial.print("Accumulations: ");
    Serial.print("UD: ");
    Serial.print(gesture_ud_delta_);
    Serial.print(" LR: ");
    Serial.println(gesture_lr_delta_);
#endif
    
    /* 确定U / D手势 */
    if( gesture_ud_delta_ >= GESTURE_SENSITIVITY_1 ) {
        gesture_ud_count_ = 1;
    } else if( gesture_ud_delta_ <= -GESTURE_SENSITIVITY_1 ) {
        gesture_ud_count_ = -1;
    } else {
        gesture_ud_count_ = 0;
    }
    
    /* 确定L / R手势 */
    if( gesture_lr_delta_ >= GESTURE_SENSITIVITY_1 ) {
        gesture_lr_count_ = 1;
    } else if( gesture_lr_delta_ <= -GESTURE_SENSITIVITY_1 ) {
        gesture_lr_count_ = -1;
    } else {
        gesture_lr_count_ = 0;
    }
    
    /* 确定 近/远 手势 */
    if( (gesture_ud_count_ == 0) && (gesture_lr_count_ == 0) ) {
        if( (abs(ud_delta) < GESTURE_SENSITIVITY_2) && \
            (abs(lr_delta) < GESTURE_SENSITIVITY_2) ) {
            
            if( (ud_delta == 0) && (lr_delta == 0) ) {
                gesture_near_count_++;
            } else if( (ud_delta != 0) || (lr_delta != 0) ) {
                gesture_far_count_++;
            }
            
            if( (gesture_near_count_ >= 10) && (gesture_far_count_ >= 2) ) {
                if( (ud_delta == 0) && (lr_delta == 0) ) {
                    gesture_state_ = NEAR_STATE;
                } else if( (ud_delta != 0) && (lr_delta != 0) ) {
                    gesture_state_ = FAR_STATE;
                }
                return true;
            }
        }
    } else {
        if( (abs(ud_delta) < GESTURE_SENSITIVITY_2) && \
            (abs(lr_delta) < GESTURE_SENSITIVITY_2) ) {
                
            if( (ud_delta == 0) && (lr_delta == 0) ) {
                gesture_near_count_++;
            }
            
            if( gesture_near_count_ >= 10 ) {
                gesture_ud_count_ = 0;
                gesture_lr_count_ = 0;
                gesture_ud_delta_ = 0;
                gesture_lr_delta_ = 0;
            }
        }
    }
    
#if DEBUG
    Serial.print("UD_CT: ");
    Serial.print(gesture_ud_count_);
    Serial.print(" LR_CT: ");
    Serial.print(gesture_lr_count_);
    Serial.print(" NEAR_CT: ");
    Serial.print(gesture_near_count_);
    Serial.print(" FAR_CT: ");
    Serial.println(gesture_far_count_);
    Serial.println("----------");
#endif
    
    return false;
}

/**
 * 说明：解析手势（方向、远离/接近）
 * 返回：如果为有效手势返回真，否则返回假.
 */
bool Kenblock_APDS9960::decodeGesture()
{
    /* 如果检测到接近或远的事件，返回 */
    if( gesture_state_ == NEAR_STATE ) {
        gesture_motion_ = DIR_NEAR;
        return true;
    } else if ( gesture_state_ == FAR_STATE ) {
        gesture_motion_ = DIR_FAR;
        return true;
    }
    
    /* 确定滑动方向 */
    if( (gesture_ud_count_ == -1) && (gesture_lr_count_ == 0) ) {
        gesture_motion_ = DIR_UP;
    } else if( (gesture_ud_count_ == 1) && (gesture_lr_count_ == 0) ) {
        gesture_motion_ = DIR_DOWN;
    } else if( (gesture_ud_count_ == 0) && (gesture_lr_count_ == 1) ) {
        gesture_motion_ = DIR_RIGHT;
    } else if( (gesture_ud_count_ == 0) && (gesture_lr_count_ == -1) ) {
        gesture_motion_ = DIR_LEFT;
    } else if( (gesture_ud_count_ == -1) && (gesture_lr_count_ == 1) ) {
        if( abs(gesture_ud_delta_) > abs(gesture_lr_delta_) ) {
            gesture_motion_ = DIR_UP;
        } else {
            gesture_motion_ = DIR_RIGHT;
        }
    } else if( (gesture_ud_count_ == 1) && (gesture_lr_count_ == -1) ) {
        if( abs(gesture_ud_delta_) > abs(gesture_lr_delta_) ) {
            gesture_motion_ = DIR_DOWN;
        } else {
            gesture_motion_ = DIR_LEFT;
        }
    } else if( (gesture_ud_count_ == -1) && (gesture_lr_count_ == -1) ) {
        if( abs(gesture_ud_delta_) > abs(gesture_lr_delta_) ) {
            gesture_motion_ = DIR_UP;
        } else {
            gesture_motion_ = DIR_LEFT;
        }
    } else if( (gesture_ud_count_ == 1) && (gesture_lr_count_ == 1) ) {
        if( abs(gesture_ud_delta_) > abs(gesture_lr_delta_) ) {
            gesture_motion_ = DIR_DOWN;
        } else {
            gesture_motion_ = DIR_RIGHT;
        }
    } else {
        return false;
    }
    
    return true;
}

/*******************************************************************************
 * 读取或设置寄存器的值
 ******************************************************************************/

 /**
 * 说明：返回接近检测中断阀值
 * 返回：下限阈值
 */
uint8_t Kenblock_APDS9960::getProxIntLowThresh()
{
    uint8_t val;
    
    /* 从PILT寄存器（0x89）读取值 */
    if( !wireReadDataByte(APDS9960_PILT, val) ) {
        val = 0;
    }
    
    return val;
}

/**
 * @brief Sets the lower threshold for proximity detection
 *
 * @param[in] threshold the lower proximity threshold
 * @return True if operation successful. False otherwise.
 */
bool Kenblock_APDS9960::setProxIntLowThresh(uint8_t threshold)
{
    if( !wireWriteDataByte(APDS9960_PILT, threshold) ) {
        return false;
    }
    
    return true;
}

/**
 * @brief Returns the high threshold for proximity detection
 *
 * @return high threshold
 */
uint8_t Kenblock_APDS9960::getProxIntHighThresh()
{
    uint8_t val;
    
    /* Read value from PIHT register */
    if( !wireReadDataByte(APDS9960_PIHT, val) ) {
        val = 0;
    }
    
    return val;
}

/**
 * @brief Sets the high threshold for proximity detection
 *
 * @param[in] threshold the high proximity threshold
 * @return True if operation successful. False otherwise.
 */
bool Kenblock_APDS9960::setProxIntHighThresh(uint8_t threshold)
{
    if( !wireWriteDataByte(APDS9960_PIHT, threshold) ) {
        return false;
    }
    
    return true;
}

/**
 * @brief Returns LED drive strength for proximity and ALS
 *
 * Value    LED Current
 *   0        100 mA
 *   1         50 mA
 *   2         25 mA
 *   3         12.5 mA
 *
 * @return the value of the LED drive strength. 0xFF on failure.
 */
uint8_t Kenblock_APDS9960::getLEDDrive()
{
    uint8_t val;
    
    /* Read value from CONTROL register */
    if( !wireReadDataByte(APDS9960_CONTROL, val) ) {
        return ERROR;
    }
    
    /* Shift and mask out LED drive bits */
    val = (val >> 6) & 0b00000011;
    
    return val;
}

/**
 * @brief Sets the LED drive strength for proximity and ALS
 *
 * Value    LED Current
 *   0        100 mA
 *   1         50 mA
 *   2         25 mA
 *   3         12.5 mA
 *
 * @param[in] drive the value (0-3) for the LED drive strength
 * @return True if operation successful. False otherwise.
 */
bool Kenblock_APDS9960::setLEDDrive(uint8_t drive)
{
    uint8_t val;
    
    /* Read value from CONTROL register */
    if( !wireReadDataByte(APDS9960_CONTROL, val) ) {
        return false;
    }
    
    /* Set bits in register to given value */
    drive &= 0b00000011;
    drive = drive << 6;
    val &= 0b00111111;
    val |= drive;
    
    /* Write register value back into CONTROL register */
    if( !wireWriteDataByte(APDS9960_CONTROL, val) ) {
        return false;
    }
    
    return true;
}

/**
 * @brief Returns receiver gain for proximity detection
 *
 * Value    Gain
 *   0       1x
 *   1       2x
 *   2       4x
 *   3       8x
 *
 * @return the value of the proximity gain. 0xFF on failure.
 */
uint8_t Kenblock_APDS9960::getProximityGain()
{
    uint8_t val;
    
    /* Read value from CONTROL register */
    if( !wireReadDataByte(APDS9960_CONTROL, val) ) {
        return ERROR;
    }
    
    /* Shift and mask out PDRIVE bits */
    val = (val >> 2) & 0b00000011;
    
    return val;
}

/**
 * @brief Sets the receiver gain for proximity detection
 *
 * Value    Gain
 *   0       1x
 *   1       2x
 *   2       4x
 *   3       8x
 *
 * @param[in] drive the value (0-3) for the gain
 * @return True if operation successful. False otherwise.
 */
bool Kenblock_APDS9960::setProximityGain(uint8_t drive)
{
    uint8_t val;
    
    /* Read value from CONTROL register */
    if( !wireReadDataByte(APDS9960_CONTROL, val) ) {
        return false;
    }
    
    /* Set bits in register to given value */
    drive &= 0b00000011;
    drive = drive << 2;
    val &= 0b11110011;
    val |= drive;
    
    /* Write register value back into CONTROL register */
    if( !wireWriteDataByte(APDS9960_CONTROL, val) ) {
        return false;
    }
    
    return true;
}

/**
 * @brief Returns receiver gain for the ambient light sensor (ALS)
 *
 * Value    Gain
 *   0        1x
 *   1        4x
 *   2       16x
 *   3       64x
 *
 * @return the value of the ALS gain. 0xFF on failure.
 */
uint8_t Kenblock_APDS9960::getAmbientLightGain()
{
    uint8_t val;
    
    /* Read value from CONTROL register */
    if( !wireReadDataByte(APDS9960_CONTROL, val) ) {
        return ERROR;
    }
    
    /* Shift and mask out ADRIVE bits */
    val &= 0b00000011;
    
    return val;
}

/**
 * @brief Sets the receiver gain for the ambient light sensor (ALS)
 *
 * Value    Gain
 *   0        1x
 *   1        4x
 *   2       16x
 *   3       64x
 *
 * @param[in] drive the value (0-3) for the gain
 * @return True if operation successful. False otherwise.
 */
bool Kenblock_APDS9960::setAmbientLightGain(uint8_t drive)
{
    uint8_t val;
    
    /* Read value from CONTROL register */
    if( !wireReadDataByte(APDS9960_CONTROL, val) ) {
        return false;
    }
    
    /* Set bits in register to given value */
    drive &= 0b00000011;
    val &= 0b11111100;
    val |= drive;
    
    /* Write register value back into CONTROL register */
    if( !wireWriteDataByte(APDS9960_CONTROL, val) ) {
        return false;
    }
    
    return true;
}

/**
 * @brief Get the current LED boost value
 * 
 * Value  Boost Current
 *   0        100%
 *   1        150%
 *   2        200%
 *   3        300%
 *
 * @return The LED boost value. 0xFF on failure.
 */
uint8_t Kenblock_APDS9960::getLEDBoost()
{
    uint8_t val;
    
    /* Read value from CONFIG2 register */
    if( !wireReadDataByte(APDS9960_CONFIG2, val) ) {
        return ERROR;
    }
    
    /* Shift and mask out LED_BOOST bits */
    val = (val >> 4) & 0b00000011;
    
    return val;
}

/**
 * @brief Sets the LED current boost value
 *
 * Value  Boost Current
 *   0        100%
 *   1        150%
 *   2        200%
 *   3        300%
 *
 * @param[in] drive the value (0-3) for current boost (100-300%)
 * @return True if operation successful. False otherwise.
 */
bool Kenblock_APDS9960::setLEDBoost(uint8_t boost)
{
    uint8_t val;
    
    /* Read value from CONFIG2 register */
    if( !wireReadDataByte(APDS9960_CONFIG2, val) ) {
        return false;
    }
    
    /* Set bits in register to given value */
    boost &= 0b00000011;
    boost = boost << 4;
    val &= 0b11001111;
    val |= boost;
    
    /* Write register value back into CONFIG2 register */
    if( !wireWriteDataByte(APDS9960_CONFIG2, val) ) {
        return false;
    }
    
    return true;
}    
   
/**
 * @brief Gets proximity gain compensation enable
 *
 * @return 1 if compensation is enabled. 0 if not. 0xFF on error.
 */
uint8_t Kenblock_APDS9960::getProxGainCompEnable()
{
    uint8_t val;
    
    /* Read value from CONFIG3 register */
    if( !wireReadDataByte(APDS9960_CONFIG3, val) ) {
        return ERROR;
    }
    
    /* Shift and mask out PCMP bits */
    val = (val >> 5) & 0b00000001;
    
    return val;
}

/**
 * @brief Sets the proximity gain compensation enable
 *
 * @param[in] enable 1 to enable compensation. 0 to disable compensation.
 * @return True if operation successful. False otherwise.
 */
 bool Kenblock_APDS9960::setProxGainCompEnable(uint8_t enable)
{
    uint8_t val;
    
    /* Read value from CONFIG3 register */
    if( !wireReadDataByte(APDS9960_CONFIG3, val) ) {
        return false;
    }
    
    /* Set bits in register to given value */
    enable &= 0b00000001;
    enable = enable << 5;
    val &= 0b11011111;
    val |= enable;
    
    /* Write register value back into CONFIG3 register */
    if( !wireWriteDataByte(APDS9960_CONFIG3, val) ) {
        return false;
    }
    
    return true;
}

/**
 * @brief Gets the current mask for enabled/disabled proximity photodiodes
 *
 * 1 = disabled, 0 = enabled
 * Bit    Photodiode
 *  3       UP
 *  2       DOWN
 *  1       LEFT
 *  0       RIGHT
 *
 * @return Current proximity mask for photodiodes. 0xFF on error.
 */
uint8_t Kenblock_APDS9960::getProxPhotoMask()
{
    uint8_t val;
    
    /* Read value from CONFIG3 register */
    if( !wireReadDataByte(APDS9960_CONFIG3, val) ) {
        return ERROR;
    }
    
    /* Mask out photodiode enable mask bits */
    val &= 0b00001111;
    
    return val;
}

/**
 * @brief Sets the mask for enabling/disabling proximity photodiodes
 *
 * 1 = disabled, 0 = enabled
 * Bit    Photodiode
 *  3       UP
 *  2       DOWN
 *  1       LEFT
 *  0       RIGHT
 *
 * @param[in] mask 4-bit mask value
 * @return True if operation successful. False otherwise.
 */
bool Kenblock_APDS9960::setProxPhotoMask(uint8_t mask)
{
    uint8_t val;
    
    /* Read value from CONFIG3 register */
    if( !wireReadDataByte(APDS9960_CONFIG3, val) ) {
        return false;
    }
    
    /* Set bits in register to given value */
    mask &= 0b00001111;
    val &= 0b11110000;
    val |= mask;
    
    /* Write register value back into CONFIG3 register */
    if( !wireWriteDataByte(APDS9960_CONFIG3, val) ) {
        return false;
    }
    
    return true;
}

/**
 * @brief Gets the entry proximity threshold for gesture sensing
 *
 * @return Current entry proximity threshold.
 */
uint8_t Kenblock_APDS9960::getGestureEnterThresh()
{
    uint8_t val;
    
    /* Read value from GPENTH register */
    if( !wireReadDataByte(APDS9960_GPENTH, val) ) {
        val = 0;
    }
    
    return val;
}

/**
 * @brief Sets the entry proximity threshold for gesture sensing
 *
 * @param[in] threshold proximity value needed to start gesture mode
 * @return True if operation successful. False otherwise.
 */
bool Kenblock_APDS9960::setGestureEnterThresh(uint8_t threshold)
{
    if( !wireWriteDataByte(APDS9960_GPENTH, threshold) ) {
        return false;
    }
    
    return true;
}

/**
 * @brief Gets the exit proximity threshold for gesture sensing
 *
 * @return Current exit proximity threshold.
 */
uint8_t Kenblock_APDS9960::getGestureExitThresh()
{
    uint8_t val;
    
    /* Read value from GEXTH register */
    if( !wireReadDataByte(APDS9960_GEXTH, val) ) {
        val = 0;
    }
    
    return val;
}

/**
 * @brief Sets the exit proximity threshold for gesture sensing
 *
 * @param[in] threshold proximity value needed to end gesture mode
 * @return True if operation successful. False otherwise.
 */
bool Kenblock_APDS9960::setGestureExitThresh(uint8_t threshold)
{
    if( !wireWriteDataByte(APDS9960_GEXTH, threshold) ) {
        return false;
    }
    
    return true;
}

/**
 * @brief Gets the gain of the photodiode during gesture mode
 *
 * Value    Gain
 *   0       1x
 *   1       2x
 *   2       4x
 *   3       8x
 *
 * @return the current photodiode gain. 0xFF on error.
 */
uint8_t Kenblock_APDS9960::getGestureGain()
{
    uint8_t val;
    
    /* Read value from GCONF2 register */
    if( !wireReadDataByte(APDS9960_GCONF2, val) ) {
        return ERROR;
    }
    
    /* Shift and mask out GGAIN bits */
    val = (val >> 5) & 0b00000011;
    
    return val;
}

/**
 * @brief Sets the gain of the photodiode during gesture mode
 *
 * Value    Gain
 *   0       1x
 *   1       2x
 *   2       4x
 *   3       8x
 *
 * @param[in] gain the value for the photodiode gain
 * @return True if operation successful. False otherwise.
 */
bool Kenblock_APDS9960::setGestureGain(uint8_t gain)
{
    uint8_t val;
    
    /* Read value from GCONF2 register */
    if( !wireReadDataByte(APDS9960_GCONF2, val) ) {
        return false;
    }
    
    /* Set bits in register to given value */
    gain &= 0b00000011;
    gain = gain << 5;
    val &= 0b10011111;
    val |= gain;
    
    /* Write register value back into GCONF2 register */
    if( !wireWriteDataByte(APDS9960_GCONF2, val) ) {
        return false;
    }
    
    return true;
}

/**
 * @brief Gets the drive current of the LED during gesture mode
 *
 * Value    LED Current
 *   0        100 mA
 *   1         50 mA
 *   2         25 mA
 *   3         12.5 mA
 *
 * @return the LED drive current value. 0xFF on error.
 */
uint8_t Kenblock_APDS9960::getGestureLEDDrive()
{
    uint8_t val;
    
    /* Read value from GCONF2 register */
    if( !wireReadDataByte(APDS9960_GCONF2, val) ) {
        return ERROR;
    }
    
    /* Shift and mask out GLDRIVE bits */
    val = (val >> 3) & 0b00000011;
    
    return val;
}

/**
 * @brief Sets the LED drive current during gesture mode
 *
 * Value    LED Current
 *   0        100 mA
 *   1         50 mA
 *   2         25 mA
 *   3         12.5 mA
 *
 * @param[in] drive the value for the LED drive current
 * @return True if operation successful. False otherwise.
 */
bool Kenblock_APDS9960::setGestureLEDDrive(uint8_t drive)
{
    uint8_t val;
    
    /* Read value from GCONF2 register */
    if( !wireReadDataByte(APDS9960_GCONF2, val) ) {
        return false;
    }
    
    /* Set bits in register to given value */
    drive &= 0b00000011;
    drive = drive << 3;
    val &= 0b11100111;
    val |= drive;
    
    /* Write register value back into GCONF2 register */
    if( !wireWriteDataByte(APDS9960_GCONF2, val) ) {
        return false;
    }
    
    return true;
}

/**
 * @brief Gets the time in low power mode between gesture detections
 *
 * Value    Wait time
 *   0          0 ms
 *   1          2.8 ms
 *   2          5.6 ms
 *   3          8.4 ms
 *   4         14.0 ms
 *   5         22.4 ms
 *   6         30.8 ms
 *   7         39.2 ms
 *
 * @return the current wait time between gestures. 0xFF on error.
 */
uint8_t Kenblock_APDS9960::getGestureWaitTime()
{
    uint8_t val;
    
    /* Read value from GCONF2 register */
    if( !wireReadDataByte(APDS9960_GCONF2, val) ) {
        return ERROR;
    }
    
    /* Mask out GWTIME bits */
    val &= 0b00000111;
    
    return val;
}

/**
 * @brief Sets the time in low power mode between gesture detections
 *
 * Value    Wait time
 *   0          0 ms
 *   1          2.8 ms
 *   2          5.6 ms
 *   3          8.4 ms
 *   4         14.0 ms
 *   5         22.4 ms
 *   6         30.8 ms
 *   7         39.2 ms
 *
 * @param[in] the value for the wait time
 * @return True if operation successful. False otherwise.
 */
bool Kenblock_APDS9960::setGestureWaitTime(uint8_t time)
{
    uint8_t val;
    
    /* Read value from GCONF2 register */
    if( !wireReadDataByte(APDS9960_GCONF2, val) ) {
        return false;
    }
    
    /* Set bits in register to given value */
    time &= 0b00000111;
    val &= 0b11111000;
    val |= time;
    
    /* Write register value back into GCONF2 register */
    if( !wireWriteDataByte(APDS9960_GCONF2, val) ) {
        return false;
    }
    
    return true;
}

/**
 * @brief Gets the low threshold for ambient light interrupts
 *
 * @param[out] threshold current low threshold stored on the APDS-9960
 * @return True if operation successful. False otherwise.
 */
bool Kenblock_APDS9960::getLightIntLowThreshold(uint16_t &threshold)
{
    uint8_t val_byte;
    threshold = 0;
    
    /* Read value from ambient light low threshold, low byte register */
    if( !wireReadDataByte(APDS9960_AILTL, val_byte) ) {
        return false;
    }
    threshold = val_byte;
    
    /* Read value from ambient light low threshold, high byte register */
    if( !wireReadDataByte(APDS9960_AILTH, val_byte) ) {
        return false;
    }
    threshold = threshold + ((uint16_t)val_byte << 8);
    
    return true;
}

/**
 * @brief Sets the low threshold for ambient light interrupts
 *
 * @param[in] threshold low threshold value for interrupt to trigger
 * @return True if operation successful. False otherwise.
 */
bool Kenblock_APDS9960::setLightIntLowThreshold(uint16_t threshold)
{
    uint8_t val_low;
    uint8_t val_high;
    
    /* Break 16-bit threshold into 2 8-bit values */
    val_low = threshold & 0x00FF;
    val_high = (threshold & 0xFF00) >> 8;
    
    /* Write low byte */
    if( !wireWriteDataByte(APDS9960_AILTL, val_low) ) {
        return false;
    }
    
    /* Write high byte */
    if( !wireWriteDataByte(APDS9960_AILTH, val_high) ) {
        return false;
    }
    
    return true;
}

/**
 * @brief Gets the high threshold for ambient light interrupts
 *
 * @param[out] threshold current low threshold stored on the APDS-9960
 * @return True if operation successful. False otherwise.
	 
 */
bool Kenblock_APDS9960::getLightIntHighThreshold(uint16_t &threshold)
{
    uint8_t val_byte;
    threshold = 0;
    
    /* Read value from ambient light high threshold, low byte register */
    if( !wireReadDataByte(APDS9960_AIHTL, val_byte) ) {
        return false;
    }
    threshold = val_byte;
    
    /* Read value from ambient light high threshold, high byte register */
    if( !wireReadDataByte(APDS9960_AIHTH, val_byte) ) {
        return false;
    }
    threshold = threshold + ((uint16_t)val_byte << 8);
    
    return true;
}

/**
 * @brief Sets the high threshold for ambient light interrupts
 *
 * @param[in] threshold high threshold value for interrupt to trigger
 * @return True if operation successful. False otherwise.
 */
bool Kenblock_APDS9960::setLightIntHighThreshold(uint16_t threshold)
{
    uint8_t val_low;
    uint8_t val_high;
    
    /* Break 16-bit threshold into 2 8-bit values */
    val_low = threshold & 0x00FF;
    val_high = (threshold & 0xFF00) >> 8;
    
    /* Write low byte */
    if( !wireWriteDataByte(APDS9960_AIHTL, val_low) ) {
        return false;
    }
    
    /* Write high byte */
    if( !wireWriteDataByte(APDS9960_AIHTH, val_high) ) {
        return false;
    }
    
    return true;
}

/**
 * @brief Gets the low threshold for proximity interrupts
 *
 * @param[out] threshold current low threshold stored on the APDS-9960
 * @return True if operation successful. False otherwise.
 */
bool Kenblock_APDS9960::getProximityIntLowThreshold(uint8_t &threshold)
{
    threshold = 0;
    
    /* Read value from proximity low threshold register */
    if( !wireReadDataByte(APDS9960_PILT, threshold) ) {
        return false;
    }
    
    return true;
}

/**
 * @brief Sets the low threshold for proximity interrupts
 *
 * @param[in] threshold low threshold value for interrupt to trigger
 * @return True if operation successful. False otherwise.
 */
bool Kenblock_APDS9960::setProximityIntLowThreshold(uint8_t threshold)
{
    
    /* Write threshold value to register */
    if( !wireWriteDataByte(APDS9960_PILT, threshold) ) {
        return false;
    }
    
    return true;
}
    
/**
 * @brief Gets the high threshold for proximity interrupts
 *
 * @param[out] threshold current low threshold stored on the APDS-9960
 * @return True if operation successful. False otherwise.
 */
bool Kenblock_APDS9960::getProximityIntHighThreshold(uint8_t &threshold)
{
    threshold = 0;
    
    /* Read value from proximity low threshold register */
    if( !wireReadDataByte(APDS9960_PIHT, threshold) ) {
        return false;
    }
    
    return true;
}

/**
 * @brief Sets the high threshold for proximity interrupts
 *
 * @param[in] threshold high threshold value for interrupt to trigger
 * @return True if operation successful. False otherwise.
 */
bool Kenblock_APDS9960::setProximityIntHighThreshold(uint8_t threshold)
{
    
    /* Write threshold value to register */
    if( !wireWriteDataByte(APDS9960_PIHT, threshold) ) {
        return false;
    }
    
    return true;
}

/**
 * @brief Gets if ambient light interrupts are enabled or not
 *
 * @return 1 if interrupts are enabled, 0 if not. 0xFF on error.
 */
uint8_t Kenblock_APDS9960::getAmbientLightIntEnable()
{
    uint8_t val;
    
    /* Read value from ENABLE register */
    if( !wireReadDataByte(APDS9960_ENABLE, val) ) {
        return ERROR;
    }
    
    /* Shift and mask out AIEN bit */
    val = (val >> 4) & 0b00000001;
    
    return val;
}

/**
 * @brief Turns ambient light interrupts on or off
 *
 * @param[in] enable 1 to enable interrupts, 0 to turn them off
 * @return True if operation successful. False otherwise.
 */
bool Kenblock_APDS9960::setAmbientLightIntEnable(uint8_t enable)
{
    uint8_t val;
    
    /* Read value from ENABLE register */
    if( !wireReadDataByte(APDS9960_ENABLE, val) ) {
        return false;
    }
    
    /* Set bits in register to given value */
    enable &= 0b00000001;
    enable = enable << 4;
    val &= 0b11101111;
    val |= enable;
    
    /* Write register value back into ENABLE register */
    if( !wireWriteDataByte(APDS9960_ENABLE, val) ) {
        return false;
    }
    
    return true;
}

/**
 * @brief Gets if proximity interrupts are enabled or not
 *
 * @return 1 if interrupts are enabled, 0 if not. 0xFF on error.
 */
uint8_t Kenblock_APDS9960::getProximityIntEnable()
{
    uint8_t val;
    
    /* Read value from ENABLE register */
    if( !wireReadDataByte(APDS9960_ENABLE, val) ) {
        return ERROR;
    }
    
    /* Shift and mask out PIEN bit */
    val = (val >> 5) & 0b00000001;
    
    return val;
}

/**
 * @brief Turns proximity interrupts on or off
 *
 * @param[in] enable 1 to enable interrupts, 0 to turn them off
 * @return True if operation successful. False otherwise.
 */
bool Kenblock_APDS9960::setProximityIntEnable(uint8_t enable)
{
    uint8_t val;
    
    /* Read value from ENABLE register */
    if( !wireReadDataByte(APDS9960_ENABLE, val) ) {
        return false;
    }
    
    /* Set bits in register to given value */
    enable &= 0b00000001;
    enable = enable << 5;
    val &= 0b11011111;
    val |= enable;
    
    /* Write register value back into ENABLE register */
    if( !wireWriteDataByte(APDS9960_ENABLE, val) ) {
        return false;
    }
    
    return true;
}

/**
 * @brief Gets if gesture interrupts are enabled or not
 *
 * @return 1 if interrupts are enabled, 0 if not. 0xFF on error.
 */
uint8_t Kenblock_APDS9960::getGestureIntEnable()
{
    uint8_t val;
    
    /* Read value from GCONF4 register */
    if( !wireReadDataByte(APDS9960_GCONF4, val) ) {
        return ERROR;
    }
    
    /* Shift and mask out GIEN bit */
    val = (val >> 1) & 0b00000001;
    
    return val;
}

/**
 * @brief Turns gesture-related interrupts on or off
 *
 * @param[in] enable 1 to enable interrupts, 0 to turn them off
 * @return True if operation successful. False otherwise.
 */
bool Kenblock_APDS9960::setGestureIntEnable(uint8_t enable)
{
    uint8_t val;
    
    /* Read value from GCONF4 register */
    if( !wireReadDataByte(APDS9960_GCONF4, val) ) {
        return false;
    }
    
    /* Set bits in register to given value */
    enable &= 0b00000001;
    enable = enable << 1;
    val &= 0b11111101;
    val |= enable;
    
    /* Write register value back into GCONF4 register */
    if( !wireWriteDataByte(APDS9960_GCONF4, val) ) {
        return false;
    }
    
    return true;
}

/**
 * @brief Clears the ambient light interrupt
 *
 * @return True if operation completed successfully. False otherwise.
 */
bool Kenblock_APDS9960::clearAmbientLightInt()
{
    uint8_t throwaway;
    if( !wireReadDataByte(APDS9960_AICLEAR, throwaway) ) {
        return false;
    }
    
    return true;
}

/**
 * @brief Clears the proximity interrupt
 *
 * @return True if operation completed successfully. False otherwise.
 */
bool Kenblock_APDS9960::clearProximityInt()
{
    uint8_t throwaway;
    if( !wireReadDataByte(APDS9960_PICLEAR, throwaway) ) {
        return false;
    }
    
    return true;
}

/**
 * @brief Tells if the gesture state machine is currently running
 *
 * @return 1 if gesture state machine is running, 0 if not. 0xFF on error.
 */
uint8_t Kenblock_APDS9960::getGestureMode()
{
    uint8_t val;
    
    /* Read value from GCONF4 register */
    if( !wireReadDataByte(APDS9960_GCONF4, val) ) {
        return ERROR;
    }
    
    /* Mask out GMODE bit */
    val &= 0b00000001;
    
    return val;
}

/**
 * @brief Tells the state machine to either enter or exit gesture state machine
 *
 * @param[in] mode 1 to enter gesture state machine, 0 to exit.
 * @return True if operation successful. False otherwise.
 */
bool Kenblock_APDS9960::setGestureMode(uint8_t mode)
{
    uint8_t val;
    
    /* Read value from GCONF4 register */
    if( !wireReadDataByte(APDS9960_GCONF4, val) ) {
        return false;
    }
    
    /* Set bits in register to given value */
    mode &= 0b00000001;
    val &= 0b11111110;
    val |= mode;
    
    /* Write register value back into GCONF4 register */
    if( !wireWriteDataByte(APDS9960_GCONF4, val) ) {
        return false;
    }
    
    return true;
}

/*******************************************************************************
 * Raw I2C Reads and Writes
 ******************************************************************************/

/**
 * @brief Writes a single byte to the I2C device (no register)
 *
 * @param[in] val the 1-byte value to write to the I2C device
 * @return True if successful write operation. False otherwise.
 */
bool Kenblock_APDS9960::wireWriteByte(uint8_t val)
{
    Wire.beginTransmission(APDS9960_I2C_ADDR);
    Wire.write(val);
    if( Wire.endTransmission() != 0 ) {
        return false;
    }
    
    return true;
}

/**
 * @brief Writes a single byte to the I2C device and specified register
 *
 * @param[in] reg the register in the I2C device to write to
 * @param[in] val the 1-byte value to write to the I2C device
 * @return True if successful write operation. False otherwise.
 */
bool Kenblock_APDS9960::wireWriteDataByte(uint8_t reg, uint8_t val)
{
    Wire.beginTransmission(APDS9960_I2C_ADDR);
    Wire.write(reg);
    Wire.write(val);
    if( Wire.endTransmission() != 0 ) {
        return false;
    }

    return true;
}

/**
 * @brief Writes a block (array) of bytes to the I2C device and register
 *
 * @param[in] reg the register in the I2C device to write to
 * @param[in] val pointer to the beginning of the data byte array
 * @param[in] len the length (in bytes) of the data to write
 * @return True if successful write operation. False otherwise.
 */
bool Kenblock_APDS9960::wireWriteDataBlock(  uint8_t reg, 
                                        uint8_t *val, 
                                        unsigned int len)
{
    unsigned int i;

    Wire.beginTransmission(APDS9960_I2C_ADDR);
    Wire.write(reg);
    for(i = 0; i < len; i++) {
        Wire.beginTransmission(val[i]);
    }
    if( Wire.endTransmission() != 0 ) {
        return false;
    }

    return true;
}

/**
 * @brief Reads a single byte from the I2C device and specified register
 *
 * @param[in] reg the register to read from
 * @param[out] the value returned from the register
 * @return True if successful read operation. False otherwise.
 */
bool Kenblock_APDS9960::wireReadDataByte(uint8_t reg, uint8_t &val)
{
    
    /* Indicate which register we want to read from */
    if (!wireWriteByte(reg)) {
        return false;
    }
    
    /* Read from register */
    Wire.requestFrom(APDS9960_I2C_ADDR, 1);
    while (Wire.available()) {
        val = Wire.read();
    }

    return true;
}

/**
 * @brief Reads a block (array) of bytes from the I2C device and register
 *
 * @param[in] reg the register to read from
 * @param[out] val pointer to the beginning of the data
 * @param[in] len number of bytes to read
 * @return Number of bytes read. -1 on read error.
 */
int Kenblock_APDS9960::wireReadDataBlock(   uint8_t reg, 
                                        uint8_t *val, 
                                        unsigned int len)
{
    unsigned char i = 0;
    
    /* Indicate which register we want to read from */
    if (!wireWriteByte(reg)) {
        return -1;
    }
    
    /* Read block data */
    Wire.requestFrom(APDS9960_I2C_ADDR, len);
    while (Wire.available()) {
        if (i >= len) {
            return -1;
        }
        val[i] = Wire.read();
        i++;
    }

    return i;
}
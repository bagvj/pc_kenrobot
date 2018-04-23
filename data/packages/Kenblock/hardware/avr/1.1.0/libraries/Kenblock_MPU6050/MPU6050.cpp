// I2Cdev library collection - MPU6050 I2C device class
// Based on InvenSense MPU-6050 register map document rev. 2.0, 5/19/2011 (RM-MPU-6000A-00)
// 8/24/2011 by Jeff Rowberg <jeff@rowberg.net>
// Updates should (hopefully) always be available at https://github.com/jrowberg/i2cdevlib
//
// Changelog:
//     ... - ongoing debug release

// NOTE: THIS IS ONLY A PARIAL RELEASE. THIS DEVICE CLASS IS CURRENTLY UNDERGOING ACTIVE
// DEVELOPMENT AND IS STILL MISSING SOME IMPORTANT FEATURES. PLEASE KEEP THIS IN MIND IF
// YOU DECIDE TO USE THIS PARTICULAR CODE FOR ANYTHING.

/* ============================================
I2Cdev device library code is placed under the MIT license
Copyright (c) 2012 Jeff Rowberg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
===============================================
*/

#include "MPU6050.h"

/** Default constructor, uses default I2C address.
 * @see MPU6050_DEFAULT_ADDRESS
 */
 
 
/**
 * \函数：MPU6050
 * \说明：默认的函数结构,使用默认的I2C地址。请参考MPU6050_DEFAULT_ADDRESS字段。
 */ 
MPU6050::MPU6050() {
    devAddr = MPU6050_DEFAULT_ADDRESS;
}

/**
 * \函数：MPU6050
 * \说明：特殊地址的函数结构。
 * \输入参数：
 *		address - I2C地址参数
 * \其他：
 * 请参考 MPU6050_DEFAULT_ADDRESS 字段
 * 请参考 MPU6050_ADDRESS_AD0_LOW 字段
 * 请参考 MPU6050_ADDRESS_AD0_HIGH 字段
 */ 
MPU6050::MPU6050(uint8_t address) {
    devAddr = address;
}

/**
 * \函数：initialize
 * \说明：开机并调试。激活设备，在启动完成后关闭睡眠模式。同时，这个函数将加速度传感器和陀螺仪设置为最灵敏模式，即+/- 2g 和 +/-250度/秒; 并把X陀螺仪设置为时钟源的参考，这比默认的内部时钟源要准确。
 */
void MPU6050::initialize() {
    setClockSource(MPU6050_CLOCK_PLL_XGYRO);
    setFullScaleGyroRange(MPU6050_GYRO_FS_250);
    setFullScaleAccelRange(MPU6050_ACCEL_FS_2);
    setSleepEnabled(false); // 多亏了Jack Elston指出了这一点!
}

/**
 * \函数：testConnection
 * \说明：验证IIC接口。确保装置正确连接并反应正常。
 * \返回值：   
 *   	ture - 设置成功； false - 设置失败
 */
bool MPU6050::testConnection() {
    return getDeviceID() == 0x34;
}

//  AUX_VDDIO寄存器(InvenSense演示代码调用这个RA_*G_OFFS_TC)

/**
 * \函数：getAuxVDDIOLevel
 * \说明：获取IIC辅助电源电压。当设置为1,辅助IIC总线高电平是VDD。当电压为0,辅助IIC总线高电平是VLOGIC。这并不适用于MPU-6000,因为它没有VLOGIC端口。
 * \返回值：  
 *		 - IIC电源电压 (0 = VLOGIC,1 = VDD)	
 */  
uint8_t MPU6050::getAuxVDDIOLevel() {
    I2Cdev::readBit(devAddr, MPU6050_RA_YG_OFFS_TC, MPU6050_TC_PWR_MODE_BIT, buffer);
    return buffer[0];
}

 /**
 * \函数：setAuxVDDIOLevel
 * \说明：设置IIC辅助电源电压。当设置为设置IIC辅助电源电压。当设置为1,辅助IIC总线高电平是VDD。当电压为0,辅助IIC总线高电平是VLOGIC。这并不适用于MPU-6000,因为它没有VLOGIC端口。
 * \输入参数：
 * 		level - IIC电源电压 (0 = VLOGIC,1 = VDD)					 	
 */ 
void MPU6050::setAuxVDDIOLevel(uint8_t level) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_YG_OFFS_TC, MPU6050_TC_PWR_MODE_BIT, level);
}

// SMPLRT_DIV寄存器
 
/**
 * \函数：getRate
 * \说明：获取陀螺仪输出频率间隔
 * \输入参数：无	
 * \输出参数：无
 * \返回值：  
 *		 - 采样率
 * \其他：   
 * 		传感器的寄存器输出,FIFO输出,DMP采样、运动检测、零运动检测和自由落体检测都是基于采样率。通过SMPLRT_DIV把陀螺仪输出率分频即可得到采样率。
 * 采样率=陀螺仪输出率/ (1 + SMPLRT_DIV)
 * 其中，在禁用DLPF的情况下(DLPF_CFG = 0或7) ，陀螺仪输出率= 8 khz；在启用DLPF(见寄存器26)时，陀螺仪输出率= 1 khz。
 * 注意:加速度传感器输出率是1 khz。这意味着,采样率大于1 khz时,同一个加速度传感器的样品可能会多次输入到FIFO、DMP和传感器寄存器。
 * 陀螺仪和加速度传感器的信号路径图,请参见第八节的MPU-6000/MPU-6050产品规格文档。
 * 请参见 MPU6050_RA_SMPLRT_DIV 字段
 */ 
uint8_t MPU6050::getRate() {
    I2Cdev::readByte(devAddr, MPU6050_RA_SMPLRT_DIV, buffer);
    return buffer[0];
}

/**
 * \函数：setRate
 * \说明：设置陀螺仪输出频率
 * \输入参数：
 * 		 rate - 新采样频率间隔参数
 * \其他：
 * 请参见 getRate() 字段
 * 请参见 MPU6050_RA_SMPLRT_DIV 字段 	
 */ 
void MPU6050::setRate(uint8_t rate) {
    I2Cdev::writeByte(devAddr, MPU6050_RA_SMPLRT_DIV, rate);
}

// CONFIG 配置寄存器

/**
 * \函数：getExternalFrameSync
 * \说明：获取FSYNC函数外接配置
 * \返回值：  
 *		 - FSYNC配置参数
 * \其他： 
 * 配置连接到FSYNC端口进行采样。一个连接到FSYNC端口的外部信号可以通过配置EXT_SYNC_SET来采样。为了捕获短频闪光，我们将FSYNC端口的信号变化关闭。我们在寄存器25中定义，由关闭的FSYNC端口信号变化采样而来的数据为采样率。采样完毕后, 锁存器将重置为当前的FSYNC信号状态。
 * 
 * 根据下表所示的EXT_SYNC_SET值，我们将所得采样值的最低有效位输入传感器数据寄存器中。
 * <pre>
 * EXT_SYNC_SET | FSYNC Bit Location
 * -------------+-------------------
 * 0            | Input disabled
 * 1            | TEMP_OUT_L[0]
 * 2            | GYRO_XOUT_L[0]
 * 3            | GYRO_YOUT_L[0]
 * 4            | GYRO_ZOUT_L[0]
 * 5            | ACCEL_XOUT_L[0]
 * 6            | ACCEL_YOUT_L[0]
 * 7            | ACCEL_ZOUT_L[0]
 * </pre>  	
  
									
 */
uint8_t MPU6050::getExternalFrameSync() {
    I2Cdev::readBits(devAddr, MPU6050_RA_CONFIG, MPU6050_CFG_EXT_SYNC_SET_BIT, MPU6050_CFG_EXT_SYNC_SET_LENGTH, buffer);
    return buffer[0];
}

/**
 * \函数：setExternalFrameSync
 * \说明：设置FSYNC函数外接配置
 * \输入参数：
 * 		 sync - 新FSYNC配置的同步参数
 * \其他： 
 * 请参见 getExternalFrameSync() 字段
 * 请参见 MPU6050_RA_CONFIG 字段
 */ 
void MPU6050::setExternalFrameSync(uint8_t sync) {
    I2Cdev::writeBits(devAddr, MPU6050_RA_CONFIG, MPU6050_CFG_EXT_SYNC_SET_BIT, MPU6050_CFG_EXT_SYNC_SET_LENGTH, sync);
}

/**
 * \函数：getDLPFMode
 * \说明：获取数字低通滤波器的配置
 * \返回值：  
 *		 - DLFP 配置参数
 * \其他：
 * DLPF_CFG参数设置了数字低通滤波器的配置。同时，通过下表所示的设备，DLPF_CFG参数决定了内部采样率。
 *
 * 注意:加速度传感器输出率是1 khz。这意味着,采样率大于1 khz时,同一个加速度传感器的样品可能会多次输入到FIFO、DMP和传感器寄存器。
 * <pre>
 *          |   加速度传感器     |             陀螺仪
 * DLPF_CFG |    带宽   |  延迟  |    带宽   |  延迟  | 采样率
																   
 * ---------+-----------+--------+-----------+--------+-------------
 * 0        | 260Hz     | 0ms    | 256Hz     | 0.98ms | 8kHz
 * 1        | 184Hz     | 2.0ms  | 188Hz     | 1.9ms  | 1kHz
 * 2        | 94Hz      | 3.0ms  | 98Hz      | 2.8ms  | 1kHz
 * 3        | 44Hz      | 4.9ms  | 42Hz      | 4.8ms  | 1kHz
 * 4        | 21Hz      | 8.5ms  | 20Hz      | 8.3ms  | 1kHz
 * 5        | 10Hz      | 13.8ms | 10Hz      | 13.4ms | 1kHz
 * 6        | 5Hz       | 19.0ms | 5Hz       | 18.6ms | 1kHz
 * 7        |   -- Reserved --   |   -- Reserved --   | Reserved
 * </pre>  	
 *
 * 请参见 MPU6050_RA_CONFIG 字段
 * 请参见 MPU6050_CFG_DLPF_CFG_BIT 字段
 * 请参见 MPU6050_CFG_DLPF_CFG_LENGTH 字段							   
 */ 
uint8_t MPU6050::getDLPFMode() {
    I2Cdev::readBits(devAddr, MPU6050_RA_CONFIG, MPU6050_CFG_DLPF_CFG_BIT, MPU6050_CFG_DLPF_CFG_LENGTH, buffer);
    return buffer[0];
}

/**
 * \函数：setDLPFMode
 * \说明：设置数字低通滤波器的配置.
 * \输入参数：
 * 		 mode - 新DLFP配置的模式参数
 * \其他：
 * 请参见 getDLPFBandwidth() 字段
 * 请参见 MPU6050_DLPF_BW_256 字段
 * 请参见 MPU6050_RA_CONFIG 字段
 * 请参见 MPU6050_CFG_DLPF_CFG_BIT 字段
 * 请参见 MPU6050_CFG_DLPF_CFG_LENGTH 字段  	
 */ 
void MPU6050::setDLPFMode(uint8_t mode) {
    I2Cdev::writeBits(devAddr, MPU6050_RA_CONFIG, MPU6050_CFG_DLPF_CFG_BIT, MPU6050_CFG_DLPF_CFG_LENGTH, mode);
}

// GYRO_CONFIG 陀螺仪配置寄存器

/**
 * \函数：getFullScaleGyroRange
 * \说明：获取全量程的陀螺仪范围
 * \输入参数：无	
 * \输出参数：无
 * \返回值：  
 *		 - 当前陀螺仪范围的全量程设置
 * \其他：
 * 如下表所示，FS_SEL参数允许将陀螺仪传感器的范围设置为全量程。
 * <pre> 
 * 0 = +/- 250 度/秒
 * 1 = +/- 500 度/秒
 * 2 = +/- 1000 度/秒
 * 3 = +/- 2000 度/秒
 * </pre> 
 *  
 * 请参见 MPU6050_GYRO_FS_250 字段
 * 请参见 MPU6050_RA_GYRO_CONFIG 字段
 * 请参见 MPU6050_GCONFIG_FS_SEL_BIT 字段
 * 请参见 MPU6050_GCONFIG_FS_SEL_LENGTH 字段 								 
 */
uint8_t MPU6050::getFullScaleGyroRange() {
    I2Cdev::readBits(devAddr, MPU6050_RA_GYRO_CONFIG, MPU6050_GCONFIG_FS_SEL_BIT, MPU6050_GCONFIG_FS_SEL_LENGTH, buffer);
    return buffer[0];
}

/**
 * \函数：setFullScaleGyroRange
 * \说明：设置全量程的陀螺仪范围.
 * \输入参数：
 * 		 range - 全量程的陀螺仪范围参数
 * \其他：   
 * 请参见 getFullScaleRange() 字段
 * 请参见 MPU6050_GYRO_FS_250 字段
 * 请参见 MPU6050_RA_GYRO_CONFIG 字段
 * 请参见 MPU6050_GCONFIG_FS_SEL_BIT 字段
 * 请参见 MPU6050_GCONFIG_FS_SEL_LENGTH 字段
 * 				 
 */ 
void MPU6050::setFullScaleGyroRange(uint8_t range) {
    I2Cdev::writeBits(devAddr, MPU6050_RA_GYRO_CONFIG, MPU6050_GCONFIG_FS_SEL_BIT, MPU6050_GCONFIG_FS_SEL_LENGTH, range);
}

// SELF TEST FACTORY TRIM VALUES

/** Get self-test factory trim value for accelerometer X axis.
 * @return factory trim value
 * @see MPU6050_RA_SELF_TEST_X
 */
uint8_t MPU6050::getAccelXSelfTestFactoryTrim() {
    I2Cdev::readByte(devAddr, MPU6050_RA_SELF_TEST_X, &buffer[0]);
	I2Cdev::readByte(devAddr, MPU6050_RA_SELF_TEST_A, &buffer[1]);	
    return (buffer[0]>>3) | ((buffer[1]>>4) & 0x03);
}

/** Get self-test factory trim value for accelerometer Y axis.
 * @return factory trim value
 * @see MPU6050_RA_SELF_TEST_Y
 */
uint8_t MPU6050::getAccelYSelfTestFactoryTrim() {
    I2Cdev::readByte(devAddr, MPU6050_RA_SELF_TEST_Y, &buffer[0]);
	I2Cdev::readByte(devAddr, MPU6050_RA_SELF_TEST_A, &buffer[1]);	
    return (buffer[0]>>3) | ((buffer[1]>>2) & 0x03);
}

/** Get self-test factory trim value for accelerometer Z axis.
 * @return factory trim value
 * @see MPU6050_RA_SELF_TEST_Z
 */
uint8_t MPU6050::getAccelZSelfTestFactoryTrim() {
    I2Cdev::readBytes(devAddr, MPU6050_RA_SELF_TEST_Z, 2, buffer);	
    return (buffer[0]>>3) | (buffer[1] & 0x03);
}

/** Get self-test factory trim value for gyro X axis.
 * @return factory trim value
 * @see MPU6050_RA_SELF_TEST_X
 */
uint8_t MPU6050::getGyroXSelfTestFactoryTrim() {
    I2Cdev::readByte(devAddr, MPU6050_RA_SELF_TEST_X, buffer);	
    return (buffer[0] & 0x1F);
}

/** Get self-test factory trim value for gyro Y axis.
 * @return factory trim value
 * @see MPU6050_RA_SELF_TEST_Y
 */
uint8_t MPU6050::getGyroYSelfTestFactoryTrim() {
    I2Cdev::readByte(devAddr, MPU6050_RA_SELF_TEST_Y, buffer);	
    return (buffer[0] & 0x1F);
}

/** Get self-test factory trim value for gyro Z axis.
 * @return factory trim value
 * @see MPU6050_RA_SELF_TEST_Z
 */
uint8_t MPU6050::getGyroZSelfTestFactoryTrim() {
    I2Cdev::readByte(devAddr, MPU6050_RA_SELF_TEST_Z, buffer);	
    return (buffer[0] & 0x1F);
}

// ACCEL_CONFIG 加速度器配置寄存器

/**
 * \函数：getAccelXSelfTest
 * \说明：开启加速度器X轴的安全自测功能。
 * \返回值：  
 *		 - 测试值
 * \其他：
 * 请参见 MPU6050_RA_ACCEL_CONFIG 字段  	
 */
bool MPU6050::getAccelXSelfTest() {
    I2Cdev::readBit(devAddr, MPU6050_RA_ACCEL_CONFIG, MPU6050_ACONFIG_XA_ST_BIT, buffer);
    return buffer[0];
}

/**
 * \函数：setAccelXSelfTest
 * \说明：开启加速度器X轴的安全自测功能。
 * \输入参数：
 * 		 enabled - 安全自测启用参数
 * \其他： 
 * 请参见 MPU6050_RA_ACCEL_CONFIG 字段  	
 */
void MPU6050::setAccelXSelfTest(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_ACCEL_CONFIG, MPU6050_ACONFIG_XA_ST_BIT, enabled);
}

/**
 * \函数：getAccelYSelfTest
 * \说明：开启加速度器Y轴的安全自测功能。
 * \返回值：  
 *		 - 测试值
 * \其他：
 * 请参见 MPU6050_RA_ACCEL_CONFIG 字段  	
 */ 
bool MPU6050::getAccelYSelfTest() {
    I2Cdev::readBit(devAddr, MPU6050_RA_ACCEL_CONFIG, MPU6050_ACONFIG_YA_ST_BIT, buffer);
    return buffer[0];
}

/**
 * \函数：setAccelYSelfTest
 * \说明：开启加速度器Y轴的安全自测功能。
 * \输入参数：
 * 		 enabled - 安全自测启用参数
 * \其他： 
 * 请参见 MPU6050_RA_ACCEL_CONFIG 字段  	
 */
void MPU6050::setAccelYSelfTest(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_ACCEL_CONFIG, MPU6050_ACONFIG_YA_ST_BIT, enabled);
}

/**
 * \函数：getAccelZSelfTest
 * \说明：开启加速度器Z轴的安全自测功能。
 * \返回值：  
 *		 - 测试值
 * \其他：
 * 请参见 MPU6050_RA_ACCEL_CONFIG 字段  	
 */ 
bool MPU6050::getAccelZSelfTest() {
    I2Cdev::readBit(devAddr, MPU6050_RA_ACCEL_CONFIG, MPU6050_ACONFIG_ZA_ST_BIT, buffer);
    return buffer[0];
}

/**
 * \函数：setAccelZSelfTest
 * \说明：开启加速度器Z轴的安全自测功能。
 * \输入参数：
 * 		 enabled - 安全自测启用参数
 * \其他： 
 * 请参见 MPU6050_RA_ACCEL_CONFIG 字段  	
 */
void MPU6050::setAccelZSelfTest(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_ACCEL_CONFIG, MPU6050_ACONFIG_ZA_ST_BIT, enabled);
}

/**
 * \函数：getFullScaleAccelRange
 * \说明：获取全量程的加速度计范围
 * \返回值：  
 *		 - 当前加速度传感器范围的全量程设置
 * \其他：
 * 如下表所示，FS_SEL参数允许将加速度传感器的范围设置为全量程。
 * 
 * <pre> 
 * 0 = +/- 2g
 * 1 = +/- 4g
 * 2 = +/- 8g
 * 3 = +/- 16g
 * </pre>
 * 
 * 请参见 MPU6050_ACCEL_FS_2 字段
 * 请参见 MPU6050_RA_ACCEL_CONFIG 字段
 * 请参见 MPU6050_ACONFIG_AFS_SEL_BIT 字段
 * 请参见 MPU6050_ACONFIG_AFS_SEL_LENGTH 字段
 */
uint8_t MPU6050::getFullScaleAccelRange() {
    I2Cdev::readBits(devAddr, MPU6050_RA_ACCEL_CONFIG, MPU6050_ACONFIG_AFS_SEL_BIT, MPU6050_ACONFIG_AFS_SEL_LENGTH, buffer);
    return buffer[0];
}

/**
 * \函数：setFullScaleAccelRange
 * \说明：设定全量程的加速度计范围
 * \输入参数：
 * 		  - 新的全量程的加速度范围参数
 * \其他：
 * 请参见 getFullScaleAccelRange() 字段
 */ 
void MPU6050::setFullScaleAccelRange(uint8_t range) {
    I2Cdev::writeBits(devAddr, MPU6050_RA_ACCEL_CONFIG, MPU6050_ACONFIG_AFS_SEL_BIT, MPU6050_ACONFIG_AFS_SEL_LENGTH, range);
}

/**
 * \函数：getDHPFMode
 * \说明：获取高通滤波器的配置.
 * \返回值：  
 *		 - 当前高通滤波器配置
 * \其他：    
 * DHPF是在路径中连接于运动探测器(自由落体,运动阈值,零运动)的一个滤波器模块。高通滤波器的输出值不在数据寄存器中（参见第八节的MPU-6000/ MPU-6050产品规格文档图）。
 * 
 * 高通滤波器有三种模式：
 * <pre>
 *    重置:在一个样本中将滤波器输出值设为零。这有效的禁用了高通滤波器。这种模式可以快速切换滤波器的设置模式。
 *    开启:高通滤波器能通过高于截止频率的信号。
 *    持续:触发后,过滤器持续当前采样。过滤器输出值是输入样本和持续样本之间的差异。
 * </pre>
 * 
 * <pre>
 * ACCEL_HPF | 高通滤波模式| 截止频率
 * ----------+-------------+------------------
 * 0         | Reset       | None
 * 1         | On          | 5Hz
 * 2         | On          | 2.5Hz
 * 3         | On          | 1.25Hz
 * 4         | On          | 0.63Hz
 * 7         | Hold        | None 
 * </pre>
 * 
 * 请参见 MPU6050_DHPF_RESET 字段
 * 请参见 MPU6050_RA_ACCEL_CONFIG 字段
 */
uint8_t MPU6050::getDHPFMode() {
    I2Cdev::readBits(devAddr, MPU6050_RA_ACCEL_CONFIG, MPU6050_ACONFIG_ACCEL_HPF_BIT, MPU6050_ACONFIG_ACCEL_HPF_LENGTH, buffer);
    return buffer[0];
}

/**
 * \函数：setDHPFMode
 * \说明：设定高通滤波器的配置.
 * \输入参数：
 * 		 bandwidth - 新高通滤波器配置的带宽参数
 * \其他：
 * 请参见 setDHPFMode() 字段
 * 请参见 MPU6050_DHPF_RESET 字段
 * 请参见 MPU6050_RA_ACCEL_CONFIG 字段	
 */ 
void MPU6050::setDHPFMode(uint8_t bandwidth) {
    I2Cdev::writeBits(devAddr, MPU6050_RA_ACCEL_CONFIG, MPU6050_ACONFIG_ACCEL_HPF_BIT, MPU6050_ACONFIG_ACCEL_HPF_LENGTH, bandwidth);
}

// FF_THR 寄存器

/**
 * \函数：getFreefallDetectionThreshold
 * \说明：获取自由落体的加速度阈值。
 * \返回值：  
 *		 - 当前自由落体加速度阈值(LSB = 2mg)
 * \其他：
 * 这个寄存器为自由落体的阈值检测进行配置。FF_THR的单位是1LSB = 2mg。当加速度传感器测量而得的三个轴的绝对值都小于检测阈值时，就可以测得自由落体值。这种情况下，自由落体时间计数器计数一次 (寄存器30)。当自由落体时间计数器达到FF_DUR中规定的时间时，自由落体被中断。
 *
 * 更多自由落体中断检测的相关信息，详见8.2节的MPU-6000/MPU-6050产品规格文件和该文件下的寄存器56和寄存器58.
 *
 * 请参见 MPU6050_RA_FF_THR 字段 
 */ 
uint8_t MPU6050::getFreefallDetectionThreshold() {
    I2Cdev::readByte(devAddr, MPU6050_RA_FF_THR, buffer);
    return buffer[0];
}

/**
 * \函数：setFreefallDetectionThreshold
 * \说明：设置自由落体加速度阈值
 * \输入参数：
 * 		 threshold - 新自由落体加速度阈值参数(LSB = 2mg)
 * \其他：
 * 请参见 getFreefallDetectionThreshold() 字段
 * 请参见 MPU6050_RA_FF_THR 字段
 */
void MPU6050::setFreefallDetectionThreshold(uint8_t threshold) {
    I2Cdev::writeByte(devAddr, MPU6050_RA_FF_THR, threshold);
}

// FF_DUR 寄存器

/**
 * \函数：getFreefallDetectionDuration
 * \说明：获取自由落体时间阈值
 * \输入参数：无
 * \输出参数：无
 * \返回值：  
 *		 - 当前自由落体加速度阈值(LSB = 1ms)
 * \其他：
 * 这个寄存器为自由落体时间阈值计数器进行配置。时间计数频率为1 khz,因此FF_DUR的单位是 1 LSB = 1毫秒。
 * 当加速度器测量而得的绝对值都小于检测阈值时，自由落体时间计数器计数一次。当自由落体时间计数器达到该寄存器的规定时间时，自由落体被中断。
 * 
 * 更多自由落体中断检测的相关信息，详见8.2节的MPU-6000/MPU-6050产品规格文件和该文件下的寄存器56和寄存器58文件。
 * 
 * 请参见 MPU6050_RA_FF_DUR 字段
 */
uint8_t MPU6050::getFreefallDetectionDuration() {
    I2Cdev::readByte(devAddr, MPU6050_RA_FF_DUR, buffer);
    return buffer[0];
}

/**
 * \函数：setFreefallDetectionDuration
 * \说明：设置自由落体时间阈值
 * \输入参数：
 * 		 duration - 新自由落体时间阈值参数(LSB = 1ms)
 * \其他：
 * 请参见 getFreefallDetectionDuration() 字段
 * 请参见 MPU6050_RA_FF_DUR 字段	
 */
void MPU6050::setFreefallDetectionDuration(uint8_t duration) {
    I2Cdev::writeByte(devAddr, MPU6050_RA_FF_DUR, duration);
}

// MOT_THR 寄存器

/**
 * \函数：getMotionDetectionThreshold
 * \说明：获取运动检测的加速度阈值。
 * \返回值：  
 *		 - 当前运动检测加速度阈值(LSB = 2mg)
 * \其他：
 * 这个寄存器为运动中断的阈值检测进行配置。MOT_THR的单位是 1LSB = 2mg。当加速度器测量而得的绝对值都超过该运动检测的阈值时，即可测得该运动。这一情况下，运动时间检测计数器计数一次。当运动检测计数器达到MOT_DUR (Register 32)的规定时间时，运动检测被中断。
 * 
 * 运动中断表明了被检测的运动MOT_DETECT_STATUS (Register 97)的轴和极性。
 * 
 * 更多运动检测中断的相关信息，详见8.3节的MPU-6000/MPU-6050产品规格文件和该文件下的寄存器56和寄存器58文件.
 * 
 * 请参见 MPU6050_RA_MOT_THR 字段
 */
uint8_t MPU6050::getMotionDetectionThreshold() {
    I2Cdev::readByte(devAddr, MPU6050_RA_MOT_THR, buffer);
    return buffer[0];
}

/**
 * \函数：setMotionDetectionThreshold
 * \说明：新运动检测加速度阈值参数(LSB = 2mg)
 * \输入参数：
 * 		 threshold - 新运动检测加速度阈值(LSB = 2mg)
 * 请参见 getMotionDetectionThreshold() 字段
 * 请参见 MPU6050_RA_MOT_THR 字段	
 */ 
void MPU6050::setMotionDetectionThreshold(uint8_t threshold) {
    I2Cdev::writeByte(devAddr, MPU6050_RA_MOT_THR, threshold);
}

// MOT_DUR 寄存器

/**
 * \函数：getMotionDetectionDuration
 * \说明：获取运动检测时间的阈值。
 * \返回值：  
 *		 - 当前运动检测加速度阈值(LSB = 1ms)
 * \其他：
 * 这个寄存器为运动中断的阈值检测进行配置。时间计数器计数频率为1 kHz ，因此MOT_THR的单位是 1LSB = 1ms。当加速度器测量而得的绝对值都超过该运动检测的阈值时(Register 31)，运动检测时间计数器计数一次。当运动检测计数器达到该寄存器规定的时间时，运动检测被中断。
 * 
 * 更多运动检测中断的相关信息，详见8.3节的MPU-6000/MPU-6050产品规格文件。
 *  
 * 请参见 MPU6050_RA_MOT_DUR 字段				  
 */ 
uint8_t MPU6050::getMotionDetectionDuration() {
    I2Cdev::readByte(devAddr, MPU6050_RA_MOT_DUR, buffer);
    return buffer[0];
}

/**
 * \函数：setMotionDetectionDuration
 * \说明：设定运动检测的时间阈值
 * \输入参数：
 * 		 duration - 新运动检测加速度阈值(LSB = 1ms)
 * \其他：
 * 请参见 getMotionDetectionDuration() 字段
 * 请参见 MPU6050_RA_MOT_DUR 字段	
 */ 
void MPU6050::setMotionDetectionDuration(uint8_t duration) {
    I2Cdev::writeByte(devAddr, MPU6050_RA_MOT_DUR, duration);
}

// ZRMOT_THR 寄存器

/**
 * \函数：getZeroMotionDetectionThreshold
 * \说明：获取零运动检测加速度阈值。
 * \输入参数：无
 * \输出参数：无
 * \返回值：  
 *		 - 当前零运动检测的加速度阈值(LSB = 2mg)
 * \其他：
 * 这个寄存器为零运动中断检测进行配置。ZRMOT_THR的单位是1LSB = 2mg。当加速度器测量而得的三个轴的绝对值都小于检测阈值时，就可以测得零运动。这种情况下，零运动时间计数器计数一次 (寄存器34)。当自零运动时间计数器达到ZRMOT_DUR (Register 34)中规定的时间时，零运动被中断。
 * 与自由落体或运动检测不同的是，当零运动首次检测到以及当零运动检测不到时，零运动检测都被中断。
 * 
 * 当零运动被检测到时,其状态将在MOT_DETECT_STATUS寄存器(寄存器97) 中显示出来。当运动状态变为零运动状态被检测到时,状态位设置为1。当零运动状态变为运动状态被检测到时,状态位设置为0。
 * 
 * 更多零运动检测中断的相关信息，详见8.4节的MPU-6000/MPU-6050产品规格文件和该文件下的寄存器56和寄存器58的相关文件。
 * 
 * 请参见 MPU6050_RA_ZRMOT_THR 字段
 */
uint8_t MPU6050::getZeroMotionDetectionThreshold() {
    I2Cdev::readByte(devAddr, MPU6050_RA_ZRMOT_THR, buffer);
    return buffer[0];
}

/**
 * \函数：setZeroMotionDetectionThreshold
 * \说明：设定零运动检测的加速度阈值
 * \输入参数：
 * 		 threshold - 新零运动检测的加速度阈值参数 (LSB = 2mg)
 * \其他：
 * 请参见 getZeroMotionDetectionThreshold() 字段
 * 请参见 MPU6050_RA_ZRMOT_THR 字段	
 */
void MPU6050::setZeroMotionDetectionThreshold(uint8_t threshold) {
    I2Cdev::writeByte(devAddr, MPU6050_RA_ZRMOT_THR, threshold);
}

// ZRMOT_DUR 寄存器

/**
 * \函数：getZeroMotionDetectionDuration
 * \说明：获取零运动检测加速度阈值。
 * \返回值：  
 *		 - 当前零运动检测时间的阈值(LSB = 64ms)
 * \其他：
 * 这个寄存器为零运动中断检测进行时间计数器的配置。时间计数器的计数频率为16 Hz,因此ZRMOT_DUR的单位是1 LSB = 64 ms。当加速度器测量而得的绝对值都小于检测器的阈值(Register 33)时，运动检测时间计数器计数一次。当零运动检测计数器达到该寄存器规定的时间时，零运动检测被中断。
 * 更多零运动检测中断的相关信息，详见8.4节的MPU-6000/MPU-6050产品规格文件和该文件下的寄存器56和寄存器58的相关文件。
 *
 * 请参见 MPU6050_RA_ZRMOT_DUR 字段
 *
 */ 
uint8_t MPU6050::getZeroMotionDetectionDuration() {
    I2Cdev::readByte(devAddr, MPU6050_RA_ZRMOT_DUR, buffer);
    return buffer[0];
}

/**
 * \函数：setZeroMotionDetectionDuration
 * \说明：设定零运动检测的时间阈值
 * \输入参数：
 * 		 duration - 新零运动检测的时间阈值参数 (LSB = 1ms)
 * \其他：
 * 请参见 getZeroMotionDetectionDuration() 字段
 * 请参见 MPU6050_RA_ZRMOT_DUR 字段
 */ 
void MPU6050::setZeroMotionDetectionDuration(uint8_t duration) {
    I2Cdev::writeByte(devAddr, MPU6050_RA_ZRMOT_DUR, duration);
}

// FIFO_EN 寄存器

/**
 * \函数：getTempFIFOEnabled
 * \说明：获取启用FIFO的温度值
 * \输入参数：无
 * \输出参数：无
 * \返回值：  
 *		 - 当前启用FIFO的温度值
 * \其他：
 * 当设置为1时,这一位点将TEMP_OUT_H and TEMP_OUT_L (寄存器  65 和
寄存器 66)写入FIFO缓冲中。
 * 
 * 请参见 MPU6050_RA_FIFO_EN 字段
 */
bool MPU6050::getTempFIFOEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_FIFO_EN, MPU6050_TEMP_FIFO_EN_BIT, buffer);
    return buffer[0];
}

/**
 * \函数：setTempFIFOEnabled
 * \说明：设定启用FIFO的温度值
 * \输入参数：
 * 		 enabled - 启用FIFO的温度值参数。
 * \其他：
 * 当设置为1时,这一位点将TEMP_OUT_H and TEMP_OUT_L (寄存器  65 和
寄存器 66)写入FIFO缓冲中。
 * 
 * 请参见 getTempFIFOEnabled()字段
 * 请参见 MPU6050_RA_FIFO_EN 字段
 */
void MPU6050::setTempFIFOEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_FIFO_EN, MPU6050_TEMP_FIFO_EN_BIT, enabled);
}

/**
 * \函数：getXGyroFIFOEnabled
 * \说明：获取启用FIFO的陀螺仪的X轴的值。
 * \返回值：  
 *		 - 启用FIFO的陀螺仪X轴的值
 * \其他：
 * 当设置为1时,这一位点将GYRO_XOUT_H and GYRO_XOUT_L (寄存器  67 和
寄存器  68)写入FIFO缓冲中。
 * 
 * 请参见 MPU6050_RA_FIFO_EN 字段
 */
bool MPU6050::getXGyroFIFOEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_FIFO_EN, MPU6050_XG_FIFO_EN_BIT, buffer);
    return buffer[0];
}

/**
 * \函数：setXGyroFIFOEnabled
 * \说明：设定启用FIFO的陀螺仪的X轴的值。
 * \输入参数：
 * 		 enabled -  FIFO的陀螺仪的X轴参数。
 * \其他：
 * 
 * 请参见 getXGyroFIFOEnabled()字段
 * 请参见 MPU6050_RA_FIFO_EN 字段	
 */
void MPU6050::setXGyroFIFOEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_FIFO_EN, MPU6050_XG_FIFO_EN_BIT, enabled);
}

/**
 * \函数：getXGyroFIFOEnabled
 * \说明：获取启用FIFO的陀螺仪的Y轴的值。
 * \返回值：  
 *		 - 启用FIFO的陀螺仪Y轴的值
 * \其他：
 * 当设置为1时,这一位点将GYRO_YOUT_H and GYRO_YOUT_L (寄存器  69 和
寄存器  70)写入FIFO缓冲中。
 * 
 * 请参见 MPU6050_RA_FIFO_EN 字段
 */
bool MPU6050::getYGyroFIFOEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_FIFO_EN, MPU6050_YG_FIFO_EN_BIT, buffer);
    return buffer[0];
}

/**
 * \函数：setYGyroFIFOEnabled
 * \说明：设定启用FIFO的陀螺仪的Y轴的值。
 * \输入参数：
 * 		 enabled -  FIFO的陀螺仪的Y轴参数。
 * \其他：
 * 
 * 请参见 getYGyroFIFOEnabled()字段
 * 请参见 MPU6050_RA_FIFO_EN 字段	
 */
void MPU6050::setYGyroFIFOEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_FIFO_EN, MPU6050_YG_FIFO_EN_BIT, enabled);
}

/**
 * \函数：getZGyroFIFOEnabled
 * \说明：获取启用FIFO的陀螺仪的Z轴的值。
 * \返回值：  
 *		 - 启用FIFO的陀螺仪Z轴的值
 * \其他：
 * 当设置为1时,这一位点将GYRO_ZOUT_H and GYRO_ZOUT_L (寄存器  71 和
寄存器  72)写入FIFO缓冲中。
 * 
 * 请参见 MPU6050_RA_FIFO_EN 字段
 */
bool MPU6050::getZGyroFIFOEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_FIFO_EN, MPU6050_ZG_FIFO_EN_BIT, buffer);
    return buffer[0];
}

/**
 * \函数：setZGyroFIFOEnabled
 * \说明：设定启用FIFO的陀螺仪的Z轴的值。
 * \输入参数：
 * 		 enabled -  FIFO的陀螺仪的Z轴参数。
 * \其他：
 * 
 * 请参见 getZGyroFIFOEnabled()字段
 * 请参见 MPU6050_RA_FIFO_EN 字段	
 */
void MPU6050::setZGyroFIFOEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_FIFO_EN, MPU6050_ZG_FIFO_EN_BIT, enabled);
}

/**
 * \函数：getAccelFIFOEnabled
 * \说明：获取启用FIFO的加速度值
 * \返回值：  
 *		 - 当前启用FIFO的加速度值
 * \其他：
 * 当设置为1时,这一位点将ACCEL_XOUT_H, ACCEL_XOUT_L, ACCEL_YOUT_H,
ACCEL_YOUT_L, ACCEL_ZOUT_H, 和 ACCEL_ZOUT_L(寄存器  59 到 寄存器 64)写入FIFO缓冲中。
 * 
 * 请参见 MPU6050_RA_FIFO_EN 字段
 */ 
bool MPU6050::getAccelFIFOEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_FIFO_EN, MPU6050_ACCEL_FIFO_EN_BIT, buffer);
    return buffer[0];
}

/**
 * \函数：setAccelFIFOEnabled
 * \说明：设定启用FIFO的加速度值
 * \输入参数：
 * 		 enabled - 启用新FIFO的加速度启用参数。
 * \其他：
 * 请参见 getAccelFIFOEnabled() 字段
 * 请参见 MPU6050_RA_FIFO_EN 字段 
 */
void MPU6050::setAccelFIFOEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_FIFO_EN, MPU6050_ACCEL_FIFO_EN_BIT, enabled);
}

/**
 * \函数：getSlave2FIFOEnabled
 * \说明：获取Slave 2 FIFO的启用值
 * \返回值：  
 *		 - 当前Slave 2 FIFO的启用值
 * \其他：
 * 当设置为1时,这一位点将与Slave 2 相连的EXT_SENS_DATA 寄存器 (寄存器 73到寄存器  96)写入FIFO缓冲中。
 * 
 * 请参见 MPU6050_RA_FIFO_EN 字段
 */
bool MPU6050::getSlave2FIFOEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_FIFO_EN, MPU6050_SLV2_FIFO_EN_BIT, buffer);
    return buffer[0];
}

/**
 * \函数：setSlave2FIFOEnabled
 * \说明：设定Slave 2 FIFO的启用值
 * \输入参数：
 * 		 enabled - 新Slave 2 FIFO的启用参数。
 * \其他： 
 * 请参见 getSlave2FIFOEnabled()字段
 * 请参见 MPU6050_RA_FIFO_EN 字段
 */
void MPU6050::setSlave2FIFOEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_FIFO_EN, MPU6050_SLV2_FIFO_EN_BIT, enabled);
}

/**
 * \函数：getSlave1FIFOEnabled
 * \说明：获取Slave 1 FIFO的启用值
 * \返回值：  
 *		 - 当前Slave 1 FIFO的启用值
 * \其他：
 * 当设置为1时,这一位点将与Slave 1 相连的EXT_SENS_DATA 寄存器 (寄存器 73到寄存器  96)写入FIFO缓冲中。
 * 
 * 请参见 MPU6050_RA_FIFO_EN 字段
 */
bool MPU6050::getSlave1FIFOEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_FIFO_EN, MPU6050_SLV1_FIFO_EN_BIT, buffer);
    return buffer[0];
}

/**
 * \函数：setSlave1FIFOEnabled
 * \说明：设定Slave 1 FIFO的启用值
 * \输入参数：
 * 		 enabled - 新Slave 1 FIFO的启用参数。
 * \其他： 
 * 请参见 getSlave1FIFOEnabled()字段
 * 请参见 MPU6050_RA_FIFO_EN 字段
 */
void MPU6050::setSlave1FIFOEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_FIFO_EN, MPU6050_SLV1_FIFO_EN_BIT, enabled);
}

/**
 * \函数：getSlave0FIFOEnabled
 * \说明：获取Slave 0 FIFO的启用值
 * \返回值：  
 *		 - 当前Slave 0 FIFO的启用值
 * \其他：
 * 当设置为1时,这一位点将与Slave 0 相连的EXT_SENS_DATA 寄存器 (寄存器 73到寄存器  96)写入FIFO缓冲中。
 * 
 * 请参见 MPU6050_RA_FIFO_EN 字段
 */
bool MPU6050::getSlave0FIFOEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_FIFO_EN, MPU6050_SLV0_FIFO_EN_BIT, buffer);
    return buffer[0];
}

/**
 * \函数：setSlave0FIFOEnabled
 * \说明：设定Slave 0 FIFO的启用值
 * \输入参数：
 * 		 enabled - 新Slave 0 FIFO的启用参数。
 * \其他： 
 * 请参见 getSlave0FIFOEnabled()字段
 * 请参见 MPU6050_RA_FIFO_EN 字段
 */
void MPU6050::setSlave0FIFOEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_FIFO_EN, MPU6050_SLV0_FIFO_EN_BIT, enabled);
}

// I2C_MST_CTRL 寄存器

/**
 * \函数：getMultiMasterEnabled
 * \说明：获取multi-master的启用值
 * \返回值：  
 *		 - 当前multi-master的启用值
 * \其他：
 * Multi-master功能允许在同一总线上使用多个IIC主机。在需要multi-master功能的电路中,将MULT_MST_EN设置为1。这将使电流增加约30 uA。
 * 
 * 在需要multi-master功能的电路中,IIC总线的状态由每个单独的IIC主机所决定。在一个IIC主机能够承担总线的仲裁之前,必须先确认没有其他IIC主机承担总线的仲裁。当MULT_MST_EN设置为1时,MPU-60X0的总线仲裁检测逻辑被打开,启用该检测逻辑来检测总线是否可用。
 *
 * 请参见 MPU6050_RA_I2C_MST_CTRL 字段	
 */
bool MPU6050::getMultiMasterEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_I2C_MST_CTRL, MPU6050_MULT_MST_EN_BIT, buffer);
    return buffer[0];
}

/**
 * \函数：setMultiMasterEnabled
 * \说明：设定multi-master的启用值
 * \输入参数：
 * 		 enabled - 新multi-master的启用参数。当设置为1时,允许在同一总线上使用多个IIC主机。
 * \其他：
 * 请参见 getMultiMasterEnabled() 字段
 * 请参见 MPU6050_RA_I2C_MST_CTRL 字段	
 */
void MPU6050::setMultiMasterEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_I2C_MST_CTRL, MPU6050_MULT_MST_EN_BIT, enabled);
}

/**
 * \函数：getWaitForExternalSensorEnabled
 * \说明：获取wait-for-external-sensor-data的启用值
 * \返回值：  
 *		 - 当前 wait-for-external-sensor-data 的启用值
 * \其他：
 *		当WAIT_FOR_ES位设置为1时,数据准备中断将会被推迟直到从Slave而得的外部传感器数据加载到EXT_SENS_DATA寄存器中。这是用来确保当数据准备中断被开启时，内部传感器数据(即陀螺仪和加速度传感器)和外部传感器数据都成功加载到各自的数据寄存器中(即数据同步完成)。
 * 
 * 请参见 MPU6050_RA_I2C_MST_CTRL 字段
 */
bool MPU6050::getWaitForExternalSensorEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_I2C_MST_CTRL, MPU6050_WAIT_FOR_ES_BIT, buffer);
    return buffer[0];
}

/**
 * \函数：setWaitForExternalSensorEnabled
 * \说明：设置wait-for-external-sensor-data的启用值
 * \输入参数：
 * 		 enabled - 新wait-for-external-sensor-data的启用参数。
 * \其他： 
 * 请参见 getWaitForExternalSensorEnabled()字段
 * 请参见 MPU6050_RA_I2C_MST_CTRL 字段
 */		 
void MPU6050::setWaitForExternalSensorEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_I2C_MST_CTRL, MPU6050_WAIT_FOR_ES_BIT, enabled);
}

/**
 * \函数：getSlave3FIFOEnabled
 * \说明：获取Slave 3 FIFO的启用值
 * \返回值：  
 *		 - 当前Slave 3 FIFO的启用值
 * \其他：
 * 当设置为1时,这一位点将与Slave3 相连的EXT_SENS_DATA寄存器(寄存器73 到寄存器 96)写入FIFO缓冲中。
 * 
 * 请参见 MPU6050_RA_MST_CTRL 字段
 */
bool MPU6050::getSlave3FIFOEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_I2C_MST_CTRL, MPU6050_SLV_3_FIFO_EN_BIT, buffer);
    return buffer[0];
}

/**
 * \函数：getSlave3FIFOEnabled
 * \说明：设定Slave 3 FIFO的启用值
 * \返回值：  
 *		 - 新Slave 3 FIFO的启用参数
 * \其他：
 * 请参见 getSlave3FIFOEnabled()字段
 * 请参见 MPU6050_RA_MST_CTRL 字段
 */
void MPU6050::setSlave3FIFOEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_I2C_MST_CTRL, MPU6050_SLV_3_FIFO_EN_BIT, enabled);
}

/**
 * \函数：getSlaveReadWriteTransitionEnabled
 * \说明： 获取slave读/写转换的启用值
 * \返回值：  
 *		 - 当前slave读/编转换的启用值
 * \其他：
 *		IIC_MST_P_NSR位对IIC主机slave读取间的转变进行配置。如果该位等于0,将重新读取。如果该位等于1,下一个读取之前会有停顿。当一个读取转换为一个编写,通常在停顿后开始连续编写。
 *
 * 请参见 MPU6050_RA_I2C_MST_CTRL 字段  
 */
bool MPU6050::getSlaveReadWriteTransitionEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_I2C_MST_CTRL, MPU6050_I2C_MST_P_NSR_BIT, buffer);
    return buffer[0];
}

/**
 * \函数：setSlaveReadWriteTransitionEnabled
 * \说明：设定slave读/编转换的启用值
 * \输入参数：
 * 		 enabled - 如果该位等于0,将重新读取。如果该位等于1,下一个读取之前会有停顿。
 * \其他：
 * 请参见 getSlaveReadWriteTransitionEnabled()字段
 * 请参见 MPU6050_RA_I2C_MST_CTRL 字段
 */ 
void MPU6050::setSlaveReadWriteTransitionEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_I2C_MST_CTRL, MPU6050_I2C_MST_P_NSR_BIT, enabled);
}

/**
 * \函数：getMasterClockSpeed
 * \说明：获取IIC主时钟速度。
 * \返回值：  
 *		 - 当前IIC 主时钟速度值
 * \其他：
 * I2C_MST_CLK是一个4位的无符号值，它用于对内部的频率为8MHz的时钟进行分频配置。它根据下表对I2C主时钟速度进行设置:
 *
 * <pre>
 * I2C_MST_CLK | I2C 主时钟速度 | 8MHz 时钟分频器
 * ------------+------------------------+-------------------
 * 0           | 348kHz                 | 23
 * 1           | 333kHz                 | 24
 * 2           | 320kHz                 | 25
 * 3           | 308kHz                 | 26
 * 4           | 296kHz                 | 27
 * 5           | 286kHz                 | 28
 * 6           | 276kHz                 | 29
 * 7           | 267kHz                 | 30
 * 8           | 258kHz                 | 31
 * 9           | 500kHz                 | 16
 * 10          | 471kHz                 | 17
 * 11          | 444kHz                 | 18
 * 12          | 421kHz                 | 19
 * 13          | 400kHz                 | 20
 * 14          | 381kHz                 | 21
 * 15          | 364kHz                 | 22
 * </pre>
 *
 * 请参见 MPU6050_RA_I2C_MST_CTRL 字段
 */
uint8_t MPU6050::getMasterClockSpeed() {
    I2Cdev::readBits(devAddr, MPU6050_RA_I2C_MST_CTRL, MPU6050_I2C_MST_CLK_BIT, MPU6050_I2C_MST_CLK_LENGTH, buffer);
    return buffer[0];
}
 
/**
 * \函数：setMasterClockSpeed
 * \说明：设定IIC 主时钟速度值
 * \输入参数：
 * 		 speed - 新IIC 主时钟速度值
 * \其他：
 * 请参见 getMasterClockSpeed() 字段
 * 请参见 MPU6050_RA_I2C_MST_CTRL 字段	
 */
void MPU6050::setMasterClockSpeed(uint8_t speed) {
    I2Cdev::writeBits(devAddr, MPU6050_RA_I2C_MST_CTRL, MPU6050_I2C_MST_CLK_BIT, MPU6050_I2C_MST_CLK_LENGTH, speed);
}

// I2C_SLV* 寄存器 (Slave 0-3)

/**
 * \函数：getSlaveAddress
 * \说明： 获取指定slave (0-3)的IIC地址
 * \输入参数：
 *		num - Slave 数 (0-3)参数
 * \返回值：  
 *		 - 当前指定slave地址
 * \其他：
 * 注意Bit 7 (MSB)控制了读/写模式。如果设置了Bit 7,那么这是一个读取操作,如果将其清除,那么这是一个编写操作。其余位(6-0)是slave设备的7-bit设备地址。
 * 在读取模式中,读取结果是存储于最低可用的EXT_SENS_DATA寄存器中。更多读取结果分布信息，请参阅EXT_SENS_DATA寄存器的描述(寄存器 73 - 96)。
 * MPU-6050支持全5个slave，但Slave 4有其特殊功能(getSlave4* 和setSlave4*)。
 * 如寄存器25中所述，IIC数据转换通过采样率体现。用户负责确保IIC数据转换能够在一个采样率周期内完成。
 * I2C slave数据传输速率可根据采样率来减小。减小的传输速率是由IIC_MST_DLY(寄存器52)所决定的。slave数据传输速率是否根据采样率来减小是由IIC_MST_DELAY_CTRL (寄存器103)所决定的。
 * slave的处理指令是固定的。Slave的处理顺序是Slave 1, Slave 2, Slave 3 和 Slave 4。如果某一个Slave被禁用了，那么它会被自动忽略。
 * 每个slave可按采样率或降低的采样率来读取。在有些slave以采样率读取有些以减小的采样率读取的情况下，slave的读取顺序依旧不变。然而，如果一些slave的读取速率不能在特定循环中进行读取，那么它们会被自动忽略。更多降低的读取速率相关信息,请参阅寄存器52。Slave是否按采样率或降低的采样率来读取由寄存器103得Delay Enable位来决定。
 *
 * 请参见 MPU6050_RA_I2C_SLV0_ADDR 字段
 */
uint8_t MPU6050::getSlaveAddress(uint8_t num) {
    if (num > 3) return 0;
    I2Cdev::readByte(devAddr, MPU6050_RA_I2C_SLV0_ADDR + num*3, buffer);
    return buffer[0];
}

/**
 * \函数：setSlaveAddress
 * \说明：设定指定slave (0-3)的IIC 地址 
 * \输入参数：
 * 		num - Slave 数 (0-3)参数
 *		address - 指定slave的新地址参数
 * \其他：
 * 请参见 getSlaveAddress() 字段
 * 请参见 MPU6050_RA_I2C_SLV0_ADDR 字段
 */
void MPU6050::setSlaveAddress(uint8_t num, uint8_t address) {
    if (num > 3) return;
    I2Cdev::writeByte(devAddr, MPU6050_RA_I2C_SLV0_ADDR + num*3, address);
}

/**
 * \函数：getSlaveRegister
 * \说明： 获取指定slave (0-3)的IIC地址
 * \输入参数：
 *		num - Slave 数 (0-3)参数
 * \返回值：  
 *		 - 指定slave的当前寄存器
 * \其他：
 * Slave的读/写操作适用于这个MPU寄存器，不管寄存器存储了什么地址。
 * MPU-6050支持全5个slave，但Slave 4有其特殊功能。
 *
 * 请参见MPU6050_RA_I2C_SLV0_REG字段
 */ 
uint8_t MPU6050::getSlaveRegister(uint8_t num) {
    if (num > 3) return 0;
    I2Cdev::readByte(devAddr, MPU6050_RA_I2C_SLV0_REG + num*3, buffer);
    return buffer[0];
}

/**
 * \函数：setSlaveRegister
 * \说明：设定指定slave（0-3）的当前内部寄存器.
 * \输入参数：
 *		num - Slave 数 (0-3)参数
 *		reg - 指定slave的新当前寄存器参数
 * \其他：
 * 请参见 getSlaveRegister() 字段
 * 请参见 MPU6050_RA_I2C_SLV0_REG 字段
 */
void MPU6050::setSlaveRegister(uint8_t num, uint8_t reg) {
    if (num > 3) return;
    I2Cdev::writeByte(devAddr, MPU6050_RA_I2C_SLV0_REG + num*3, reg);
}

/**
 * \函数：getSlaveEnabled
 * \说明：获取指定slave（0-3）的启用值
 * \输入参数：
 *		num - Slave 数 (0-3)参数
 * \输出参数：无
 * \返回值：  
 *		 - 当前指定slave的启用值
 * \其他：
 * 当设置为1时,这个位启用Slave 0数据传输操作。当设置为0时,这个位禁用了Slave 0数据传输操作。
 * 
 * 请参见 MPU6050_RA_I2C_SLV0_CTRL 字段
 */
bool MPU6050::getSlaveEnabled(uint8_t num) {
    if (num > 3) return 0;
    I2Cdev::readBit(devAddr, MPU6050_RA_I2C_SLV0_CTRL + num*3, MPU6050_I2C_SLV_EN_BIT, buffer);
    return buffer[0];
}

/**
 * \函数：setSlaveEnabled
 * \说明：设定指定slave（0-3）的启用值
 * \输入参数：
 *		num - Slave 数 (0-3)参数
 *		enabled - 指定slave的启用参数
 * \其他：
 * 请参见 getSlaveEnabled()字段
 * 请参见 MPU6050_RA_I2C_SLV0_CTRL 字段
 */ 
void MPU6050::setSlaveEnabled(uint8_t num, bool enabled) {
    if (num > 3) return;
    I2Cdev::writeBit(devAddr, MPU6050_RA_I2C_SLV0_CTRL + num*3, MPU6050_I2C_SLV_EN_BIT, enabled);
}

/**
 * \函数：getSlaveWordByteSwap
 * \说明：启用指定slave的词对字节交换
 * \输入参数：
 *		num - Slave 数 (0-3)参数
 * \返回值：  
 *		 - 当前指定slave的词对字节交换启用值
 * \其他：
 *  当设置为1时,字节交换启用。当启用字节交换时,词对的高低字节即可交换。词对配对规律，请参考I2C_SLV0_GRP。为了进行字节交换，当设置为0时，由slave0交换而来的字节将被存储于EXT_SENS_DATA寄存器中。
 *
 * 请参见 MPU6050_RA_I2C_SLV0_CTRL 字段
 */
bool MPU6050::getSlaveWordByteSwap(uint8_t num) {
    if (num > 3) return 0;
    I2Cdev::readBit(devAddr, MPU6050_RA_I2C_SLV0_CTRL + num*3, MPU6050_I2C_SLV_BYTE_SW_BIT, buffer);
    return buffer[0];
}

/**
 * \函数：setSlaveWordByteSwap
 * \说明：设定指定slave（0-3）的词对字节交换
 * \输入参数：
 *		num - Slave 数 (0-3)参数
 *		enabled - 当前指定slave的词对字节交换启用参数
 * \其他：
 * 请参见 getSlaveWordByteSwap()字段
 * 请参见 MPU6050_RA_I2C_SLV0_CTRL 字段
 */
void MPU6050::setSlaveWordByteSwap(uint8_t num, bool enabled) {
    if (num > 3) return;
    I2Cdev::writeBit(devAddr, MPU6050_RA_I2C_SLV0_CTRL + num*3, MPU6050_I2C_SLV_BYTE_SW_BIT, enabled);
}

/**
 * \函数：getSlaveWriteMode
 * \说明：获取指定slave（0-3）的编写模式.
 * \输入参数：
 *		num - Slave 数 (0-3)参数
 * \返回值：  
 *		 - 当前指定slave的编写模式(0 = register address + data, 1 = data only)
 * \其他：
 *  当设置为1时,只进行数据的读或写操作。当设置为0时,在读写数据之前将编写一个寄存器地址。当指定寄存器地址在slave设备中时，这应该等于0，而在该寄存器中会进行数据处理。
 *
 * 请参见 MPU6050_RA_I2C_SLV0_CTRL 字段
 */
bool MPU6050::getSlaveWriteMode(uint8_t num) {
    if (num > 3) return 0;
    I2Cdev::readBit(devAddr, MPU6050_RA_I2C_SLV0_CTRL + num*3, MPU6050_I2C_SLV_REG_DIS_BIT, buffer);
    return buffer[0];
}

/**
 * \函数：setSlaveWriteMode
 * \说明：设置指定slave（0-3）的编写模式
 * \输入参数：
 *		num - Slave 数 (0-3)参数
 *		mode - 指定slave的新编写模式参数
 * \其他：
 * 请参见 getSlaveWriteMode() 字段
 * 请参见 MPU6050_RA_I2C_SLV0_CTRL 字段
 */
void MPU6050::setSlaveWriteMode(uint8_t num, bool mode) {
    if (num > 3) return;
    I2Cdev::writeBit(devAddr, MPU6050_RA_I2C_SLV0_CTRL + num*3, MPU6050_I2C_SLV_REG_DIS_BIT, mode);
}

/**
 * \函数：getSlaveWordGroupOffset
 * \说明：获取指定slave（0-3）的词对分组顺序函数.
 * \输入参数：
 *		num - Slave 数 (0-3)参数
 * \返回值：  
 *		 - 当前指定slave的词对分组顺序
 * \其他：
 *  这确定了从寄存器接收到的指定词对分组顺序。当设置为0时，寄存器地址为0和1、2和3等(甚至是不成对的寄存器地址)的字节组成词对。当设置为1时，寄存器地址为1和2、3和4等(甚至是不成对的寄存器地址)的字节组成词对。
 * 
 * 请参见 MPU6050_RA_I2C_SLV0_CTRL 字段
 */
bool MPU6050::getSlaveWordGroupOffset(uint8_t num) {
    if (num > 3) return 0;
    I2Cdev::readBit(devAddr, MPU6050_RA_I2C_SLV0_CTRL + num*3, MPU6050_I2C_SLV_GRP_BIT, buffer);
    return buffer[0];
}

/**
 * \函数：setSlaveWordGroupOffset
 * \说明：设定指定slave（0-3）的词对分组顺序函数.
 * \输入参数：
 *		num - Slave 数 (0-3)参数
 *		enabled - 指定slave新词对分组顺序的启用参数
 * \其他：
 * 请参见 getSlaveWordGroupOffset() 字段
 * 请参见 MPU6050_RA_I2C_SLV0_CTRL 字段
 */
void MPU6050::setSlaveWordGroupOffset(uint8_t num, bool enabled) {
    if (num > 3) return;
    I2Cdev::writeBit(devAddr, MPU6050_RA_I2C_SLV0_CTRL + num*3, MPU6050_I2C_SLV_GRP_BIT, enabled);
}

/**
 * \函数：getSlaveDataLength
 * \说明：获取指定slave（0-3）读取的字节数
 * \输入参数：
 *		num - Slave 数 (0-3)参数
 * \返回值：  
 *		 - 指定slave读取的字节数
 * \其他：
 *	确定由Slave 0转换而来和转换至Slave 0的字节数。将此位清楚为0就相当于通过在IIC_SLV0_EN上编写0来禁用该寄存器。
 * 
 * 请参见 MPU6050_RA_I2C_SLV0_CTRL 字段
 */
uint8_t MPU6050::getSlaveDataLength(uint8_t num) {
    if (num > 3) return 0;
    I2Cdev::readBits(devAddr, MPU6050_RA_I2C_SLV0_CTRL + num*3, MPU6050_I2C_SLV_LEN_BIT, MPU6050_I2C_SLV_LEN_LENGTH, buffer);
    return buffer[0];
}

/**
 * \函数：setSlaveDataLength
 * \说明：设定指定slave（0-3）的词对分组顺序函数
 * \输入参数：
 *		num - Slave 数 (0-3)参数
 *		length - 指定slave的字节数长度参数
 * \其他：
 * 请参见 getSlaveDataLength()字段
 * 请参见 MPU6050_RA_I2C_SLV0_CTRL 字段
 */ 
void MPU6050::setSlaveDataLength(uint8_t num, uint8_t length) {
    if (num > 3) return;
    I2Cdev::writeBits(devAddr, MPU6050_RA_I2C_SLV0_CTRL + num*3, MPU6050_I2C_SLV_LEN_BIT, MPU6050_I2C_SLV_LEN_LENGTH, length);
}

// I2C_SLV* 寄存器 (Slave 4)

/**
 * \函数：getSlave4Address
 * \说明：获取指定slave4的I2C地址
 * \返回值：  
 *		 - 当前slave4的地址
 * \其他：无
 *	注意Bit 7 (MSB)控制了读/写模式。如果设置了Bit 7,那么这是一个读取操作,如果将其清除,那么这是一个编写操作。其余位(6-0)是slave设备的7-bit设备地址。
 * 
 * 请参见 getSlaveAddress()字段
 * 请参见 MPU6050_RA_I2C_SLV4_ADDR 字段
 */
uint8_t MPU6050::getSlave4Address() {
    I2Cdev::readByte(devAddr, MPU6050_RA_I2C_SLV4_ADDR, buffer);
    return buffer[0];
}

/**
 * \函数：setSlave4Address
 * \说明：设定slave4的I2C地址
 * \输入参数：
 *		address - slave4的新地址参数
 * \其他：
 * 请参见 getSlave4Address()字段
 * 请参见 MPU6050_RA_I2C_SLV4_ADDR 字段
 */ 
void MPU6050::setSlave4Address(uint8_t address) {
    I2Cdev::writeByte(devAddr, MPU6050_RA_I2C_SLV4_ADDR, address);
}

/**
 * \函数：getSlave4Register
 * \说明：获取slave4的当前内部寄存器
 * \返回值：  
 *		 - slave4的当前寄存器
 * \其他：
 *	注意：Slave的读/写操作适用于这个MPU寄存器，不管寄存器存储了什么地址。
 * 
 * 请参见 MPU6050_RA_I2C_SLV4_REG 字段
 */
uint8_t MPU6050::getSlave4Register() {
    I2Cdev::readByte(devAddr, MPU6050_RA_I2C_SLV4_REG, buffer);
    return buffer[0];
}

/**
 * \函数：setSlave4Register
 * \说明：设定slave4的当前内部寄存器
 * \输入参数：
 *		reg - slave4当前寄存器的寄存参数
 * \其他：
 * 请参见 getSlave4Register()字段
 * 请参见 MPU6050_RA_I2C_SLV4_REG 字段
 */ 
void MPU6050::setSlave4Register(uint8_t reg) {
    I2Cdev::writeByte(devAddr, MPU6050_RA_I2C_SLV4_REG, reg);
}

/**
 * \函数：setSlave4OutputByte
 * \说明：设定写于slave4的新字节
 * \输入参数：
 *		data - 写于slave4的新字节数据参数
 * \其他：
 *	注意： 这一寄存器可储存写于slave4的数据。如果IIC_SLV4_RW设置为1（设置为读取模式），那么该寄存器无法执行操作。
 * 
 * 请参见 MPU6050_RA_I2C_SLV4_DO 字段
 */
void MPU6050::setSlave4OutputByte(uint8_t data) {
    I2Cdev::writeByte(devAddr, MPU6050_RA_I2C_SLV4_DO, data);
}

/**
 * \函数：getSlave4Enabled
 * \说明：获取slave4的启用值  
 * \返回值：   
 *		 - 当前slave4的启用值 
 * \其他：
 * 当设置为1时，此位启用了slave4的转换操作。当设置为0时，则禁用该操作。
 * 
 * 请参见 MPU6050_RA_I2C_SLV4_CTRL 字段
 */
bool MPU6050::getSlave4Enabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_I2C_SLV4_CTRL, MPU6050_I2C_SLV4_EN_BIT, buffer);
    return buffer[0];
}

/**
 * \函数：setSlave4Enabled
 * \说明：设定slave4的启用值
 * \输入参数：
 *		enabled -  slave4新启用参数。
 * \其他：
 * 请参见 getSlave4Enabled()字段
 * 请参见 MPU6050_RA_I2C_SLV4_CTRL 字段
 */ 
void MPU6050::setSlave4Enabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_I2C_SLV4_CTRL, MPU6050_I2C_SLV4_EN_BIT, enabled);
}

 /**
 * \函数：getSlave4InterruptEnabled
 * \说明：获取slave4事件中断的启用值
 * \返回值：  
 *		 - 返回当前slave4事务中断的启用值 
 * \其他：
 * 当设置为1时，此位启用了slave4事务完成的中断信号的生成。当清除为0时，则禁用了该信号的生成。这一中断状态可在寄存器54中看到。
 * 
 *	请参见 MPU6050_RA_I2C_SLV4_CTRL 字段
 */
bool MPU6050::getSlave4InterruptEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_I2C_SLV4_CTRL, MPU6050_I2C_SLV4_INT_EN_BIT, buffer);
    return buffer[0];
}

/**
 * \函数：setSlave4InterruptEnabled
 * \说明：设定slave4事件中断的启用值
 * \输入参数：
 *		enabled -  lave4事务中断的新启用值参数
 * \其他：
 * 请参见 getSlave4InterruptEnabled()字段
 * 请参见 MPU6050_RA_I2C_SLV4_CTRL 字段
 */
void MPU6050::setSlave4InterruptEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_I2C_SLV4_CTRL, MPU6050_I2C_SLV4_INT_EN_BIT, enabled);
}

/**
 * \函数：getSlave4WriteMode
 * \说明：获取slave4的编写模式
 * \返回值：  
 *		 - 当前slave4的编写模式(0 = register address + data, 1 = data only)
 * \其他：
 * 当设置为1时,只进行数据的读或写操作。当设置为0时,在读写数据之前将编写一个寄存器地址。当指定寄存器地址在slave设备中时，这应该等于0，而在该寄存器中会进行数据处理。
 *
 *	请参见 MPU6050_RA_I2C_SLV4_CTRL 字段
 */
bool MPU6050::getSlave4WriteMode() {
    I2Cdev::readBit(devAddr, MPU6050_RA_I2C_SLV4_CTRL, MPU6050_I2C_SLV4_REG_DIS_BIT, buffer);
    return buffer[0];
}

/**
 * \函数：setSlave4WriteMode
 * \说明： 设定slave4的编写模式
 * \输入参数：
 *		mode -  Slave 4新编写模式参数 (0 = register address + data, 1 = data only)
 * \其他：
 * 请参见 getSlave4WriteMode()字段
 * 请参见 MPU6050_RA_I2C_SLV4_CTRL 字段
 */ 
void MPU6050::setSlave4WriteMode(bool mode) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_I2C_SLV4_CTRL, MPU6050_I2C_SLV4_REG_DIS_BIT, mode);
}

/**
 * \函数：getSlave4MasterDelay
 * \说明：获取slave4的主延迟值。
 * \返回值：  
 *		 - 当前slave4的主延迟值
 * \其他：
 * 这为根据采样率减小的I2C slaves传输速率进行了配置。当一个slave的传输速率是根据采样率而降低的,那么该slave是以每1 / (1 + I2C_MST_DLY) 个样本进行传输。
 *
 * 这一基本的采样率也是由SMPLRT_DIV (寄存器 25)和DLPF_CFG (寄存器26)所决定的的。slave传输速率是否根据采样率来减小是由I2C_MST_DELAY_CTRL (寄存器103)所决定的。更多采样率相关信息，请参阅寄存器25.
 *
 * 请参见 MPU6050_RA_I2C_SLV4_CTRL 字段
 *		
 */
uint8_t MPU6050::getSlave4MasterDelay() {
    I2Cdev::readBits(devAddr, MPU6050_RA_I2C_SLV4_CTRL, MPU6050_I2C_SLV4_MST_DLY_BIT, MPU6050_I2C_SLV4_MST_DLY_LENGTH, buffer);
    return buffer[0];
}

/**
 * \函数：setSlave4MasterDelay
 * \说明：设定slave4的主延迟值
 * \输入参数：
 *		delay -  slave4主延迟值参数
 * \其他：
 * 请参见 getSlave4MasterDelay()字段
 * 请参见 MPU6050_RA_I2C_SLV4_CTRL 字段
 */
void MPU6050::setSlave4MasterDelay(uint8_t delay) {
    I2Cdev::writeBits(devAddr, MPU6050_RA_I2C_SLV4_CTRL, MPU6050_I2C_SLV4_MST_DLY_BIT, MPU6050_I2C_SLV4_MST_DLY_LENGTH, delay);
}

/**
 * \函数：getSlate4InputByte
 * \说明：获取slave4中可读取的最后可用字节。
 * \输入参数：无
 * \输出参数：无
 * \返回值：  
 *		 - slave4中最后一个可读取的字节。
 * \其他： 无
 *	这一寄存器储存了slave4中读取的数据。读取事件完成后即填充了该字段。
 * 
 * 请参见 MPU6050_RA_I2C_SLV4_DI 字段
 */
uint8_t MPU6050::getSlate4InputByte() {
    I2Cdev::readByte(devAddr, MPU6050_RA_I2C_SLV4_DI, buffer);
    return buffer[0];
}

// I2C_MST_STATUS 寄存器

/** Get FSYNC interrupt status.
 * This bit reflects the status of the FSYNC interrupt from an external device
 * into the MPU-60X0. This is used as a way to pass an external interrupt
 * through the MPU-60X0 to the host application processor. When set to 1, this
 * bit will cause an interrupt if FSYNC_INT_EN is asserted in INT_PIN_CFG
 * (Register 55).
 * @return FSYNC interrupt status
 * @see MPU6050_RA_I2C_MST_STATUS
 */
bool MPU6050::getPassthroughStatus() {
    I2Cdev::readBit(devAddr, MPU6050_RA_I2C_MST_STATUS, MPU6050_MST_PASS_THROUGH_BIT, buffer);
    return buffer[0];
}
/** Get Slave 4 transaction done status.
 * Automatically sets to 1 when a Slave 4 transaction has completed. This
 * triggers an interrupt if the I2C_MST_INT_EN bit in the INT_ENABLE register
 * (Register 56) is asserted and if the SLV_4_DONE_INT bit is asserted in the
 * I2C_SLV4_CTRL register (Register 52).
 * @return Slave 4 transaction done status
 * @see MPU6050_RA_I2C_MST_STATUS
 */
bool MPU6050::getSlave4IsDone() {
    I2Cdev::readBit(devAddr, MPU6050_RA_I2C_MST_STATUS, MPU6050_MST_I2C_SLV4_DONE_BIT, buffer);
    return buffer[0];
}
/** Get master arbitration lost status.
 * This bit automatically sets to 1 when the I2C Master has lost arbitration of
 * the auxiliary I2C bus (an error condition). This triggers an interrupt if the
 * I2C_MST_INT_EN bit in the INT_ENABLE register (Register 56) is asserted.
 * @return Master arbitration lost status
 * @see MPU6050_RA_I2C_MST_STATUS
 */
bool MPU6050::getLostArbitration() {
    I2Cdev::readBit(devAddr, MPU6050_RA_I2C_MST_STATUS, MPU6050_MST_I2C_LOST_ARB_BIT, buffer);
    return buffer[0];
}
/** Get Slave 4 NACK status.
 * This bit automatically sets to 1 when the I2C Master receives a NACK in a
 * transaction with Slave 4. This triggers an interrupt if the I2C_MST_INT_EN
 * bit in the INT_ENABLE register (Register 56) is asserted.
 * @return Slave 4 NACK interrupt status
 * @see MPU6050_RA_I2C_MST_STATUS
 */
bool MPU6050::getSlave4Nack() {
    I2Cdev::readBit(devAddr, MPU6050_RA_I2C_MST_STATUS, MPU6050_MST_I2C_SLV4_NACK_BIT, buffer);
    return buffer[0];
}
/** Get Slave 3 NACK status.
 * This bit automatically sets to 1 when the I2C Master receives a NACK in a
 * transaction with Slave 3. This triggers an interrupt if the I2C_MST_INT_EN
 * bit in the INT_ENABLE register (Register 56) is asserted.
 * @return Slave 3 NACK interrupt status
 * @see MPU6050_RA_I2C_MST_STATUS
 */
bool MPU6050::getSlave3Nack() {
    I2Cdev::readBit(devAddr, MPU6050_RA_I2C_MST_STATUS, MPU6050_MST_I2C_SLV3_NACK_BIT, buffer);
    return buffer[0];
}
/** Get Slave 2 NACK status.
 * This bit automatically sets to 1 when the I2C Master receives a NACK in a
 * transaction with Slave 2. This triggers an interrupt if the I2C_MST_INT_EN
 * bit in the INT_ENABLE register (Register 56) is asserted.
 * @return Slave 2 NACK interrupt status
 * @see MPU6050_RA_I2C_MST_STATUS
 */
bool MPU6050::getSlave2Nack() {
    I2Cdev::readBit(devAddr, MPU6050_RA_I2C_MST_STATUS, MPU6050_MST_I2C_SLV2_NACK_BIT, buffer);
    return buffer[0];
}
/** Get Slave 1 NACK status.
 * This bit automatically sets to 1 when the I2C Master receives a NACK in a
 * transaction with Slave 1. This triggers an interrupt if the I2C_MST_INT_EN
 * bit in the INT_ENABLE register (Register 56) is asserted.
 * @return Slave 1 NACK interrupt status
 * @see MPU6050_RA_I2C_MST_STATUS
 */
bool MPU6050::getSlave1Nack() {
    I2Cdev::readBit(devAddr, MPU6050_RA_I2C_MST_STATUS, MPU6050_MST_I2C_SLV1_NACK_BIT, buffer);
    return buffer[0];
}
/** Get Slave 0 NACK status.
 * This bit automatically sets to 1 when the I2C Master receives a NACK in a
 * transaction with Slave 0. This triggers an interrupt if the I2C_MST_INT_EN
 * bit in the INT_ENABLE register (Register 56) is asserted.
 * @return Slave 0 NACK interrupt status
 * @see MPU6050_RA_I2C_MST_STATUS
 */
bool MPU6050::getSlave0Nack() {
    I2Cdev::readBit(devAddr, MPU6050_RA_I2C_MST_STATUS, MPU6050_MST_I2C_SLV0_NACK_BIT, buffer);
    return buffer[0];
}

// INT_PIN_CFG register

/** Get interrupt logic level mode.
 * Will be set 0 for active-high, 1 for active-low.
 * @return Current interrupt mode (0=active-high, 1=active-low)
 * @see MPU6050_RA_INT_PIN_CFG
 * @see MPU6050_INTCFG_INT_LEVEL_BIT
 */
bool MPU6050::getInterruptMode() {
    I2Cdev::readBit(devAddr, MPU6050_RA_INT_PIN_CFG, MPU6050_INTCFG_INT_LEVEL_BIT, buffer);
    return buffer[0];
}
/** Set interrupt logic level mode.
 * @param mode New interrupt mode (0=active-high, 1=active-low)
 * @see getInterruptMode()
 * @see MPU6050_RA_INT_PIN_CFG
 * @see MPU6050_INTCFG_INT_LEVEL_BIT
 */
void MPU6050::setInterruptMode(bool mode) {
   I2Cdev::writeBit(devAddr, MPU6050_RA_INT_PIN_CFG, MPU6050_INTCFG_INT_LEVEL_BIT, mode);
}
/** Get interrupt drive mode.
 * Will be set 0 for push-pull, 1 for open-drain.
 * @return Current interrupt drive mode (0=push-pull, 1=open-drain)
 * @see MPU6050_RA_INT_PIN_CFG
 * @see MPU6050_INTCFG_INT_OPEN_BIT
 */
bool MPU6050::getInterruptDrive() {
    I2Cdev::readBit(devAddr, MPU6050_RA_INT_PIN_CFG, MPU6050_INTCFG_INT_OPEN_BIT, buffer);
    return buffer[0];
}
/** Set interrupt drive mode.
 * @param drive New interrupt drive mode (0=push-pull, 1=open-drain)
 * @see getInterruptDrive()
 * @see MPU6050_RA_INT_PIN_CFG
 * @see MPU6050_INTCFG_INT_OPEN_BIT
 */
void MPU6050::setInterruptDrive(bool drive) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_INT_PIN_CFG, MPU6050_INTCFG_INT_OPEN_BIT, drive);
}
/** Get interrupt latch mode.
 * Will be set 0 for 50us-pulse, 1 for latch-until-int-cleared.
 * @return Current latch mode (0=50us-pulse, 1=latch-until-int-cleared)
 * @see MPU6050_RA_INT_PIN_CFG
 * @see MPU6050_INTCFG_LATCH_INT_EN_BIT
 */
bool MPU6050::getInterruptLatch() {
    I2Cdev::readBit(devAddr, MPU6050_RA_INT_PIN_CFG, MPU6050_INTCFG_LATCH_INT_EN_BIT, buffer);
    return buffer[0];
}
/** Set interrupt latch mode.
 * @param latch New latch mode (0=50us-pulse, 1=latch-until-int-cleared)
 * @see getInterruptLatch()
 * @see MPU6050_RA_INT_PIN_CFG
 * @see MPU6050_INTCFG_LATCH_INT_EN_BIT
 */
void MPU6050::setInterruptLatch(bool latch) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_INT_PIN_CFG, MPU6050_INTCFG_LATCH_INT_EN_BIT, latch);
}
/** Get interrupt latch clear mode.
 * Will be set 0 for status-read-only, 1 for any-register-read.
 * @return Current latch clear mode (0=status-read-only, 1=any-register-read)
 * @see MPU6050_RA_INT_PIN_CFG
 * @see MPU6050_INTCFG_INT_RD_CLEAR_BIT
 */
bool MPU6050::getInterruptLatchClear() {
    I2Cdev::readBit(devAddr, MPU6050_RA_INT_PIN_CFG, MPU6050_INTCFG_INT_RD_CLEAR_BIT, buffer);
    return buffer[0];
}
/** Set interrupt latch clear mode.
 * @param clear New latch clear mode (0=status-read-only, 1=any-register-read)
 * @see getInterruptLatchClear()
 * @see MPU6050_RA_INT_PIN_CFG
 * @see MPU6050_INTCFG_INT_RD_CLEAR_BIT
 */
void MPU6050::setInterruptLatchClear(bool clear) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_INT_PIN_CFG, MPU6050_INTCFG_INT_RD_CLEAR_BIT, clear);
}
/** Get FSYNC interrupt logic level mode.
 * @return Current FSYNC interrupt mode (0=active-high, 1=active-low)
 * @see getFSyncInterruptMode()
 * @see MPU6050_RA_INT_PIN_CFG
 * @see MPU6050_INTCFG_FSYNC_INT_LEVEL_BIT
 */
bool MPU6050::getFSyncInterruptLevel() {
    I2Cdev::readBit(devAddr, MPU6050_RA_INT_PIN_CFG, MPU6050_INTCFG_FSYNC_INT_LEVEL_BIT, buffer);
    return buffer[0];
}
/** Set FSYNC interrupt logic level mode.
 * @param mode New FSYNC interrupt mode (0=active-high, 1=active-low)
 * @see getFSyncInterruptMode()
 * @see MPU6050_RA_INT_PIN_CFG
 * @see MPU6050_INTCFG_FSYNC_INT_LEVEL_BIT
 */
void MPU6050::setFSyncInterruptLevel(bool level) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_INT_PIN_CFG, MPU6050_INTCFG_FSYNC_INT_LEVEL_BIT, level);
}
/** Get FSYNC pin interrupt enabled setting.
 * Will be set 0 for disabled, 1 for enabled.
 * @return Current interrupt enabled setting
 * @see MPU6050_RA_INT_PIN_CFG
 * @see MPU6050_INTCFG_FSYNC_INT_EN_BIT
 */
bool MPU6050::getFSyncInterruptEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_INT_PIN_CFG, MPU6050_INTCFG_FSYNC_INT_EN_BIT, buffer);
    return buffer[0];
}
/** Set FSYNC pin interrupt enabled setting.
 * @param enabled New FSYNC pin interrupt enabled setting
 * @see getFSyncInterruptEnabled()
 * @see MPU6050_RA_INT_PIN_CFG
 * @see MPU6050_INTCFG_FSYNC_INT_EN_BIT
 */
void MPU6050::setFSyncInterruptEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_INT_PIN_CFG, MPU6050_INTCFG_FSYNC_INT_EN_BIT, enabled);
}
/** Get I2C bypass enabled status.
 * When this bit is equal to 1 and I2C_MST_EN (Register 106 bit[5]) is equal to
 * 0, the host application processor will be able to directly access the
 * auxiliary I2C bus of the MPU-60X0. When this bit is equal to 0, the host
 * application processor will not be able to directly access the auxiliary I2C
 * bus of the MPU-60X0 regardless of the state of I2C_MST_EN (Register 106
 * bit[5]).
 * @return Current I2C bypass enabled status
 * @see MPU6050_RA_INT_PIN_CFG
 * @see MPU6050_INTCFG_I2C_BYPASS_EN_BIT
 */
bool MPU6050::getI2CBypassEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_INT_PIN_CFG, MPU6050_INTCFG_I2C_BYPASS_EN_BIT, buffer);
    return buffer[0];
}
/** Set I2C bypass enabled status.
 * When this bit is equal to 1 and I2C_MST_EN (Register 106 bit[5]) is equal to
 * 0, the host application processor will be able to directly access the
 * auxiliary I2C bus of the MPU-60X0. When this bit is equal to 0, the host
 * application processor will not be able to directly access the auxiliary I2C
 * bus of the MPU-60X0 regardless of the state of I2C_MST_EN (Register 106
 * bit[5]).
 * @param enabled New I2C bypass enabled status
 * @see MPU6050_RA_INT_PIN_CFG
 * @see MPU6050_INTCFG_I2C_BYPASS_EN_BIT
 */
void MPU6050::setI2CBypassEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_INT_PIN_CFG, MPU6050_INTCFG_I2C_BYPASS_EN_BIT, enabled);
}
/** Get reference clock output enabled status.
 * When this bit is equal to 1, a reference clock output is provided at the
 * CLKOUT pin. When this bit is equal to 0, the clock output is disabled. For
 * further information regarding CLKOUT, please refer to the MPU-60X0 Product
 * Specification document.
 * @return Current reference clock output enabled status
 * @see MPU6050_RA_INT_PIN_CFG
 * @see MPU6050_INTCFG_CLKOUT_EN_BIT
 */
bool MPU6050::getClockOutputEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_INT_PIN_CFG, MPU6050_INTCFG_CLKOUT_EN_BIT, buffer);
    return buffer[0];
}
/** Set reference clock output enabled status.
 * When this bit is equal to 1, a reference clock output is provided at the
 * CLKOUT pin. When this bit is equal to 0, the clock output is disabled. For
 * further information regarding CLKOUT, please refer to the MPU-60X0 Product
 * Specification document.
 * @param enabled New reference clock output enabled status
 * @see MPU6050_RA_INT_PIN_CFG
 * @see MPU6050_INTCFG_CLKOUT_EN_BIT
 */
void MPU6050::setClockOutputEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_INT_PIN_CFG, MPU6050_INTCFG_CLKOUT_EN_BIT, enabled);
}

// INT_ENABLE register

/** Get full interrupt enabled status.
 * Full register byte for all interrupts, for quick reading. Each bit will be
 * set 0 for disabled, 1 for enabled.
 * @return Current interrupt enabled status
 * @see MPU6050_RA_INT_ENABLE
 * @see MPU6050_INTERRUPT_FF_BIT
 **/
uint8_t MPU6050::getIntEnabled() {
    I2Cdev::readByte(devAddr, MPU6050_RA_INT_ENABLE, buffer);
    return buffer[0];
}
/** Set full interrupt enabled status.
 * Full register byte for all interrupts, for quick reading. Each bit should be
 * set 0 for disabled, 1 for enabled.
 * @param enabled New interrupt enabled status
 * @see getIntFreefallEnabled()
 * @see MPU6050_RA_INT_ENABLE
 * @see MPU6050_INTERRUPT_FF_BIT
 **/
void MPU6050::setIntEnabled(uint8_t enabled) {
    I2Cdev::writeByte(devAddr, MPU6050_RA_INT_ENABLE, enabled);
}
/** Get Free Fall interrupt enabled status.
 * Will be set 0 for disabled, 1 for enabled.
 * @return Current interrupt enabled status
 * @see MPU6050_RA_INT_ENABLE
 * @see MPU6050_INTERRUPT_FF_BIT
 **/
bool MPU6050::getIntFreefallEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_INT_ENABLE, MPU6050_INTERRUPT_FF_BIT, buffer);
    return buffer[0];
}
/** Set Free Fall interrupt enabled status.
 * @param enabled New interrupt enabled status
 * @see getIntFreefallEnabled()
 * @see MPU6050_RA_INT_ENABLE
 * @see MPU6050_INTERRUPT_FF_BIT
 **/
void MPU6050::setIntFreefallEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_INT_ENABLE, MPU6050_INTERRUPT_FF_BIT, enabled);
}
/** Get Motion Detection interrupt enabled status.
 * Will be set 0 for disabled, 1 for enabled.
 * @return Current interrupt enabled status
 * @see MPU6050_RA_INT_ENABLE
 * @see MPU6050_INTERRUPT_MOT_BIT
 **/
bool MPU6050::getIntMotionEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_INT_ENABLE, MPU6050_INTERRUPT_MOT_BIT, buffer);
    return buffer[0];
}
/** Set Motion Detection interrupt enabled status.
 * @param enabled New interrupt enabled status
 * @see getIntMotionEnabled()
 * @see MPU6050_RA_INT_ENABLE
 * @see MPU6050_INTERRUPT_MOT_BIT
 **/
void MPU6050::setIntMotionEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_INT_ENABLE, MPU6050_INTERRUPT_MOT_BIT, enabled);
}
/** Get Zero Motion Detection interrupt enabled status.
 * Will be set 0 for disabled, 1 for enabled.
 * @return Current interrupt enabled status
 * @see MPU6050_RA_INT_ENABLE
 * @see MPU6050_INTERRUPT_ZMOT_BIT
 **/
bool MPU6050::getIntZeroMotionEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_INT_ENABLE, MPU6050_INTERRUPT_ZMOT_BIT, buffer);
    return buffer[0];
}
/** Set Zero Motion Detection interrupt enabled status.
 * @param enabled New interrupt enabled status
 * @see getIntZeroMotionEnabled()
 * @see MPU6050_RA_INT_ENABLE
 * @see MPU6050_INTERRUPT_ZMOT_BIT
 **/
void MPU6050::setIntZeroMotionEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_INT_ENABLE, MPU6050_INTERRUPT_ZMOT_BIT, enabled);
}
/** Get FIFO Buffer Overflow interrupt enabled status.
 * Will be set 0 for disabled, 1 for enabled.
 * @return Current interrupt enabled status
 * @see MPU6050_RA_INT_ENABLE
 * @see MPU6050_INTERRUPT_FIFO_OFLOW_BIT
 **/
bool MPU6050::getIntFIFOBufferOverflowEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_INT_ENABLE, MPU6050_INTERRUPT_FIFO_OFLOW_BIT, buffer);
    return buffer[0];
}
/** Set FIFO Buffer Overflow interrupt enabled status.
 * @param enabled New interrupt enabled status
 * @see getIntFIFOBufferOverflowEnabled()
 * @see MPU6050_RA_INT_ENABLE
 * @see MPU6050_INTERRUPT_FIFO_OFLOW_BIT
 **/
void MPU6050::setIntFIFOBufferOverflowEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_INT_ENABLE, MPU6050_INTERRUPT_FIFO_OFLOW_BIT, enabled);
}
/** Get I2C Master interrupt enabled status.
 * This enables any of the I2C Master interrupt sources to generate an
 * interrupt. Will be set 0 for disabled, 1 for enabled.
 * @return Current interrupt enabled status
 * @see MPU6050_RA_INT_ENABLE
 * @see MPU6050_INTERRUPT_I2C_MST_INT_BIT
 **/
bool MPU6050::getIntI2CMasterEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_INT_ENABLE, MPU6050_INTERRUPT_I2C_MST_INT_BIT, buffer);
    return buffer[0];
}
/** Set I2C Master interrupt enabled status.
 * @param enabled New interrupt enabled status
 * @see getIntI2CMasterEnabled()
 * @see MPU6050_RA_INT_ENABLE
 * @see MPU6050_INTERRUPT_I2C_MST_INT_BIT
 **/
void MPU6050::setIntI2CMasterEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_INT_ENABLE, MPU6050_INTERRUPT_I2C_MST_INT_BIT, enabled);
}
/** Get Data Ready interrupt enabled setting.
 * This event occurs each time a write operation to all of the sensor registers
 * has been completed. Will be set 0 for disabled, 1 for enabled.
 * @return Current interrupt enabled status
 * @see MPU6050_RA_INT_ENABLE
 * @see MPU6050_INTERRUPT_DATA_RDY_BIT
 */
bool MPU6050::getIntDataReadyEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_INT_ENABLE, MPU6050_INTERRUPT_DATA_RDY_BIT, buffer);
    return buffer[0];
}
/** Set Data Ready interrupt enabled status.
 * @param enabled New interrupt enabled status
 * @see getIntDataReadyEnabled()
 * @see MPU6050_RA_INT_CFG
 * @see MPU6050_INTERRUPT_DATA_RDY_BIT
 */
void MPU6050::setIntDataReadyEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_INT_ENABLE, MPU6050_INTERRUPT_DATA_RDY_BIT, enabled);
}

// INT_STATUS register

/** Get full set of interrupt status bits.
 * These bits clear to 0 after the register has been read. Very useful
 * for getting multiple INT statuses, since each single bit read clears
 * all of them because it has to read the whole byte.
 * @return Current interrupt status
 * @see MPU6050_RA_INT_STATUS
 */
uint8_t MPU6050::getIntStatus() {
    I2Cdev::readByte(devAddr, MPU6050_RA_INT_STATUS, buffer);
    return buffer[0];
}
/** Get Free Fall interrupt status.
 * This bit automatically sets to 1 when a Free Fall interrupt has been
 * generated. The bit clears to 0 after the register has been read.
 * @return Current interrupt status
 * @see MPU6050_RA_INT_STATUS
 * @see MPU6050_INTERRUPT_FF_BIT
 */
bool MPU6050::getIntFreefallStatus() {
    I2Cdev::readBit(devAddr, MPU6050_RA_INT_STATUS, MPU6050_INTERRUPT_FF_BIT, buffer);
    return buffer[0];
}
/** Get Motion Detection interrupt status.
 * This bit automatically sets to 1 when a Motion Detection interrupt has been
 * generated. The bit clears to 0 after the register has been read.
 * @return Current interrupt status
 * @see MPU6050_RA_INT_STATUS
 * @see MPU6050_INTERRUPT_MOT_BIT
 */
bool MPU6050::getIntMotionStatus() {
    I2Cdev::readBit(devAddr, MPU6050_RA_INT_STATUS, MPU6050_INTERRUPT_MOT_BIT, buffer);
    return buffer[0];
}
/** Get Zero Motion Detection interrupt status.
 * This bit automatically sets to 1 when a Zero Motion Detection interrupt has
 * been generated. The bit clears to 0 after the register has been read.
 * @return Current interrupt status
 * @see MPU6050_RA_INT_STATUS
 * @see MPU6050_INTERRUPT_ZMOT_BIT
 */
bool MPU6050::getIntZeroMotionStatus() {
    I2Cdev::readBit(devAddr, MPU6050_RA_INT_STATUS, MPU6050_INTERRUPT_ZMOT_BIT, buffer);
    return buffer[0];
}
/** Get FIFO Buffer Overflow interrupt status.
 * This bit automatically sets to 1 when a Free Fall interrupt has been
 * generated. The bit clears to 0 after the register has been read.
 * @return Current interrupt status
 * @see MPU6050_RA_INT_STATUS
 * @see MPU6050_INTERRUPT_FIFO_OFLOW_BIT
 */
bool MPU6050::getIntFIFOBufferOverflowStatus() {
    I2Cdev::readBit(devAddr, MPU6050_RA_INT_STATUS, MPU6050_INTERRUPT_FIFO_OFLOW_BIT, buffer);
    return buffer[0];
}
/** Get I2C Master interrupt status.
 * This bit automatically sets to 1 when an I2C Master interrupt has been
 * generated. For a list of I2C Master interrupts, please refer to Register 54.
 * The bit clears to 0 after the register has been read.
 * @return Current interrupt status
 * @see MPU6050_RA_INT_STATUS
 * @see MPU6050_INTERRUPT_I2C_MST_INT_BIT
 */
bool MPU6050::getIntI2CMasterStatus() {
    I2Cdev::readBit(devAddr, MPU6050_RA_INT_STATUS, MPU6050_INTERRUPT_I2C_MST_INT_BIT, buffer);
    return buffer[0];
}
/** Get Data Ready interrupt status.
 * This bit automatically sets to 1 when a Data Ready interrupt has been
 * generated. The bit clears to 0 after the register has been read.
 * @return Current interrupt status
 * @see MPU6050_RA_INT_STATUS
 * @see MPU6050_INTERRUPT_DATA_RDY_BIT
 */
bool MPU6050::getIntDataReadyStatus() {
    I2Cdev::readBit(devAddr, MPU6050_RA_INT_STATUS, MPU6050_INTERRUPT_DATA_RDY_BIT, buffer);
    return buffer[0];
}

// ACCEL_*OUT_* registers

/** Get raw 9-axis motion sensor readings (accel/gyro/compass).
 * FUNCTION NOT FULLY IMPLEMENTED YET.
 * @param ax 16-bit signed integer container for accelerometer X-axis value
 * @param ay 16-bit signed integer container for accelerometer Y-axis value
 * @param az 16-bit signed integer container for accelerometer Z-axis value
 * @param gx 16-bit signed integer container for gyroscope X-axis value
 * @param gy 16-bit signed integer container for gyroscope Y-axis value
 * @param gz 16-bit signed integer container for gyroscope Z-axis value
 * @param mx 16-bit signed integer container for magnetometer X-axis value
 * @param my 16-bit signed integer container for magnetometer Y-axis value
 * @param mz 16-bit signed integer container for magnetometer Z-axis value
 * @see getMotion6()
 * @see getAcceleration()
 * @see getRotation()
 * @see MPU6050_RA_ACCEL_XOUT_H
 */
void MPU6050::getMotion9(int16_t* ax, int16_t* ay, int16_t* az, int16_t* gx, int16_t* gy, int16_t* gz, int16_t* mx, int16_t* my, int16_t* mz) {
    getMotion6(ax, ay, az, gx, gy, gz);
    // TODO: magnetometer integration
}
/** Get raw 6-axis motion sensor readings (accel/gyro).
 * Retrieves all currently available motion sensor values.
 * @param ax 16-bit signed integer container for accelerometer X-axis value
 * @param ay 16-bit signed integer container for accelerometer Y-axis value
 * @param az 16-bit signed integer container for accelerometer Z-axis value
 * @param gx 16-bit signed integer container for gyroscope X-axis value
 * @param gy 16-bit signed integer container for gyroscope Y-axis value
 * @param gz 16-bit signed integer container for gyroscope Z-axis value
 * @see getAcceleration()
 * @see getRotation()
 * @see MPU6050_RA_ACCEL_XOUT_H
 */
void MPU6050::getMotion6(int16_t* ax, int16_t* ay, int16_t* az, int16_t* gx, int16_t* gy, int16_t* gz) {
    I2Cdev::readBytes(devAddr, MPU6050_RA_ACCEL_XOUT_H, 14, buffer);
    *ax = (((int16_t)buffer[0]) << 8) | buffer[1];
    *ay = (((int16_t)buffer[2]) << 8) | buffer[3];
    *az = (((int16_t)buffer[4]) << 8) | buffer[5];
    *gx = (((int16_t)buffer[8]) << 8) | buffer[9];
    *gy = (((int16_t)buffer[10]) << 8) | buffer[11];
    *gz = (((int16_t)buffer[12]) << 8) | buffer[13];
}
/** Get 3-axis accelerometer readings.
 * These registers store the most recent accelerometer measurements.
 * Accelerometer measurements are written to these registers at the Sample Rate
 * as defined in Register 25.
 *
 * The accelerometer measurement registers, along with the temperature
 * measurement registers, gyroscope measurement registers, and external sensor
 * data registers, are composed of two sets of registers: an internal register
 * set and a user-facing read register set.
 *
 * The data within the accelerometer sensors' internal register set is always
 * updated at the Sample Rate. Meanwhile, the user-facing read register set
 * duplicates the internal register set's data values whenever the serial
 * interface is idle. This guarantees that a burst read of sensor registers will
 * read measurements from the same sampling instant. Note that if burst reads
 * are not used, the user is responsible for ensuring a set of single byte reads
 * correspond to a single sampling instant by checking the Data Ready interrupt.
 *
 * Each 16-bit accelerometer measurement has a full scale defined in ACCEL_FS
 * (Register 28). For each full scale setting, the accelerometers' sensitivity
 * per LSB in ACCEL_xOUT is shown in the table below:
 *
 * <pre>
 * AFS_SEL | Full Scale Range | LSB Sensitivity
 * --------+------------------+----------------
 * 0       | +/- 2g           | 8192 LSB/mg
 * 1       | +/- 4g           | 4096 LSB/mg
 * 2       | +/- 8g           | 2048 LSB/mg
 * 3       | +/- 16g          | 1024 LSB/mg
 * </pre>
 *
 * @param x 16-bit signed integer container for X-axis acceleration
 * @param y 16-bit signed integer container for Y-axis acceleration
 * @param z 16-bit signed integer container for Z-axis acceleration
 * @see MPU6050_RA_GYRO_XOUT_H
 */
void MPU6050::getAcceleration(int16_t* x, int16_t* y, int16_t* z) {
    I2Cdev::readBytes(devAddr, MPU6050_RA_ACCEL_XOUT_H, 6, buffer);
    *x = (((int16_t)buffer[0]) << 8) | buffer[1];
    *y = (((int16_t)buffer[2]) << 8) | buffer[3];
    *z = (((int16_t)buffer[4]) << 8) | buffer[5];
}
/** Get X-axis accelerometer reading.
 * @return X-axis acceleration measurement in 16-bit 2's complement format
 * @see getMotion6()
 * @see MPU6050_RA_ACCEL_XOUT_H
 */
int16_t MPU6050::getAccelerationX() {
    I2Cdev::readBytes(devAddr, MPU6050_RA_ACCEL_XOUT_H, 2, buffer);
    return (((int16_t)buffer[0]) << 8) | buffer[1];
}
/** Get Y-axis accelerometer reading.
 * @return Y-axis acceleration measurement in 16-bit 2's complement format
 * @see getMotion6()
 * @see MPU6050_RA_ACCEL_YOUT_H
 */
int16_t MPU6050::getAccelerationY() {
    I2Cdev::readBytes(devAddr, MPU6050_RA_ACCEL_YOUT_H, 2, buffer);
    return (((int16_t)buffer[0]) << 8) | buffer[1];
}
/** Get Z-axis accelerometer reading.
 * @return Z-axis acceleration measurement in 16-bit 2's complement format
 * @see getMotion6()
 * @see MPU6050_RA_ACCEL_ZOUT_H
 */
int16_t MPU6050::getAccelerationZ() {
    I2Cdev::readBytes(devAddr, MPU6050_RA_ACCEL_ZOUT_H, 2, buffer);
    return (((int16_t)buffer[0]) << 8) | buffer[1];
}

// TEMP_OUT_* registers

/** Get current internal temperature.
 * @return Temperature reading in 16-bit 2's complement format
 * @see MPU6050_RA_TEMP_OUT_H
 */
int16_t MPU6050::getTemperature() {
    I2Cdev::readBytes(devAddr, MPU6050_RA_TEMP_OUT_H, 2, buffer);
    return (((int16_t)buffer[0]) << 8) | buffer[1];
}

// GYRO_*OUT_* registers

/** Get 3-axis gyroscope readings.
 * These gyroscope measurement registers, along with the accelerometer
 * measurement registers, temperature measurement registers, and external sensor
 * data registers, are composed of two sets of registers: an internal register
 * set and a user-facing read register set.
 * The data within the gyroscope sensors' internal register set is always
 * updated at the Sample Rate. Meanwhile, the user-facing read register set
 * duplicates the internal register set's data values whenever the serial
 * interface is idle. This guarantees that a burst read of sensor registers will
 * read measurements from the same sampling instant. Note that if burst reads
 * are not used, the user is responsible for ensuring a set of single byte reads
 * correspond to a single sampling instant by checking the Data Ready interrupt.
 *
 * Each 16-bit gyroscope measurement has a full scale defined in FS_SEL
 * (Register 27). For each full scale setting, the gyroscopes' sensitivity per
 * LSB in GYRO_xOUT is shown in the table below:
 *
 * <pre>
 * FS_SEL | Full Scale Range   | LSB Sensitivity
 * -------+--------------------+----------------
 * 0      | +/- 250 degrees/s  | 131 LSB/deg/s
 * 1      | +/- 500 degrees/s  | 65.5 LSB/deg/s
 * 2      | +/- 1000 degrees/s | 32.8 LSB/deg/s
 * 3      | +/- 2000 degrees/s | 16.4 LSB/deg/s
 * </pre>
 *
 * @param x 16-bit signed integer container for X-axis rotation
 * @param y 16-bit signed integer container for Y-axis rotation
 * @param z 16-bit signed integer container for Z-axis rotation
 * @see getMotion6()
 * @see MPU6050_RA_GYRO_XOUT_H
 */
void MPU6050::getRotation(int16_t* x, int16_t* y, int16_t* z) {
    I2Cdev::readBytes(devAddr, MPU6050_RA_GYRO_XOUT_H, 6, buffer);
    *x = (((int16_t)buffer[0]) << 8) | buffer[1];
    *y = (((int16_t)buffer[2]) << 8) | buffer[3];
    *z = (((int16_t)buffer[4]) << 8) | buffer[5];
}
/** Get X-axis gyroscope reading.
 * @return X-axis rotation measurement in 16-bit 2's complement format
 * @see getMotion6()
 * @see MPU6050_RA_GYRO_XOUT_H
 */
int16_t MPU6050::getRotationX() {
    I2Cdev::readBytes(devAddr, MPU6050_RA_GYRO_XOUT_H, 2, buffer);
    return (((int16_t)buffer[0]) << 8) | buffer[1];
}
/** Get Y-axis gyroscope reading.
 * @return Y-axis rotation measurement in 16-bit 2's complement format
 * @see getMotion6()
 * @see MPU6050_RA_GYRO_YOUT_H
 */
int16_t MPU6050::getRotationY() {
    I2Cdev::readBytes(devAddr, MPU6050_RA_GYRO_YOUT_H, 2, buffer);
    return (((int16_t)buffer[0]) << 8) | buffer[1];
}
/** Get Z-axis gyroscope reading.
 * @return Z-axis rotation measurement in 16-bit 2's complement format
 * @see getMotion6()
 * @see MPU6050_RA_GYRO_ZOUT_H
 */
int16_t MPU6050::getRotationZ() {
    I2Cdev::readBytes(devAddr, MPU6050_RA_GYRO_ZOUT_H, 2, buffer);
    return (((int16_t)buffer[0]) << 8) | buffer[1];
}

// EXT_SENS_DATA_* registers

/** Read single byte from external sensor data register.
 * These registers store data read from external sensors by the Slave 0, 1, 2,
 * and 3 on the auxiliary I2C interface. Data read by Slave 4 is stored in
 * I2C_SLV4_DI (Register 53).
 *
 * External sensor data is written to these registers at the Sample Rate as
 * defined in Register 25. This access rate can be reduced by using the Slave
 * Delay Enable registers (Register 103).
 *
 * External sensor data registers, along with the gyroscope measurement
 * registers, accelerometer measurement registers, and temperature measurement
 * registers, are composed of two sets of registers: an internal register set
 * and a user-facing read register set.
 *
 * The data within the external sensors' internal register set is always updated
 * at the Sample Rate (or the reduced access rate) whenever the serial interface
 * is idle. This guarantees that a burst read of sensor registers will read
 * measurements from the same sampling instant. Note that if burst reads are not
 * used, the user is responsible for ensuring a set of single byte reads
 * correspond to a single sampling instant by checking the Data Ready interrupt.
 *
 * Data is placed in these external sensor data registers according to
 * I2C_SLV0_CTRL, I2C_SLV1_CTRL, I2C_SLV2_CTRL, and I2C_SLV3_CTRL (Registers 39,
 * 42, 45, and 48). When more than zero bytes are read (I2C_SLVx_LEN > 0) from
 * an enabled slave (I2C_SLVx_EN = 1), the slave is read at the Sample Rate (as
 * defined in Register 25) or delayed rate (if specified in Register 52 and
 * 103). During each Sample cycle, slave reads are performed in order of Slave
 * number. If all slaves are enabled with more than zero bytes to be read, the
 * order will be Slave 0, followed by Slave 1, Slave 2, and Slave 3.
 *
 * Each enabled slave will have EXT_SENS_DATA registers associated with it by
 * number of bytes read (I2C_SLVx_LEN) in order of slave number, starting from
 * EXT_SENS_DATA_00. Note that this means enabling or disabling a slave may
 * change the higher numbered slaves' associated registers. Furthermore, if
 * fewer total bytes are being read from the external sensors as a result of
 * such a change, then the data remaining in the registers which no longer have
 * an associated slave device (i.e. high numbered registers) will remain in
 * these previously allocated registers unless reset.
 *
 * If the sum of the read lengths of all SLVx transactions exceed the number of
 * available EXT_SENS_DATA registers, the excess bytes will be dropped. There
 * are 24 EXT_SENS_DATA registers and hence the total read lengths between all
 * the slaves cannot be greater than 24 or some bytes will be lost.
 *
 * Note: Slave 4's behavior is distinct from that of Slaves 0-3. For further
 * information regarding the characteristics of Slave 4, please refer to
 * Registers 49 to 53.
 *
 * EXAMPLE:
 * Suppose that Slave 0 is enabled with 4 bytes to be read (I2C_SLV0_EN = 1 and
 * I2C_SLV0_LEN = 4) while Slave 1 is enabled with 2 bytes to be read so that
 * I2C_SLV1_EN = 1 and I2C_SLV1_LEN = 2. In such a situation, EXT_SENS_DATA _00
 * through _03 will be associated with Slave 0, while EXT_SENS_DATA _04 and 05
 * will be associated with Slave 1. If Slave 2 is enabled as well, registers
 * starting from EXT_SENS_DATA_06 will be allocated to Slave 2.
 *
 * If Slave 2 is disabled while Slave 3 is enabled in this same situation, then
 * registers starting from EXT_SENS_DATA_06 will be allocated to Slave 3
 * instead.
 *
 * REGISTER ALLOCATION FOR DYNAMIC DISABLE VS. NORMAL DISABLE:
 * If a slave is disabled at any time, the space initially allocated to the
 * slave in the EXT_SENS_DATA register, will remain associated with that slave.
 * This is to avoid dynamic adjustment of the register allocation.
 *
 * The allocation of the EXT_SENS_DATA registers is recomputed only when (1) all
 * slaves are disabled, or (2) the I2C_MST_RST bit is set (Register 106).
 *
 * This above is also true if one of the slaves gets NACKed and stops
 * functioning.
 *
 * @param position Starting position (0-23)
 * @return Byte read from register
 */
uint8_t MPU6050::getExternalSensorByte(int position) {
    I2Cdev::readByte(devAddr, MPU6050_RA_EXT_SENS_DATA_00 + position, buffer);
    return buffer[0];
}
/** Read word (2 bytes) from external sensor data registers.
 * @param position Starting position (0-21)
 * @return Word read from register
 * @see getExternalSensorByte()
 */
uint16_t MPU6050::getExternalSensorWord(int position) {
    I2Cdev::readBytes(devAddr, MPU6050_RA_EXT_SENS_DATA_00 + position, 2, buffer);
    return (((uint16_t)buffer[0]) << 8) | buffer[1];
}
/** Read double word (4 bytes) from external sensor data registers.
 * @param position Starting position (0-20)
 * @return Double word read from registers
 * @see getExternalSensorByte()
 */
uint32_t MPU6050::getExternalSensorDWord(int position) {
    I2Cdev::readBytes(devAddr, MPU6050_RA_EXT_SENS_DATA_00 + position, 4, buffer);
    return (((uint32_t)buffer[0]) << 24) | (((uint32_t)buffer[1]) << 16) | (((uint16_t)buffer[2]) << 8) | buffer[3];
}

// MOT_DETECT_STATUS register

/** Get full motion detection status register content (all bits).
 * @return Motion detection status byte
 * @see MPU6050_RA_MOT_DETECT_STATUS
 */
uint8_t MPU6050::getMotionStatus() {
    I2Cdev::readByte(devAddr, MPU6050_RA_MOT_DETECT_STATUS, buffer);
    return buffer[0];
}
/** Get X-axis negative motion detection interrupt status.
 * @return Motion detection status
 * @see MPU6050_RA_MOT_DETECT_STATUS
 * @see MPU6050_MOTION_MOT_XNEG_BIT
 */
bool MPU6050::getXNegMotionDetected() {
    I2Cdev::readBit(devAddr, MPU6050_RA_MOT_DETECT_STATUS, MPU6050_MOTION_MOT_XNEG_BIT, buffer);
    return buffer[0];
}
/** Get X-axis positive motion detection interrupt status.
 * @return Motion detection status
 * @see MPU6050_RA_MOT_DETECT_STATUS
 * @see MPU6050_MOTION_MOT_XPOS_BIT
 */
bool MPU6050::getXPosMotionDetected() {
    I2Cdev::readBit(devAddr, MPU6050_RA_MOT_DETECT_STATUS, MPU6050_MOTION_MOT_XPOS_BIT, buffer);
    return buffer[0];
}
/** Get Y-axis negative motion detection interrupt status.
 * @return Motion detection status
 * @see MPU6050_RA_MOT_DETECT_STATUS
 * @see MPU6050_MOTION_MOT_YNEG_BIT
 */
bool MPU6050::getYNegMotionDetected() {
    I2Cdev::readBit(devAddr, MPU6050_RA_MOT_DETECT_STATUS, MPU6050_MOTION_MOT_YNEG_BIT, buffer);
    return buffer[0];
}
/** Get Y-axis positive motion detection interrupt status.
 * @return Motion detection status
 * @see MPU6050_RA_MOT_DETECT_STATUS
 * @see MPU6050_MOTION_MOT_YPOS_BIT
 */
bool MPU6050::getYPosMotionDetected() {
    I2Cdev::readBit(devAddr, MPU6050_RA_MOT_DETECT_STATUS, MPU6050_MOTION_MOT_YPOS_BIT, buffer);
    return buffer[0];
}
/** Get Z-axis negative motion detection interrupt status.
 * @return Motion detection status
 * @see MPU6050_RA_MOT_DETECT_STATUS
 * @see MPU6050_MOTION_MOT_ZNEG_BIT
 */
bool MPU6050::getZNegMotionDetected() {
    I2Cdev::readBit(devAddr, MPU6050_RA_MOT_DETECT_STATUS, MPU6050_MOTION_MOT_ZNEG_BIT, buffer);
    return buffer[0];
}
/** Get Z-axis positive motion detection interrupt status.
 * @return Motion detection status
 * @see MPU6050_RA_MOT_DETECT_STATUS
 * @see MPU6050_MOTION_MOT_ZPOS_BIT
 */
bool MPU6050::getZPosMotionDetected() {
    I2Cdev::readBit(devAddr, MPU6050_RA_MOT_DETECT_STATUS, MPU6050_MOTION_MOT_ZPOS_BIT, buffer);
    return buffer[0];
}
/** Get zero motion detection interrupt status.
 * @return Motion detection status
 * @see MPU6050_RA_MOT_DETECT_STATUS
 * @see MPU6050_MOTION_MOT_ZRMOT_BIT
 */
bool MPU6050::getZeroMotionDetected() {
    I2Cdev::readBit(devAddr, MPU6050_RA_MOT_DETECT_STATUS, MPU6050_MOTION_MOT_ZRMOT_BIT, buffer);
    return buffer[0];
}

// I2C_SLV*_DO register

/** Write byte to Data Output container for specified slave.
 * This register holds the output data written into Slave when Slave is set to
 * write mode. For further information regarding Slave control, please
 * refer to Registers 37 to 39 and immediately following.
 * @param num Slave number (0-3)
 * @param data Byte to write
 * @see MPU6050_RA_I2C_SLV0_DO
 */
void MPU6050::setSlaveOutputByte(uint8_t num, uint8_t data) {
    if (num > 3) return;
    I2Cdev::writeByte(devAddr, MPU6050_RA_I2C_SLV0_DO + num, data);
}

// I2C_MST_DELAY_CTRL register

/** Get external data shadow delay enabled status.
 * This register is used to specify the timing of external sensor data
 * shadowing. When DELAY_ES_SHADOW is set to 1, shadowing of external
 * sensor data is delayed until all data has been received.
 * @return Current external data shadow delay enabled status.
 * @see MPU6050_RA_I2C_MST_DELAY_CTRL
 * @see MPU6050_DELAYCTRL_DELAY_ES_SHADOW_BIT
 */
bool MPU6050::getExternalShadowDelayEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_I2C_MST_DELAY_CTRL, MPU6050_DELAYCTRL_DELAY_ES_SHADOW_BIT, buffer);
    return buffer[0];
}
/** Set external data shadow delay enabled status.
 * @param enabled New external data shadow delay enabled status.
 * @see getExternalShadowDelayEnabled()
 * @see MPU6050_RA_I2C_MST_DELAY_CTRL
 * @see MPU6050_DELAYCTRL_DELAY_ES_SHADOW_BIT
 */
void MPU6050::setExternalShadowDelayEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_I2C_MST_DELAY_CTRL, MPU6050_DELAYCTRL_DELAY_ES_SHADOW_BIT, enabled);
}
/** Get slave delay enabled status.
 * When a particular slave delay is enabled, the rate of access for the that
 * slave device is reduced. When a slave's access rate is decreased relative to
 * the Sample Rate, the slave is accessed every:
 *
 *     1 / (1 + I2C_MST_DLY) Samples
 *
 * This base Sample Rate in turn is determined by SMPLRT_DIV (register  * 25)
 * and DLPF_CFG (register 26).
 *
 * For further information regarding I2C_MST_DLY, please refer to register 52.
 * For further information regarding the Sample Rate, please refer to register 25.
 *
 * @param num Slave number (0-4)
 * @return Current slave delay enabled status.
 * @see MPU6050_RA_I2C_MST_DELAY_CTRL
 * @see MPU6050_DELAYCTRL_I2C_SLV0_DLY_EN_BIT
 */
bool MPU6050::getSlaveDelayEnabled(uint8_t num) {
    // MPU6050_DELAYCTRL_I2C_SLV4_DLY_EN_BIT is 4, SLV3 is 3, etc.
    if (num > 4) return 0;
    I2Cdev::readBit(devAddr, MPU6050_RA_I2C_MST_DELAY_CTRL, num, buffer);
    return buffer[0];
}
/** Set slave delay enabled status.
 * @param num Slave number (0-4)
 * @param enabled New slave delay enabled status.
 * @see MPU6050_RA_I2C_MST_DELAY_CTRL
 * @see MPU6050_DELAYCTRL_I2C_SLV0_DLY_EN_BIT
 */
void MPU6050::setSlaveDelayEnabled(uint8_t num, bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_I2C_MST_DELAY_CTRL, num, enabled);
}

// SIGNAL_PATH_RESET register

/** Reset gyroscope signal path.
 * The reset will revert the signal path analog to digital converters and
 * filters to their power up configurations.
 * @see MPU6050_RA_SIGNAL_PATH_RESET
 * @see MPU6050_PATHRESET_GYRO_RESET_BIT
 */
void MPU6050::resetGyroscopePath() {
    I2Cdev::writeBit(devAddr, MPU6050_RA_SIGNAL_PATH_RESET, MPU6050_PATHRESET_GYRO_RESET_BIT, true);
}
/** Reset accelerometer signal path.
 * The reset will revert the signal path analog to digital converters and
 * filters to their power up configurations.
 * @see MPU6050_RA_SIGNAL_PATH_RESET
 * @see MPU6050_PATHRESET_ACCEL_RESET_BIT
 */
void MPU6050::resetAccelerometerPath() {
    I2Cdev::writeBit(devAddr, MPU6050_RA_SIGNAL_PATH_RESET, MPU6050_PATHRESET_ACCEL_RESET_BIT, true);
}
/** Reset temperature sensor signal path.
 * The reset will revert the signal path analog to digital converters and
 * filters to their power up configurations.
 * @see MPU6050_RA_SIGNAL_PATH_RESET
 * @see MPU6050_PATHRESET_TEMP_RESET_BIT
 */
void MPU6050::resetTemperaturePath() {
    I2Cdev::writeBit(devAddr, MPU6050_RA_SIGNAL_PATH_RESET, MPU6050_PATHRESET_TEMP_RESET_BIT, true);
}

// MOT_DETECT_CTRL register

/** Get accelerometer power-on delay.
 * The accelerometer data path provides samples to the sensor registers, Motion
 * detection, Zero Motion detection, and Free Fall detection modules. The
 * signal path contains filters which must be flushed on wake-up with new
 * samples before the detection modules begin operations. The default wake-up
 * delay, of 4ms can be lengthened by up to 3ms. This additional delay is
 * specified in ACCEL_ON_DELAY in units of 1 LSB = 1 ms. The user may select
 * any value above zero unless instructed otherwise by InvenSense. Please refer
 * to Section 8 of the MPU-6000/MPU-6050 Product Specification document for
 * further information regarding the detection modules.
 * @return Current accelerometer power-on delay
 * @see MPU6050_RA_MOT_DETECT_CTRL
 * @see MPU6050_DETECT_ACCEL_ON_DELAY_BIT
 */
uint8_t MPU6050::getAccelerometerPowerOnDelay() {
    I2Cdev::readBits(devAddr, MPU6050_RA_MOT_DETECT_CTRL, MPU6050_DETECT_ACCEL_ON_DELAY_BIT, MPU6050_DETECT_ACCEL_ON_DELAY_LENGTH, buffer);
    return buffer[0];
}
/** Set accelerometer power-on delay.
 * @param delay New accelerometer power-on delay (0-3)
 * @see getAccelerometerPowerOnDelay()
 * @see MPU6050_RA_MOT_DETECT_CTRL
 * @see MPU6050_DETECT_ACCEL_ON_DELAY_BIT
 */
void MPU6050::setAccelerometerPowerOnDelay(uint8_t delay) {
    I2Cdev::writeBits(devAddr, MPU6050_RA_MOT_DETECT_CTRL, MPU6050_DETECT_ACCEL_ON_DELAY_BIT, MPU6050_DETECT_ACCEL_ON_DELAY_LENGTH, delay);
}
/** Get Free Fall detection counter decrement configuration.
 * Detection is registered by the Free Fall detection module after accelerometer
 * measurements meet their respective threshold conditions over a specified
 * number of samples. When the threshold conditions are met, the corresponding
 * detection counter increments by 1. The user may control the rate at which the
 * detection counter decrements when the threshold condition is not met by
 * configuring FF_COUNT. The decrement rate can be set according to the
 * following table:
 *
 * <pre>
 * FF_COUNT | Counter Decrement
 * ---------+------------------
 * 0        | Reset
 * 1        | 1
 * 2        | 2
 * 3        | 4
 * </pre>
 *
 * When FF_COUNT is configured to 0 (reset), any non-qualifying sample will
 * reset the counter to 0. For further information on Free Fall detection,
 * please refer to Registers 29 to 32.
 *
 * @return Current decrement configuration
 * @see MPU6050_RA_MOT_DETECT_CTRL
 * @see MPU6050_DETECT_FF_COUNT_BIT
 */
uint8_t MPU6050::getFreefallDetectionCounterDecrement() {
    I2Cdev::readBits(devAddr, MPU6050_RA_MOT_DETECT_CTRL, MPU6050_DETECT_FF_COUNT_BIT, MPU6050_DETECT_FF_COUNT_LENGTH, buffer);
    return buffer[0];
}
/** Set Free Fall detection counter decrement configuration.
 * @param decrement New decrement configuration value
 * @see getFreefallDetectionCounterDecrement()
 * @see MPU6050_RA_MOT_DETECT_CTRL
 * @see MPU6050_DETECT_FF_COUNT_BIT
 */
void MPU6050::setFreefallDetectionCounterDecrement(uint8_t decrement) {
    I2Cdev::writeBits(devAddr, MPU6050_RA_MOT_DETECT_CTRL, MPU6050_DETECT_FF_COUNT_BIT, MPU6050_DETECT_FF_COUNT_LENGTH, decrement);
}
/** Get Motion detection counter decrement configuration.
 * Detection is registered by the Motion detection module after accelerometer
 * measurements meet their respective threshold conditions over a specified
 * number of samples. When the threshold conditions are met, the corresponding
 * detection counter increments by 1. The user may control the rate at which the
 * detection counter decrements when the threshold condition is not met by
 * configuring MOT_COUNT. The decrement rate can be set according to the
 * following table:
 *
 * <pre>
 * MOT_COUNT | Counter Decrement
 * ----------+------------------
 * 0         | Reset
 * 1         | 1
 * 2         | 2
 * 3         | 4
 * </pre>
 *
 * When MOT_COUNT is configured to 0 (reset), any non-qualifying sample will
 * reset the counter to 0. For further information on Motion detection,
 * please refer to Registers 29 to 32.
 *
 */
uint8_t MPU6050::getMotionDetectionCounterDecrement() {
    I2Cdev::readBits(devAddr, MPU6050_RA_MOT_DETECT_CTRL, MPU6050_DETECT_MOT_COUNT_BIT, MPU6050_DETECT_MOT_COUNT_LENGTH, buffer);
    return buffer[0];
}
/** Set Motion detection counter decrement configuration.
 * @param decrement New decrement configuration value
 * @see getMotionDetectionCounterDecrement()
 * @see MPU6050_RA_MOT_DETECT_CTRL
 * @see MPU6050_DETECT_MOT_COUNT_BIT
 */
void MPU6050::setMotionDetectionCounterDecrement(uint8_t decrement) {
    I2Cdev::writeBits(devAddr, MPU6050_RA_MOT_DETECT_CTRL, MPU6050_DETECT_MOT_COUNT_BIT, MPU6050_DETECT_MOT_COUNT_LENGTH, decrement);
}

// USER_CTRL register

/** Get FIFO enabled status.
 * When this bit is set to 0, the FIFO buffer is disabled. The FIFO buffer
 * cannot be written to or read from while disabled. The FIFO buffer's state
 * does not change unless the MPU-60X0 is power cycled.
 * @return Current FIFO enabled status
 * @see MPU6050_RA_USER_CTRL
 * @see MPU6050_USERCTRL_FIFO_EN_BIT
 */
bool MPU6050::getFIFOEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_USER_CTRL, MPU6050_USERCTRL_FIFO_EN_BIT, buffer);
    return buffer[0];
}
/** Set FIFO enabled status.
 * @param enabled New FIFO enabled status
 * @see getFIFOEnabled()
 * @see MPU6050_RA_USER_CTRL
 * @see MPU6050_USERCTRL_FIFO_EN_BIT
 */
void MPU6050::setFIFOEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_USER_CTRL, MPU6050_USERCTRL_FIFO_EN_BIT, enabled);
}
/** Get I2C Master Mode enabled status.
 * When this mode is enabled, the MPU-60X0 acts as the I2C Master to the
 * external sensor slave devices on the auxiliary I2C bus. When this bit is
 * cleared to 0, the auxiliary I2C bus lines (AUX_DA and AUX_CL) are logically
 * driven by the primary I2C bus (SDA and SCL). This is a precondition to
 * enabling Bypass Mode. For further information regarding Bypass Mode, please
 * refer to Register 55.
 * @return Current I2C Master Mode enabled status
 * @see MPU6050_RA_USER_CTRL
 * @see MPU6050_USERCTRL_I2C_MST_EN_BIT
 */
bool MPU6050::getI2CMasterModeEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_USER_CTRL, MPU6050_USERCTRL_I2C_MST_EN_BIT, buffer);
    return buffer[0];
}
/** Set I2C Master Mode enabled status.
 * @param enabled New I2C Master Mode enabled status
 * @see getI2CMasterModeEnabled()
 * @see MPU6050_RA_USER_CTRL
 * @see MPU6050_USERCTRL_I2C_MST_EN_BIT
 */
void MPU6050::setI2CMasterModeEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_USER_CTRL, MPU6050_USERCTRL_I2C_MST_EN_BIT, enabled);
}
/** Switch from I2C to SPI mode (MPU-6000 only)
 * If this is set, the primary SPI interface will be enabled in place of the
 * disabled primary I2C interface.
 */
void MPU6050::switchSPIEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_USER_CTRL, MPU6050_USERCTRL_I2C_IF_DIS_BIT, enabled);
}
/** Reset the FIFO.
 * This bit resets the FIFO buffer when set to 1 while FIFO_EN equals 0. This
 * bit automatically clears to 0 after the reset has been triggered.
 * @see MPU6050_RA_USER_CTRL
 * @see MPU6050_USERCTRL_FIFO_RESET_BIT
 */
void MPU6050::resetFIFO() {
    I2Cdev::writeBit(devAddr, MPU6050_RA_USER_CTRL, MPU6050_USERCTRL_FIFO_RESET_BIT, true);
}
/** Reset the I2C Master.
 * This bit resets the I2C Master when set to 1 while I2C_MST_EN equals 0.
 * This bit automatically clears to 0 after the reset has been triggered.
 * @see MPU6050_RA_USER_CTRL
 * @see MPU6050_USERCTRL_I2C_MST_RESET_BIT
 */
void MPU6050::resetI2CMaster() {
    I2Cdev::writeBit(devAddr, MPU6050_RA_USER_CTRL, MPU6050_USERCTRL_I2C_MST_RESET_BIT, true);
}
/** Reset all sensor registers and signal paths.
 * When set to 1, this bit resets the signal paths for all sensors (gyroscopes,
 * accelerometers, and temperature sensor). This operation will also clear the
 * sensor registers. This bit automatically clears to 0 after the reset has been
 * triggered.
 *
 * When resetting only the signal path (and not the sensor registers), please
 * use Register 104, SIGNAL_PATH_RESET.
 *
 * @see MPU6050_RA_USER_CTRL
 * @see MPU6050_USERCTRL_SIG_COND_RESET_BIT
 */
void MPU6050::resetSensors() {
    I2Cdev::writeBit(devAddr, MPU6050_RA_USER_CTRL, MPU6050_USERCTRL_SIG_COND_RESET_BIT, true);
}

// PWR_MGMT_1 register

/** Trigger a full device reset.
 * A small delay of ~50ms may be desirable after triggering a reset.
 * @see MPU6050_RA_PWR_MGMT_1
 * @see MPU6050_PWR1_DEVICE_RESET_BIT
 */
void MPU6050::reset() {
    I2Cdev::writeBit(devAddr, MPU6050_RA_PWR_MGMT_1, MPU6050_PWR1_DEVICE_RESET_BIT, true);
}
/** Get sleep mode status.
 * Setting the SLEEP bit in the register puts the device into very low power
 * sleep mode. In this mode, only the serial interface and internal registers
 * remain active, allowing for a very low standby current. Clearing this bit
 * puts the device back into normal mode. To save power, the individual standby
 * selections for each of the gyros should be used if any gyro axis is not used
 * by the application.
 * @return Current sleep mode enabled status
 * @see MPU6050_RA_PWR_MGMT_1
 * @see MPU6050_PWR1_SLEEP_BIT
 */
bool MPU6050::getSleepEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_PWR_MGMT_1, MPU6050_PWR1_SLEEP_BIT, buffer);
    return buffer[0];
}
/** Set sleep mode status.
 * @param enabled New sleep mode enabled status
 * @see getSleepEnabled()
 * @see MPU6050_RA_PWR_MGMT_1
 * @see MPU6050_PWR1_SLEEP_BIT
 */
void MPU6050::setSleepEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_PWR_MGMT_1, MPU6050_PWR1_SLEEP_BIT, enabled);
}
/** Get wake cycle enabled status.
 * When this bit is set to 1 and SLEEP is disabled, the MPU-60X0 will cycle
 * between sleep mode and waking up to take a single sample of data from active
 * sensors at a rate determined by LP_WAKE_CTRL (register 108).
 * @return Current sleep mode enabled status
 * @see MPU6050_RA_PWR_MGMT_1
 * @see MPU6050_PWR1_CYCLE_BIT
 */
bool MPU6050::getWakeCycleEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_PWR_MGMT_1, MPU6050_PWR1_CYCLE_BIT, buffer);
    return buffer[0];
}
/** Set wake cycle enabled status.
 * @param enabled New sleep mode enabled status
 * @see getWakeCycleEnabled()
 * @see MPU6050_RA_PWR_MGMT_1
 * @see MPU6050_PWR1_CYCLE_BIT
 */
void MPU6050::setWakeCycleEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_PWR_MGMT_1, MPU6050_PWR1_CYCLE_BIT, enabled);
}
/** Get temperature sensor enabled status.
 * Control the usage of the internal temperature sensor.
 *
 * Note: this register stores the *disabled* value, but for consistency with the
 * rest of the code, the function is named and used with standard true/false
 * values to indicate whether the sensor is enabled or disabled, respectively.
 *
 * @return Current temperature sensor enabled status
 * @see MPU6050_RA_PWR_MGMT_1
 * @see MPU6050_PWR1_TEMP_DIS_BIT
 */
bool MPU6050::getTempSensorEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_PWR_MGMT_1, MPU6050_PWR1_TEMP_DIS_BIT, buffer);
    return buffer[0] == 0; // 1 is actually disabled here
}
/** Set temperature sensor enabled status.
 * Note: this register stores the *disabled* value, but for consistency with the
 * rest of the code, the function is named and used with standard true/false
 * values to indicate whether the sensor is enabled or disabled, respectively.
 *
 * @param enabled New temperature sensor enabled status
 * @see getTempSensorEnabled()
 * @see MPU6050_RA_PWR_MGMT_1
 * @see MPU6050_PWR1_TEMP_DIS_BIT
 */
void MPU6050::setTempSensorEnabled(bool enabled) {
    // 1 is actually disabled here
    I2Cdev::writeBit(devAddr, MPU6050_RA_PWR_MGMT_1, MPU6050_PWR1_TEMP_DIS_BIT, !enabled);
}
/** Get clock source setting.
 * @return Current clock source setting
 * @see MPU6050_RA_PWR_MGMT_1
 * @see MPU6050_PWR1_CLKSEL_BIT
 * @see MPU6050_PWR1_CLKSEL_LENGTH
 */
uint8_t MPU6050::getClockSource() {
    I2Cdev::readBits(devAddr, MPU6050_RA_PWR_MGMT_1, MPU6050_PWR1_CLKSEL_BIT, MPU6050_PWR1_CLKSEL_LENGTH, buffer);
    return buffer[0];
}
/** Set clock source setting.
 * An internal 8MHz oscillator, gyroscope based clock, or external sources can
 * be selected as the MPU-60X0 clock source. When the internal 8 MHz oscillator
 * or an external source is chosen as the clock source, the MPU-60X0 can operate
 * in low power modes with the gyroscopes disabled.
 *
 * Upon power up, the MPU-60X0 clock source defaults to the internal oscillator.
 * However, it is highly recommended that the device be configured to use one of
 * the gyroscopes (or an external clock source) as the clock reference for
 * improved stability. The clock source can be selected according to the following table:
 *
 * <pre>
 * CLK_SEL | Clock Source
 * --------+--------------------------------------
 * 0       | Internal oscillator
 * 1       | PLL with X Gyro reference
 * 2       | PLL with Y Gyro reference
 * 3       | PLL with Z Gyro reference
 * 4       | PLL with external 32.768kHz reference
 * 5       | PLL with external 19.2MHz reference
 * 6       | Reserved
 * 7       | Stops the clock and keeps the timing generator in reset
 * </pre>
 *
 * @param source New clock source setting
 * @see getClockSource()
 * @see MPU6050_RA_PWR_MGMT_1
 * @see MPU6050_PWR1_CLKSEL_BIT
 * @see MPU6050_PWR1_CLKSEL_LENGTH
 */
void MPU6050::setClockSource(uint8_t source) {
    I2Cdev::writeBits(devAddr, MPU6050_RA_PWR_MGMT_1, MPU6050_PWR1_CLKSEL_BIT, MPU6050_PWR1_CLKSEL_LENGTH, source);
}

// PWR_MGMT_2 register

/** Get wake frequency in Accel-Only Low Power Mode.
 * The MPU-60X0 can be put into Accerlerometer Only Low Power Mode by setting
 * PWRSEL to 1 in the Power Management 1 register (Register 107). In this mode,
 * the device will power off all devices except for the primary I2C interface,
 * waking only the accelerometer at fixed intervals to take a single
 * measurement. The frequency of wake-ups can be configured with LP_WAKE_CTRL
 * as shown below:
 *
 * <pre>
 * LP_WAKE_CTRL | Wake-up Frequency
 * -------------+------------------
 * 0            | 1.25 Hz
 * 1            | 2.5 Hz
 * 2            | 5 Hz
 * 3            | 10 Hz
 * </pre>
 *
 * For further information regarding the MPU-60X0's power modes, please refer to
 * Register 107.
 *
 * @return Current wake frequency
 * @see MPU6050_RA_PWR_MGMT_2
 */
uint8_t MPU6050::getWakeFrequency() {
    I2Cdev::readBits(devAddr, MPU6050_RA_PWR_MGMT_2, MPU6050_PWR2_LP_WAKE_CTRL_BIT, MPU6050_PWR2_LP_WAKE_CTRL_LENGTH, buffer);
    return buffer[0];
}
/** Set wake frequency in Accel-Only Low Power Mode.
 * @param frequency New wake frequency
 * @see MPU6050_RA_PWR_MGMT_2
 */
void MPU6050::setWakeFrequency(uint8_t frequency) {
    I2Cdev::writeBits(devAddr, MPU6050_RA_PWR_MGMT_2, MPU6050_PWR2_LP_WAKE_CTRL_BIT, MPU6050_PWR2_LP_WAKE_CTRL_LENGTH, frequency);
}

/** Get X-axis accelerometer standby enabled status.
 * If enabled, the X-axis will not gather or report data (or use power).
 * @return Current X-axis standby enabled status
 * @see MPU6050_RA_PWR_MGMT_2
 * @see MPU6050_PWR2_STBY_XA_BIT
 */
bool MPU6050::getStandbyXAccelEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_PWR_MGMT_2, MPU6050_PWR2_STBY_XA_BIT, buffer);
    return buffer[0];
}
/** Set X-axis accelerometer standby enabled status.
 * @param New X-axis standby enabled status
 * @see getStandbyXAccelEnabled()
 * @see MPU6050_RA_PWR_MGMT_2
 * @see MPU6050_PWR2_STBY_XA_BIT
 */
void MPU6050::setStandbyXAccelEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_PWR_MGMT_2, MPU6050_PWR2_STBY_XA_BIT, enabled);
}
/** Get Y-axis accelerometer standby enabled status.
 * If enabled, the Y-axis will not gather or report data (or use power).
 * @return Current Y-axis standby enabled status
 * @see MPU6050_RA_PWR_MGMT_2
 * @see MPU6050_PWR2_STBY_YA_BIT
 */
bool MPU6050::getStandbyYAccelEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_PWR_MGMT_2, MPU6050_PWR2_STBY_YA_BIT, buffer);
    return buffer[0];
}
/** Set Y-axis accelerometer standby enabled status.
 * @param New Y-axis standby enabled status
 * @see getStandbyYAccelEnabled()
 * @see MPU6050_RA_PWR_MGMT_2
 * @see MPU6050_PWR2_STBY_YA_BIT
 */
void MPU6050::setStandbyYAccelEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_PWR_MGMT_2, MPU6050_PWR2_STBY_YA_BIT, enabled);
}
/** Get Z-axis accelerometer standby enabled status.
 * If enabled, the Z-axis will not gather or report data (or use power).
 * @return Current Z-axis standby enabled status
 * @see MPU6050_RA_PWR_MGMT_2
 * @see MPU6050_PWR2_STBY_ZA_BIT
 */
bool MPU6050::getStandbyZAccelEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_PWR_MGMT_2, MPU6050_PWR2_STBY_ZA_BIT, buffer);
    return buffer[0];
}
/** Set Z-axis accelerometer standby enabled status.
 * @param New Z-axis standby enabled status
 * @see getStandbyZAccelEnabled()
 * @see MPU6050_RA_PWR_MGMT_2
 * @see MPU6050_PWR2_STBY_ZA_BIT
 */
void MPU6050::setStandbyZAccelEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_PWR_MGMT_2, MPU6050_PWR2_STBY_ZA_BIT, enabled);
}
/** Get X-axis gyroscope standby enabled status.
 * If enabled, the X-axis will not gather or report data (or use power).
 * @return Current X-axis standby enabled status
 * @see MPU6050_RA_PWR_MGMT_2
 * @see MPU6050_PWR2_STBY_XG_BIT
 */
bool MPU6050::getStandbyXGyroEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_PWR_MGMT_2, MPU6050_PWR2_STBY_XG_BIT, buffer);
    return buffer[0];
}
/** Set X-axis gyroscope standby enabled status.
 * @param New X-axis standby enabled status
 * @see getStandbyXGyroEnabled()
 * @see MPU6050_RA_PWR_MGMT_2
 * @see MPU6050_PWR2_STBY_XG_BIT
 */
void MPU6050::setStandbyXGyroEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_PWR_MGMT_2, MPU6050_PWR2_STBY_XG_BIT, enabled);
}
/** Get Y-axis gyroscope standby enabled status.
 * If enabled, the Y-axis will not gather or report data (or use power).
 * @return Current Y-axis standby enabled status
 * @see MPU6050_RA_PWR_MGMT_2
 * @see MPU6050_PWR2_STBY_YG_BIT
 */
bool MPU6050::getStandbyYGyroEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_PWR_MGMT_2, MPU6050_PWR2_STBY_YG_BIT, buffer);
    return buffer[0];
}
/** Set Y-axis gyroscope standby enabled status.
 * @param New Y-axis standby enabled status
 * @see getStandbyYGyroEnabled()
 * @see MPU6050_RA_PWR_MGMT_2
 * @see MPU6050_PWR2_STBY_YG_BIT
 */
void MPU6050::setStandbyYGyroEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_PWR_MGMT_2, MPU6050_PWR2_STBY_YG_BIT, enabled);
}
/** Get Z-axis gyroscope standby enabled status.
 * If enabled, the Z-axis will not gather or report data (or use power).
 * @return Current Z-axis standby enabled status
 * @see MPU6050_RA_PWR_MGMT_2
 * @see MPU6050_PWR2_STBY_ZG_BIT
 */
bool MPU6050::getStandbyZGyroEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_PWR_MGMT_2, MPU6050_PWR2_STBY_ZG_BIT, buffer);
    return buffer[0];
}
/** Set Z-axis gyroscope standby enabled status.
 * @param New Z-axis standby enabled status
 * @see getStandbyZGyroEnabled()
 * @see MPU6050_RA_PWR_MGMT_2
 * @see MPU6050_PWR2_STBY_ZG_BIT
 */
void MPU6050::setStandbyZGyroEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_PWR_MGMT_2, MPU6050_PWR2_STBY_ZG_BIT, enabled);
}

// FIFO_COUNT* registers

/** Get current FIFO buffer size.
 * This value indicates the number of bytes stored in the FIFO buffer. This
 * number is in turn the number of bytes that can be read from the FIFO buffer
 * and it is directly proportional to the number of samples available given the
 * set of sensor data bound to be stored in the FIFO (register 35 and 36).
 * @return Current FIFO buffer size
 */
uint16_t MPU6050::getFIFOCount() {
    I2Cdev::readBytes(devAddr, MPU6050_RA_FIFO_COUNTH, 2, buffer);
    return (((uint16_t)buffer[0]) << 8) | buffer[1];
}

// FIFO_R_W register

/** Get byte from FIFO buffer.
 * This register is used to read and write data from the FIFO buffer. Data is
 * written to the FIFO in order of register number (from lowest to highest). If
 * all the FIFO enable flags (see below) are enabled and all External Sensor
 * Data registers (Registers 73 to 96) are associated with a Slave device, the
 * contents of registers 59 through 96 will be written in order at the Sample
 * Rate.
 *
 * The contents of the sensor data registers (Registers 59 to 96) are written
 * into the FIFO buffer when their corresponding FIFO enable flags are set to 1
 * in FIFO_EN (Register 35). An additional flag for the sensor data registers
 * associated with I2C Slave 3 can be found in I2C_MST_CTRL (Register 36).
 *
 * If the FIFO buffer has overflowed, the status bit FIFO_OFLOW_INT is
 * automatically set to 1. This bit is located in INT_STATUS (Register 58).
 * When the FIFO buffer has overflowed, the oldest data will be lost and new
 * data will be written to the FIFO.
 *
 * If the FIFO buffer is empty, reading this register will return the last byte
 * that was previously read from the FIFO until new data is available. The user
 * should check FIFO_COUNT to ensure that the FIFO buffer is not read when
 * empty.
 *
 * @return Byte from FIFO buffer
 */
uint8_t MPU6050::getFIFOByte() {
    I2Cdev::readByte(devAddr, MPU6050_RA_FIFO_R_W, buffer);
    return buffer[0];
}
void MPU6050::getFIFOBytes(uint8_t *data, uint8_t length) {
    if(length > 0){
        I2Cdev::readBytes(devAddr, MPU6050_RA_FIFO_R_W, length, data);
    } else {
    	*data = 0;
    }
}
/** Write byte to FIFO buffer.
 * @see getFIFOByte()
 * @see MPU6050_RA_FIFO_R_W
 */
void MPU6050::setFIFOByte(uint8_t data) {
    I2Cdev::writeByte(devAddr, MPU6050_RA_FIFO_R_W, data);
}

// WHO_AM_I register

/** Get Device ID.
 * This register is used to verify the identity of the device (0b110100, 0x34).
 * @return Device ID (6 bits only! should be 0x34)
 * @see MPU6050_RA_WHO_AM_I
 * @see MPU6050_WHO_AM_I_BIT
 * @see MPU6050_WHO_AM_I_LENGTH
 */
uint8_t MPU6050::getDeviceID() {
    I2Cdev::readBits(devAddr, MPU6050_RA_WHO_AM_I, MPU6050_WHO_AM_I_BIT, MPU6050_WHO_AM_I_LENGTH, buffer);
    return buffer[0];
}
/** Set Device ID.
 * Write a new ID into the WHO_AM_I register (no idea why this should ever be
 * necessary though).
 * @param id New device ID to set.
 * @see getDeviceID()
 * @see MPU6050_RA_WHO_AM_I
 * @see MPU6050_WHO_AM_I_BIT
 * @see MPU6050_WHO_AM_I_LENGTH
 */
void MPU6050::setDeviceID(uint8_t id) {
    I2Cdev::writeBits(devAddr, MPU6050_RA_WHO_AM_I, MPU6050_WHO_AM_I_BIT, MPU6050_WHO_AM_I_LENGTH, id);
}

// ======== UNDOCUMENTED/DMP REGISTERS/METHODS ========

// XG_OFFS_TC register

uint8_t MPU6050::getOTPBankValid() {
    I2Cdev::readBit(devAddr, MPU6050_RA_XG_OFFS_TC, MPU6050_TC_OTP_BNK_VLD_BIT, buffer);
    return buffer[0];
}
void MPU6050::setOTPBankValid(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_XG_OFFS_TC, MPU6050_TC_OTP_BNK_VLD_BIT, enabled);
}
int8_t MPU6050::getXGyroOffsetTC() {
    I2Cdev::readBits(devAddr, MPU6050_RA_XG_OFFS_TC, MPU6050_TC_OFFSET_BIT, MPU6050_TC_OFFSET_LENGTH, buffer);
    return buffer[0];
}
void MPU6050::setXGyroOffsetTC(int8_t offset) {
    I2Cdev::writeBits(devAddr, MPU6050_RA_XG_OFFS_TC, MPU6050_TC_OFFSET_BIT, MPU6050_TC_OFFSET_LENGTH, offset);
}

// YG_OFFS_TC register

int8_t MPU6050::getYGyroOffsetTC() {
    I2Cdev::readBits(devAddr, MPU6050_RA_YG_OFFS_TC, MPU6050_TC_OFFSET_BIT, MPU6050_TC_OFFSET_LENGTH, buffer);
    return buffer[0];
}
void MPU6050::setYGyroOffsetTC(int8_t offset) {
    I2Cdev::writeBits(devAddr, MPU6050_RA_YG_OFFS_TC, MPU6050_TC_OFFSET_BIT, MPU6050_TC_OFFSET_LENGTH, offset);
}

// ZG_OFFS_TC register

int8_t MPU6050::getZGyroOffsetTC() {
    I2Cdev::readBits(devAddr, MPU6050_RA_ZG_OFFS_TC, MPU6050_TC_OFFSET_BIT, MPU6050_TC_OFFSET_LENGTH, buffer);
    return buffer[0];
}
void MPU6050::setZGyroOffsetTC(int8_t offset) {
    I2Cdev::writeBits(devAddr, MPU6050_RA_ZG_OFFS_TC, MPU6050_TC_OFFSET_BIT, MPU6050_TC_OFFSET_LENGTH, offset);
}

// X_FINE_GAIN register

int8_t MPU6050::getXFineGain() {
    I2Cdev::readByte(devAddr, MPU6050_RA_X_FINE_GAIN, buffer);
    return buffer[0];
}
void MPU6050::setXFineGain(int8_t gain) {
    I2Cdev::writeByte(devAddr, MPU6050_RA_X_FINE_GAIN, gain);
}

// Y_FINE_GAIN register

int8_t MPU6050::getYFineGain() {
    I2Cdev::readByte(devAddr, MPU6050_RA_Y_FINE_GAIN, buffer);
    return buffer[0];
}
void MPU6050::setYFineGain(int8_t gain) {
    I2Cdev::writeByte(devAddr, MPU6050_RA_Y_FINE_GAIN, gain);
}

// Z_FINE_GAIN register

int8_t MPU6050::getZFineGain() {
    I2Cdev::readByte(devAddr, MPU6050_RA_Z_FINE_GAIN, buffer);
    return buffer[0];
}
void MPU6050::setZFineGain(int8_t gain) {
    I2Cdev::writeByte(devAddr, MPU6050_RA_Z_FINE_GAIN, gain);
}

// XA_OFFS_* registers

int16_t MPU6050::getXAccelOffset() {
    I2Cdev::readBytes(devAddr, MPU6050_RA_XA_OFFS_H, 2, buffer);
    return (((int16_t)buffer[0]) << 8) | buffer[1];
}
void MPU6050::setXAccelOffset(int16_t offset) {
    I2Cdev::writeWord(devAddr, MPU6050_RA_XA_OFFS_H, offset);
}

// YA_OFFS_* register

int16_t MPU6050::getYAccelOffset() {
    I2Cdev::readBytes(devAddr, MPU6050_RA_YA_OFFS_H, 2, buffer);
    return (((int16_t)buffer[0]) << 8) | buffer[1];
}
void MPU6050::setYAccelOffset(int16_t offset) {
    I2Cdev::writeWord(devAddr, MPU6050_RA_YA_OFFS_H, offset);
}

// ZA_OFFS_* register

int16_t MPU6050::getZAccelOffset() {
    I2Cdev::readBytes(devAddr, MPU6050_RA_ZA_OFFS_H, 2, buffer);
    return (((int16_t)buffer[0]) << 8) | buffer[1];
}
void MPU6050::setZAccelOffset(int16_t offset) {
    I2Cdev::writeWord(devAddr, MPU6050_RA_ZA_OFFS_H, offset);
}

// XG_OFFS_USR* registers

int16_t MPU6050::getXGyroOffset() {
    I2Cdev::readBytes(devAddr, MPU6050_RA_XG_OFFS_USRH, 2, buffer);
    return (((int16_t)buffer[0]) << 8) | buffer[1];
}
void MPU6050::setXGyroOffset(int16_t offset) {
    I2Cdev::writeWord(devAddr, MPU6050_RA_XG_OFFS_USRH, offset);
}

// YG_OFFS_USR* register

int16_t MPU6050::getYGyroOffset() {
    I2Cdev::readBytes(devAddr, MPU6050_RA_YG_OFFS_USRH, 2, buffer);
    return (((int16_t)buffer[0]) << 8) | buffer[1];
}
void MPU6050::setYGyroOffset(int16_t offset) {
    I2Cdev::writeWord(devAddr, MPU6050_RA_YG_OFFS_USRH, offset);
}

// ZG_OFFS_USR* register

int16_t MPU6050::getZGyroOffset() {
    I2Cdev::readBytes(devAddr, MPU6050_RA_ZG_OFFS_USRH, 2, buffer);
    return (((int16_t)buffer[0]) << 8) | buffer[1];
}
void MPU6050::setZGyroOffset(int16_t offset) {
    I2Cdev::writeWord(devAddr, MPU6050_RA_ZG_OFFS_USRH, offset);
}

// INT_ENABLE register (DMP functions)

bool MPU6050::getIntPLLReadyEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_INT_ENABLE, MPU6050_INTERRUPT_PLL_RDY_INT_BIT, buffer);
    return buffer[0];
}
void MPU6050::setIntPLLReadyEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_INT_ENABLE, MPU6050_INTERRUPT_PLL_RDY_INT_BIT, enabled);
}
bool MPU6050::getIntDMPEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_INT_ENABLE, MPU6050_INTERRUPT_DMP_INT_BIT, buffer);
    return buffer[0];
}
void MPU6050::setIntDMPEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_INT_ENABLE, MPU6050_INTERRUPT_DMP_INT_BIT, enabled);
}

// DMP_INT_STATUS

bool MPU6050::getDMPInt5Status() {
    I2Cdev::readBit(devAddr, MPU6050_RA_DMP_INT_STATUS, MPU6050_DMPINT_5_BIT, buffer);
    return buffer[0];
}
bool MPU6050::getDMPInt4Status() {
    I2Cdev::readBit(devAddr, MPU6050_RA_DMP_INT_STATUS, MPU6050_DMPINT_4_BIT, buffer);
    return buffer[0];
}
bool MPU6050::getDMPInt3Status() {
    I2Cdev::readBit(devAddr, MPU6050_RA_DMP_INT_STATUS, MPU6050_DMPINT_3_BIT, buffer);
    return buffer[0];
}
bool MPU6050::getDMPInt2Status() {
    I2Cdev::readBit(devAddr, MPU6050_RA_DMP_INT_STATUS, MPU6050_DMPINT_2_BIT, buffer);
    return buffer[0];
}
bool MPU6050::getDMPInt1Status() {
    I2Cdev::readBit(devAddr, MPU6050_RA_DMP_INT_STATUS, MPU6050_DMPINT_1_BIT, buffer);
    return buffer[0];
}
bool MPU6050::getDMPInt0Status() {
    I2Cdev::readBit(devAddr, MPU6050_RA_DMP_INT_STATUS, MPU6050_DMPINT_0_BIT, buffer);
    return buffer[0];
}

// INT_STATUS register (DMP functions)

bool MPU6050::getIntPLLReadyStatus() {
    I2Cdev::readBit(devAddr, MPU6050_RA_INT_STATUS, MPU6050_INTERRUPT_PLL_RDY_INT_BIT, buffer);
    return buffer[0];
}
bool MPU6050::getIntDMPStatus() {
    I2Cdev::readBit(devAddr, MPU6050_RA_INT_STATUS, MPU6050_INTERRUPT_DMP_INT_BIT, buffer);
    return buffer[0];
}

// USER_CTRL register (DMP functions)

bool MPU6050::getDMPEnabled() {
    I2Cdev::readBit(devAddr, MPU6050_RA_USER_CTRL, MPU6050_USERCTRL_DMP_EN_BIT, buffer);
    return buffer[0];
}
void MPU6050::setDMPEnabled(bool enabled) {
    I2Cdev::writeBit(devAddr, MPU6050_RA_USER_CTRL, MPU6050_USERCTRL_DMP_EN_BIT, enabled);
}
void MPU6050::resetDMP() {
    I2Cdev::writeBit(devAddr, MPU6050_RA_USER_CTRL, MPU6050_USERCTRL_DMP_RESET_BIT, true);
}

// BANK_SEL register

void MPU6050::setMemoryBank(uint8_t bank, bool prefetchEnabled, bool userBank) {
    bank &= 0x1F;
    if (userBank) bank |= 0x20;
    if (prefetchEnabled) bank |= 0x40;
    I2Cdev::writeByte(devAddr, MPU6050_RA_BANK_SEL, bank);
}

// MEM_START_ADDR register

void MPU6050::setMemoryStartAddress(uint8_t address) {
    I2Cdev::writeByte(devAddr, MPU6050_RA_MEM_START_ADDR, address);
}

// MEM_R_W register

uint8_t MPU6050::readMemoryByte() {
    I2Cdev::readByte(devAddr, MPU6050_RA_MEM_R_W, buffer);
    return buffer[0];
}
void MPU6050::writeMemoryByte(uint8_t data) {
    I2Cdev::writeByte(devAddr, MPU6050_RA_MEM_R_W, data);
}
void MPU6050::readMemoryBlock(uint8_t *data, uint16_t dataSize, uint8_t bank, uint8_t address) {
    setMemoryBank(bank);
    setMemoryStartAddress(address);
    uint8_t chunkSize;
    for (uint16_t i = 0; i < dataSize;) {
        // determine correct chunk size according to bank position and data size
        chunkSize = MPU6050_DMP_MEMORY_CHUNK_SIZE;

        // make sure we don't go past the data size
        if (i + chunkSize > dataSize) chunkSize = dataSize - i;

        // make sure this chunk doesn't go past the bank boundary (256 bytes)
        if (chunkSize > 256 - address) chunkSize = 256 - address;

        // read the chunk of data as specified
        I2Cdev::readBytes(devAddr, MPU6050_RA_MEM_R_W, chunkSize, data + i);
        
        // increase byte index by [chunkSize]
        i += chunkSize;

        // uint8_t automatically wraps to 0 at 256
        address += chunkSize;

        // if we aren't done, update bank (if necessary) and address
        if (i < dataSize) {
            if (address == 0) bank++;
            setMemoryBank(bank);
            setMemoryStartAddress(address);
        }
    }
}
bool MPU6050::writeMemoryBlock(const uint8_t *data, uint16_t dataSize, uint8_t bank, uint8_t address, bool verify, bool useProgMem) {
    setMemoryBank(bank);
    setMemoryStartAddress(address);
    uint8_t chunkSize;
    uint8_t *verifyBuffer;
    uint8_t *progBuffer=0;
    uint16_t i;
    uint8_t j;
    if (verify) verifyBuffer = (uint8_t *)malloc(MPU6050_DMP_MEMORY_CHUNK_SIZE);
    if (useProgMem) progBuffer = (uint8_t *)malloc(MPU6050_DMP_MEMORY_CHUNK_SIZE);
    for (i = 0; i < dataSize;) {
        // determine correct chunk size according to bank position and data size
        chunkSize = MPU6050_DMP_MEMORY_CHUNK_SIZE;

        // make sure we don't go past the data size
        if (i + chunkSize > dataSize) chunkSize = dataSize - i;

        // make sure this chunk doesn't go past the bank boundary (256 bytes)
        if (chunkSize > 256 - address) chunkSize = 256 - address;
        
        if (useProgMem) {
            // write the chunk of data as specified
            for (j = 0; j < chunkSize; j++) progBuffer[j] = pgm_read_byte(data + i + j);
        } else {
            // write the chunk of data as specified
            progBuffer = (uint8_t *)data + i;
        }

        I2Cdev::writeBytes(devAddr, MPU6050_RA_MEM_R_W, chunkSize, progBuffer);

        // verify data if needed
        if (verify && verifyBuffer) {
            setMemoryBank(bank);
            setMemoryStartAddress(address);
            I2Cdev::readBytes(devAddr, MPU6050_RA_MEM_R_W, chunkSize, verifyBuffer);
            if (memcmp(progBuffer, verifyBuffer, chunkSize) != 0) {
                /*Serial.print("Block write verification error, bank ");
                Serial.print(bank, DEC);
                Serial.print(", address ");
                Serial.print(address, DEC);
                Serial.print("!\nExpected:");
                for (j = 0; j < chunkSize; j++) {
                    Serial.print(" 0x");
                    if (progBuffer[j] < 16) Serial.print("0");
                    Serial.print(progBuffer[j], HEX);
                }
                Serial.print("\nReceived:");
                for (uint8_t j = 0; j < chunkSize; j++) {
                    Serial.print(" 0x");
                    if (verifyBuffer[i + j] < 16) Serial.print("0");
                    Serial.print(verifyBuffer[i + j], HEX);
                }
                Serial.print("\n");*/
                free(verifyBuffer);
                if (useProgMem) free(progBuffer);
                return false; // uh oh.
            }
        }

        // increase byte index by [chunkSize]
        i += chunkSize;

        // uint8_t automatically wraps to 0 at 256
        address += chunkSize;

        // if we aren't done, update bank (if necessary) and address
        if (i < dataSize) {
            if (address == 0) bank++;
            setMemoryBank(bank);
            setMemoryStartAddress(address);
        }
    }
    if (verify) free(verifyBuffer);
    if (useProgMem) free(progBuffer);
    return true;
}
bool MPU6050::writeProgMemoryBlock(const uint8_t *data, uint16_t dataSize, uint8_t bank, uint8_t address, bool verify) {
    return writeMemoryBlock(data, dataSize, bank, address, verify, true);
}
bool MPU6050::writeDMPConfigurationSet(const uint8_t *data, uint16_t dataSize, bool useProgMem) {
    uint8_t *progBuffer = 0;
	uint8_t success, special;
    uint16_t i, j;
    if (useProgMem) {
        progBuffer = (uint8_t *)malloc(8); // assume 8-byte blocks, realloc later if necessary
    }

    // config set data is a long string of blocks with the following structure:
    // [bank] [offset] [length] [byte[0], byte[1], ..., byte[length]]
    uint8_t bank, offset, length;
    for (i = 0; i < dataSize;) {
        if (useProgMem) {
            bank = pgm_read_byte(data + i++);
            offset = pgm_read_byte(data + i++);
            length = pgm_read_byte(data + i++);
        } else {
            bank = data[i++];
            offset = data[i++];
            length = data[i++];
        }

        // write data or perform special action
        if (length > 0) {
            // regular block of data to write
            /*Serial.print("Writing config block to bank ");
            Serial.print(bank);
            Serial.print(", offset ");
            Serial.print(offset);
            Serial.print(", length=");
            Serial.println(length);*/
            if (useProgMem) {
                if (sizeof(progBuffer) < length) progBuffer = (uint8_t *)realloc(progBuffer, length);
                for (j = 0; j < length; j++) progBuffer[j] = pgm_read_byte(data + i + j);
            } else {
                progBuffer = (uint8_t *)data + i;
            }
            success = writeMemoryBlock(progBuffer, length, bank, offset, true);
            i += length;
        } else {
            // special instruction
            // NOTE: this kind of behavior (what and when to do certain things)
            // is totally undocumented. This code is in here based on observed
            // behavior only, and exactly why (or even whether) it has to be here
            // is anybody's guess for now.
            if (useProgMem) {
                special = pgm_read_byte(data + i++);
            } else {
                special = data[i++];
            }
            /*Serial.print("Special command code ");
            Serial.print(special, HEX);
            Serial.println(" found...");*/
            if (special == 0x01) {
                // enable DMP-related interrupts
                
                //setIntZeroMotionEnabled(true);
                //setIntFIFOBufferOverflowEnabled(true);
                //setIntDMPEnabled(true);
                I2Cdev::writeByte(devAddr, MPU6050_RA_INT_ENABLE, 0x32);  // single operation

                success = true;
            } else {
                // unknown special command
                success = false;
            }
        }
        
        if (!success) {
            if (useProgMem) free(progBuffer);
            return false; // uh oh
        }
    }
    if (useProgMem) free(progBuffer);
    return true;
}
bool MPU6050::writeProgDMPConfigurationSet(const uint8_t *data, uint16_t dataSize) {
    return writeDMPConfigurationSet(data, dataSize, true);
}

// DMP_CFG_1 register

uint8_t MPU6050::getDMPConfig1() {
    I2Cdev::readByte(devAddr, MPU6050_RA_DMP_CFG_1, buffer);
    return buffer[0];
}
void MPU6050::setDMPConfig1(uint8_t config) {
    I2Cdev::writeByte(devAddr, MPU6050_RA_DMP_CFG_1, config);
}

// DMP_CFG_2 register

uint8_t MPU6050::getDMPConfig2() {
    I2Cdev::readByte(devAddr, MPU6050_RA_DMP_CFG_2, buffer);
    return buffer[0];
}
void MPU6050::setDMPConfig2(uint8_t config) {
    I2Cdev::writeByte(devAddr, MPU6050_RA_DMP_CFG_2, config);
}

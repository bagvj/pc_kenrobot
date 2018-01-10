#ifndef _UPER_H_
#define _UPER_H_

//#define GYRO_PORT_M0

#define USER	0x80
#define C0	USER+1
#define C1	USER+2

#define S0	USER+11
#define S1	USER+12
#define S2	USER+13
#define S3	USER+14
#define S4	USER+15
#define S5	USER+16

#define M0	USER+21
#define M1	USER+22
#define M2	S4
#define M3	S5

//pin define
#define C0_PIN_0	0
#define C0_PIN_1	1

// 位置后面需要改回来
#define C1_PIN_0	A5	//SCL
#define C1_PIN_1	A4	//SDA

#define S0_PIN	2
#define S1_PIN	9
#define S2_PIN	10
#define S3_PIN	13

#define S4_PIN_0	11
#define S4_PIN_1	12
#define S5_PIN_0	3
#define S5_PIN_1	4

#define M0_PIN_0	5
#define M0_PIN_1	7
#define M1_PIN_0	6
#define M1_PIN_1	8

#define M2_PIN_0	S4_PIN_0
#define M2_PIN_1	S4_PIN_1
#define M3_PIN_0	S5_PIN_0
#define M3_PIN_1	S5_PIN_1

#define M0_S1   M0_PIN_1
#define M0_S2   M0_PIN_0

#define M1_S1   M1_PIN_1
#define M1_S2   M1_PIN_0

#define M2_S1   M2_PIN_1
#define M2_S2   M2_PIN_0

#define M3_S1   M3_PIN_1
#define M3_S2   M3_PIN_0

#define C0_S1   C0_PIN_1
#define C0_S2   C0_PIN_0

// 位置后面需要改回来
#define C1_S1   C1_PIN_0
#define C1_S2   C1_PIN_1





#define STRING_VERSION_CONFIG_H __DATE__ " " __TIME__ //Get system time
//


#endif
/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  ColorSensorTest.ino
 * @作者：  Kenblcok
 * @版本：  V0.1.0
 * @时间：  2017/08/08
 * @描述：  颜色传感模块的颜色识别测试程序。
 * 
 * \说明
 * 颜色传感模块的颜色识别测试程序。使用外部中断0（数字接口 2），定时器1。所以只能使用PD5接口。
 * 原理：白平衡校正后得到的RGB比例因子，则其它颜色物体反射光中红、绿、蓝三色光对应的TCS3200输出信号1s内脉冲数乘以R、G、B比例因子，就可换算出了被测物体的RGB标准值了。
 * 白平衡校正方法：本程序复位后，前4s时间为自动白平衡校正。把一个白色物体放置在TCS3200颜色传感器之下，两者相距10mm左右，然后按下复位键。
 * 
 * 
 * \函数列表
 *  	1. void ColorSensor::OutputSetting(uint8_t temp)
 *		2. void ColorSensor::WhiteBalance(uint8_t temp1,uint8_t temp2)
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  King           2017/08/08      0.1.0              新建程序。
 * 
 */

#include "Kenblock.h"
#include "Kenblock_ColorSensor.h"

ColorSensor Color(PD5);

//ps：如果要调用库里面定义的公共变量，主函数在调用的时候要加上变量的类名 
//Color.g_SF[3];   	//从TCS3200输出信号的脉冲数转换为RGB标准值的RGB比例因子
//Color.g_count = 0;//计算与反射光强相对应TCS3200颜色传感器输出信号的脉冲数
//Color.g_array[3];	//数组用于存储在1s内TCS3200输出信号的脉冲数，它乘以RGB比例因子就是RGB标准值
//Color.g_flag = 0;	//滤波器模式选择顺序标志  
   
/**
 * \函数：PulseCount
 * \说明：外部中断函数,计算传感模块的输出信号脉冲数
 * \输入参数：无
 * \输出参数：
    g_count - 脉冲个数
 * \返回值：无
 * \其他：无
 */
void PulseCount()
{
  Color.g_count++;
} 

/**
 * \函数：Callback
 * \说明：定时器中断函数，每一秒中断后，把该时间内红、绿、蓝三种光线通过滤波器时，把模块输出信号脉冲个数分别存储在数组g_array[3]中                                    
 * \输入参数：无
 * \输出参数：无
 * \返回值：无
 * \其他：无
 */ 
void Callback()
{
  switch(Color.g_flag)
  {
    case 0:
      //Serial.println("->WB Start");
      Color.WhiteBalance(LOW, LOW);        	//选择让红色光线通过滤波器的模式        
      break;
    case 1:
      //Serial.print("->Frequency R=");		//打印1s脉冲个数
      //Serial.println(Color.g_count);
      Color.g_array[0] = Color.g_count;		//存储1s内的红光通过滤波器时，传感器输出的脉冲个数
      Color.WhiteBalance(HIGH, HIGH);      	//选择让绿色光线通过滤波器的模式   
      break;    
    case 2:
      //Serial.print("->Frequency G="); 		//打印1s脉冲个数       
      //Serial.println(Color.g_count);
      Color.g_array[1] = Color.g_count;		//存储1s内的绿光通过滤波器时，传感器输出的脉冲个数
      Color.WhiteBalance(LOW, HIGH);        //选择让蓝色光线通过滤波器的模式    
      break; 
    case 3:
      //Serial.print("->Frequency B=");		//打印1s脉冲个数
      //Serial.println(Color.g_count);
      //Serial.println("->WB End");
      Color.g_array[2] = Color.g_count;		//存储1s内的蓝光通过滤波器时，传感器输出的脉冲个数
      Color.WhiteBalance(HIGH, LOW);		//选择无滤波器的模式   
      break;
    default:     
      Color.g_count = 0;   //计数值清零     
      break; 
  }
} 

int getRGBValue(char rgb)
{
	return int(Color.g_array[rgb] * Color.g_SF[rgb]);
}

void setup()
{
	Color.OutputSetting(100);			//设置比例输出因子为100%
	Serial.begin(115200);				//启动串行通信,波特率115200
	Timer1.initialize();             	//初始化1s中断 
	Timer1.attachInterrupt(Callback);  	//设置定时器1的中断，中断调用函数为Callback()
	attachInterrupt(0, PulseCount ,RISING);//设置传感器输出信号的上跳沿触发中断，中断调用函数为PulseCount()   
	delay(4000); 						//延时4s，以等待被测物体红、绿、蓝三色在1s内的TCS3200输出信号脉冲计数

	//打印出被测物体RGB颜色值
	for(int i=0; i<3; i++)
	Serial.println(Color.g_array[i]);

	//通过白平衡测试，计算得到白色物体RGB值255与1s内三色光脉冲数的RGB比例因子
	Color.g_SF[0] = 255.0/ Color.g_array[0] ;    //红色光比例因子
	Color.g_SF[1] = 255.0/ Color.g_array[1] ;    //绿色光比例因子
	Color.g_SF[2] = 255.0/ Color.g_array[2] ;    //蓝色光比例因子

	//打印白平衡后的红、绿、蓝三色的RGB比例因子，精确到小数点后5位
	Serial.println(Color.g_SF[0],5);
	Serial.println(Color.g_SF[1],5);
	Serial.println(Color.g_SF[2],5); 
}
 

   
void loop()
{
	Color.g_flag = 0;

	//打印出被测物体RGB颜色值
	for(int i=0; i<3; i++)
	Serial.println(getRGBValue(i));

	//每获得一次被测物体RGB颜色值需时4s
	delay(4000); 
}

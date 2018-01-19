 /**
 * \著作权 
 * @名称：  uper_HX711.cpp
 * @作者：  uper
 * @版本：  v171213
 * @URL: 	http://www.uper.cc
 * @维护：  uper
 * @时间：  2017/12/13
 *
 * \说明
 * uper_Fan HX711称
 *
 * \公有方法列表
 * 
 * 		1.void HX711::getMaopi()
 * 		2.unsigned int HX711::getWeight()
 *		3.unsigned long HX711::read(void)
 *		
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  
 * \示例
 *  
 * 		1.uper_HX711.ino
 */
#include "uper_HX711.h"

//****************************************************
//初始化HX711
//****************************************************
UPER_HX711::UPER_HX711(int sck, int dt)
{
	sckPin = sck;
	dtPin = dt;

	pinMode(sckPin, OUTPUT);
	pinMode(dtPin, INPUT);

	Buffer = 0;
	Weight_Maopi = 0;
	Weight_Shiwu = 0;
}

//****************************************************
//获取毛皮重量
//****************************************************
void UPER_HX711::getMaopi()
{
	Buffer = read();
	Weight_Maopi = Buffer/100;		
} 

//****************************************************
//称重
//****************************************************
unsigned int UPER_HX711::getWeight()
{
	Buffer = read();
	Buffer = Buffer/100;
	if(Buffer > Weight_Maopi)			
	{
		Weight_Shiwu = Buffer;
		Weight_Shiwu = Weight_Shiwu - Weight_Maopi;				//获取实物的AD采样数值。
	
		Weight_Shiwu = (unsigned int)((float)Weight_Shiwu/4.05+0.05); 	
			//计算实物的实际重量
			//因为不同的传感器特性曲线不一样，因此，每一个传感器需要矫正这里的4.30这个除数。
			//当发现测试出来的重量偏大时，增加该数值。
			//如果测试出来的重量偏小时，减小改数值。
			//该数值一般在4.0-5.0之间。因传感器不同而定。
			//+0.05是为了四舍五入百分位
	}
 // Serial.print("实际质量：");
 // Serial.print(Weight_Shiwu);
 // Serial.print("\n");
	if(Weight_Shiwu > 5000 || Buffer < Weight_Maopi - 30)
	{
		Serial.print("Error");
	}
	return Weight_Shiwu;
}

//****************************************************
//读取HX711
//****************************************************
unsigned long UPER_HX711::read(void)	//增益128
{
	unsigned long count; 
	unsigned char i;
	bool Flag = 0;

	digitalWrite(dtPin, HIGH);
	delayMicroseconds(1);

	digitalWrite(sckPin, LOW);
	delayMicroseconds(1);

  	count=0; 
  	while(digitalRead(dtPin)); 
  	for(i=0;i<24;i++)
	{ 
	  	digitalWrite(sckPin, HIGH); 
		delayMicroseconds(1);
	  	count=count<<1; 
		digitalWrite(sckPin, LOW); 
		delayMicroseconds(1);
	  	if(digitalRead(dtPin))
			count++; 
	} 
 	digitalWrite(sckPin, HIGH); 
	delayMicroseconds(1);
	digitalWrite(sckPin, LOW); 
	delayMicroseconds(1);
	count ^= 0x800000;
	return(count);
}

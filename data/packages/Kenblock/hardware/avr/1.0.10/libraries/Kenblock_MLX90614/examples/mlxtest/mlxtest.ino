/**
 * \著作权 
 * @名称：  mxltest.ino
 * @作者：  Adafruit
 * @版本：  V0.1.0
 * @维护：  Kenblock
 * @时间：  2017/09/20
 * @描述：  非接触式测温模块测试示例。传感器为 MLX90614。
 *
 * \说明
 * 非接触式测温模块测试示例。串口显示当前环境的摄氏温度、华氏温度，被测物体的摄氏温度、华氏温度。
 *
 * \函数列表
 * 		1. boolean	MLX90614::begin(void) 
 * 		2. double	MLX90614::readObjectTempF(void) 
 * 		3. double	MLX90614::readAmbientTempF(void) 
 * 		4. double	MLX90614::readObjectTempC(void) 
 *    5. double	MLX90614::readAmbientTempC(void) 
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING            2017/09/20      0.1.0              做汉化修订注释。
 *  
 */
 

#include <Wire.h>
#include <Kenblock_MLX90614.h>

MLX90614 mlx = MLX90614();

void setup() {
  Serial.begin(9600);

  Serial.println("MLX90614 test");  

  mlx.begin(); 		//初始化非接触式测温模块 
}

void loop() {
  //将读取到的数据通过串口打印出来
  Serial.print("Ambient = "); 
  Serial.print(mlx.readAmbientTempC()); 
  
  Serial.print("*C\tObject = ");
  Serial.print(mlx.readObjectTempC());
  Serial.println("*C");
  
  Serial.print("Ambient = ");
  Serial.print(mlx.readAmbientTempF()); 
  
  Serial.print("*F\tObject = ");
  Serial.print(mlx.readObjectTempF());
  Serial.println("*F");

  Serial.println();
  delay(500);
}

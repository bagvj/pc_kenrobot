/**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  KeyMatrixTest.ino
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2017/09/01
 * @描述：  KeyMatrix 键盘阵列模块的按键扫描程序。
 * 
 * \说明
 *  KeyMatrix 键盘阵列模块的按键扫描程序。不同按键按下时，接入的电阻不同，模块输出不同的电压，根据电压值的变化判断按键按下，串口显示哪个按键被按下。
 * 
 * \函数列表
 * 
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  KING           2017/09/01      0.1.0              新建程序。
 * 
 */
int keyMatrixPin = A1;             //键盘阵列模块接口引脚
int16_t temp;

//按键扫描函数
uint8_t keyScan()
{
  temp = analogRead(keyMatrixPin);  
  Serial.println(temp);      
  //由于各个电阻精度的不同，可能要修改限位阀值
  if(temp>=445&&temp<=461)      return 1;//蓝
  else if(temp>=261&&temp<=277) return 2;//红
  else if(temp>=729&&temp<=745) return 3;//白
  else if(temp>=863&&temp<=878) return 4;//黄
  else if(temp>=595&&temp<=612) return 5;//绿
  else return 0;//无
}

void setup()
{
  Serial.begin(9600);             //初始化串口，波特率为9600
  pinMode(keyMatrixPin, INPUT_PULLUP);
}
void loop()
{            
  switch(keyScan())
  {
    case 1:Serial.println("BlueKey Press");break;
    case 2:Serial.println("RedKey Press");break;    
    case 3:Serial.println("WhiteKey Press");break;    
    case 4:Serial.println("YellowKey Press");break;
    case 5:Serial.println("GreenKey Press");break;
    default:Serial.println("NoKey Press");break;
  }          
  delay(100);           //每100毫秒扫描一次         
}
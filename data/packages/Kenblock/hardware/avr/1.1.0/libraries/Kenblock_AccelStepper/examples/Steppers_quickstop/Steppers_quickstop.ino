 /**
 * \著作权 Copyright (C), 2016-2020, LZRobot
 * @名称：  Kenblock_AccelStepper.h
 * @作者：  Kenblock
 * @版本：  V0.1.0
 * @时间：  2018/04/19
 * @描述：  步进电机驱动函数。Kenblock_AccelStepper.cpp 的头文件。
 *
 * \说明
 * 步进电机加减速运行至指定步数。
 *
 * \方法列表（仅列出常用函数）
 * 
 * 		1. void    moveTo(long absolute);                 //移动至绝对位置
 * 		2. void    move(long relative);                   //移动至绝对位置
 * 		3. boolean run();                                 //运行电机
 * 		4. void    setAcceleration(float acceleration);   //设置加速度
 *      5. void    setMaxSpeed(float speed);              //设置最大速度
 *      6. void    setSpeed(float speed);                 //设置匀速运动速度
 *      7. void    runSpeed();                            //以设定速度运行
 *      8. void    runSpeedToPosition();                  //以设定速度运行至设定位置
 *      9. long    distanceToGo();                        //获取当前剩余步数
 *
 *
 * \修订历史
 * `<Author>`      `<Time>`        `<Version>`        `<Descr>`
 *  RJK            2018/04/19        0.1.0              新建库文件。
 *  
 * \示例
 *  
 * 		1.Stepper_Run_continuously.ino      //以恒定速度持续运行
 * 		2.Stepper_Runspeed.ino              //匀速运行至目标点
 * 		3.Steppers_Accel.ino                //步进电机加减速运行
 * 		4.Steppers_Overshoot.ino            //超调回零
 * 		5.Steppers_quickstop.ino            //快速停止
 */
#include "Kenblock_AccelStepper.h"

KenAccelStepper stepper(PD5, M1);   //定义PD5接口 M1步进电机

void setup()
{  
  stepper.setMaxSpeed(150);
  stepper.setAcceleration(100);
}

void loop()
{    
  stepper.moveTo(500);
  while (stepper.currentPosition() != 300) // Full speed up to 300
    stepper.run();
  stepper.stop(); // Stop as fast as possible: sets new target
  stepper.runToPosition(); 
  // Now stopped after quickstop

  // Now go backwards
  stepper.moveTo(-500);
  while (stepper.currentPosition() != 0) // Full speed basck to 0
    stepper.run();
  stepper.stop(); // Stop as fast as possible: sets new target
  stepper.runToPosition(); 
  // Now stopped after quickstop

}

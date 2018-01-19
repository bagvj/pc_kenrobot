#include "uper_Record.h"

UPER_Record uper_record(PD0);

void setup()
{

}

void loop()
{

	// 播放录音(循环)
	uper_record.play();
	delay(2000);
	
	// 停止录音或播放
	uper_record.stop();
	delay(2000);


	// 停止录音或播放
	uper_record.loop();
	delay(2000);
}

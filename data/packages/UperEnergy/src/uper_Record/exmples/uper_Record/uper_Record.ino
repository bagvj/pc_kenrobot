#include "uper_Record.h"

Record record(PD0);

void setup()
{

}

void loop()
{
	// 开始录音
	record.start();
	delay(2000);

	// 停止录音或播放
	record.stop();
	delay(2000);

	// 播放录音(循环)
	record.play(true);
	delay(2000);

	// 停止录音或播放
	record.stop();
	delay(2000);

	// 播放录音，持续时间1000毫秒
	record.play(false, 1000);
	delay(2000);
}

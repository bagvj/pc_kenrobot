@echo off

rem 使用方法: upload.bat target COM [board_type]
rem 参数说明: target, hex或者bin; board_type, 主板类型
rem 使用示例: 1. upload.bat test.hex COM5 2. upload.bat c:\project\test.ino.hex COM5 3. 2. upload.bat c:\project\test.ino.bin COM5 genuino101

rem 目标文件路径
set TARGET_PATH=%~f1

set DIR=%~dp0
set LOCAL_ARDUINO_PATH="%DIR%..\arduino-win"

set UPLOADER="%LOCAL_ARDUINO_PATH:~1,-1%\hardware\tools\avr\bin\avrdude.exe"
set UPLOADER_CONF="%LOCAL_ARDUINO_PATH:~1,-1%\hardware\tools\avr\etc\avrdude.conf"

rem COM端口
set ARDUINO_COMPORT=%2

set ARDUINO_MCU=atmega328p
set ARDUINO_PROGRAMMER=arduino
set ARDUINO_BURNRATE=115200
set BORAD_TYPE=%3

if %BORAD_TYPE% == genuino101 (
	"%LOCAL_ARDUINO_PATH:~1,-1%\packages\Intel\tools\arduino101load\1.6.9+1.28\arduino101load\arduino101load.exe" "%LOCAL_ARDUINO_PATH:~1,-1%\packages\Intel\tools\arduino101load\1.6.9+1.28\x86\bin" "%TARGET_PATH%" %ARDUINO_COMPORT% verbose ATP1BLE000-1541C5635 141312
) else (
	%UPLOADER% -C %UPLOADER_CONF% -v -p %ARDUINO_MCU% -P %ARDUINO_COMPORT% -c %ARDUINO_PROGRAMMER% -b %ARDUINO_BURNRATE% -U "flash:w:%TARGET_PATH%:i"
)

if not %errorlevel% == 0 (
	echo upload fail
    goto end
)

echo upload success

:end
exit /b %errorlevel
@echo off
rem utf8
chcp 65001

rem useage: upload.bat target COM
rem arguments: target, hex or bin path; COM, com name
rem example: 1. upload.bat test.hex COM5 2. upload.bat c:\project\test.ino.hex COM5 3. 2. upload.bat c:\project\test.ino.bin COM5

rem target file path
set TARGET_PATH=%~f1

set DIR=%~dp0
set LOCAL_ARDUINO_PATH="%DIR%..\arduino-win"

set UPLOADER="%LOCAL_ARDUINO_PATH:~1,-1%\hardware\tools\avr\bin\avrdude.exe"
set UPLOADER_CONF="%LOCAL_ARDUINO_PATH:~1,-1%\hardware\tools\avr\etc\avrdude.conf"

rem COM port
set ARDUINO_COMPORT=%2

set ARDUINO_MCU=atmega328p
set ARDUINO_PROGRAMMER=arduino
set ARDUINO_BURNRATE=115200

%UPLOADER% -C %UPLOADER_CONF% -v -p %ARDUINO_MCU% -P %ARDUINO_COMPORT% -c %ARDUINO_PROGRAMMER% -b %ARDUINO_BURNRATE% -U "flash:w:%TARGET_PATH%:i"

if not %errorlevel% == 0 (
	echo upload fail
    goto end
)

echo upload success

:end
exit /b %errorlevel
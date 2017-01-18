@echo off

rem ʹ�÷���: upload.bat hex COM
rem ʹ��ʾ��: 1. upload.bat test.hex COM5 2. upload.bat c:\project\test.hex COM5

rem hex�ļ�·��
set HEX_PATH=%~f1

set DIR=%~dp0
set LOCAL_ARDUINO_PATH=%DIR%..\\arduino-win

set UPLOADER="%LOCAL_ARDUINO_PATH%\\hardware\\tools\\avr\\bin\\avrdude.exe"
set UPLOADER_CONF="%LOCAL_ARDUINO_PATH%\\hardware\\tools\\avr\\etc\\avrdude.conf"

rem COM�˿�
set ARDUINO_COMPORT=%2

set ARDUINO_MCU=atmega328p
set ARDUINO_PROGRAMMER=arduino
set ARDUINO_BURNRATE=115200

%UPLOADER% -C %UPLOADER_CONF% -v -p %ARDUINO_MCU% -P %ARDUINO_COMPORT% -c %ARDUINO_PROGRAMMER% -b %ARDUINO_BURNRATE% -U "flash:w:%HEX_PATH%:i"

if not %errorlevel% == 0 (
	echo upload fail
    goto end
)

echo upload success

:end
exit /b %errorlevel%
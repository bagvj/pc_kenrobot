@echo off

rem 使用方法: upload.bat 项目名 主板类型
rem 使用示例: 1. build.bat test uno 2. build.bat c:\project\test uno

rem hex文件路径
set HEX_PATH=%~f1

set DIR=%~dp0
set LOCAL_ARDUINO_PATH=%DIR%..\\Arduino-windows

set UPLOADER="%LOCAL_ARDUINO_PATH%\\hardware\\tools\\avr\\bin\\avrdude.exe"
set UPLOADER_CONF="%LOCAL_ARDUINO_PATH%\\hardware\\tools\\avr\\etc\\avrdude.conf"

%UPLOADER% -C %UPLOADER_CONF% -p !arduino_mcu! -P !arduino_comport! -c !arduino_programmer! -b !arduino_burnrate! -U "flash:w:"
@echo off

rem useage: upload.bat target COM [board_type]
rem arguments: target, hex or bin path; board_type, board type
rem example: 1. upload.bat test.hex COM5 2. upload.bat c:\project\test.ino.hex COM5 3. 2. upload.bat c:\project\test.ino.bin COM5 genuino101

rem target file path
set TARGET_PATH=%~f1

set DIR=%~dp0
set LOCAL_ARDUINO_PATH="%DIR%..\arduino-win"

rem COM port
set ARDUINO_COMPORT=%2

"%LOCAL_ARDUINO_PATH:~1,-1%\packages\Intel\tools\arduino101load\1.6.9+1.28\arduino101load\arduino101load.exe" "%LOCAL_ARDUINO_PATH:~1,-1%\packages\Intel\tools\arduino101load\1.6.9+1.28\x86\bin" "%TARGET_PATH%" %ARDUINO_COMPORT% verbose ATP1BLE000-1541C5635 141312

if not %errorlevel% == 0 (
	echo upload fail
    goto end
)

echo upload success

:end
exit /b %errorlevel
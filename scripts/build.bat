@echo off
rem utf8
chcp 65001>nul

rem useage: build.bat project_path
rem notice: you can't call this script manual, unless you ensure [project_path]/config/build.txt exist which generated automatic

rem project path
set PROJECT_PATH=%~f1
set PROJECT_NAME=%~n1
set ARDUINO_FILE="%PROJECT_PATH%\%PROJECT_NAME%.ino"
set BUILD_PATH="%PROJECT_PATH%\build"

if not exist %BUILD_PATH% (
	mkdir %BUILD_PATH%
)

rem read build args
set /p ARGS=<"%PROJECT_PATH%\config\build.txt"

set DIR=%~dp0
set LOCAL_ARDUINO_PATH="%DIR%..\arduino-win"

set BUILDER="%LOCAL_ARDUINO_PATH:~1,-1%\arduino-builder.exe"
set HARDWARE="%LOCAL_ARDUINO_PATH:~1,-1%\hardware,%LOCAL_ARDUINO_PATH:~1,-1%\packages"
set TOOLS="%LOCAL_ARDUINO_PATH:~1,-1%\tools-builder,%LOCAL_ARDUINO_PATH:~1,-1%\hardware\tools\avr,%LOCAL_ARDUINO_PATH:~1,-1%\packages"
set BUILT_IN_LIBRARIES_PATH="%LOCAL_ARDUINO_PATH:~1,-1%\libraries"

set COMMAND=%BUILDER% -compile -logger=machine -hardware=%HARDWARE% -tools=%TOOLS% -built-in-libraries=%BUILT_IN_LIBRARIES_PATH% -ide-version=10612 -warnings=all -prefs=build.warn_data_percentage=75 %ARGS% -build-path=%BUILD_PATH% %ARDUINO_FILE%
%COMMAND%

if not %errorlevel% == 0 (
	echo build fail
    goto end
)

echo build success

:end
exit /b %errorlevel%

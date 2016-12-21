@echo off

rem 使用方法: build.bat 项目名 主板类型
rem 使用示例: 1. build.bat test uno 2. build.bat c:\project\test uno

rem 项目路径
set SKETCH_PATH=%~f1
set SKETCH=%~n1
set SKETCH="%SKETCH_PATH%\\%SKETCH%.ino"
set BUILD_PATH="%SKETCH_PATH%\\build"

rem 主板类型
set BOARD_TYPE=%2

set DIR=%~dp0
set LOCAL_ARDUINO_PATH=%DIR%..\\Arduino-win

set BUILDER="%LOCAL_ARDUINO_PATH%\\arduino-builder.exe"
set HARDWARE="%LOCAL_ARDUINO_PATH%\\hardware"
set TOOLS="%LOCAL_ARDUINO_PATH%\\tools-builder,%LOCAL_ARDUINO_PATH%\\hardware\\tools\\avr,%LOCALAPPDATA%\\Arduino15\\packages"
set LIBRARIES="%LOCAL_ARDUINO_PATH%\\libraries,%USERPROFILE%\\Documents\\Arduino\\libraries"
set FQBN="arduino:avr:%BOARD_TYPE%"

if not exist %BUILD_PATH% (
	mkdir %BUILD_PATH%
)

%BUILDER% -hardware=%HARDWARE% -tools=%TOOLS% -built-in-libraries=%LIBRARIES% -fqbn=%FQBN% -build-path=%BUILD_PATH% -warnings=all %SKETCH%

if not %errorlevel% == 0 (
	echo build fail
    goto end
)

echo build success

:end
exit /b %errorlevel%
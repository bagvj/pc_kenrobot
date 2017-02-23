@echo off

rem useage:  build.bat project_path board_type
rem example: 1. build.bat test uno 2. build.bat c:\project\test uno

rem project path
set SKETCH_PATH=%~f1
set SKETCH=%~n1
set SKETCH="%SKETCH_PATH%\%SKETCH%.ino"
set BUILD_PATH="%SKETCH_PATH%\build"

rem board type
set BOARD_TYPE=%2

set DIR=%~dp0
set LOCAL_ARDUINO_PATH="%DIR%..\arduino-win"

set BUILDER="%LOCAL_ARDUINO_PATH:~1,-1%\arduino-builder.exe"
set HARDWARE="%LOCAL_ARDUINO_PATH:~1,-1%\hardware,%LOCAL_ARDUINO_PATH:~1,-1%\packages"
set TOOLS="%LOCAL_ARDUINO_PATH:~1,-1%\tools-builder,%LOCAL_ARDUINO_PATH:~1,-1%\hardware\tools\avr,%LOCAL_ARDUINO_PATH:~1,-1%\packages"
set LIBRARIES="%LOCAL_ARDUINO_PATH:~1,-1%\libraries"

if not exist %BUILD_PATH% (
	mkdir %BUILD_PATH%
)

%BUILDER% -compile -logger=machine -hardware=%HARDWARE% -tools=%TOOLS% -built-in-libraries=%LIBRARIES% -fqbn="arduino:avr:%BOARD_TYPE%" -ide-version=10612 -build-path=%BUILD_PATH% -warnings=all -prefs=build.warn_data_percentage=75 -prefs=runtime.tools.avr-gcc.path="%LOCAL_ARDUINO_PATH:~1,-1%\hardware\tools\avr" -prefs=runtime.tools.avrdude.path="%LOCAL_ARDUINO_PATH:~1,-1%\hardware\tools\avr"  %SKETCH%

if not %errorlevel% == 0 (
	echo build fail
    goto end
)

echo build success

:end
exit /b %errorlevel%
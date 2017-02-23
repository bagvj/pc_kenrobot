@echo off
rem utf8
chcp 65001

rem useage:  build_101.bat project_path
rem example: 1. build_101.bat test 2. build_101.bat c:\project\test

rem project path
set SKETCH_PATH=%~f1
set SKETCH=%~n1
set SKETCH="%SKETCH_PATH%\%SKETCH%.ino"
set BUILD_PATH="%SKETCH_PATH%\build"

set DIR=%~dp0
set LOCAL_ARDUINO_PATH="%DIR%..\arduino-win"

set BUILDER="%LOCAL_ARDUINO_PATH:~1,-1%\arduino-builder.exe"
set HARDWARE="%LOCAL_ARDUINO_PATH:~1,-1%\hardware,%LOCAL_ARDUINO_PATH:~1,-1%\packages"
set TOOLS="%LOCAL_ARDUINO_PATH:~1,-1%\tools-builder,%LOCAL_ARDUINO_PATH:~1,-1%\hardware\tools\avr,%LOCAL_ARDUINO_PATH:~1,-1%\packages"
set LIBRARIES="%LOCAL_ARDUINO_PATH:~1,-1%\libraries"

if not exist %BUILD_PATH% (
	mkdir %BUILD_PATH%
)

%BUILDER% -compile -logger=machine -hardware=%HARDWARE% -tools=%TOOLS% -built-in-libraries=%LIBRARIES% -fqbn="Intel:arc32:arduino_101" -ide-version=10612 -build-path=%BUILD_PATH% -warnings=all -prefs=build.warn_data_percentage=75 -prefs=runtime.tools.arduino101load.path="%LOCAL_ARDUINO_PATH:~1,-1%\packages\Intel\tools\arduino101load\1.6.9+1.28" -prefs=runtime.tools.flashpack.path="%LOCAL_ARDUINO_PATH:~1,-1%\packages\Intel\tools\flashpack\1.0.0" -prefs=runtime.tools.openocd.path="%LOCAL_ARDUINO_PATH:~1,-1%\packages\Intel\tools\openocd\0.9.0+0.1" -prefs=runtime.tools.arc-elf32.path="%LOCAL_ARDUINO_PATH:~1,-1%\packages\Intel\tools\arc-elf32\1.6.9+1.0.1" %SKETCH%

if not %errorlevel% == 0 (
	echo build fail
    goto end
)

echo build success

:end
exit /b %errorlevel%
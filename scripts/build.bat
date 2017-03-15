@echo off
rem utf8
chcp 65001>nul

rem useage:  build.bat project_path fqbn [libraries]
rem example: 
rem     1. build.bat test arduino:avr:uno:cpu=atmege328
rem     2. build.bat /home/project/test arduino:avr:yun ~/documents/kenrobot/libraries/kenrobot
rem     3. fqbn: arduino:avr:uno:cpu=atmege328 | arduino:avr:yun | arduino:avr:pro:cpu=16MHzatmega328
rem     4. some boards must spec mcu on windows fqbn's "=" need replace with "!" because of bat not support pass "=" directly

rem project path
set SKETCH_PATH=%~f1
set SKETCH=%~n1
set SKETCH="%SKETCH_PATH%\%SKETCH%.ino"
set BUILD_PATH="%SKETCH_PATH%\build"

rem fqbn
set FQBN=%2
rem replace '!' to '='
set FQBN=%FQBN:!==%

set LIBRARIES_PATH=%3

set DIR=%~dp0
set LOCAL_ARDUINO_PATH="%DIR%..\arduino-win"

REM for /f "tokens=2,*" %%j in ('REG QUERY "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders" ^|find /i "Personal"') do  call set "USERDOCUMENT=%%k"
REM set SKETCHBOOKFOLDER="%USERDOCUMENT%\Arduino"
REM set LIBRARIES_PATH="%SKETCHBOOKFOLDER:~1,-1%\libraries"
set BUILDER="%LOCAL_ARDUINO_PATH:~1,-1%\arduino-builder.exe"
set HARDWARE="%LOCAL_ARDUINO_PATH:~1,-1%\hardware,%LOCAL_ARDUINO_PATH:~1,-1%\packages"
set TOOLS="%LOCAL_ARDUINO_PATH:~1,-1%\tools-builder,%LOCAL_ARDUINO_PATH:~1,-1%\hardware\tools\avr,%LOCAL_ARDUINO_PATH:~1,-1%\packages"
set BUILT_IN_LIBRARIES_PATH="%LOCAL_ARDUINO_PATH:~1,-1%\libraries"

if not exist %BUILD_PATH% (
	mkdir %BUILD_PATH%
)

set COMMAND=%BUILDER% -compile -logger=machine -hardware=%HARDWARE% -tools=%TOOLS% -built-in-libraries=%BUILT_IN_LIBRARIES_PATH%
if defined LIBRARIES_PATH (
	set COMMAND=%COMMAND% -libraries=%LIBRARIES_PATH% 
)
set COMMAND=%COMMAND% -fqbn=%FQBN% -ide-version=10612 -build-path=%BUILD_PATH% -warnings=all -prefs=build.warn_data_percentage=75 -prefs=runtime.tools.avr-gcc.path="%LOCAL_ARDUINO_PATH:~1,-1%\hardware\tools\avr" -prefs=runtime.tools.avrdude.path="%LOCAL_ARDUINO_PATH:~1,-1%\hardware\tools\avr"  %SKETCH%
%COMMAND%

if not %errorlevel% == 0 (
	echo build fail
    goto end
)

echo build success

:end
exit /b %errorlevel%

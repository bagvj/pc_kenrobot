@echo off

set topdir=%~dp0

:: Flash Arduino 101 Factory BLE via USB and dfu-util
cls
setlocal ENABLEDELAYEDEXPANSION

:start_parse_params
if "%1" == ""  goto:end_parse_params
if /i "%1" == "-s" (
  set SER_NUM=%2
  if "!SER_NUM!" == "" goto:help	  
  set SER_NUM_ARG=-S !SER_NUM!
)

SHIFT
goto:start_parse_params

:end_parse_params

set DFU=%topdir%\bin\dfu-util.exe %SER_NUM_ARG% -d,8087:0ABA
set IMG=%topdir%\images/firmware

if NOT "%SER_NUM%" == "" echo Flashing board S/N: %SER_NUM%
echo.
echo Reset the board before proceeding...
REM wait for DFU device
set X=
:loop
  for /f "delims== tokens=9" %%i in ('%DFU% -l 2^>NUL ^|find "sensor"') do (
    set X=%%i
  )
  REM extract the serial number from unknown discovered device
  if "!X!" == "" goto:loop
  if "%SER_NUM%" == "" (
    set SER_NUM=!X:*serial=!
	set SER_NUM=!SER_NUM:"=!
	echo Using board S/N: !SER_NUM!...
	set DFU=%DFU% -S !SER_NUM!
  ) 

call:flash

if %ERRORLEVEL% NEQ 0 goto:error

echo.
echo ---SUCCESS---
exit /b 0

:flash
  echo.
  echo ** Flashing Factory BLE **
  echo.
  %DFU% -a 8 -R -D %IMG%/ble_core/image.bin
  if !ERRORLEVEL! NEQ 0 goto:error
goto:eof

REM Usage message
:help
echo Usage: %~nx0 [options]
echo               -s serial_number  Only flash to board with specified serial number
exit /b 1
goto:eof

REM Return error message
:error
echo.
echo ***ERROR***
exit /b 1
goto:eof

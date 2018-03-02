@echo off

set DIR=%cd%
set SYSTEM_BIT=x64
set DRIVER_NAME=0
if "%PROCESSOR_ARCHITECTURE%" == "X86" (
    set SYSTEM_BIT=x86
)

cd /d %windir%\inf
for /f "tokens=6 delims=\" %%a in ('type setupapi.dev.log ^| find /i "mdmcpq.inf_"') do (
    for /f "tokens=1 delims='" %%b in ("%%a") do (
        set DRIVER_NAME=%%b
        goto copyDriver
    )
)
echo skip
cd /d %DIR%
exit /b 1

:copyDriver
set DRIVER_DIR=%windir%\System32\DriverStore\FileRepository\%DRIVER_NAME%
set USB_DIR1=%windir%\System32\usbser.sys
set USB_DIR2=%windir%\System32\drivers\usbser.sys

if not exist %DRIVER_DIR% md %DRIVER_DIR%
if not exist %USB_DIR1% copy /y %DIR%\%SYSTEM_BIT%\usbser.sys %USB_DIR1%
if not exist %USB_DIR2% copy /y %DIR%\%SYSTEM_BIT%\usbser.sys %USB_DIR2%
xcopy /e /y %DIR%\%SYSTEM_BIT%\mdmcpq %DRIVER_DIR%

cd /d %DIR%
echo success
exit /b 0

@echo off
rem utf8
chcp 65001>nul

rem useage: call.bat command_path
rem NOTICE: you CAN NOT call this script manual

rem command path
set COMMAND_PATH=%~f1

rem read command
set COMMAND=
for /f "tokens=*" %%i in (%COMMAND_PATH%) do (
	set COMMAND=%%i
	goto :begin
)

:begin
%COMMAND%

if not %errorlevel% == 0 (
	echo fail
    goto end
)

echo success

:end
exit /b %errorlevel

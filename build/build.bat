@echo off

set ZIP="tools\7z.exe"
set BIN_DIR=".\bin\*"
set SKIN_DIR=".\skin\*"
set BIN_PACK="output\app.7z"
set SKIN_PACK="output\skin.zip"

set PRODUCT_DISPLAY_VERSION="0.1.1"
set PRODUCT_VERSION="0.1.1.2"
set INSTALL_OUTPUT_NAME="kenrobot_v0.1.1.exe"

rem set OUT_DIR="%UserProfile%\Desktop"
set OUT_DIR="output"

set NSIS="tools\NSIS\makensis.exe"
set SCRIPT="build.nsi"

if exist %BIN_PACK% del %BIN_PACK%
%ZIP% a -r %BIN_PACK% %BIN_DIR%

if exist %SKIN_PACK% del %SKIN_PACK%
%ZIP% a -r %SKIN_PACK% %SKIN_DIR%

%NSIS% /V2 /DPRODUCT_DISPLAY_VERSION=%PRODUCT_DISPLAY_VERSION% /DPRODUCT_VERSION=%PRODUCT_VERSION% /DINSTALL_OUTPUT_NAME=%INSTALL_OUTPUT_NAME% /DOUT_DIR=%OUT_DIR% %SCRIPT%
if %ErrorLevel%==0 (
	echo.
	echo %OUT_DIR:~1,-1%\%INSTALL_OUTPUT_NAME:~1,-1%
	echo build success
)
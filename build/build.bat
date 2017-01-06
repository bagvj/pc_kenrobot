@echo off

set ZIP="tools\7z.exe"
set BIN_DIR=".\bin\*"
set SKIN_DIR=".\skin\*"
set BIN_PACK="output\app.7z"
set SKIN_PACK="output\skin.zip"

set NSIS="tools\NSIS\makensis.exe"
set SCRIPT="build.nsi"

if exist %BIN_PACK% del %BIN_PACK%
%ZIP% a -r %BIN_PACK% %BIN_DIR%

if exist %SKIN_PACK% del %SKIN_PACK%
%ZIP% a -r %SKIN_PACK% %SKIN_DIR%

%NSIS% %SCRIPT%
echo success
@pause
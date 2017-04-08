@echo off
rem utf8
chcp 65001>nul

rem useage: upload.bat project_path
rem notice: you can't call this script manual, unless you ensure [project_path]/config/upload.txt and [project_path]/config/[target_file] both exist which generated automatic

rem project path
set PROJECT_PATH=%~f1

rem read upload command
set /p COMMAND=<"%PROJECT_PATH%\config\upload.txt"
%COMMAND%

if not %errorlevel% == 0 (
	echo upload fail
    goto end
)

echo upload success

:end
exit /b %errorlevel

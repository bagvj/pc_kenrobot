#!/bin/bash
#export PATH=/usr/bin:$PATH

# useage: upload.sh target COM
# arguments: target, hex or bin path
# example: 1. upload.sh test.hex COM5 2. upload.sh c:\project\test.ino.hex COM5 3. 2. upload.sh /home/test/test.ino.bin COM5

if [ $# -ne 1 ];then
	echo "1 arguments required"
    exit 1
fi

# target file path
TARGET_PATH=$1

DIR=$(dirname "$0")
if [[ `arch` == arm* ]];then
	LOCAL_ARDUINO_PATH=${DIR}/../arduino-arm
elif [[ `uname -s` == Darwin ]];then
	LOCAL_ARDUINO_PATH=${DIR}/../arduino-mac
else
	LOCAL_ARDUINO_PATH=${DIR}/../arduino-linux
fi

# COM port
ARDUINO_COMPORT=$2

${LOCAL_ARDUINO_PATH}/packages/Intel/tools/arduino101load/1.6.9+1.28/arduino101load/arduino101load ${LOCAL_ARDUINO_PATH}/packages/Intel/tools/arduino101load/1.6.9+1.28/x86/bin ${TARGET_PATH} ${ARDUINO_COMPORT} verbose ATP1BLE000-1541C5635 141312

if [ $? -ne 0 ]; then
	echo upload fail
    exit 2
fi

echo upload success
exit 0

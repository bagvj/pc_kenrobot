#!/bin/bash
#export PATH=/usr/bin:$PATH

# useage: upload.sh target COM [board_type]
# arguments: target, hex or bin path; board_type, board type
# example: 1. upload.sh test.hex COM5 2. upload.sh c:\project\test.ino.hex COM5 3. 2. upload.sh /home/test/test.ino.bin COM5 genuino101

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

UPLOADER=${LOCAL_ARDUINO_PATH}/hardware/tools/avr/bin/avrdude
UPLOADER_CONF=${LOCAL_ARDUINO_PATH}/hardware/tools/avr/etc/avrdude.conf

# COM port
ARDUINO_COMPORT=$2

BOARD_TYPE=$3

ARDUINO_MCU=atmega328p
ARDUINO_PROGRAMMER=arduino
ARDUINO_BURNRATE=115200

${UPLOADER} -C ${UPLOADER_CONF} -p ${ARDUINO_MCU} -P ${ARDUINO_COMPORT} -c ${ARDUINO_PROGRAMMER} -b ${ARDUINO_BURNRATE} -U "flash:w:${TARGET_PATH}:i"

if [ $? -ne 0 ]; then
	echo upload fail
    exit 2
fi

echo upload success
exit 0
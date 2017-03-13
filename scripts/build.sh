#!/bin/bash
#export PATH=/usr/bin:$PATH

# useage:  build.sh project_path board_type [libraries]
# example: 1. build.sh test uno 2. build.sh /home/project/test uno ~/documents/kenrobot/libraries/kenrobot

if [ $# -lt 2 ];then
	echo "more arguments required"
    exit 1
fi

SKETCH_PATH=$1
SKETCH=$(basename ${SKETCH_PATH})
SKETCH=${SKETCH_PATH}/${SKETCH}.ino
BUILD_PATH=${SKETCH_PATH}/build

BOARD_TYPE=$2
LIBRARIES=$3
# USERPATH=`echo $HOME`
#先这么写  后期加入参数
# SKETCHBOOKFOLDER=${USERPATH}/Documents/Arduino

DIR=$(dirname "$0")
if [[ `arch` == arm* ]];then
	LOCAL_ARDUINO_PATH=${DIR}/../arduino-arm
elif [[ `uname -s` == Darwin ]];then
	LOCAL_ARDUINO_PATH=${DIR}/../arduino-mac
else
	LOCAL_ARDUINO_PATH=${DIR}/../arduino-linux
fi

# LIBRARIES=${SKETCHBOOKFOLDER}/libraries
BUILDER=${LOCAL_ARDUINO_PATH}/arduino-builder
HARDWARE=${LOCAL_ARDUINO_PATH}/hardware,${LOCAL_ARDUINO_PATH}/packages
TOOLS=${LOCAL_ARDUINO_PATH}/tools-builder,${LOCAL_ARDUINO_PATH}/hardware/tools/avr,${LOCAL_ARDUINO_PATH}/packages
BUILT_IN_LIBRARIES=${LOCAL_ARDUINO_PATH}/libraries

if [ ! -d ${BUILD_PATH} ]; then
	mkdir ${BUILD_PATH}
fi

if [ ! -n "$LIBRARIES" ];then
	${BUILDER} -compile -logger=machine -hardware=${HARDWARE} -tools=${TOOLS} -built-in-libraries=${BUILT_IN_LIBRARIES} -libraries=${LIBRARIES} -fqbn="arduino:avr:${BOARD_TYPE}" -ide-version=10612 -build-path=${BUILD_PATH} -warnings=all ${SKETCH}
else
	${BUILDER} -compile -logger=machine -hardware=${HARDWARE} -tools=${TOOLS} -built-in-libraries=${BUILT_IN_LIBRARIES} -fqbn="arduino:avr:${BOARD_TYPE}" -ide-version=10612 -build-path=${BUILD_PATH} -warnings=all ${SKETCH}
fi

if [ $? -ne 0 ]; then
	echo build fail
    exit 2
fi

echo build success
exit 0

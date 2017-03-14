#!/bin/bash
#export PATH=/usr/bin:$PATH

# useage:  build.sh project_path fqbn [libraries]
# example: 
#     1. build.sh test arduino:avr:uno:cpu=atmege328
#     2. build.sh /home/project/test arduino:avr:yun ~/documents/kenrobot/libraries/kenrobot
#     3. fqbn: arduino:avr:uno:cpu=atmege328 | arduino:avr:yun | arduino:avr:pro:cpu=16MHzatmega328
#     4. 有些主板需要指定mcu

if [ $# -lt 2 ];then
	echo "more arguments required"
    exit 1
fi

SKETCH_PATH=$1
SKETCH=$(basename ${SKETCH_PATH})
SKETCH=${SKETCH_PATH}/${SKETCH}.ino
BUILD_PATH=${SKETCH_PATH}/build

FQBN=$2
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

COMMAND="${BUILDER} -compile -logger=machine -hardware=${HARDWARE} -tools=${TOOLS} -built-in-libraries=${BUILT_IN_LIBRARIES}"
if [ ! -n "$LIBRARIES" ];then
	COMMAND+=" -libraries=${LIBRARIES}"
fi
COMMAND+=" -fqbn=${FQBN} -ide-version=10612 -build-path=${BUILD_PATH} -warnings=all ${SKETCH}"
${COMMAND}

if [ $? -ne 0 ]; then
	echo build fail
    exit 2
fi

echo build success
exit 0

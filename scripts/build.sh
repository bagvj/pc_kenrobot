#!/bin/bash
#export PATH=/usr/bin:$PATH

# 使用方法: build.sh 项目名 主板类型
# 使用示例: 1. build.sh test uno 2. build.sh /home/project/test uno

if [ $# -ne 2 ];then
	echo "参数个数必须为2"
    exit 1
fi

SKETCH_PATH=$1
SKETCH=$(basename ${SKETCH_PATH})
SKETCH=${SKETCH_PATH}/${SKETCH}.ino
BUILD_PATH=${SKETCH_PATH}/build

BOARD_TYPE=$2

DIR=$(dirname "$0")
LOCAL_ARDUINO_PATH=${DIR}/../arduino-linux
# EXTRA_LIBRARIES=

BUILDER=${LOCAL_ARDUINO_PATH}/arduino-builder
HARDWARE=${LOCAL_ARDUINO_PATH}/hardware
TOOLS=${LOCAL_ARDUINO_PATH}/tools-builder,${LOCAL_ARDUINO_PATH}/hardware/tools/avr
LIBRARIES=${LOCAL_ARDUINO_PATH}/libraries
FQBN=arduino:avr:${BOARD_TYPE}

if [ ! -d ${BUILD_PATH} ]; then
	mkdir ${BUILD_PATH}
fi

${BUILDER} -hardware=${HARDWARE} -tools=${TOOLS} -built-in-libraries=${LIBRARIES} -fqbn=${FQBN} -build-path=${BUILD_PATH} -warnings=all ${SKETCH}

if [ $? -ne 0 ]; then
	echo build fail
    exit 2
fi

echo build success
exit 0
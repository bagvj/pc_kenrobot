#!/bin/bash
#export PATH=/usr/bin:$PATH

# useage:  build.sh project_path board_type
# example: 1. build.sh test uno 2. build.sh /home/project/test uno

if [ $# -ne 2 ];then
	echo "2 arguments required"
    exit 1
fi

SKETCH_PATH=$1
SKETCH=$(basename ${SKETCH_PATH})
SKETCH=${SKETCH_PATH}/${SKETCH}.ino
BUILD_PATH=${SKETCH_PATH}/build

BOARD_TYPE=$2

DIR=$(dirname "$0")
if [[ `arch` == arm* ]];then
	LOCAL_ARDUINO_PATH=${DIR}/../arduino-arm
elif [[ `uname -s` == Darwin ]];then
	LOCAL_ARDUINO_PATH=${DIR}/../arduino-mac
else
	LOCAL_ARDUINO_PATH=${DIR}/../arduino-linux
fi

BUILDER=${LOCAL_ARDUINO_PATH}/arduino-builder
HARDWARE=${LOCAL_ARDUINO_PATH}/hardware,${LOCAL_ARDUINO_PATH}/packages
TOOLS=${LOCAL_ARDUINO_PATH}/tools-builder,${LOCAL_ARDUINO_PATH}/hardware/tools/avr,${LOCAL_ARDUINO_PATH}/packages
LIBRARIES=${LOCAL_ARDUINO_PATH}/libraries

if [ ! -d ${BUILD_PATH} ]; then
	mkdir ${BUILD_PATH}
fi

if [[ ${BOARD_TYPE} = genuino101 ]]; then
	${BUILDER} -hardware=${HARDWARE} -tools=${TOOLS} -built-in-libraries=${LIBRARIES} -fqbn="Intel:arc32:arduino_101" -ide-version=10612 -build-path=${BUILD_PATH} -warnings=all -prefs=runtime.tools.arduino101load.path=${LOCAL_ARDUINO_PATH}/packages/Intel/tools/arduino101load/1.6.9+1.28 -prefs=runtime.tools.flashpack.path=${LOCAL_ARDUINO_PATH}/packages/Intel/tools/flashpack/1.0.0 -prefs=runtime.tools.openocd.path=${LOCAL_ARDUINO_PATH}/packages/Intel/tools/openocd/0.9.0+0.1 -prefs=runtime.tools.arc-elf32.path=${LOCAL_ARDUINO_PATH}/packages/Intel/tools/arc-elf32/1.6.9+1.0.1 ${SKETCH}
else
	${BUILDER} -hardware=${HARDWARE} -tools=${TOOLS} -built-in-libraries=${LIBRARIES} -fqbn="arduino:avr:${BOARD_TYPE}" -ide-version=10612 -build-path=${BUILD_PATH} -warnings=all ${SKETCH}
fi

if [ $? -ne 0 ]; then
	echo build fail
    exit 2
fi

echo build success
exit 0

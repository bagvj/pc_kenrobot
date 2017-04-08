#!/bin/bash
#export PATH=/usr/bin:$PATH

# useage: build.sh project_path
# notice: you can't call this script manual, unless you ensure [project_path]/config/build.txt exist which generated automatic

# project path
PROJECT_PATH=$1
PROJECT_NAME=$(basename ${PROJECT_PATH})
ARDUINO_FILE=${PROJECT_PATH}/${PROJECT_NAME}.ino
BUILD_PATH=${PROJECT_PATH}/build

if [ ! -d ${BUILD_PATH} ]; then
	mkdir ${BUILD_PATH}
fi

# read build args
ARGS=`head -1 ${PROJECT_PATH}/config/build.txt`

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
BUILT_IN_LIBRARIES=${LOCAL_ARDUINO_PATH}/libraries

COMMAND="${BUILDER} -compile -logger=machine -hardware=${HARDWARE} -tools=${TOOLS} -built-in-libraries=${BUILT_IN_LIBRARIES} -fqbn=${FQBN} -ide-version=10612 -warnings=all -prefs=build.warn_data_percentage=75 ${ARGS} -build-path=${BUILD_PATH} ${ARDUINO_FILE}"
${COMMAND}

if [ $? -ne 0 ]; then
	echo build fail
    exit 1
fi

echo build success
exit 0

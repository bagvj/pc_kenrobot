#!/bin/bash
#export PATH=/usr/bin:$PATH

# useage:  ./copy-builtIn-libraries.sh

DIR=$(dirname "$0")

LIB_PATH=${DIR}/../../lib_kenrobot
TMP_PATH=/tmp/lib_kenrobot

#echo ${DIR
rm -rf ${TMP_PATH}
mkdir ${TMP_PATH}
cp -r ${LIB_PATH}/* ${TMP_PATH}

rm -rf ${TMP_PATH}/RoSys/*.docx
rm -rf ${TMP_PATH}/RoSys/*.xlsx
rm -rf ${TMP_PATH}/RoSys/*.doc
rm -rf ${TMP_PATH}/RoSys/*.xls

cp -r ${TMP_PATH}/* ${DIR}/../arduino-arm/libraries
cp -r ${TMP_PATH}/* ${DIR}/../arduino-linux/libraries
cp -r ${TMP_PATH}/* ${DIR}/../arduino-mac/libraries
cp -r ${TMP_PATH}/* ${DIR}/../arduino-win/libraries

rm -rf ${TMP_PATH}

echo copy success
exit 0
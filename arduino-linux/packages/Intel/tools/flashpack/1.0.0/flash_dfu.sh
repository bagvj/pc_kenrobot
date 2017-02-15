#!/bin/sh 
set -e
#
# Script to flash Arduino 101 Factory BLE via USB and dfu-util
#
PID="8087:0aba"
IMG="images/firmware"
os="$(uname)"
SCRIPTDIR="$(dirname $0)"
cd "$SCRIPTDIR"

if [ x"$os" = x"Darwin" ]; then
  BIN="bin_osx/dfu-util"
  export DYLD_LIBRARY_PATH=bin_osx:$DYLD_LIBRARY_PATH
else
  BIN="bin/dfu-util"
  arch="$(uname -m)" 2>/dev/null
  if [ x"$arch" = x"i686" ]; then
    BIN="bin/dfu-util.32"
  fi
fi

help() {
  echo "Usage: $0 [options]
          -s serial_number  Only flash to board with specified serial number"
  exit 1
}

flash() {
  echo "

** Flashing Factory BLE **

"
  $DFU -a 8 -R -D $IMG/ble_core/image.bin
}

trap_to_dfu() {
  # If trapped.bin already exists, clean up before starting the loop
  [ -f "trapped.bin" ] && rm -f "trapped.bin"

  # Loop to read from 101 so that it stays on DFU mode afterwards
  until $DFU -a 4 -U trapped.bin > /dev/null 2>&1
  do
    sleep 0.1
  done

  # Clean up
  [ -f "trapped.bin" ] && rm -f "trapped.bin"

  # If a serial number is not specified by the user, read it from the board
  if [ -z "$ser_num" ]; then
    x=$($DFU -l 2>/dev/null |grep sensor|head -1)
    ser_num="-S $(echo $x|awk -F= {'print $8'}|sed -e 's/\"//g')"
    DFU="$BIN $ser_num -d,$PID"
  fi
}

# Parse command args
while [ $# -gt 0 ]; do
  arg="$1"
  case $arg in
    -s)
      ser_num=$2
      if [ -z "$ser_num" ]; then help; fi
      ser_num_param="-S $ser_num"
      shift # past argument
      ;;
    *)
      help # unknown option
      ;;
  esac
  shift # past argument or value
done

DFU="$BIN $ser_num_param -d,$PID"

echo "*** Reset the board to begin..."
trap_to_dfu

echo Flashing board S/N: $ser_num
flash

if [ $? -ne 0 ]; then
  echo
  echo "***ERROR***"
  exit 1
else
  echo
  echo "!!!SUCCESS!!!"
  exit 0
fi


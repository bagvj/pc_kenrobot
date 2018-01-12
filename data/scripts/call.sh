#!/bin/bash
#export PATH=/usr/bin:$PATH

# useage: call.sh command_path
# NOTICE: you CAN NOT call this script manual

# command path
COMMAND_PATH=$1

# read command
COMMAND=`head -1 "${COMMAND_PATH}"`
${COMMAND}
CODE=$?

if [ ${CODE} -ne 0 ]; then
	echo fail
    exit ${CODE}
fi

echo success
exit 0

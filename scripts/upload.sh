#!/bin/bash
#export PATH=/usr/bin:$PATH

# useage: upload.sh project_path
# notice: you can't call this script manual, unless you ensure [project_path]/config/upload.txt and [project_path]/config/[target_file] both exist which generated automatic


# project path
PROJECT_PATH=$1

# read upload command
COMMAND=`head -1 ${PROJECT_PATH}/config/upload.txt`
${COMMAND}

if [ $? -ne 0 ]; then
	echo upload fail
    exit 2
fi

echo upload success
exit 0

#!/usr/bin/env bash
# See https://stackoverflow.com/a/246128/7447059
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE"  ]; do # resolve $SOURCE until the file is no longer a symlink
	DIR="$( cd -P "$( dirname "$SOURCE"  )" && pwd  )"
	SOURCE="$(readlink "$SOURCE")"
	[[ $SOURCE != /*  ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
declare -r __ROOT_PATH__="$( cd -P "$( dirname "${SOURCE}"  )" && pwd )"

node ${__ROOT_PATH__}/firepass.js

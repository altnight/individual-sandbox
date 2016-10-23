#!/bin/bash
name=`date +%Y%m%d`
test -d ${name} || mkdir -p ${name}
cd ${name}
test -f README.md || touch README.md

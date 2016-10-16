#!/bin/bash
# USAGE ./serve.sh [1.html|2.html]

[ -f ./index.html ] && rm ./index.html
ln -s ${1} ./index.html
python3 -m http.server

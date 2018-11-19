#!/bin/sh -x

GECKO_DRIVER_VERSION=0.23.0

if [ "$(uname)" == 'Darwin' ]; then
  PLATFORM=macos
else
  PLATFORM=linux64
fi
TAR_FILENAME=geckodriver-v${GECKO_DRIVER_VERSION}-${PLATFORM}.tar.gz

[ -f geckodriver ] && rm geckodriver
wget -q https://github.com/mozilla/geckodriver/releases/download/v${GECKO_DRIVER_VERSION}/${TAR_FILENAME}
tar xzf ${TAR_FILENAME}
rm ${TAR_FILENAME}


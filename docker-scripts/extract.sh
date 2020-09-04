#!/bin/sh

WOGVERSION=$(ls -1 | grep wog | sed s/wog-//g | sed s/.tar.gz//g)
tar xzvf wog-$WOGVERSION.tar.gz
tar xzvf assets.tar.gz
rm *.tar.gz

#!/bin/bash

function check () {
  npm-check --production
}

if ! command -v npm-check &> /dev/null
then
  echo "npm-check not found!"
  read -p "Do you want to install it now? (Y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]
  then
    npm i -g npm-check
    check
  fi
else
  check
fi

exit 0

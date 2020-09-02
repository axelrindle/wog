#!/bin/bash

./dist.sh
docker build . -t wog:latest

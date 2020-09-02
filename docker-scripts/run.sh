#!/bin/bash

docker run \
  --mount source=wog,target=/usr/src/app/storage \
  --mount type=bind,source=/var/log,target=/var/log_host \
  -p 8080:8082 \
  --name wog \
  --rm -d wog:latest

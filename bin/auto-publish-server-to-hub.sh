#!/bin/bash

build_version=latest
hub_version=v10.3.2

## build by docker-compose-build-code.yml
docker-compose -f ../docker/docker-compose-build-code.yml --profile=server build

## tag
docker tag docker-tl-rtc-file-api-server:$build_version iamtsm/tl-rtc-file-api-server:$hub_version
docker tag docker-tl-rtc-file-socket-server:$build_version iamtsm/tl-rtc-file-socket-server:$hub_version

## push to hub version and latest
docker push iamtsm/tl-rtc-file-api-server:$hub_version
docker push iamtsm/tl-rtc-file-socket-server:$hub_version
docker push iamtsm/tl-rtc-file-api-server:latest
docker push iamtsm/tl-rtc-file-socket-server:latest

## remove server images
docker rmi docker-tl-rtc-file-api-server:$build_version
docker rmi docker-tl-rtc-file-socket-server:$build_version
docker rmi iamtsm/tl-rtc-file-api-server:$hub_version
docker rmi iamtsm/tl-rtc-file-socket-server:$hub_version
#!/bin/bash

build_version=latest
hub_version=v1.0.0

## build by docker-compose-build-code.yml
docker-compose -f ../docker/docker-compose-build-code.yml --profile=local build

## tag
docker tag docker-tl-rtc-file-api-local:$build_version iamtsm/tl-rtc-file-api-local:$hub_version
docker tag docker-tl-rtc-file-socket-local:$build_version iamtsm/tl-rtc-file-socket-local:$hub_version

## push to hub version and latest
docker push iamtsm/tl-rtc-file-api-local:$hub_version
docker push iamtsm/tl-rtc-file-socket-local:$hub_version
docker push iamtsm/tl-rtc-file-api-local:latest
docker push iamtsm/tl-rtc-file-socket-local:latest

## remove local images
docker rmi docker-tl-rtc-file-api-local:$build_version
docker rmi docker-tl-rtc-file-socket-local:$build_version
docker rmi iamtsm/tl-rtc-file-api-local:$hub_version
docker rmi iamtsm/tl-rtc-file-socket-local:$hub_version
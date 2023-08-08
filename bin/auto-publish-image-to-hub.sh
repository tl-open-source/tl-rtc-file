#!/bin/bash

build_version=latest
hub_version=v10.3.3

## build by docker-compose-build-code.yml
docker-compose -f ../docker/docker-compose-build-code.yml build

## tag
docker tag docker-tl-rtc-file-api:$build_version iamtsm/tl-rtc-file-api:$hub_version
docker tag docker-tl-rtc-file-socket:$build_version iamtsm/tl-rtc-file-socket:$hub_version
docker tag docker-tl-rtc-file-api:$build_version iamtsm/tl-rtc-file-api:$build_version
docker tag docker-tl-rtc-file-socket:$build_version iamtsm/tl-rtc-file-socket:$build_version

## push to hub version and latest
docker push iamtsm/tl-rtc-file-api:$hub_version
docker push iamtsm/tl-rtc-file-socket:$hub_version
docker push iamtsm/tl-rtc-file-api:$build_version
docker push iamtsm/tl-rtc-file-socket:$build_version

## remove local images
docker rmi docker-tl-rtc-file-api:$build_version
docker rmi docker-tl-rtc-file-socket:$build_version

docker rmi iamtsm/tl-rtc-file-api:$build_version
docker rmi iamtsm/tl-rtc-file-socket:$build_version
docker rmi iamtsm/tl-rtc-file-api:$hub_version
docker rmi iamtsm/tl-rtc-file-socket:$hub_version
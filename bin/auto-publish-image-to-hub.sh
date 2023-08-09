#!/bin/bash
#########################
# 一键推送dockerhub的脚本
# @auther: iamtsm
# @version: v1.0.0
#########################

######################################## start ######################################
build_version=latest
hub_version=v10.3.4

######################################## build ######################################
## build by docker-compose-build-code.yml
docker-compose -f ../docker/docker-compose-build-code.yml build

######################################## tag ########################################
# tag hub version
docker tag docker-api:$build_version iamtsm/tl-rtc-file-api:$hub_version
docker tag docker-socket:$build_version iamtsm/tl-rtc-file-socket:$hub_version
docker tag docker-mysql:$build_version iamtsm/tl-rtc-file-mysql:$hub_version

# tag latest version
docker tag docker-api:$build_version iamtsm/tl-rtc-file-api:$build_version
docker tag docker-socket:$build_version iamtsm/tl-rtc-file-socket:$build_version
docker tag docker-mysql:$build_version iamtsm/tl-rtc-file-mysql:$build_version

######################################## push #######################################
# push hub version
docker push iamtsm/tl-rtc-file-api:$hub_version
docker push iamtsm/tl-rtc-file-socket:$hub_version
docker push iamtsm/tl-rtc-file-mysql:$hub_version

# push latest version
docker push iamtsm/tl-rtc-file-api:$build_version
docker push iamtsm/tl-rtc-file-socket:$build_version
docker push iamtsm/tl-rtc-file-mysql:$build_version

######################################## del ########################################
## del build version
docker rmi docker-api:$build_version
docker rmi docker-socket:$build_version
docker rmi docker-mysql:$build_version

# # del tag build version
docker rmi iamtsm/tl-rtc-file-api:$build_version
docker rmi iamtsm/tl-rtc-file-socket:$build_version
docker rmi iamtsm/tl-rtc-file-mysql:$build_version

# del tag hub version
docker rmi iamtsm/tl-rtc-file-api:$hub_version
docker rmi iamtsm/tl-rtc-file-socket:$hub_version
docker rmi iamtsm/tl-rtc-file-mysql:$hub_version

######################################## done #######################################

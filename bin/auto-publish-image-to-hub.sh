#!/bin/bash
#########################
# 一键推送dockerhub的脚本
# @auther: iamtsm
# @version: v1.1.0
#########################

######################################## start ######################################
latest_version=latest

######################################## build ######################################
## build by docker-compose-build-code.yml
docker-compose -f ../docker/docker-compose-build-code.yml build

######################################## tag ########################################
# tag latest version
docker tag docker-api:$latest_version iamtsm/tl-rtc-file-api:$latest_version
docker tag docker-socket:$latest_version iamtsm/tl-rtc-file-socket:$latest_version
docker tag docker-mysql:$latest_version iamtsm/tl-rtc-file-mysql:$latest_version
docker tag docker-coturn:$latest_version iamtsm/tl-rtc-file-coturn:$latest_version

######################################## push #######################################
# push latest version
docker push iamtsm/tl-rtc-file-api:$latest_version
docker push iamtsm/tl-rtc-file-socket:$latest_version
docker push iamtsm/tl-rtc-file-mysql:$latest_version
docker push iamtsm/tl-rtc-file-coturn:$latest_version

######################################## del ########################################
## del build version
docker rmi docker-api:$latest_version
docker rmi docker-socket:$latest_version
docker rmi docker-mysql:$latest_version
docker rmi docker-coturn:$latest_version

# # del tag build version
docker rmi iamtsm/tl-rtc-file-api:$latest_version
docker rmi iamtsm/tl-rtc-file-socket:$latest_version
docker rmi iamtsm/tl-rtc-file-mysql:$latest_version
docker rmi iamtsm/tl-rtc-file-coturn:$latest_version

######################################## done #######################################

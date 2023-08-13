#!/bin/bash
#########################
# 一键推送dockerhub的脚本
# for arm64
# @auther: iamtsm
# @version: v1.2.0
#########################

build_and_push_image() {
    local image_name=$1
    local tag=$2
    local target_name=$3
    local image_prefix="iamtsm/tl-rtc-file"
    local arch="arm64"
  
    echo "###################################### build $image_prefix-$target_name-$arch:$tag"
    ## build by docker-compose-build-code.yml
    docker-compose -f ../docker/docker-compose-build-code.yml build $image_name

    echo "###################################### tag $image_prefix-$target_name-$arch:$tag"
    docker tag docker-$image_name:$tag $image_prefix-$target_name-$arch:$tag

    echo "###################################### push $image_prefix-$target_name-$arch:$tag"
    docker push $image_prefix-$target_name-$arch:$tag

    echo "###################################### del $image_prefix-$target_name-$arch:$tag"
    ## del build version
    docker rmi docker-$image_name:$tag
    ## del tag build version
    docker rmi $image_prefix-$target_name-$arch:$tag
}

latest_version=latest

if [ $# -eq 0 ]; then
    # 如果没有传入参数，默认执行所有镜像的打包发布逻辑
    echo "Please input args"
else
  # 有传入参数时，遍历处理每个参数
  for image_arg in "$@"; do
    case $image_arg in
      api)
        build_and_push_image "api" $latest_version "api"
        ;;
      socket)
        build_and_push_image "socket" $latest_version "socket"
        ;;
      mysql)
        build_and_push_image "mysql" $latest_version "mysql"
        ;;
      coturn)
        build_and_push_image "coturn" $latest_version "coturn"
        ;;
      *)
        echo "Invalid argument: $image_arg"
        ;;
    esac
  done
fi
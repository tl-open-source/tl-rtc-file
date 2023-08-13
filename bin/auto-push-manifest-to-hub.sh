#!/bin/bash
#########################
# 一键推送dockerhub多架构脚本
# @auther: iamtsm
# @version: v1.0.0
#########################

build_and_push_manifest() {
    local image_name=$1
    local tag=$2
    local target_name=$3
    local image_prefix="iamtsm/tl-rtc-file"
    local arch_arm64="arm64"
    local arch_amd64="amd64"
  
    echo "###################################### craete manifest $image_prefix-$target_name:$tag"
    docker manifest create $image_prefix-$target_name:$tag \
                        $image_prefix-$target_name-$arch_arm64:$tag \
                        $image_prefix-$target_name-$arch_amd64:$tag --amend

    echo "###################################### push manifest $image_prefix-$target_name:$tag"
    docker manifest push $image_prefix-$target_name:$tag
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
        build_and_push_manifest "api" $latest_version "api"
        ;;
      socket)
        build_and_push_manifest "socket" $latest_version "socket"
        ;;
      mysql)
        build_and_push_manifest "mysql" $latest_version "mysql"
        ;;
      coturn)
        build_and_push_manifest "coturn" $latest_version "coturn"
        ;;
      *)
        echo "Invalid argument: $image_arg"
        ;;
    esac
  done
fi
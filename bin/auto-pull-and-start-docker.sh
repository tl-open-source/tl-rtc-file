#!/bin/bash
#########################
# 提供一键部署docker的脚本
# @auther: iamtsm
# @version: v1.1.0
#########################

# 检查Docker是否启动
docker info > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "======> Docker is not running. Exiting."
    exit 1
fi

# 读取配置文件中的每一行
while IFS= read -r line; do
  # 忽略注释和空行
  if [[ $line == \#* || -z $line ]]; then
    continue
  fi
  
  # 将每一行拆分成键和值
  IFS== read -r key value <<< "$line"
  
  # 去除空白字符
  key=$(echo "$key" | tr -d '[:space:]')
  value=$(echo "$value" | tr -d '[:space:]')
  
  # 设置环境变量
  export "$key"="$value"
  echo "======> " $key=$value
done < ./../tlrtcfile.env

# docker启动 默认开启数据库
export tl_rtc_file_db_open=true

# 从dockerhub拉取镜像
docker pull iamtsm/tl-rtc-file-api
docker pull iamtsm/tl-rtc-file-socket
docker pull iamtsm/tl-rtc-file-mysql
docker pull iamtsm/tl-rtc-file-coturn

if docker images | grep -q "iamtsm/tl-rtc-file-api"; then
    echo "======> check image iamtsm/tl-rtc-file-api exists ok..."
else
    echo "======> Image iamtsm/tl-rtc-file-api does not exist. Exiting."
    exit 1
fi

if docker images | grep -q "iamtsm/tl-rtc-file-socket"; then
    echo "======> check image iamtsm/tl-rtc-file-socket exists ok..."
else
    echo "======> Image iamtsm/tl-rtc-file-socket does not exist. Exiting."
    exit 1
fi

if docker images | grep -q "iamtsm/tl-rtc-file-mysql"; then
    echo "======> check image iamtsm/tl-rtc-file-mysql exists ok..."
else
    echo "Image iamtsm/tl-rtc-file-mysql does not exist. Exiting."
    exit 1
fi

if docker images | grep -q "iamtsm/tl-rtc-file-coturn"; then
    echo "======> check image iamtsm/tl-rtc-file-coturn exists ok..."
else
    echo "Image iamtsm/tl-rtc-file-coturn does not exist. Exiting."
    exit 1
fi

echo "======> start run docker..."

# 启动mysql容器
docker run \
  --name=mysql \
  -p $tl_rtc_file_db_mysql_port:$tl_rtc_file_db_mysql_port \
  -e MYSQL_ROOT_PASSWORD=tlrtcfile \
  -e MYSQL_DATABASE=webchat \
  -e MYSQL_USER=tlrtcfile \
  -e MYSQL_PASSWORD=tlrtcfile \
  -v ./../docker/mysql/data/mysql.env:/tlrtcfile/docker/mysql/mysql.env \
  -v ./../docker/mysql/data/db:/var/lib/mysql \
  -v ./../docker/mysql/data/my.cnf:/etc/mysql/conf.d/my.cnf \
  -v ./../docker/mysql/data/log:/var/log/mysql \
  -v ./../docker/mysql/data/init.sql:/docker-entrypoint-initdb.d/init.sql \
  --restart=always \
  -d iamtsm/tl-rtc-file-mysql

# 启动coturn容器
docker run \
  --name=coturn \
  -p 3478:3478/udp \
  -p 3478:3478/tcp \
  -v ./../docker/coturn/turnserver-with-secret-user.conf:/etc/coturn/turnserver.conf \
  -d iamtsm/tl-rtc-file-coturn

# 启动api容器
docker run \
  --name=api \
  -p $tl_rtc_file_api_port:$tl_rtc_file_api_port \
  -e "tl_rtc_file_env_mode=http" \
  -e tl_rtc_file_api_port \
  -e tl_rtc_file_ws_port \
  -e tl_rtc_file_ws_host \
  -e tl_rtc_file_webrtc_stun_host \
  -e tl_rtc_file_webrtc_turn_host \
  -e tl_rtc_file_webrtc_turn_username \
  -e tl_rtc_file_webrtc_turn_credential \
  -e tl_rtc_file_webrtc_turn_secret \
  -e tl_rtc_file_webrtc_turn_expire \
  -e tl_rtc_file_db_open \
  -e tl_rtc_file_db_mysql_host \
  -e tl_rtc_file_db_mysql_port \
  -e tl_rtc_file_db_mysql_dbName \
  -e tl_rtc_file_db_mysql_user \
  -e tl_rtc_file_db_mysql_password \
  -e tl_rtc_file_oss_seafile_repoid \
  -e tl_rtc_file_oss_seafile_host \
  -e tl_rtc_file_oss_seafile_username \
  -e tl_rtc_file_oss_seafile_password \
  -e tl_rtc_file_oss_alyun_AccessKey \
  -e tl_rtc_file_oss_alyun_Secretkey \
  -e tl_rtc_file_oss_alyun_bucket \
  -e tl_rtc_file_oss_txyun_AccessKey \
  -e tl_rtc_file_oss_txyun_Secretkey \
  -e tl_rtc_file_oss_txyun_bucket \
  -e tl_rtc_file_oss_qiniuyun_AccessKey \
  -e tl_rtc_file_oss_qiniuyun_Secretkey \
  -e tl_rtc_file_oss_qiniuyun_bucket \
  -e tl_rtc_file_manage_room \
  -e tl_rtc_file_manage_password \
  -e tl_rtc_file_notify_open \
  -e tl_rtc_file_notify_qiwei_normal \
  -e tl_rtc_file_notify_qiwei_error \
  -v ../tlrtcfile.env:/tlrtcfile/tlrtcfile.env \
  --link mysql \
  -d iamtsm/tl-rtc-file-api tlapi

# 启动socket容器
docker run \
  --name=socket \
  -p $tl_rtc_file_ws_port:$tl_rtc_file_ws_port \
  -e "tl_rtc_file_env_mode=http" \
  -e tl_rtc_file_api_port \
  -e tl_rtc_file_ws_port \
  -e tl_rtc_file_ws_host \
  -e tl_rtc_file_webrtc_stun_host \
  -e tl_rtc_file_webrtc_turn_host \
  -e tl_rtc_file_webrtc_turn_username \
  -e tl_rtc_file_webrtc_turn_credential \
  -e tl_rtc_file_webrtc_turn_secret \
  -e tl_rtc_file_webrtc_turn_expire \
  -e tl_rtc_file_db_open \
  -e tl_rtc_file_db_mysql_host \
  -e tl_rtc_file_db_mysql_port \
  -e tl_rtc_file_db_mysql_dbName \
  -e tl_rtc_file_db_mysql_user \
  -e tl_rtc_file_db_mysql_password \
  -e tl_rtc_file_oss_seafile_repoid \
  -e tl_rtc_file_oss_seafile_host \
  -e tl_rtc_file_oss_seafile_username \
  -e tl_rtc_file_oss_seafile_password \
  -e tl_rtc_file_oss_alyun_AccessKey \
  -e tl_rtc_file_oss_alyun_Secretkey \
  -e tl_rtc_file_oss_alyun_bucket \
  -e tl_rtc_file_oss_txyun_AccessKey \
  -e tl_rtc_file_oss_txyun_Secretkey \
  -e tl_rtc_file_oss_txyun_bucket \
  -e tl_rtc_file_oss_qiniuyun_AccessKey \
  -e tl_rtc_file_oss_qiniuyun_Secretkey \
  -e tl_rtc_file_oss_qiniuyun_bucket \
  -e tl_rtc_file_manage_room \
  -e tl_rtc_file_manage_password \
  -e tl_rtc_file_notify_open \
  -e tl_rtc_file_notify_qiwei_normal \
  -e tl_rtc_file_notify_qiwei_error \
  -v ../tlrtcfile.env:/tlrtcfile/tlrtcfile.env \
  --link mysql \
  -d iamtsm/tl-rtc-file-socket tlsocket
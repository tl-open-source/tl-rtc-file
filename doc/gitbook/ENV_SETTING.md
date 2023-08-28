下面先对项目默认配置文件 `tlrtcfile.env` 进行简单说明

# tlrtcfile.env

这个配置文件主要分为几部分，每个配置部分相对独立，不会相互影响

### 基础配置

**这个地方全部设置好，服务就可以基本使用了**

```
#-----------------以下为基础配置-----------------#
## api服务端口
tl_rtc_file_api_port=9092
## websocket服务端口
tl_rtc_file_socket_port=8444
## websocket服务地址
tl_rtc_file_socket_host=127.0.0.1:8444
```

### webrtc配置

**主要是coturn中继服务器相关，不是非必需配置，主要用于处理公网环境的p2p打洞失败的数据中转用的服务器**

```
#-----------------以下为webrtc相关配置-----------------#
## webrtc-stun中继服务地址
tl_rtc_file_webrtc_stun_host=stun:127.0.0.1:3478
## webrtc-turn中继服务地址
tl_rtc_file_webrtc_turn_host=turn:127.0.0.1:3478?transport=udp
## webrtc中继服务用户名
tl_rtc_file_webrtc_turn_username=tlrtcfile
## webrtc中继服务密码
tl_rtc_file_webrtc_turn_credential=tlrtcfile
## webrtc中继服务Secret
tl_rtc_file_webrtc_turn_secret=tlrtcfile
## webrtc中继服务帐号过期时间 (毫秒)
tl_rtc_file_webrtc_turn_expire=86400000
```

### mysql配置

**主要是mysql数据库相关的配置，主要用于后台管理统计，功能控制，取件码等场景，不是非必需**

```
#-----------------以下为mysql数据库相关配置-----------------#
## 是否开启数据库
tl_rtc_file_db_open=false
## 数据库地址
tl_rtc_file_db_mysql_host=mysql
## 数据库端口
tl_rtc_file_db_mysql_port=3306
## 数据库名称
tl_rtc_file_db_mysql_dbName=webchat
## 数据库用户名
tl_rtc_file_db_mysql_user=tlrtcfile
## 数据库密码
tl_rtc_file_db_mysql_password=tlrtcfile
```

### 后台管理配置

**主要是进入后台管理的管理员房间帐号配置，前提是需要设置好并开启数据库相关配置**

```
#-----------------以下为管理后台相关配置-----------------#
## 管理后台房间号
tl_rtc_file_manage_room=tlrtcfile
## 管理后台密码
tl_rtc_file_manage_password=tlrtcfile
```

### 告警通知配置

**主要用于系统异常告警，日常操作通知，需要注册企业微信，并传创建好群聊机器人**

```
#-----------------以下为企业微信通知相关配置-----------------#
## 企业微信通知开关
tl_rtc_file_notify_open=false
## 企业微信通知机器人KEY，正常通知，如果有多个key，逗号分隔
tl_rtc_file_notify_qiwei_normal=
## 企业微信通知机器人KEY，错误通知，如果有多个key，逗号分隔
tl_rtc_file_notify_qiwei_error=
```

### OpenAI聊天配置

**项目内置了一个聊天对话框，对接了chatgpt的开放接口，只需要注册并设置好自己的帐号key即可**

```
#-----------------以下为openai相关配置-----------------#
## openai-key，如果有多个key，逗号分隔
tl_rtc_file_openai_keys=
```


### Oss云存储配置

目前还不是特别完善，后续会逐步更新主流厂商，目前仅支持了seafile私有云盘

**主要是用于目前已有的取件码形式，和后续会支持的多厂商云存储，打造可以自己私有化部署的一套式文件传输，暂存文件等功能等在线应用**

```
#-----------------以下为oss相关配置-----------------#
## oss-seafile存储库ID
tl_rtc_file_oss_seafile_repoid=
## oss-seafile地址
tl_rtc_file_oss_seafile_host=
## oss-seafile用户名
tl_rtc_file_oss_seafile_username=
## oss-seafile密码
tl_rtc_file_oss_seafile_password=

## oss-alyun存储accessKey
tl_rtc_file_oss_alyun_AccessKey=
## oss-aly存储SecretKey
tl_rtc_file_oss_alyun_Secretkey=
## oss-aly存储bucket
tl_rtc_file_oss_alyun_bucket=

## oss-txyun存储accessKey
tl_rtc_file_oss_txyun_AccessKey=
## oss-txyunt存储SecretKey
tl_rtc_file_oss_txyun_Secretkey=
## oss-txyun存储bucket
tl_rtc_file_oss_txyun_bucket=

## oss-qiniuyun存储accessKey
tl_rtc_file_oss_qiniuyun_AccessKey=
## oss-qiniuyunt存储SecretKey
tl_rtc_file_oss_qiniuyun_Secretkey=
## oss-qiniuyun存储bucket
tl_rtc_file_oss_qiniuyun_bucket=
```

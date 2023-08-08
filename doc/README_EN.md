# tl-rtc-file-tool - Beyond File Transmission, Originating from It

[![](https://img.shields.io/badge/webrtc-p2p-blue)](https://webrtc.org.cn/)
[![](https://img.shields.io/badge/code-simple-green)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/large%20file-support-green)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/deployment-private-yellow)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/platform-unlimited-coral)](https://github.com/iamtsm/tl-rtc-file/)

<p align="center">
<a href="https://im.iamtsm.cn/file" target="_blank">Experience Here</a> ｜
<a href="https://hub.docker.com/repositories/iamtsm" target="_blank">DockerHub</a> ｜
<a href="https://github.com/tl-open-source/tl-rtc-file/blob/master/doc/README_EN.md" target="_blank">EN-DOC</a>
</p>

<p align="center">QQ Group: <a href="https://jq.qq.com/?_wv=1027&k=TKCwMBjN" target="_blank">624214498 </a></p>

## Table of Contents

- [Background](#background)
- [Introduction](#introduction)
- [Advantages](#advantages)
- [Extensions](#extensions)
- [Preparation (Required Steps)](#preparation-required-steps)
- [Configure Websocket (Required Steps)](#configure-websocket-required-steps)
- [Startup (Required Steps)](#startup-required-steps)
- [Configure Database (Optional Steps)](#configure-database-optional-steps)
- [Admin Panel (Optional Steps)](#admin-panel-optional-steps)
- [Enterprise WeChat Notification (Optional Steps)](#enterprise-wechat-notification-optional-steps)
- [OSS Cloud Storage (Optional Steps)](#oss-cloud-storage-optional-steps)
- [Chat-GPT (Optional Steps)](#chat-gpt-optional-steps)
- [Configure Turnserver (Local Network - Optional Steps, Public Network - Required Steps)](#configure-turnserver-local-network-optional-steps-public-network-required-steps)
- [Docker](#docker)
- [Other Deployment Methods](#other-deployment-methods)
- [Overview Diagram](#overview-diagram)
- [License](#license)
- [Disclaimer](#disclaimer)

#### Background: Consolidated from the Topic of the 20-year Graduation Project

#### Introduction: (tl webrtc datachannel filetools) Transferring files on the web using WebRTC, supporting transmission of large files.

#### Advantages: Chunked transmission, cross-platform, versatile usage, no speed restrictions on local networks (up to 70+ MB/s in LAN), supports private deployment, supports drag-and-drop sending of multiple files, web-based file preview.

#### Extensions: Many rich additional features have been added, such as local screen recording, remote screen sharing (no latency), remote audio and video calls (no latency), live streaming (no latency), password-protected rooms, OSS cloud storage, relay service configuration, WebRTC detection, WebRTC statistics, text transmission (group chat, private chat), public chat, remote whiteboard, AI chatbot, comprehensive backend management, real-time execution log display, robot alert notifications, and more.

## Preparation (Required Steps)

1. Install Node.js 14.21.x or above, and npm. Then, navigate to the project directory and run the following commands:

    ```
    cd svr/
    npm install
    ```

2. For the first run or when developing your own pages, you can use either of the following commands:

    ```
    npm run build:dev  # Use this command if you need to develop/modify frontend pages
    npm run build:pro  # Use this command if you don't need to develop/modify frontend pages
    ```

3. Modify the `http.env` and `https.env` configuration files.

## Configure WebSocket (Required Steps)

Modify the relevant WebSocket configuration in `http.env` and `https.env` files.

`http.env`

```ini
## WebSocket server port
tl_rtc_file_ws_port=8444

## WebSocket server address
## "ws://domain or ip:port or domain:port"
## For socket IP, use LAN IP/public IP. LAN IP can only be accessed within the LAN, public IP can be accessed from the internet
tl_rtc_file_ws_host=ws://127.0.0.1:8444
```

`https.env`

```ini
## WebSocket server port
tl_rtc_file_wss_port=8444

## WebSocket server address
## "wss://domain or ip:port or domain:port"
## For socket IP, use LAN IP/public IP. LAN IP can only be accessed within the LAN, public IP can be accessed from the internet
tl_rtc_file_wss_host=wss://127.0.0.1:8444
```

## Startup (Required Steps)

Start the following two services; choose one mode to start. The only difference between the two modes is that the HTTPS environment allows the use of audio, video, live streaming, and screen sharing features, while the other functionalities remain unaffected.

For HTTP mode, access http://your-machine-ip:9092.

```
API service: npm run http-api
Socket service: npm run http-socket
```

For HTTPS mode, access https://your-machine-ip:9092.

```
API service: npm run https-api
Socket service: npm run https-socket
```

## Configure Database (Non-Required Step)

Modify the database-related configuration in `http.env` and `https.env`.

```ini
## Whether to enable the database
tl_rtc_file_db_open=false
## Database address
tl_rtc_file_db_mysql_host=
## Database port
tl_rtc_file_db_mysql_port=3306
## Database name
tl_rtc_file_db_mysql_dbName=webchat
## Database username
tl_rtc_file_db_mysql_user=tlrtcfile
## Database password
tl_rtc_file_db_mysql_password=tlrtcfile
```

## Admin Dashboard (Non-Required Step)

Prerequisite: Database configuration must be enabled.

Modify the admin dashboard-related configuration in `http.env` and `https.env`.

```ini
## Admin dashboard room number
tl_rtc_file_manage_room=tlrtcfile
## Admin dashboard password
tl_rtc_file_manage_password=tlrtcfile
```

Access: http://localhost:9092 or http://your-machine-ip:9092, enter the configured room number and password to access the admin dashboard.

## Enterprise WeChat Notifications (Non-Required Step)

Modify the enterprise WeChat notification-related configuration in `http.env` and `https.env`.

```ini
# ## Enterprise WeChat notification switch
tl_rtc_file_notify_open=false
## Enterprise WeChat notification robot keys, normal notifications (comma-separated if multiple keys)
tl_rtc_file_notify_qiwei_normal=
## Enterprise WeChat notification robot keys, error notifications (comma-separated if multiple keys)
tl_rtc_file_notify_qiwei_error=
```

## OSS Cloud Storage (Non-Required Step)

Modify the OSS storage-related configuration in `http.env` and `https.env`.

```ini
## oss-seafile storage repository ID
tl_rtc_file_oss_seafile_repoid=
## oss-seafile address
tl_rtc_file_oss_seafile_host=
## oss-seafile username
tl_rtc_file_oss_seafile_username=
## oss-seafile password
tl_rtc_file_oss_seafile_password=

## oss-alyun storage accessKey
tl_rtc_file_oss_alyun_AccessKey=
## oss-alyun storage SecretKey
tl_rtc_file_oss_alyun_Secretkey=
## oss-alyun storage bucket
tl_rtc_file_oss_alyun_bucket=

## oss-txyun storage accessKey
tl_rtc_file_oss_txyun_AccessKey=
## oss-txyun storage SecretKey
tl_rtc_file_oss_txyun_Secretkey=
## oss-txyun storage bucket
tl_rtc_file_oss_txyun_bucket=

## oss-q

iniuyun storage accessKey
tl_rtc_file_oss_qiniuyun_AccessKey=
## oss-qiniuyun storage SecretKey
tl_rtc_file_oss_qiniuyun_Secretkey==
## oss-qiniuyun storage bucket
tl_rtc_file_oss_qiniuyun_bucket=
```

## Chat-GPT (Non-Required Step)

Modify the OpenAI-related configuration in `http.env` and `https.env`.

```ini
## OpenAI key(s), comma-separated if multiple keys
tl_rtc_file_openai_keys=
```

## Configure TURN Server (Non-Required Step for LAN, Required Step for Public Network)

Currently, there are two ways to generate credentials for using TURN service: fixed credentials (recommended) and credentials with expiration date. Choose one method.

Example for Ubuntu:

Install Coturn: `sudo apt-get install coturn`

Valid credentials: `docker/coturn/turnserver-with-secret-user.conf`

1. Modify the fields `listening-device`, `listening-ip`, `external-ip`, `static-auth-secret`, and `realm`.
2. Start TURN server: `turnserver -c /complete/path/to/conf/turn/turnserver-with-secret-user.conf`

Fixed credentials: `docker/coturn/turnserver-with-fixed-user.conf`

1. Modify the fields `listening-device`, `listening-ip`, `external-ip`, `user`, and `realm`.
2. Generate a user: `turnadmin -a -u username -p password -r realm`
3. Start TURN server: `turnserver -c /complete/path/to/docker/coturn/turnserver-with-secret-user.conf`

After deploying Coturn, set up WebRTC-related information in the corresponding `http.env` and `https.env` configurations.

```ini
## Webrtc-stun relay service address
tl_rtc_file_webrtc_stun_host=
## Webrtc-turn relay service address
tl_rtc_file_webrtc_turn_host=
## Webrtc relay service username
tl_rtc_file_webrtc_turn_username=tlrtcfile
## Webrtc relay service password
tl_rtc_file_webrtc_turn_credential=tlrtcfile
## Webrtc relay service Secret
tl_rtc_file_webrtc_turn_secret=tlrtcfile
## Webrtc relay service account expiration time (milliseconds)
tl_rtc_file_webrtc_turn_expire=86400000
```

## Docker

### Using Official Images:

The following are basic parameters; you can refer to `http.env` and `https.env` for more parameters.

Pull the API image:

```bash
docker pull iamtsm/tl-rtc-file-api

docker run --name=api -p 9092:9092 \
    -e "tl_rtc_file_env_mode=http" \
    -e "tl_rtc_file_ws_port=8444" \
    -e "tl_rtc_file_ws_host=ws://127.0.0.1:8444" \
    -d iamtsm/tl-rtc-file-api tlapi
```

Pull the Socket image:

```bash
docker pull iamtsm/tl-rtc-file-socket

docker run --name=socket -p 8444:8444 \
    -e "tl_rtc_file_env_mode=http" \
    -e "tl_rtc_file_ws_port=8444" \
    -e "tl_rtc_file_ws_host=ws://127.0.0.1:8444" \
    -d iamtsm/tl-rtc-file-socket tlsocket
```

### Using Official Images (docker-compose):

Start the HTTP mode image: `docker-compose --profile=http up -d`

Start the HTTPS mode image: `docker-compose --profile=https up -d`

### Build Your Own Image (docker-compose):

After configuring `http.env` and `https.env`, go to the `docker` directory, and choose one mode to execute:

Build HTTP mode image:

```bash
docker-compose -f docker-compose-build-code.yml --profile=http build
```

Build HTTPS mode image:

```bash
docker-compose -f docker-compose-build-code.yml --profile=https build
```

## Other Deployment Methods:

In addition to the manual installation, using official Docker images, and building Docker images yourself, there are also automatic scripts and one-click deployment options on hosting platforms.

After downloading the project, you can navigate to the `bin/` directory and execute the appropriate script for your system. If the Linux script lacks execution permissions, you can grant it by using the `chmod +x bin/linux/*.sh` command.

### Linux Automatic Scripts

Choose one mode to start:

- `auto-check-install-http.sh`: Automatically check and install Node.js environment, then start HTTP mode service.
- `auto-check-install-https.sh`: Automatically check and install Node.js environment, then start HTTPS mode service.

### Windows Automatic Scripts

Choose one mode to start:

- `auto-check-install-http.bat`: Automatically check and install Node.js environment, then start HTTP mode service.
- `auto-check-install-https.bat`: Automatically check and install Node.js environment, then start HTTPS mode service.

### Zeabur Platform One-Click Deployment

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/898TLE?referralCode=iamtsm)

## Overview Diagram

![image](tl-rtc-file-tool.jpg)

## License

### MIT License Copyright (c) 2022 iamtsm

## Disclaimer

[Disclaimer](DISCLAIMER.md)
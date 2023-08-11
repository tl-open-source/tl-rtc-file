# tl-rtc-file-tool【From File Transfer, Beyond File Transfer】

[![](https://img.shields.io/badge/webrtc-p2p-blue)](https://webrtc.org.cn/)
[![](https://img.shields.io/badge/code-simple-green)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/large%20file-support-green)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/deployment-private-yellow)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/platform-unlimited-coral)](https://github.com/iamtsm/tl-rtc-file/)

<p align="center">
<a href="https://im.iamtsm.cn/file" target="_blank">Demo</a> ｜
<a href="https://hub.docker.com/repositories/iamtsm" target="_blank">DockerHub</a> ｜
<a href="https://github.com/tl-open-source/tl-rtc-file/blob/master/doc/README_EN.md" target="_blank">EN-DOC</a>
</p>

<p align="center">QQ Group: <a href="https://jq.qq.com/?_wv=1027&k=TKCwMBjN" target="_blank">624214498 </a></p>

## Table of Contents

- [Background](#background)
- [Introduction](#introduction)
- [Advantages](#advantages)
- [Extensions](#extensions)
- [Preparation (Mandatory Steps)](#preparation-mandatory-steps)
- [Configure Websocket (Mandatory Steps)](#configure-websocket-mandatory-steps)
- [Startup (Mandatory Steps)](#startup-mandatory-steps)
- [Configure Database (Optional)](#configure-database-optional)
- [Admin Panel (Optional)](#admin-panel-optional)
- [Enterprise WeChat Notifications (Optional)](#enterprise-wechat-notifications-optional)
- [OSS Cloud Storage (Optional)](#oss-cloud-storage-optional)
- [Chat-GPT Integration (Optional)](#chat-gpt-integration-optional)
- [Configure TURN Server (LAN-Optional, WAN-Mandatory)](#configure-turn-server-lan-optional-wan-mandatory)
- [Docker](#docker)
- [Other Deployment Methods](#other-deployment-methods)
- [Overview Diagram](#overview-diagram)
- [License](#license)
- [Disclaimer](#disclaimer)

#### Background: Developed from the topic of 2020 graduation project

#### Introduction: (tl webrtc datachannel filetools) Transferring files through WebRTC on the web, supporting transfer of large files.

#### Advantages: Fragmented transfer, cross-platform, platform-independent, easy to use, no internal network speed limit (up to 70+ MB/s in LAN), supports private deployment, supports multi-file drag-and-drop sending, web file preview.

#### Extensions: Extended with many rich features, such as local screen recording, remote screen sharing (zero-latency), remote audio-video calling (zero-latency), live streaming (zero-latency), password-protected rooms, OSS cloud storage, relay service settings, WebRTC testing, WebRTC statistics, text messaging (group, private), public chat, remote whiteboard, AI chatbot, comprehensive admin dashboard, real-time execution log display, robot alert notifications, etc.

## Preparation (Mandatory Steps)

1. Install Node.js 14.21.x or above and npm. Then navigate to the project directory and run the following command:

    ```bash
    cd svr/
    npm install
    ```

2. For the first run or self-developed pages, you can use one of the following commands:

    ```bash
    npm run build:dev   # If you need to develop or modify frontend pages
    npm run build:pro   # If you don't need to develop or modify frontend pages
    ```

3. Modify the `tlrtcfile.env` configuration file.

## Configure Websocket (Mandatory Steps)

Modify the corresponding websocket configuration in `tlrtcfile.env`:

```ini
## Websocket server port
tl_rtc_file_ws_port=8444

## Websocket server address
## "ws://domain or ip:port or domain:port"
## For socket ip, use LAN IP for LAN access and public IP for public access
tl_rtc_file_socket_host=ws://127.0.0.1:8444
```

## Startup (Mandatory Steps)

Start the following two services, choose either mode, the difference between them is that the HTTPS environment is required for audio-video functions, live streaming, and screen sharing, but it won't affect other functionalities.

After starting in HTTP mode, access http://your_machine_ip:9092.

API service: `npm run http-api`

Socket service: `npm run http-socket`

After starting in HTTPS mode, access https://your_machine_ip:9092.

API service: `npm run https-api`

Socket service: `npm run https-socket`

## Configure Database (Optional)

Modify the database-related configuration in `tlrtcfile.env`:

```ini
## Enable database
tl_rtc_file_db_open=false
## Database address
tl_rtc_file_db_mysql_host=mysql
## Database port
tl_rtc_file_db_mysql_port=3306
## Database name
tl_rtc_file_db_mysql_dbName=webchat
## Database username
tl_rtc_file_db_mysql_user=tlrtcfile
## Database password
tl_rtc_file_db_mysql_password=tlrtcfile
```

## Admin Panel (Optional)

Prerequisite: Database configuration needs to be enabled.

Modify the admin panel-related configuration in `tlrtcfile.env`. After starting, enter the configured room number and password to access the admin panel:

```ini
## Admin panel room number
tl_rtc_file_manage_room=tlrtcfile
## Admin panel password
tl_rtc_file_manage_password=tlrtcfile
```

## Enterprise WeChat Notifications (Optional)

Modify the Enterprise WeChat notification-related configuration in `tlrtcfile.env`:

```ini
## Enterprise WeChat notification switch
tl_rtc_file_notify_open=false
## Enterprise WeChat notification robot key for normal notifications (comma-separated if multiple keys)
tl_rtc_file_notify_qiwei_normal=
## Enterprise WeChat notification robot key for error notifications (comma-separated if multiple keys)
tl_rtc_file_notify_qiwei_error=
```

## OSS Cloud Storage (Optional)

Modify the OSS storage-related configuration in `tlrtcfile.env`:

```ini
## oss-seafile storage repository ID
tl_rtc_file_oss_seafile_repoid=
## oss-seafile address
tl

_rtc_file_oss_seafile_host=
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

## oss-qiniuyun storage accessKey
tl_rtc_file_oss_qiniuyun_AccessKey=
## oss-qiniuyun storage SecretKey
tl_rtc_file_oss_qiniuyun_Secretkey==
## oss-qiniuyun storage bucket
tl_rtc_file_oss_qiniuyun_bucket=
```

## Chat-GPT Integration (Optional)

Modify the OpenAI-related configuration in `tlrtcfile.env`:

```ini
## OpenAI keys (comma-separated if multiple keys)
tl_rtc_file_openai_keys=
```

## Configure TURN Server (LAN-Optional, WAN-Mandatory)

Currently, two ways are available to generate and use TURN service credentials: fixed credentials (recommended) and temporary credentials with expiration. **Choose one method**.

Example for Ubuntu:

Install coturn: `sudo apt-get install coturn`

Fixed credentials: `docker/coturn/turnserver-with-secret-user.conf`

1. Modify fields like `listening-device`, `listening-ip`, `external-ip`, `static-auth-secret`, `realm`.

2. Start TURN server:
    
   `turnserver -c /full/path/to/conf/turn/turnserver-with-secret-user.conf`

Temporary credentials: `docker/coturn/turnserver-with-fixed-user.conf`

1. Modify fields like `listening-device`, `listening-ip`, `external-ip`, `user`, `realm`.

2. Generate user credentials:
    
   `turnadmin -a -u username -p password -r realm`

3. Start TURN server:
    
   `turnserver -c /full/path/to/docker/coturn/turnserver-with-secret-user.conf`

After setting up coturn, configure WebRTC related information in `tlrtcfile.env`:

```ini
## webrtc-stun server address
tl_rtc_file_webrtc_stun_host=
## webrtc-turn server address
tl_rtc_file_webrtc_turn_host=
## webrtc-turn server username
tl_rtc_file_webrtc_turn_username=tlrtcfile
## webrtc-turn server password
tl_rtc_file_webrtc_turn_credential=tlrtcfile
## webrtc-turn server secret
tl_rtc_file_webrtc_turn_secret=tlrtcfile
## webrtc-turn server account expiration time (milliseconds)
tl_rtc_file_webrtc_turn_expire=86400000
```

## Docker

Both `official images` and `self-packaged images` are supported. Using official images allows for two modes of operation: `Docker script startup` and `Docker Compose startup`.

Different from deploying on a server/computer, the Docker environment by default starts the database and coturn service. No additional actions are needed, simply start it.

### Using Official Images (Docker Script Startup):

After modifying the `tlrtcfile.env` configuration (or using the default configuration), navigate to the `bin/` directory and run the script `auto-pull-and-start-docker.sh`:

1. `chmod +x ./auto-pull-and-start-docker.sh`
2. `./auto-pull-and-start-docker.sh`

### Using Official Images (Docker Compose Startup):

After modifying the `tlrtcfile.env` configuration (or using the default configuration), execute the following command in the main directory:

```bash
docker-compose --profile=http up -d
```

### Self-Packaged Image (Docker Compose Packaged Startup):

After modifying the `tlrtcfile.env` configuration (or using the default configuration), navigate to the `docker/` directory and execute:

```bash
docker-compose -f docker-compose-build-code.yml up -d
```

## Other Deployment Methods

Apart from the manual installation, Docker official images, and self-packaged images, there are also options for automatic scripts and one-click deployment on hosting platforms.

After downloading the project, navigate to the `bin/` directory and execute the corresponding system script:

### ubuntu Auto Script

```bash
chmod +x ./ubuntu/*.sh
cd ubuntu/
./auto-check-install-http.sh  # or ./auto-check-install-https.sh
```

### Windows Auto Script

Run `windows/auto-check-install-http.bat` or `windows/auto-check-install-https.bat`.

### Zeabur Platform One-Click Deployment

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/898TLE?referralCode=iamtsm)

## Overview Diagram

![image](tl-rtc-file-tool.jpg)

## License

### MIT License Copyright (c) 2022 iamtsm

## Disclaimer

[Disclaimer](DISCLAIMER.md)
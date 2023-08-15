# tl-rtc-file-tool【Beyond File Transfer, Beyond Imagination】

[![](https://img.shields.io/badge/webrtc-p2p-blue)](https://webrtc.org.cn/)
[![](https://img.shields.io/badge/code-simple-green)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/large%20file-support-green)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/deployment-private-yellow)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/platform-unlimited-coral)](https://github.com/iamtsm/tl-rtc-file/)

<p align="center">
<a href="https://im.iamtsm.cn/file" target="_blank">Experience</a> ｜
<a href="https://hub.docker.com/u/iamtsm" target="_blank">DockerHub</a> ｜
<a href="https://github.com/tl-open-source/tl-rtc-file/blob/master/doc/README_EN.md" target="_blank">EN-DOC</a>
</p>

<p align="center">QQ Group: <a href="https://jq.qq.com/?_wv=1027&k=TKCwMBjN" target="_blank">624214498 </a></p>

## Table of Contents

- [Background](#background)
- [Introduction](#introduction)
- [Advantages](#advantages)
- [Extensions](#extensions)
- [Preparation (Essential Steps)](#preparation-essential-steps)
- [Configure Websocket (Essential Steps)](#configure-websocket-essential-steps)
- [Startup (Essential Steps)](#startup-essential-steps)
- [Configure Database (Non-Essential Steps)](#configure-database-non-essential-steps)
- [Admin Panel (Non-Essential Steps)](#admin-panel-non-essential-steps)
- [WeChat Work Notification (Non-Essential Steps)](#wechat-work-notification-non-essential-steps)
- [OSS Cloud Storage (Non-Essential Steps)](#oss-cloud-storage-non-essential-steps)
- [Chat-GPT (Non-Essential Steps)](#chat-gpt-non-essential-steps)
- [Configure Turn Server (LAN Non-Essential Steps, Internet Essential Steps)](#configure-turn-server-lan-non-essential-steps-internet-essential-steps)
- [Docker](#docker)
- [Other Deployment Methods](#other-deployment-methods)
- [Overview Diagram](#overview-diagram)
- [License](#license)
- [Disclaimer](#disclaimer)

#### Background: Consolidated from the topic of the 20th-year graduation project

#### Introduction: (tl webrtc datachannel filetools) Transferring files on the web using WebRTC, supporting the transfer of very large files.

#### Advantages: Fragmented transmission, cross-device, cross-platform, easy to use, unlimited speed within the intranet (up to over 70MB/s in the LAN), supports private deployment, supports multi-file drag-and-drop sending, web file preview.

#### Extensions: Extends many rich features, such as local screen recording, remote screen sharing (no delay), remote audio and video calls (no delay), live streaming (no delay), password-protected rooms, OSS cloud storage, relay service settings, WebRTC detection, WebRTC statistics, text transmission (group chat, private chat), public chat, remote whiteboard, AI chatbox, rich backend management, real-time execution log display, robot alert notifications, and more...

## Preparation (Essential Steps)

1. Install node-14.21.x or higher and npm, then run the following command in the project directory:
```
cd svr/
npm install
```
2. For the first run or self-development of the page, use either of the following commands:

`npm run build:dev` (Use this command if you need to develop/modifty the frontend page)
`npm run build:pro` (Use this command if you don't need to develop/modifty the frontend page)

3. Modify the `tlrtcfile.env` configuration file.

## Configure Websocket (Essential Steps)

Modify the corresponding websocket configurations in `tlrtcfile.env`:

    ## Websocket server port
    tl_rtc_file_socket_port=8444

    ## Websocket server address
    ## "domain or ip:port or domain:port"
    tl_rtc_file_socket_host=127.0.0.1

## Startup (Essential Steps)

Start the following two services. Choose one mode to start, and the difference between them is that the HTTPS environment is required for audio, video, live streaming, and screen sharing features. Other features are not affected.

After starting in HTTP mode, access http://your_machine_ip:9092.

- API service: `npm run http-api`
- Socket service: `npm run http-socket`

After starting in HTTPS mode, access https://your_machine_ip:9092.

- API service: `npm run https-api`
- Socket service: `npm run https-socket`

## Configure Database (Non-Essential Steps)

Modify the database-related configurations in `tlrtcfile.env`:

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

## Admin Panel (Non-Essential Steps)

Prerequisite: Database configuration must be enabled.

Modify the admin panel-related configurations in `tlrtcfile.env`. After starting, enter the configured room number and password to access the admin panel:

    ## Admin panel room number
    tl_rtc_file_manage_room=tlrtcfile
    ## Admin panel password
    tl_rtc_file_manage_password=tlrtcfile

## WeChat Work Notification (Non-Essential Steps)

Modify the WeChat Work notification-related configurations in `tlrtcfile.env`:

    ## WeChat Work notification switch
    tl_rtc_file_notify_open=false
    ## WeChat Work notification robot KEY, normal notifications, comma-separated if multiple keys
    tl_rtc_file_notify_qiwei_normal=
    ## WeChat Work notification robot KEY, error notifications, comma-separated if multiple keys
    tl_rtc_file_notify_qiwei_error=

## OSS Cloud Storage (Non-Essential Steps)

Modify the OSS storage-related configurations in `tlrtcfile.env`:

    ## oss-seafile storage repository ID
    tl_rtc_file_oss_seafile_repoid=
    ## oss-seafile address
    tl_rtc_file_oss_seafile_host=
    ## oss-seafile username
    tl_rtc_file_oss_seafile_username=
    ## oss-seafile password
    tl_rtc_file_oss_seafile_password=

    ##

 oss-alyun storage accessKey
    tl_rtc_file_oss_alyun_AccessKey=
    ## oss-aly storage SecretKey
    tl_rtc_file_oss_alyun_Secretkey=
    ## oss-aly storage bucket
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

## Chat-GPT (Non-Essential Steps)

Modify the OpenAI-related configurations in `tlrtcfile.env`:

    ## openai-key, comma-separated if multiple keys
    tl_rtc_file_openai_keys=

## Configure Turn Server (LAN Non-Essential Steps, Internet Essential Steps)

Currently, there are two ways to generate and use Turn server accounts and passwords: fixed accounts and passwords (recommended), and time-limited accounts and passwords. **Choose one method**:

Example for Ubuntu:

- Install coturn: `sudo apt-get install coturn`

Valid accounts and passwords: `docker/coturn/turnserver-with-secret-user.conf`

1. Modify the fields `listening-device`, `listening-ip`, `external-ip`, `static-auth-secret`, and `realm`.
2. Start turnserver:
    `turnserver -c  /path/to/complete/conf/turn/turnserver-with-secret-user.conf`

Fixed accounts and passwords: `docker/coturn/turnserver-with-fixed-user.conf`

1. Modify the fields `listening-device`, `listening-ip`, `external-ip`, `user`, and `realm`.
2. Generate users:
    `turnadmin -a -u username -p password -r realm_from_config_file`
3. Start turnserver:
    `turnserver -c  /path/to/complete/docker/coturn/turnserver-with-secret-user.conf`

After deploying coturn, set up WebRTC-related information in the corresponding `tlrtcfile.env` configuration:

    ## webrtc-stun relay service address
    tl_rtc_file_webrtc_stun_host=
    ## webrtc-turn relay service address
    tl_rtc_file_webrtc_turn_host=
    ## webrtc relay service username
    tl_rtc_file_webrtc_turn_username=tlrtcfile
    ## webrtc relay service password
    tl_rtc_file_webrtc_turn_credential=tlrtcfile
    ## webrtc relay service secret
    tl_rtc_file_webrtc_turn_secret=tlrtcfile
    ## webrtc relay service account expiration time (milliseconds)
    tl_rtc_file_webrtc_turn_expire=86400000

## Docker

Currently, support is provided for `official images` and `self-packaged images`. Using official images supports two methods: `docker script startup` and `docker-compose startup`.

Unlike self-deployment on a server/computer, the Docker environment by default starts the database and coturn services, requiring minimal additional steps for setup.

### Using Official Images (Docker Script Startup):

After modifying the `tlrtcfile.env` configuration as needed (or using the default configuration), navigate to the `bin/` directory and execute the `auto-pull-and-start-docker.sh` script:

```
chmod +x ./auto-pull-and-start-docker.sh
./auto-pull-and-start-docker.sh
```

### Using Official Images (Docker-Compose Startup):

After modifying the `tlrtcfile.env` configuration as needed (or using the default configuration), execute the following command based on your `Docker Compose` version in the main directory:

- For `Docker Compose V1`:
```
docker-compose --profile=http up -d
```

- For `Docker Compose V2`:
```
docker compose --profile=http up -d
```

### Self-Packaged Image (Docker-Compose Self-Packaged Startup):

After confirming the modification of the `tlrtcfile.env` configuration file (or using the default configuration), navigate to the `docker/` directory and execute the following command based on your `Docker Compose` version in the main directory:

- For `Docker Compose V1`:
```
docker-compose -f docker-compose-build-code.yml up -d
```

- For `Docker Compose V2`:
```
docker compose -f docker-compose-build-code.yml up -d
```

## Other Deployment Methods

In addition to the above manual installation, Docker official images, and self-packaged images, there are also options for automatic scripts and one-click deployment on hosting platforms.

After downloading the project, navigate to the `bin/` directory and select the appropriate system script to execute. The script will automatically detect the installation environment, install dependencies, and start the services automatically.

**Note: Before executing the script, you can modify the configuration first. If you're using the default configuration, you'll need to restart both services for the changes to take effect. To do this, execute the `Stop Services` script and then run the `Automatic Script` again.**

### Ubuntu Automatic Script (e.g., ubuntu16):

```
chmod +x ./ubuntu16/*.sh

cd ubuntu16/

./auto-check-install-http.sh
```
For HTTPS, use this script:
```
./auto-check-install-https.sh
```
Stop Services Script:
```
./auto-stop.sh
```

### Windows Automatic Script:

```
windows/auto-check-install-http.bat
```
For HTTPS, use this script:
```
windows/auto-check-install-https.bat
```

### Zeabur One-Click Deployment Platform

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/898TLE?referralCode=iamtsm)

## Overview Diagram

![image](tl-rtc-file-tool.jpg)

## License

### MIT License Copyright (c) 2022 iamtsm

## Disclaimer

[Disclaimer](DISCLAIMER.md)
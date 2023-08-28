# tl-rtc-file-tool (tl webrtc file(media) tools)

[![](https://img.shields.io/badge/webrtc-p2p-blue)](https://webrtc.org.cn/)
[![](https://img.shields.io/badge/code-simple-green)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/large%20file-support-green)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/deployment-private-yellow)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/platform-unlimited-coral)](https://github.com/iamtsm/tl-rtc-file/)

<p align="center">
<a href="https://im.iamtsm.cn/file" target="_blank">Demo</a> ｜
<a href="https://im.iamtsm.cn/document" target="_blank">Document</a> ｜
<a href="https://hub.docker.com/u/iamtsm" target="_blank">DockerHub</a> ｜
<a href="https://github.com/tl-open-source/tl-rtc-file/blob/master/doc/README_ZN.md" target="_blank">中文文档</a> ｜ QQ Group:
<a href="https://jq.qq.com/?_wv=1027&k=TKCwMBjN" target="_blank">624214498</a>
</p>

## Table of Contents

- [Background](#background)
- [Advantages](#advantages)
- [Pre-deployment Considerations](#pre-deployment-considerations)
- [Self-Deployment](#self-deployment)
    - [Installing Dependencies](#installing-dependencies)
    - [Starting the Service](#starting-the-service)
- [Docker Deployment](#docker-deployment)
    - [One-Click Docker Script](#one-click-docker-script)
    - [Using docker-compose](#using-docker-compose)
    - [Self-Building and Starting the Image](#self-building-and-starting-the-image)
- [Other Deployment Methods](#other-deployment-methods)
- [Configuring the Database (Optional)](#configuring-the-database-optional)
- [Admin Panel (Optional)](#admin-panel-optional)
- [WeChat Notifications (Optional)](#wechat-notifications-optional)
- [OSS Cloud Storage (Optional)](#oss-cloud-storage-optional)
- [Chat-GPT (Optional)](#chat-gpt-optional)
- [Configuring turnserver (Optional for LAN, Required for WAN)](#configuring-turnserver-optional-for-lan-required-for-wan)
- [Overview Diagram](#overview-diagram)
- [License](#license)
- [Disclaimer](#disclaimer)

## Background

This project was developed based on the topic of the graduation project in 2020. It allows file transfer using WebRTC in web applications and supports transferring large files.

## Advantages

Fragmented transmission, cross-platform, platform-independent, easy to use, no speed limit in the local network (up to over 70 MB/s in the LAN), supports private deployment, supports drag-and-drop sending of multiple files, web file preview. Many additional features have been added, such as local screen recording, remote screen sharing (zero-latency), remote audio and video calls (zero-latency), live streaming (zero-latency), password-protected rooms, OSS cloud storage, relay service settings, WebRTC detection, WebRTC statistics, text transmission (group chat, private chat), public chat, remote whiteboard, AI chatbox, feature-rich admin panel, real-time execution log display, robot alert notifications, and more.

## Pre-deployment Considerations

Whether it's self-deployment, Docker deployment, or other script deployments, you need to modify the corresponding configurations in `tlrtcfile.env` before performing the following operations. Further configuration modifications and service restarts are required.

Of course, you can also use the default configurations without modifications, but the default configurations are only suitable for testing on localhost. They won't be accessible to others, making it impossible for others to use. Therefore, if you intend to deploy on a server for local network or public network users, you must configure `tlrtcfile.env` accordingly.

## Self-Deployment
#### Installing Dependencies

Install Node.js 14.21.x or above, and npm. Then, navigate to the project directory and run the following command:
```
cd svr/

npm install
```
For the first run, execute the following command:
```
npm run build:pro
```
If you need to develop or modify the frontend pages, use this command. If not, you can skip this step:
```
npm run build:dev
```

#### Starting the Service

Start the following two services. Choose one mode to start. The only difference between them is that the HTTPS mode is required to use features like audio/video streaming, live streaming, and screen sharing. Other features are not affected.

After starting in HTTP mode, access the service at `http://your_machine_ip:9092`.

- Start the API and socket services:
```
npm run http-api
npm run http-socket
```

Or, start in HTTPS mode and access the service at `https://your_machine_ip:9092`.

- Start the API and socket services:
```
npm run https-api
npm run https-socket
```

## Docker Deployment

Currently, both `official images` and `self-built images` are supported. For official images, there are two ways to operate: `docker script startup` and `docker-compose startup`.

#### One-Click Docker Script

Navigate to the `bin/` directory and execute the `auto-pull-and-start-docker.sh` script:
```
chmod +x ./auto-pull-and-start-docker.sh
./auto-pull-and-start-docker.sh
```

#### Using docker-compose

In the main directory, execute the corresponding command based on your Docker Compose version:

- For Docker Compose V1:
```
docker-compose --profile=http up -d
```

- For Docker Compose V2:
```
docker compose --profile=http up -d
```

#### Self-Building and Starting the Image

Navigate to the `docker/` directory and execute the corresponding command based on your Docker Compose version:

- For Docker Compose V1:
```
docker-compose -f docker-compose-build-code.yml up -d
```

- For Docker Compose V2:
```
docker compose -f docker-compose-build-code.yml up -d
```

## Other Deployment Methods

In addition to the manual installation, Docker official images, and self-built Docker images, there are other methods such as automatic scripts and one-click deployments on hosting platforms.

After downloading the project, navigate to the `bin/` directory and choose the appropriate system script to execute. It will automatically detect the environment, install dependencies, and start the service.

#### Automatic script for Ubuntu (e.g., Ubuntu 16)

- If the script doesn't have execution permission, run the following command:
```
chmod +x ./ubuntu16/*.sh
```

- If using HTTP, execute this script:
```
./auto-check-install-http.sh
```

- If using HTTPS, execute this script:
```
./auto-check-install-https.sh
```

- To stop the service:
```
./auto-stop.sh
```

#### Automatic script for Windows

- If using HTTP, execute this script:
```
windows/auto-check-install-http.bat
```

- If using HTTPS, execute this script:
```
windows/auto-check-install-https.bat
```

#### One-Click Deployment on Zeabur Platform

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/898TLE?referralCode=iamtsm)

## Other Configuration Options

#### Configuring the Database (Optional)

You need to install MySQL database manually, create a database named `webchat`, and then modify the database-related configurations in `tlrtcfile.env`.

#### Admin Panel (Optional)

Prerequisite: Database configuration must be enabled.

Modify the admin panel-related configurations in `tlrtcfile.env`. After starting, enter the configured room number and password to access the admin panel.

#### WeChat Notifications (Optional)

If you need to set up notification for access and error alerts, you can create a WeChat Work robot and get an API key. Modify the WeChat notification configurations in `tlrtcfile.env`.

#### OSS Cloud Storage (Optional)

The project currently supports Seafile storage integration, and future updates will include support for Alibaba Cloud, Tencent Cloud, Qiniu Cloud, and self-hosted server storage methods. Modify the OSS storage configurations in `tlrtcfile.env`.

#### Chat-GPT (Optional)

Integrated with the OpenAI API, this project includes a chat dialog. Modify the OpenAI configurations in `tlrtcfile.env`.

#### Configuring turnserver (Optional for LAN, Required for WAN)

There are two ways to generate TURN server credentials: fixed credentials (recommended) and time-limited credentials. Choose one method. The following example uses Ubuntu.

Install coturn:
```
sudo apt-get install coturn
```

For time-limited credentials, modify the configuration file `docker/coturn/turnserver-with-secret-user.conf`.

- Modify the fields in the configuration file:
```
`listening-device`, `listening-ip`, `external-ip`, `static-auth-secret`, `realm`
```
- Start the turnserver:
```
turnserver -c /path/to/conf/turn/turnserver-with-secret-user.conf
```

For fixed credentials, modify the configuration file `docker/coturn/turnserver-with-fixed-user.conf`.

- Modify the fields in the configuration file:
```
`listening-device`, `listening-ip`, `external-ip`, `user`, `realm`
```
- Generate a user:
```
turnadmin -a -u username -p password -r realm_in_config_file
```
- Start the turnserver:
```
turnserver -c /path/to/docker/coturn/turnserver-with-secret-user.conf
```

After setting up coturn, configure the WebRTC-related information in the corresponding `tlrtcfile.env` configuration.

## Overview Diagram

![image](doc/tl-rtc-file-tool.jpg)

## License

### MIT License Copyright (c) 2020 ~ 2023 iamtsm

## Disclaimer

[Disclaimer](DISCLAIMER.md)
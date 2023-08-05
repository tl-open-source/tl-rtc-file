# tl-rtc-file-tool   [From File Transfer to Beyond]

[![](https://img.shields.io/badge/webrtc-p2p-blue)](https://webrtc.org.cn/)
[![](https://img.shields.io/badge/code-simple-green)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/large%20file-support-green)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/deployment-private-yellow)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/platform-unlimited-coral)](https://github.com/iamtsm/tl-rtc-file/)

<p align="center">
<a href="https://im.iamtsm.cn/file" target="_blank">Demo</a> ｜
<a href="https://hub.docker.com/repositories/iamtsm" target="_blank">DockerHub</a> ｜
<a href="https://github.com/tl-open-source/tl-rtc-file/blob/master/README.md" target="_blank">中文-DOC</a>
</p>

<p align="center">QQ-Group: <a href="https://jq.qq.com/?_wv=1027&k=TKCwMBjN" target="_blank">624214498 </a></p>

#### Background: Collated from the topic of my graduation project in 2020.

#### Introduction: (tl webrtc datachannel filetools) transfers files using WebRTC on the web, supporting transmission of large files.

#### Advantages: Fragmented transmission, cross-platform, platform-independent, easy to use, no speed restrictions on the local network (up to 70+ MB/s in the LAN), supports private deployment, supports drag-and-drop sending of multiple files, and web-based file preview.

#### Extensions: Provides various additional features such as local screen recording, remote screen sharing (no delay), remote audio/video calls (no delay), live streaming (no delay), password-protected rooms, cloud storage via OSS, relay service settings, WebRTC detection, WebRTC statistics, text transmission (group chat, private chat), public chat, remote drawing board, AI chat box, feature-rich backend management, real-time execution log display, robot alert notifications, and more.

## Preparation (Mandatory Steps)

Install node 14.21.x or above, and npm. Then, navigate to the project directory and run the following commands:

    cd svr/

    npm install

For the first run or when developing your own frontend, use either of the following commands:

    npm run build:dev (If you need to develop/modify the frontend)
    npm run build:pro (If you don't need to develop/modify the frontend)

## Configure WebSocket (Mandatory Step)

Modify the respective ws or wss configurations in cfg.json:

    "ws": {
        "port": 8444,    #socket port
        "host": "ws://domain or ip:port or domain:port",  #socket ip, use LAN IP for the local network, and public IP for the internet
    },
    "wss" : {
        "port": 8444,   #socket port
        "host": "wss://domain or ip:port or domain:port", #socket ip, use LAN IP for the local network, and public IP for the internet
    },

Common examples:

If you are deploying the socket service using the IP (10.1.2.3), the host will be:

    ws://10.1.2.3:8444 or wss://10.1.2.3:8444

If you have a domain and configured a proxy, for example, a.test.com forwarding to the local socket service on port 8444, the host will be:

    ws://a.test.com or wss://a.test.com

If you have a domain but it's not forwarded to a specific port, for example, accessing b.test.com:8444 accesses the socket service on port 8444, the host will be:

    ws://b.test.com:8444 or wss://b.test.com:8444

## Startup (Mandatory Step)

Start the following two services, choose one mode to start:

HTTP mode: After starting, access http://your-machine-ip:9092

    API service: npm run lapi
    Socket service: npm run lsocket

HTTPS mode: After starting, access https://your-machine-ip:9092

    API service: npm run sapi
    Socket service: npm run ssocket

## Configure TURN server (Not mandatory for LAN deployment, mandatory for internet deployment)

Currently, there are two ways to generate account and password for using TURN service: fixed credentials (recommended) and time-limited credentials. **Choose one method**.

Example for Ubuntu:

Install coturn: `sudo apt-get install coturn`

Time-limited credentials: `docker/coturn/turnserver-with-secret-user.conf`

    1. Modify `listening-device`, `listening-ip`, `external-ip`, `static-auth-secret`, `realm` fields accordingly.

    2. Start turnserver: `turnserver -c /complete-path/conf/turn/turnserver-with-secret-user.conf`

Fixed credentials: `docker/coturn/turnserver-with-fixed-user.conf`

    1. Modify `listening-device`, `listening-ip`, `external-ip`, `user`, `realm` fields accordingly.

    2. Generate user: `turnadmin -a -u username -p password -r realm-from-config`

    3. Start turnserver: `turnserver -c /complete-path/docker/coturn/turnserver-with-secret-user.conf`

## Configure Database (Not mandatory step)

Modify the corresponding database configuration in cfg.json:

    "db": {
        "open": false, # Whether to enable the database, defaults to off
        "mysql": {
            "host": "host-address",
            "port": 3306,
            "dbName": "database-name",
            "user": "username",
            "password": "password",
            "other": {
                "sequelize": {
                    "dialect": "mysql",
                    "host": "host-address",
                    "port": 3306,
                    "logging": false,
                    "pool": {
                        "max": 5,
                        "min": 0,
                        "acquire": 30000,
                        "idle": 10000
                    },
                    "timezone": "+08:00",
                    "define": {
                        "freezeTableName": true,
                        "underscored": true,
                        "charset": "utf8",
                        "collate": "utf8_general_ci",
                        "timestamps": false,
                        "paranoid": true
                    }
                }
            }
        }
    }

## Management Dashboard (Not mandatory step)

Prerequisite: Enable the database configuration.

Modify the room and password for the manage section in cfg.json (default room number and password are "tlrtcfile"):

    "manage": {
		"room": "tlrtcfile",
		"password": "tlrtcfile"
	}

Access: http://localhost:9092 or http://your-machine-ip:9092

Enter the configured room number and password to access the management dashboard.

## Enterprise WeChat Notification (Not mandatory step)

Modify the qiwei array in the notify section of cfg.json and fill in the key for the Enterprise WeChat robot:

normal: Normal notification, error: System error notification.

    "notify": {
        "open": true,  # Whether to enable Enterprise WeChat notification
        "qiwei": {
            "normal" : [
                "key1",
                "key2"
            ],
            "error" : [
                "key3",
                "key4"
            ]
       

 }
    }

## OSS Cloud Storage (Not mandatory step)

Modify the oss section in cfg.json:

    "oss": {
		"seafile": {
			"repoid": "",
			"host": "",
			"username": "account",
			"password": "password"
		},
		"alyun": {
			"AccessKey": "",
			"SecretKey": "",
			"bucket": "tl-rtc-file"
		},
		"txyun": {
			"AccessKey": "",
			"SecretKey": "",
			"bucket": "tl-rtc-file"
		},
		"qiniuyun": {
			"AccessKey": "",
			"SecretKey": "",
			"bucket": "tl-rtc-file"
		}
	}

## Chat-GPT (Not mandatory step)

Modify the openai.apiKeys in cfg.json and enter your own apiKey generated from your OpenAI account:

    "openai": {
		"apiKeys": [
			
		]
	}

## Docker (Not mandatory step)

### Using Official Images:

Choose either of the two image modes:

HTTP mode image:

    docker pull iamtsm/tl-rtc-file-api-local
    docker run --name=api-local -p 9092:9092 -e "WS_HOST=ws://127.0.0.1:8444" -d iamtsm/tl-rtc-file-api-local localapi

    docker pull iamtsm/tl-rtc-file-socket-local
    docker run --name=socket-local -p 8444:8444 -e "WS_HOST=ws://127.0.0.1:8444" -d iamtsm/tl-rtc-file-socket-local localsocket

HTTPS mode image:

    docker pull iamtsm/tl-rtc-file-api-server
    docker run --name=api-server -p 9092:9092 -e "WSS_HOST=wss://127.0.0.1:8444" -d iamtsm/tl-rtc-file-api-server serverapi

    docker pull iamtsm/tl-rtc-file-socket-server
    docker run --name=socket-server -p 8444:8444 -e "WSS_HOST=wss://127.0.0.1:8444" -d iamtsm/tl-rtc-file-socket-server serversocket

### Build Your Own Images:

Choose either mode and perform the respective operation:

HTTP mode startup:

    Modify the configuration information in `docker/local.env` or cfg.json as needed (ws or wss must be configured with container IP and port).
    
    docker-compose --profile=local up -d

    Access: http://localhost:9092 or http://your-machine-ip:9092

HTTPS mode startup:

    Modify the configuration information in `docker/local.env` or cfg.json as needed (ws or wss must be configured with container IP and port).
    
    docker-compose --profile=server up -d

    Access: https://localhost:9092 or https://your-machine-ip:9092

## Other Deployment Methods

In addition to the above manual installation, official Docker images, and self-packaged Docker images, it also supports fully automatic scripts. After downloading the project, you can go to the bin/ directory and choose the corresponding system script to execute.

If the Linux script doesn't have permission, you can grant execute permission to the script first: `chmod +x bin/linux/*.sh`

### Linux Fully Automatic Script

Choose one mode to start:

`auto-check-install-local.sh`: Automatically check and install the node environment and automatically start the HTTP mode service.

`auto-check-install-server.sh`: Automatically check and install the node environment and automatically start the HTTPS mode service.

### Windows Fully Automatic Script

Choose one mode to start:

`auto-check-install-local.bat`: Automatically check and install the node environment and automatically start the HTTP mode service.

`auto-check-install-server.bat`: Automatically check and install the node environment and automatically start the HTTPS mode service.

## Overview Diagram

![image](doc/tl-rtc-file-tool.jpg)

## License

### MIT License Copyright (c) 2022 iamtsm

## Disclaimer

[Disclaimer](DISCLAIMER.md)
# tl-rtc-file-tool

[![](https://img.shields.io/badge/webrtc-p2p-blue)](https://webrtc.org.cn/)
[![](https://img.shields.io/badge/code-simple-green)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/large%20file-support-green)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/deployment-private-yellow)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/platform-unlimited-coral)](https://github.com/iamtsm/tl-rtc-file/)

#### demo ： https://im.iamtsm.cn/file

## Table of Contents

- [Prepare](#Prepare)

- [Debug](#Debug)

- [Production](#Production)

- [Database-Configuration](#Database-Configuration)

- [Wss-Configuration](#Wss-Configuration)

- [TurnServer-Configuration](#TurnServer-Configuration)

- [Overview](#Overview)

- [中文说明](#Chinese)

### Prepare

Before this you need to install `node` and `npm`。

If already installed `node` and `npm`, enter the project directory and execute  `npm install`, enter the build directory to install node dependencies `npm install`。

If you want to modify the web resource code, keep webpack running in the background。

debug environment uses `npm run dev`

production environment uses `npm run pro`

### Debug 

debugging environment starts the web `npm run dev`

debugging environment starts the file socket `npm run devsocket`

### Production

##### If you want to deploy in a public network environment, you need to configure wss

Production environment starts the web `npm run svr`

Production environment starts the file socket `npm run svrsocket`


### Database-Configuration

If you want to configure open database related, you can modify the configuration in conf/cfg.json。`open, dbName, host, port, user, pwd ...`


### Wss-Configuration

If you want to configure open database related, you can modify the configuration ws in conf/cfg.json。`port, ws_online ...`


### TurnServer-Configuration 

1. install coturn ( ubuntu )

        sudo apt-get install coturn

2. modify conf/turn/turnserver.conf and execute

        cp conf/turn/turnserver.conf /etc/turnserver.conf

3. modify bin/genTurnUser.sh and execute

        chomd +x bin/genTurnUser.sh && ./genTurnUser.sh 

4. modify bin/startTurnServer.sh and execute

        chomd +x bin/startTurnServer.sh

5. start turn server

        ./startTurnServer.sh 


### Overview

![image](tl-rtc-file-tool.jpg)


## Thanks

### [scroxt](https://github.com/chenjianfang/scroxt)

### [layui](https://github.com/layui/layui)

### [webpack](https://github.com/webpack/webpack)

### [swiper](https://github.com/nolimits4web/swiper)

## License

#### Apache License 2.0


### Chinese

[中文说明](README_ZN.md)
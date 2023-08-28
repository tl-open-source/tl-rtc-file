# 通过命令部署

本项目依赖的基础环境为 nodejs, npm, 有了这两个就可以运行 `api服务`, `socket服务` 这两个基础服务了。

先下载项目，可以去github下载源码包（优先推荐），也可以在gitee下载源码包(可能不是最新版)，也可以通过git下载源码包

git下载: 

![git下载项目](https://qnproxy.iamtsm.cn/image-3.png "git下载项目") 

### 第一步: 安装node

可以直接去nodejs官方网站下载版本，建议nodejs版本选在 `14.21.x` 以上，`18.x` 以内，因为其他版本没测试过，也许/可能/存在问题

安装完nodejs后，npm也是配套会安装好，windows/linux/macos用户操作都一样，网络上安装nodejs教程很多，这里不再阐述。

### 第二步: 修改配置

这种模式下，只需要修改 `tlrtcfile.env` 配置文件。以下是配置示例供参考


```
#-----------------以下为基础配置-----------------#
## api服务端口
tl_rtc_file_api_port=9092
## websocket服务端口
tl_rtc_file_socket_port=8444
## websocket服务地址
tl_rtc_file_socket_host=127.0.0.1:8444
```

`tl_rtc_file_socket_host` 这个配置需要注意填写的内容

- 填 `127.0.0.1:8444` 只能在自己的机器上访问，局域网和公网都访问不了。
- 填 `局域网ip:8444` 或者 `局域网域名:8444` 只能在自己机器和局域网访问，公网访问不了
- 填 `公网ip:8444` 或者 `公网域名:8444`， 自己机器，局域网，公网都可以访问

![修改基础配置](https://qnproxy.iamtsm.cn/image-4.png "修改基础配置") 

### 第三步: 进入svr目录

```
cd svr/
```

后续的 npm 命令都是在svr目录下，进行操作


安装依赖

```
npm install
```

![进入svr目录,安装依赖](https://qnproxy.iamtsm.cn/image-2.png "图片") 

### 第四步: 压缩静态资源文件

```
npm run build:pro
```

![压缩静态资源文件](https://qnproxy.iamtsm.cn/image.png "压缩静态资源文件") 

### 第五步: 启动api服务

浏览器只允许在localhost和https环境下获取摄像头/屏幕共享权限，所以优先推荐 `npm run https-api` 启动

```
npm run http-api
```

![启动api服务](https://qnproxy.iamtsm.cn/image-5.png "启动api服务") 

或者

```
npm run https-api
```

![启动api服务](https://qnproxy.iamtsm.cn/image-6.png "启动api服务") 

### 第六步: 启动socket服务

浏览器只允许在localhost和https环境下获取摄像头/屏幕共享权限，所以优先推荐 `npm run https-socket` 启动

```
npm run http-socket
```

![启动socket服务](https://qnproxy.iamtsm.cn/image-7.png "启动socket服务") 

或者

```
npm run https-socket
```

![启动socket服务](https://qnproxy.iamtsm.cn/image-8.png "启动socket服务") 

### 第七步: 访问api服务

打开你的浏览器输入你的api服务所在的机器ip或者域名即可进行访问

`http://localhost:9092` 或者  `http://局域网ip:9092` 或者 `http://局域网域名:9092` 或者 `http://公网ip:9092` 或者 `http://公网域名:9092`

![访问api服务](https://qnproxy.iamtsm.cn/image-9.png "访问api服务") 

当然，我这里只是示例，实际操作下，可以对外提供一个域名，将域名反向代理到内部服务的9092端口，这样就可以对外用一个专有域名进行访问了

### pm2扩展服务安装

![终端启动两个服务](https://qnproxy.iamtsm.cn/image-10.png "终端启动两个服务") 

由于npm启动的命令，会将进程挂在终端中，关闭终端，服务就退出了，所以这个时候我们需要将服务挂在后台运行，我们可以安装pm2进行服务管理

全局安装pm2

```
npm install pm2 -g
```

![全局安装pm2](https://qnproxy.iamtsm.cn/image-11.png "全局安装pm2") 

安装完毕后，执行命令

**启动api服务**

```
pm2 start npm --name=tl-rtc-file-api -- run http-api
```

或者

```
pm2 start npm --name=tl-rtc-file-api -- run https-api
```

**启动socket服务**

```
pm2 start npm --name=tl-rtc-file-socket -- run  http-socket
```

或者

```
pm2 start npm --name=tl-rtc-file-socket -- run  https-socket
```

![pm2启动](https://qnproxy.iamtsm.cn/image-12.png "pm2启动") 

### mysql扩展服务安装

恰好你你需要后台管理功能，那么推荐你配置好mysql服务，这样你可以对你的数据进行统计管理，还有更加详细的管理功能等待你探索，如果你没有安装过mysql，那么可以先安装mysql，这里就不再阐述，网络很多教程。

安装完mysql后，需要新建一个数据库，名称为 `webchat`（也可以自定义），然后根据你数据库的设置项，同步修改好 `tlrtcfile.env` 中的数据库相关配置

```
#-----------------以下为mysql数据库相关配置-----------------#
## 是否开启数据库
tl_rtc_file_db_open=true
## 数据库地址
tl_rtc_file_db_mysql_host=填写你的数据库地址,比如 127.0.0.1
## 数据库端口
tl_rtc_file_db_mysql_port=3306
## 数据库名称
tl_rtc_file_db_mysql_dbName=填写你的数据库名称, 比如 webchat
## 数据库用户名
tl_rtc_file_db_mysql_user=填写你的数据库用户名称
## 数据库密码
tl_rtc_file_db_mysql_password=填写你的数据库用户密码
```

### coturn扩展服务安装

如果你发现部署之后的服务，在某些用户的某些情况下，出现了文件发送不了，直播看不到，音视频打不通，屏幕共享没反应，用户连接显示 disconnected。
有很大情况是由于p2p直连失败，这个时候就需要依赖coturn服务进行数据中转了。

由于环境和系统的情况因素太多,网上也有很多教程, coturn的安装我也不阐述了

但是配置文件还是优先推荐使用我这个项目中默认提供的两个配置（请使用有效帐号模式）

`docker/coturn/turnserver-with-secret-user.conf`, 修改好这个配置后，使用这个配置进行启动，启动后按照配置同步修改好 `tlrtcfile.env` 中的webrtc相关配置

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
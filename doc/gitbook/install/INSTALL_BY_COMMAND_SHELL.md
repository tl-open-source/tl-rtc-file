# 通过命令一键脚本部署

由于每个人的机器/环境都是有细微区别的，但是脚本能处理的情况有限，所以选择这种模式，有一定几率不能正常运行。但是可以遇到具体情况具体分析，或者可以加群反馈问题或者建议, QQ群 : 624214498

目前支持 `ubuntu16`, `ubuntu18`, `ubuntu20`, `windows` 这几种自动脚本。

### ubuntu16/18/20/macos

脚本放在 bin/ubuntu相关目录下，进入 bin/ubuntu对应的目录，有五个脚本，分别作用如下: 

- `auto-check-install-http.sh` 自动检测环境 + 安装环境 + 检测端口占用 + 调用 **`auto-start-http.sh`** 服务脚本
- `auto-check-install-https.sh` 自动检测环境 + 安装环境 + 检测端口占用 + 调用 **`auto-start-https.sh`** 服务脚本
- `auto-start-http.sh` pm2后台启动 **http** 服务脚本
- `auto-start-https.sh` pm2后台启动 **https** 服务脚本
- `auto-stop.sh` pm2删除服务进程

这里相应的 **http** 和 **https** 脚本选一种执行就好，下面的文档以 **http** 模式进行说明，如果需要以 **https** 脚本操作，**http** 替换为 **https** 即可

#### 初次安装启动

使用 `auto-check-install-http.sh` 脚本 

```
./auto-check-install-http.sh
```

如果没有执行权限，先给脚本添加权限 `chmod +x ./auto-check-install-http.sh`

![初次安装启动](https://qnproxy.iamtsm.cn/image-13.png "初次安装启动") 

#### 停止服务

使用 `auto-stop.sh` 脚本

```
./auto-stop.sh
```

如果没有执行权限，先给脚本添加权限 `chmod +x ./auto-stop.sh`

![停止服务](https://qnproxy.iamtsm.cn/image-14.png "停止服务") 

#### 非初次安装启动

使用 `auto-start-http.sh` 脚本， 也可以沿用之前的 `auto-check-install-http.sh` 脚本

```
./auto-check-install-http.sh
```

### windows

- `auto-check-install-http.bat` 自动检测环境 + 安装环境 + 检测端口占用 + 调用 **`auto-start-http.bat`** 服务脚本
- `auto-check-install-https.bat` 自动检测环境 + 安装环境 + 检测端口占用 + 调用 **`auto-start-https.bat`** 服务脚本
- `auto-start-http.bat` pm2后台启动 **http** 服务脚本
- `auto-start-https.bat` pm2后台启动 **https** 服务脚本

具体操作如ubuntu所示例，脚本内容如有问题，请反馈

### centeros

自动脚本待补充...
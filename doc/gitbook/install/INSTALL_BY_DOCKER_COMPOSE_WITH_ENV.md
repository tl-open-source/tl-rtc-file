# docker-compose官方镜像部署 - 内置配置文件形式

项目默认提供了已经打包好的镜像放在dockerhub，供大家下载使用。并提供了 `docker-compose-with-all-env.yml` 配置，供大家使用。

这种方式和前一种 `docker-compose.yml` 的唯一区别就是，这个方式内置了大部分配置，无需依赖挂载文件。

即使不下载源码，单独下载这个yml文件，也可以部署。

### 前置条件

- 需要安装好docker-compose，V1或者V2都可以

- DockerHub需要科学上网

- 需要修改好内置配置的数据，具体可以参考 [配置简要说明](../ENV_SETTING.md)

- 如果不下载源码包，且你需要配置挂载文件/目录的时候，需要按需下载/设置好挂载依赖的目录/文件，如果下载源码包则可以忽略这一条件

### 准备启动

根据你的 `Docker Compose` 版本在 `主目录` 执行如下对应的命令

- 对于 `Docker Compose V1`

```
docker-compose --profile=http up -d
```

- 对于 `Docker Compose V2`

```
docker compose --profile=http up -d
```

### 注意事项

虽然内置了大部分配置，但是还有部分配置依然是需要通过挂载的形式，但挂载的配置不是必需存在，如不需要可以注释挂载代码，目前有两个容器有挂载配置。

但是注释挂载设置后，将会带来一些小问题，如果你可以接受的话。

mysql容器的挂载配置如下，作用是: 将mysql容器内的数据文件挂载出来进行保存

```
volumes:
    - ./docker/mysql/data/db:/var/lib/mysql
    - ./docker/mysql/data/my.cnf:/etc/mysql/conf.d/my.cnf
    - ./docker/mysql/data/log:/var/log/mysql
    - ./docker/mysql/data/init.sql:/docker-entrypoint-initdb.d/init.sql
```

coturn的挂载配置，作用是: 将项目默认提供的turn的配置，提供给coturn容器使用

```
volumes:
    - ./docker/coturn/turnserver-with-secret-user.conf:/etc/turnserver.conf
```
# docker-compose官方镜像部署

项目默认提供了已经打包好的镜像放在dockerhub，供大家下载使用。并提供了 `docker-compose.yml` 配置，供大家使用

### 前置条件

- 需要安装好docker-compose，V1或者V2都可以

- DockerHub需要科学上网

- 需要下载源码包

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

由于项目的服务需要依赖一些配置，所以容器方式都挂载了一些配置文件。

api容器和socket容器 挂载配置如下

```
volumes:
    - ./tlrtcfile.env:/tlrtcfile/tlrtcfile.env
```

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

如果觉得这种方式麻烦，或者不合适自己的场景，可以选择另外一种 `内置配置的docker-compose`
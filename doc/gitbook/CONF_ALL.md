# 配置统计汇总

- `tlrtcfile.env` [ 主要的项目配置文件 ]
- `docker-compose.yml` [ 使用官方镜像启动的docker-compose文件 ]
- `docker-compose-with-all-env.yml` [ 使用官方镜像启动的，内置了所有tlrtcfile.env配置的 docker-compose文件 ]
- `docker/docker-compose-build-code.yml` [ 可以自己编译打包镜像的docker-compose文件 ]
- `docker/mysql/mysql.env` [ mysql的外部挂载配置文件 ]
- `docker/coturn/coturn.env` [ coturn的外部挂载配置文件 ]
- `docker/coturn/turnserver-with-fixed-user.conf` [ coturn的项目默认内置的固定帐号模式的配置文件 ]
- `docker/coturn/turnserver-with-secret-user.conf` [ coturn的项目默认内置的有时效性帐号模式的配置文件 ]

配置不算多，以上是算上所有服务后 (`api服务`, `socket服务`, `mysql服务`, `coturn服务`)的配置汇总

进行分类到不同服务后，每个服务可能需要修改的配置划分如下

### 部署api服务相关配置

可能需要修改

- `tlrtcfile.env`
- `docker-compose.yml`
- `docker-compose-with-all-env.yml`
- `docker/docker-compose-build-code.yml`
- `docker/mysql/mysql.env`
- `docker/coturn/coturn.env`
- `docker/coturn/turnserver-with-fixed-user.conf`
- `docker/coturn/turnserver-with-secret-user.conf`

### 部署socket服务相关配置

可能需要修改

- `tlrtcfile.env`
- `docker-compose.yml`
- `docker-compose-with-all-env.yml`
- `docker/docker-compose-build-code.yml`
- `docker/mysql/mysql.env`
- `docker/coturn/coturn.env`
- `docker/coturn/turnserver-with-fixed-user.conf`
- `docker/coturn/turnserver-with-secret-user.conf`

### 部署mysql服务相关配置

可能需要修改

- `tlrtcfile.env`
- `docker-compose.yml`
- `docker-compose-with-all-env.yml`
- `docker/docker-compose-build-code.yml`
- `docker/mysql/mysql.env`

### 部署coturn服务相关配置

可能需要修改

- `tlrtcfile.env`
- `docker-compose.yml`
- `docker-compose-with-all-env.yml`
- `docker/docker-compose-build-code.yml`
- `docker/coturn/coturn.env`
- `docker/coturn/turnserver-with-fixed-user.conf`
- `docker/coturn/turnserver-with-secret-user.conf`

我知道，看到这么多配置，有些小伙伴已经开始急了，但是先别急，不是每一个都需要改的，而是选择不同的部署模式，部署不同的服务，只是改对应的配置就好。不是全部要改，后面的文档，我将对不同部署模式需要修改的配置进行说明。

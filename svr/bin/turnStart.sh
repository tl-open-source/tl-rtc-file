#生成账号密码方式1
turnadmin -a -u tlrtcfile -p tlrtcfile -r 域名或ip:port

#生成账号密码方式2
turnadmin -k -u tlrtcfile -r 域名或ip:port

#启动turnserver
turnserver -c turnserver.conf路径

pm2 start npm --name=tl-rtc-file-api-server -- run sapi

sleep 1

pm2 start npm --name=tl-rtc-file-socket-server -- run ssocket
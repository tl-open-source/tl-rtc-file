pm2 start npm --name=tl-rtc-file-api-local -- run lapi

sleep 1

pm2 start npm --name=tl-rtc-file-socket-local -- run lsocket

sleep 1

cd build/webpack

pm2 start npm --name=tl-rtc-file-build-local -- run dev